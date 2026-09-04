import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma, ProductStatus, AuditAction, ActorType } from '@merchantpilot/database';
import { PrismaService } from '../common/prisma.service';
import { AdjustStockDto, StockAdjustmentMode } from './dto/adjust-stock.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import {
  InventoryResponseDto,
  InventoryListResponseDto,
  InventoryAuditLogDto
} from './dto/inventory-response.dto';

const productSelect = {
  id: true,
  title: true,
  slug: true,
  sku: true,
  priceMinor: true,
  currency: true,
  status: true
} as const;

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Format raw Prisma inventory record into enriched response DTO
   */
  private formatInventory(item: {
    id: string;
    productId: string;
    storeId: string;
    availableQuantity: number;
    reservedQuantity: number;
    reorderThreshold: number;
    createdAt: Date;
    updatedAt: Date;
    product?: {
      id: string;
      title: string;
      slug: string;
      sku: string;
      priceMinor: number;
      currency: string;
      status: ProductStatus;
    } | null;
  }): InventoryResponseDto {
    return {
      id: item.id,
      productId: item.productId,
      storeId: item.storeId,
      availableQuantity: item.availableQuantity,
      reservedQuantity: item.reservedQuantity,
      reorderThreshold: item.reorderThreshold,
      isLowStock: item.availableQuantity <= item.reorderThreshold,
      isOutOfStock: item.availableQuantity === 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      product: item.product ?? null
    };
  }

  /**
   * List inventory items across merchant products with filtering and pagination
   */
  async findAll(tenantId: string, query: QueryInventoryDto): Promise<InventoryListResponseDto> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryWhereInput = {
      store: {
        merchantId: tenantId
      }
    };

    if (query.storeId) {
      where.storeId = query.storeId;
    }

    if (query.search) {
      const search = query.search.trim();
      where.product = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [total, rawItems, allMerchantItems] = await Promise.all([
      this.prisma.inventory.count({ where }),
      this.prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: productSelect
          }
        }
      }),
      this.prisma.inventory.findMany({
        where: {
          store: { merchantId: tenantId }
        },
        select: {
          availableQuantity: true,
          reorderThreshold: true
        }
      })
    ]);

    let formattedItems = rawItems.map((item) => this.formatInventory(item));

    if (query.lowStockOnly) {
      formattedItems = formattedItems.filter((i) => i.isLowStock);
    }

    const totalPages = Math.ceil(total / limit) || 1;

    // Metrics across the entire merchant inventory
    let totalAvailableStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const inv of allMerchantItems) {
      totalAvailableStock += inv.availableQuantity;
      if (inv.availableQuantity === 0) {
        outOfStockCount++;
      }
      if (inv.availableQuantity <= inv.reorderThreshold) {
        lowStockCount++;
      }
    }

    return {
      data: formattedItems,
      meta: {
        total: query.lowStockOnly ? formattedItems.length : total,
        page,
        limit,
        totalPages
      },
      summary: {
        totalAvailableStock,
        lowStockCount,
        outOfStockCount
      }
    };
  }

  /**
   * Get all low-stock products for merchant alert dashboards
   */
  async findLowStock(tenantId: string, storeId?: string): Promise<InventoryResponseDto[]> {
    const rawItems = await this.prisma.inventory.findMany({
      where: {
        store: {
          merchantId: tenantId
        },
        ...(storeId ? { storeId } : {})
      },
      orderBy: { availableQuantity: 'asc' },
      include: {
        product: {
          select: productSelect
        }
      }
    });

    return rawItems.map((item) => this.formatInventory(item)).filter((item) => item.isLowStock);
  }

  /**
   * Get or initialize inventory for a specific product
   */
  async findByProduct(tenantId: string, productId: string): Promise<InventoryResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          merchantId: tenantId
        }
      },
      include: {
        inventory: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found for this merchant`);
    }

    let inventory = product.inventory;
    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: product.storeId,
          availableQuantity: 0,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });
    }

    return this.formatInventory({
      ...inventory,
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        priceMinor: product.priceMinor,
        currency: product.currency,
        status: product.status
      }
    });
  }

  /**
   * Adjust stock levels (delta or absolute) with product status sync and audit logging
   */
  async adjustStock(
    tenantId: string,
    productId: string,
    dto: AdjustStockDto,
    userId: string
  ): Promise<InventoryResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          merchantId: tenantId
        }
      },
      include: {
        inventory: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found for this merchant`);
    }

    let inventory = product.inventory;
    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: product.storeId,
          availableQuantity: 0,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });
    }

    const currentStock = inventory.availableQuantity;
    let newStock: number;

    if (dto.mode === StockAdjustmentMode.ABSOLUTE) {
      if (dto.quantity < 0) {
        throw new BadRequestException('Stock quantity cannot be negative');
      }
      newStock = dto.quantity;
    } else {
      newStock = currentStock + dto.quantity;
      if (newStock < 0) {
        throw new BadRequestException(
          `Insufficient stock: current stock (${currentStock}) cannot be reduced by ${Math.abs(dto.quantity)}`
        );
      }
    }

    const beforeState = {
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity,
      reorderThreshold: inventory.reorderThreshold
    };

    const afterState = {
      availableQuantity: newStock,
      reservedQuantity: inventory.reservedQuantity,
      reorderThreshold: inventory.reorderThreshold,
      mode: dto.mode,
      adjustment: dto.quantity,
      reason: dto.reason ?? null
    };

    const correlationId = randomUUID();

    const [updatedInventory, updatedProduct] = await this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.update({
        where: { id: inventory.id },
        data: { availableQuantity: newStock }
      });

      // Synchronize ProductStatus with stock availability
      let newProductStatus = product.status;
      if (newStock === 0 && product.status === ProductStatus.ACTIVE) {
        newProductStatus = ProductStatus.OUT_OF_STOCK;
      } else if (newStock > 0 && product.status === ProductStatus.OUT_OF_STOCK) {
        newProductStatus = ProductStatus.ACTIVE;
      }

      const prod = await tx.product.update({
        where: { id: productId },
        data: { status: newProductStatus },
        select: productSelect
      });

      await tx.auditLog.create({
        data: {
          merchantId: tenantId,
          userId,
          actorType: ActorType.MERCHANT_USER,
          actorId: userId,
          action: AuditAction.UPDATE,
          correlationId,
          entityName: 'Inventory',
          entityId: inventory.id,
          beforeState,
          afterState
        }
      });

      return [inv, prod];
    });

    return this.formatInventory({
      ...updatedInventory,
      product: updatedProduct
    });
  }

  /**
   * Update inventory parameters like thresholds and stock levels
   */
  async update(
    tenantId: string,
    productId: string,
    dto: UpdateInventoryDto,
    userId: string
  ): Promise<InventoryResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          merchantId: tenantId
        }
      },
      include: {
        inventory: true
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found for this merchant`);
    }

    let inventory = product.inventory;
    if (!inventory) {
      inventory = await this.prisma.inventory.create({
        data: {
          productId: product.id,
          storeId: product.storeId,
          availableQuantity: 0,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });
    }

    const beforeState = {
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity,
      reorderThreshold: inventory.reorderThreshold
    };

    const newAvailable =
      dto.availableQuantity !== undefined ? dto.availableQuantity : inventory.availableQuantity;

    const afterState = {
      availableQuantity: newAvailable,
      reservedQuantity:
        dto.reservedQuantity !== undefined ? dto.reservedQuantity : inventory.reservedQuantity,
      reorderThreshold:
        dto.reorderThreshold !== undefined ? dto.reorderThreshold : inventory.reorderThreshold,
      reason: dto.reason ?? null
    };

    const correlationId = randomUUID();

    const [updatedInventory, updatedProduct] = await this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          ...(dto.availableQuantity !== undefined && { availableQuantity: dto.availableQuantity }),
          ...(dto.reservedQuantity !== undefined && { reservedQuantity: dto.reservedQuantity }),
          ...(dto.reorderThreshold !== undefined && { reorderThreshold: dto.reorderThreshold })
        }
      });

      // Synchronize product status if available quantity was changed
      let newProductStatus = product.status;
      if (newAvailable === 0 && product.status === ProductStatus.ACTIVE) {
        newProductStatus = ProductStatus.OUT_OF_STOCK;
      } else if (newAvailable > 0 && product.status === ProductStatus.OUT_OF_STOCK) {
        newProductStatus = ProductStatus.ACTIVE;
      }

      const prod = await tx.product.update({
        where: { id: productId },
        data: { status: newProductStatus },
        select: productSelect
      });

      await tx.auditLog.create({
        data: {
          merchantId: tenantId,
          userId,
          actorType: ActorType.MERCHANT_USER,
          actorId: userId,
          action: AuditAction.UPDATE,
          correlationId,
          entityName: 'Inventory',
          entityId: inventory.id,
          beforeState,
          afterState
        }
      });

      return [inv, prod];
    });

    return this.formatInventory({
      ...updatedInventory,
      product: updatedProduct
    });
  }

  /**
   * Retrieve audit history for inventory modifications on a product
   */
  async getAuditTrail(tenantId: string, productId: string): Promise<InventoryAuditLogDto[]> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        store: {
          merchantId: tenantId
        }
      },
      include: {
        inventory: true
      }
    });

    if (!product || !product.inventory) {
      throw new NotFoundException(`Inventory record not found for product "${productId}"`);
    }

    const logs = await this.prisma.auditLog.findMany({
      where: {
        merchantId: tenantId,
        entityName: 'Inventory',
        entityId: product.inventory.id
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return logs as InventoryAuditLogDto[];
  }
}
