import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { DashboardController } from './dashboard.controller';
import type { DashboardService } from './dashboard.service';

interface MockDashboardService {
  getMetrics: Mock;
}

describe('DashboardController', () => {
  let controller: DashboardController;
  let mockDashboardService: MockDashboardService;

  const mockTenantId = 'm-tenant-123';

  beforeEach(() => {
    mockDashboardService = {
      getMetrics: vi.fn()
    };

    controller = new DashboardController(mockDashboardService as unknown as DashboardService);
  });

  describe('getMetrics', () => {
    it('should delegate getMetrics to DashboardService with tenantId', async () => {
      const mockResult = {
        revenue: { todayRevenueMinor: 50000, totalRevenueMinor: 250000, currency: 'INR' },
        orders: {
          ordersToday: 2,
          totalOrders: 10,
          pendingOrders: 1,
          paidOrders: 7,
          processingOrders: 1,
          shippedOrders: 1,
          deliveredOrders: 0,
          cancelledOrders: 0
        },
        products: {
          totalProducts: 15,
          activeProducts: 12,
          draftProducts: 2,
          archivedProducts: 1,
          outOfStockProducts: 0
        },
        inventory: {
          totalUnitsInStock: 400,
          totalUnitsReserved: 10,
          lowStockItemsCount: 1,
          outOfStockItemsCount: 0
        },
        topSellingProducts: [],
        recentOrders: []
      };

      mockDashboardService.getMetrics.mockResolvedValueOnce(mockResult);

      const result = await controller.getMetrics(mockTenantId);

      expect(mockDashboardService.getMetrics).toHaveBeenCalledWith(mockTenantId);
      expect(result).toEqual(mockResult);
    });
  });
});
