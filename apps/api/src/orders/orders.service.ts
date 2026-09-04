import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  Prisma,
  OrderStatus,
  ProductStatus,
  AuditAction,
  ActorType
} from '@merchantpilot/database';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import {
  OrderResponseDto,
  OrderListResponseDto,
  OrderItemResponseDto
} from './dto/order-response.dto';

const orderInclude = {
  items: true,
  customer: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  },
  store: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  }
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Format raw Prisma order with calculated subtotalMinor for each item
   */
  private formatOrder(order: {
    id: string;
    merchantId: string;
    storeId: string;
    orderNumber: string;
    razorpayOrderId: string | null;
    status: OrderStatus;
    totalAmountMinor: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      productId: string;
      title: string;
      sku: string;
      quantity: number;
      priceMinor: number;
      createdAt: Date;
    }>;
    customer?: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    } | null;
    store?: {
      id: string;
      name: string;
      slug: string;
    };
  }): OrderResponseDto {
    const formattedItems: OrderItemResponseDto[] = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      priceMinor: item.priceMinor,
      subtotalMinor: item.priceMinor * item.quantity,
      createdAt: item.createdAt
    }));

    return {
      id: order.id,
      merchantId: order.merchantId,
      storeId: order.storeId,
      orderNumber: order.orderNumber,
      razorpayOrderId: order.razorpayOrderId,
      status: order.status,
      totalAmountMinor: order.totalAmountMinor,
      currency: order.currency,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: formattedItems,
      customer: order.customer ?? null,
      store: order.store ?? null
    };
  }

  /**
   * Create a new order with atomic inventory deduction and audit logging
   */
  async create(tenantId: string, dto: CreateOrderDto, userId: string): Promise<OrderResponseDto> {
    // 1. Resolve Store and verify tenant ownership
    let storeId = dto.storeId;
    if (storeId) {
      const store = await this.prisma.store.findFirst({
        where: { id: storeId, merchantId: tenantId }
      });
      if (!store) {
        throw new BadRequestException(
          `Store with ID "${storeId}" not found or does not belong to this merchant`
        );
      }
    } else {
      const defaultStore = await this.prisma.store.findFirst({
        where: { merchantId: tenantId }
      });
      if (!defaultStore) {
        throw new BadRequestException(
          `No store found for merchant "${tenantId}". Please create a store first.`
        );
      }
      storeId = defaultStore.id;
    }

    // 2. Aggregate quantities per product
    const productQuantityMap = new Map<string, number>();
    for (const item of dto.items) {
      const current = productQuantityMap.get(item.productId) || 0;
      productQuantityMap.set(item.productId, current + item.quantity);
    }
    const productIds = Array.from(productQuantityMap.keys());

    // 3. Fetch products and their inventories
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId
      },
      include: {
        inventory: true
      }
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more requested products were not found in this store');
    }

    // 4. Validate stock availability and status
    const itemsToProcess: Array<{
      product: (typeof products)[0];
      quantity: number;
      inventoryId: string;
      currentAvailable: number;
    }> = [];

    let totalAmountMinor = 0;

    for (const product of products) {
      const requestedQty = productQuantityMap.get(product.id) || 0;

      if (product.status === ProductStatus.ARCHIVED) {
        throw new BadRequestException(`Cannot place order for archived product "${product.title}"`);
      }

      if (!product.inventory) {
        throw new BadRequestException(`Product "${product.title}" has no inventory configured`);
      }

      if (product.inventory.availableQuantity < requestedQty) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.title}" (available: ${product.inventory.availableQuantity}, requested: ${requestedQty})`
        );
      }

      totalAmountMinor += product.priceMinor * requestedQty;
      itemsToProcess.push({
        product,
        quantity: requestedQty,
        inventoryId: product.inventory.id,
        currentAvailable: product.inventory.availableQuantity
      });
    }

    // 5. Generate Order Number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // 6. Execute Transaction
    const correlationId = randomUUID();

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      // Create Order & OrderItems
      const order = await tx.order.create({
        data: {
          merchantId: tenantId,
          storeId,
          customerId: dto.customerId ?? null,
          orderNumber,
          status: dto.status || OrderStatus.PENDING_PAYMENT,
          totalAmountMinor,
          currency: dto.currency || 'INR',
          items: {
            create: itemsToProcess.map((item) => ({
              productId: item.product.id,
              title: item.product.title,
              sku: item.product.sku,
              quantity: item.quantity,
              priceMinor: item.product.priceMinor
            }))
          }
        },
        include: orderInclude
      });

      // Decrement Inventory and sync product status
      for (const item of itemsToProcess) {
        const newAvailable = item.currentAvailable - item.quantity;

        await tx.inventory.update({
          where: { id: item.inventoryId },
          data: { availableQuantity: newAvailable }
        });

        if (newAvailable === 0 && item.product.status === ProductStatus.ACTIVE) {
          await tx.product.update({
            where: { id: item.product.id },
            data: { status: ProductStatus.OUT_OF_STOCK }
          });
        }
      }

      // Record AuditLog
      await tx.auditLog.create({
        data: {
          merchantId: tenantId,
          userId,
          actorType: ActorType.MERCHANT_USER,
          actorId: userId,
          action: AuditAction.CREATE,
          correlationId,
          entityName: 'Order',
          entityId: order.id,
          beforeState: Prisma.JsonNull,
          afterState: {
            orderNumber: order.orderNumber,
            totalAmountMinor: order.totalAmountMinor,
            status: order.status,
            itemCount: order.items.length
          }
        }
      });

      return order;
    });

    return this.formatOrder(createdOrder);
  }

  /**
   * List orders for a merchant with search, filtering, and pagination
   */
  async findAll(tenantId: string, query: QueryOrderDto): Promise<OrderListResponseDto> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      merchantId: tenantId
    };

    if (query.storeId) {
      where.storeId = query.storeId;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        {
          items: {
            some: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
              ]
            }
          }
        }
      ];
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: orderInclude
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: orders.map((order) => this.formatOrder(order)),
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  /**
   * Get single order by UUID scoped to merchant tenant
   */
  async findOne(tenantId: string, id: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        merchantId: tenantId
      },
      include: orderInclude
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found for this merchant`);
    }

    return this.formatOrder(order);
  }

  /**
   * Update order status with optional inventory replenishment on cancellation
   */
  async updateStatus(
    tenantId: string,
    id: string,
    dto: UpdateOrderStatusDto,
    userId: string
  ): Promise<OrderResponseDto> {
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        id,
        merchantId: tenantId
      },
      include: {
        items: true
      }
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found for this merchant`);
    }

    const isCancelling =
      (dto.status === OrderStatus.CANCELLED || dto.status === OrderStatus.REFUNDED) &&
      existingOrder.status !== OrderStatus.CANCELLED &&
      existingOrder.status !== OrderStatus.REFUNDED;

    const correlationId = randomUUID();

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // If order is cancelled/refunded, replenish inventory
      if (isCancelling) {
        for (const item of existingOrder.items) {
          const inv = await tx.inventory.findFirst({
            where: { productId: item.productId }
          });

          if (inv) {
            const restoredQuantity = inv.availableQuantity + item.quantity;
            await tx.inventory.update({
              where: { id: inv.id },
              data: { availableQuantity: restoredQuantity }
            });

            // If product was OUT_OF_STOCK, restore to ACTIVE
            const prod = await tx.product.findUnique({
              where: { id: item.productId }
            });
            if (prod && prod.status === ProductStatus.OUT_OF_STOCK) {
              await tx.product.update({
                where: { id: item.productId },
                data: { status: ProductStatus.ACTIVE }
              });
            }
          }
        }
      }

      const order = await tx.order.update({
        where: { id },
        data: { status: dto.status },
        include: orderInclude
      });

      await tx.auditLog.create({
        data: {
          merchantId: tenantId,
          userId,
          actorType: ActorType.MERCHANT_USER,
          actorId: userId,
          action: AuditAction.UPDATE,
          correlationId,
          entityName: 'Order',
          entityId: order.id,
          beforeState: { status: existingOrder.status },
          afterState: {
            status: dto.status,
            reason: dto.reason ?? null,
            inventoryRestored: isCancelling
          }
        }
      });

      return order;
    });

    return this.formatOrder(updatedOrder);
  }
}
