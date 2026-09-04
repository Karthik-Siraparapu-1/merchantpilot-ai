import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { OrderStatus, ProductStatus } from '@merchantpilot/database';
import type { PrismaService } from '../common/prisma.service';
import { DashboardService } from './dashboard.service';

interface MockPrismaOrder {
  findMany: Mock;
}

interface MockPrismaProduct {
  findMany: Mock;
}

interface MockPrismaInventory {
  findMany: Mock;
}

interface MockPrismaOrderItem {
  findMany: Mock;
}

interface MockPrismaService {
  order: MockPrismaOrder;
  product: MockPrismaProduct;
  inventory: MockPrismaInventory;
  orderItem: MockPrismaOrderItem;
}

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let mockPrisma: MockPrismaService;

  const mockTenantId = 'm-tenant-123';

  beforeEach(() => {
    mockPrisma = {
      order: {
        findMany: vi.fn()
      },
      product: {
        findMany: vi.fn()
      },
      inventory: {
        findMany: vi.fn()
      },
      orderItem: {
        findMany: vi.fn()
      }
    };

    dashboardService = new DashboardService(mockPrisma as unknown as PrismaService);
  });

  describe('getMetrics', () => {
    it('should aggregate revenue, order counts, product metrics, and top selling products correctly', async () => {
      // 1. All orders
      mockPrisma.order.findMany
        .mockResolvedValueOnce([
          { id: 'o-1', status: OrderStatus.PAID, totalAmountMinor: 100000, currency: 'INR' },
          { id: 'o-2', status: OrderStatus.PROCESSING, totalAmountMinor: 200000, currency: 'INR' },
          {
            id: 'o-3',
            status: OrderStatus.PENDING_PAYMENT,
            totalAmountMinor: 50000,
            currency: 'INR'
          },
          { id: 'o-4', status: OrderStatus.CANCELLED, totalAmountMinor: 50000, currency: 'INR' }
        ])
        // 2. Today's orders
        .mockResolvedValueOnce([{ status: OrderStatus.PAID, totalAmountMinor: 100000 }])
        // 5. Recent orders (order of Promise.all calls)
        .mockResolvedValueOnce([
          {
            id: 'o-1',
            orderNumber: 'ORD-001',
            customer: { email: 'customer@example.com' },
            totalAmountMinor: 100000,
            currency: 'INR',
            status: OrderStatus.PAID,
            items: [{ id: 'oi-1' }],
            createdAt: new Date()
          }
        ]);

      // 3. Products
      mockPrisma.product.findMany.mockResolvedValueOnce([
        { id: 'p-1', status: ProductStatus.ACTIVE },
        { id: 'p-2', status: ProductStatus.OUT_OF_STOCK },
        { id: 'p-3', status: ProductStatus.DRAFT },
        { id: 'p-4', status: ProductStatus.ARCHIVED }
      ]);

      // 4. Inventories
      mockPrisma.inventory.findMany.mockResolvedValueOnce([
        { availableQuantity: 50, reservedQuantity: 5, reorderThreshold: 10 },
        { availableQuantity: 3, reservedQuantity: 0, reorderThreshold: 10 },
        { availableQuantity: 0, reservedQuantity: 0, reorderThreshold: 5 }
      ]);

      // 6. OrderItems for paid orders
      mockPrisma.orderItem.findMany.mockResolvedValueOnce([
        { productId: 'p-1', title: 'Backpack', sku: 'BPK-001', quantity: 3, priceMinor: 50000 },
        { productId: 'p-1', title: 'Backpack', sku: 'BPK-001', quantity: 2, priceMinor: 50000 }
      ]);

      const metrics = await dashboardService.getMetrics(mockTenantId);

      // Revenue checks
      expect(metrics.revenue.todayRevenueMinor).toBe(100000);
      expect(metrics.revenue.totalRevenueMinor).toBe(300000); // 100k + 200k from PAID & PROCESSING

      // Order counts
      expect(metrics.orders.totalOrders).toBe(4);
      expect(metrics.orders.ordersToday).toBe(1);
      expect(metrics.orders.paidOrders).toBe(1);
      expect(metrics.orders.processingOrders).toBe(1);
      expect(metrics.orders.pendingOrders).toBe(1);
      expect(metrics.orders.cancelledOrders).toBe(1);

      // Product counts
      expect(metrics.products.totalProducts).toBe(4);
      expect(metrics.products.activeProducts).toBe(1);
      expect(metrics.products.outOfStockProducts).toBe(1);
      expect(metrics.products.draftProducts).toBe(1);
      expect(metrics.products.archivedProducts).toBe(1);

      // Inventory metrics
      expect(metrics.inventory.totalUnitsInStock).toBe(53);
      expect(metrics.inventory.totalUnitsReserved).toBe(5);
      expect(metrics.inventory.lowStockItemsCount).toBe(2); // 3 <= 10 and 0 <= 5
      expect(metrics.inventory.outOfStockItemsCount).toBe(1); // 0 === 0

      // Top selling products
      expect(metrics.topSellingProducts).toHaveLength(1);
      expect(metrics.topSellingProducts[0]?.productId).toBe('p-1');
      expect(metrics.topSellingProducts[0]?.unitsSold).toBe(5);
      expect(metrics.topSellingProducts[0]?.revenueGeneratedMinor).toBe(250000);

      // Recent orders
      expect(metrics.recentOrders).toHaveLength(1);
      expect(metrics.recentOrders[0]?.orderNumber).toBe('ORD-001');
      expect(metrics.recentOrders[0]?.customerEmail).toBe('customer@example.com');
    });
  });
});
