import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { InventoryController } from './inventory.controller';
import type { InventoryService } from './inventory.service';
import { StockAdjustmentMode } from './dto/adjust-stock.dto';
import type { QueryInventoryDto } from './dto/query-inventory.dto';

interface MockInventoryService {
  findAll: Mock;
  findLowStock: Mock;
  findByProduct: Mock;
  adjustStock: Mock;
  update: Mock;
  getAuditTrail: Mock;
}

describe('InventoryController', () => {
  let controller: InventoryController;
  let mockInventoryService: MockInventoryService;

  const mockTenantId = 'm-tenant-123';
  const mockUserId = 'u-user-456';
  const mockProductId = 'p-prod-789';

  beforeEach(() => {
    mockInventoryService = {
      findAll: vi.fn(),
      findLowStock: vi.fn(),
      findByProduct: vi.fn(),
      adjustStock: vi.fn(),
      update: vi.fn(),
      getAuditTrail: vi.fn()
    };

    controller = new InventoryController(mockInventoryService as unknown as InventoryService);
  });

  describe('findAll', () => {
    it('should delegate findAll to InventoryService', async () => {
      const query: QueryInventoryDto = {
        page: 1,
        limit: 20,
        lowStockOnly: false
      };

      const expectedResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
        summary: { totalAvailableStock: 0, lowStockCount: 0, outOfStockCount: 0 }
      };

      mockInventoryService.findAll.mockResolvedValueOnce(expectedResponse);

      const result = await controller.findAll(mockTenantId, query);

      expect(mockInventoryService.findAll).toHaveBeenCalledWith(mockTenantId, query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findLowStock', () => {
    it('should delegate findLowStock to InventoryService', async () => {
      const expectedLowStock = [
        {
          id: 'inv-1',
          productId: mockProductId,
          availableQuantity: 2,
          reorderThreshold: 10,
          isLowStock: true
        }
      ];

      mockInventoryService.findLowStock.mockResolvedValueOnce(expectedLowStock);

      const result = await controller.findLowStock(mockTenantId, undefined);

      expect(mockInventoryService.findLowStock).toHaveBeenCalledWith(mockTenantId, undefined);
      expect(result).toEqual(expectedLowStock);
    });
  });

  describe('findByProduct', () => {
    it('should delegate findByProduct to InventoryService', async () => {
      const expectedItem = {
        id: 'inv-1',
        productId: mockProductId,
        availableQuantity: 20,
        reservedQuantity: 0,
        reorderThreshold: 10
      };

      mockInventoryService.findByProduct.mockResolvedValueOnce(expectedItem);

      const result = await controller.findByProduct(mockTenantId, mockProductId);

      expect(mockInventoryService.findByProduct).toHaveBeenCalledWith(mockTenantId, mockProductId);
      expect(result).toEqual(expectedItem);
    });
  });

  describe('adjustStock', () => {
    it('should delegate adjustStock to InventoryService', async () => {
      const dto = {
        mode: StockAdjustmentMode.DELTA,
        quantity: 15,
        reason: 'Restocked'
      };

      const expectedAdjusted = {
        id: 'inv-1',
        productId: mockProductId,
        availableQuantity: 35
      };

      mockInventoryService.adjustStock.mockResolvedValueOnce(expectedAdjusted);

      const result = await controller.adjustStock(mockTenantId, mockProductId, dto, mockUserId);

      expect(mockInventoryService.adjustStock).toHaveBeenCalledWith(
        mockTenantId,
        mockProductId,
        dto,
        mockUserId
      );
      expect(result).toEqual(expectedAdjusted);
    });
  });

  describe('update', () => {
    it('should delegate update to InventoryService', async () => {
      const dto = {
        reorderThreshold: 25
      };

      const expectedUpdated = {
        id: 'inv-1',
        productId: mockProductId,
        reorderThreshold: 25
      };

      mockInventoryService.update.mockResolvedValueOnce(expectedUpdated);

      const result = await controller.update(mockTenantId, mockProductId, dto, mockUserId);

      expect(mockInventoryService.update).toHaveBeenCalledWith(
        mockTenantId,
        mockProductId,
        dto,
        mockUserId
      );
      expect(result).toEqual(expectedUpdated);
    });
  });

  describe('getAuditTrail', () => {
    it('should delegate getAuditTrail to InventoryService', async () => {
      const expectedLogs = [
        {
          id: 'log-1',
          action: 'UPDATE',
          actorId: mockUserId
        }
      ];

      mockInventoryService.getAuditTrail.mockResolvedValueOnce(expectedLogs);

      const result = await controller.getAuditTrail(mockTenantId, mockProductId);

      expect(mockInventoryService.getAuditTrail).toHaveBeenCalledWith(mockTenantId, mockProductId);
      expect(result).toEqual(expectedLogs);
    });
  });
});
