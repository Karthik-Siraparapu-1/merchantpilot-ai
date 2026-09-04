import { Injectable, Inject } from '@nestjs/common';
import { OrderStatus, ProductStatus } from '@merchantpilot/database';
import { PrismaService } from '../common/prisma.service';
import {
  DashboardResponseDto,
  TopSellingProductDto,
  RecentOrderSummaryDto
} from './dto/dashboard-response.dto';

const revenueStatuses: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED
];

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getMetrics(tenantId: string): Promise<DashboardResponseDto> {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Parallel aggregate queries for high performance
    const [
      allOrders,
      todayOrders,
      products,
      inventories,
      recentOrdersRaw,
      orderItemsForPaidOrders
    ] = await Promise.all([
      // 1. All Orders summary for tenant
      this.prisma.order.findMany({
        where: { merchantId: tenantId },
        select: {
          id: true,
          status: true,
          totalAmountMinor: true,
          currency: true
        }
      }),

      // 2. Orders placed today
      this.prisma.order.findMany({
        where: {
          merchantId: tenantId,
          createdAt: { gte: startOfToday }
        },
        select: {
          status: true,
          totalAmountMinor: true
        }
      }),

      // 3. Products
      this.prisma.product.findMany({
        where: {
          store: { merchantId: tenantId }
        },
        select: {
          id: true,
          status: true
        }
      }),

      // 4. Inventories
      this.prisma.inventory.findMany({
        where: {
          store: { merchantId: tenantId }
        },
        select: {
          availableQuantity: true,
          reservedQuantity: true,
          reorderThreshold: true
        }
      }),

      // 5. 5 most recent orders
      this.prisma.order.findMany({
        where: { merchantId: tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          customer: {
            select: {
              email: true
            }
          },
          items: {
            select: {
              id: true
            }
          }
        }
      }),

      // 6. Order items from revenue-generating orders for top seller analysis
      this.prisma.orderItem.findMany({
        where: {
          order: {
            merchantId: tenantId,
            status: { in: revenueStatuses }
          }
        },
        select: {
          productId: true,
          title: true,
          sku: true,
          quantity: true,
          priceMinor: true
        }
      })
    ]);

    // Calculate revenue metrics
    let totalRevenueMinor = 0;
    let currency = 'INR';

    const orderStatusCounts = {
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    for (const order of allOrders) {
      if (order.currency) {
        currency = order.currency;
      }
      if (revenueStatuses.includes(order.status)) {
        totalRevenueMinor += order.totalAmountMinor;
      }

      switch (order.status) {
        case OrderStatus.PENDING_PAYMENT:
          orderStatusCounts.pending++;
          break;
        case OrderStatus.PAID:
          orderStatusCounts.paid++;
          break;
        case OrderStatus.PROCESSING:
          orderStatusCounts.processing++;
          break;
        case OrderStatus.SHIPPED:
          orderStatusCounts.shipped++;
          break;
        case OrderStatus.DELIVERED:
          orderStatusCounts.delivered++;
          break;
        case OrderStatus.CANCELLED:
        case OrderStatus.REFUNDED:
          orderStatusCounts.cancelled++;
          break;
      }
    }

    let todayRevenueMinor = 0;
    for (const order of todayOrders) {
      if (revenueStatuses.includes(order.status)) {
        todayRevenueMinor += order.totalAmountMinor;
      }
    }

    // Calculate product metrics
    let activeProducts = 0;
    let draftProducts = 0;
    let archivedProducts = 0;
    let outOfStockProducts = 0;

    for (const prod of products) {
      switch (prod.status) {
        case ProductStatus.ACTIVE:
          activeProducts++;
          break;
        case ProductStatus.DRAFT:
          draftProducts++;
          break;
        case ProductStatus.ARCHIVED:
          archivedProducts++;
          break;
        case ProductStatus.OUT_OF_STOCK:
          outOfStockProducts++;
          break;
      }
    }

    // Calculate inventory metrics
    let totalUnitsInStock = 0;
    let totalUnitsReserved = 0;
    let lowStockItemsCount = 0;
    let outOfStockItemsCount = 0;

    for (const inv of inventories) {
      totalUnitsInStock += inv.availableQuantity;
      totalUnitsReserved += inv.reservedQuantity;
      if (inv.availableQuantity === 0) {
        outOfStockItemsCount++;
      }
      if (inv.availableQuantity <= inv.reorderThreshold) {
        lowStockItemsCount++;
      }
    }

    // Calculate top-selling products
    const productSalesMap = new Map<
      string,
      { title: string; sku: string; unitsSold: number; revenueGeneratedMinor: number }
    >();

    for (const item of orderItemsForPaidOrders) {
      const existing = productSalesMap.get(item.productId);
      if (existing) {
        existing.unitsSold += item.quantity;
        existing.revenueGeneratedMinor += item.priceMinor * item.quantity;
      } else {
        productSalesMap.set(item.productId, {
          title: item.title,
          sku: item.sku,
          unitsSold: item.quantity,
          revenueGeneratedMinor: item.priceMinor * item.quantity
        });
      }
    }

    const topSellingProducts: TopSellingProductDto[] = Array.from(productSalesMap.entries())
      .map(([productId, sales]) => ({
        productId,
        title: sales.title,
        sku: sales.sku,
        unitsSold: sales.unitsSold,
        revenueGeneratedMinor: sales.revenueGeneratedMinor
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Format recent orders
    const recentOrders: RecentOrderSummaryDto[] = recentOrdersRaw.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customer?.email ?? null,
      totalAmountMinor: order.totalAmountMinor,
      currency: order.currency,
      status: order.status,
      itemCount: order.items.length,
      createdAt: order.createdAt
    }));

    return {
      revenue: {
        todayRevenueMinor,
        totalRevenueMinor,
        currency
      },
      orders: {
        ordersToday: todayOrders.length,
        totalOrders: allOrders.length,
        pendingOrders: orderStatusCounts.pending,
        paidOrders: orderStatusCounts.paid,
        processingOrders: orderStatusCounts.processing,
        shippedOrders: orderStatusCounts.shipped,
        deliveredOrders: orderStatusCounts.delivered,
        cancelledOrders: orderStatusCounts.cancelled
      },
      products: {
        totalProducts: products.length,
        activeProducts,
        draftProducts,
        archivedProducts,
        outOfStockProducts
      },
      inventory: {
        totalUnitsInStock,
        totalUnitsReserved,
        lowStockItemsCount,
        outOfStockItemsCount
      },
      topSellingProducts,
      recentOrders
    };
  }
}
