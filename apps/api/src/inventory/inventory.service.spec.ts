import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductStatus } from '@merchantpilot/database';
import type { PrismaService } from '../common/prisma.service';
import { InventoryService } from './inventory.service';
import { StockAdjustmentMode } from './dto/adjust-stock.dto';

interface MockPrismaInventory {
  count: Mock;
  findMany: Mock;
  create: Mock;
  update: Mock;
}

interface MockPrismaProduct {
  findFirst: Mock;
  update: Mock;
}

interface MockPrismaAuditLog {
  create: Mock;
  findMany: Mock;
}

interface MockPrismaService {
  inventory: MockPrismaInventory;
  product: MockPrismaProduct;
  auditLog: MockPrismaAuditLog;
  $transaction: Mock;
}

describe('InventoryService', () => {
  let inventoryService: InventoryService;
  let mockPrisma: MockPrismaService;

  const mockTenantId = 'm-tenant-123';
  const mockUserId = 'u-user-456';
  const mockProductId = 'p-prod-789';
  const mockStoreId = 's-store-111';
  const mockInventoryId = 'inv-222';

  beforeEach(() => {
    mockPrisma = {
      inventory: {
        count: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
      },
      product: {
        findFirst: vi.fn(),
        update: vi.fn()
      },
      auditLog: {
        create: vi.fn(),
        findMany: vi.fn()
      },
      $transaction: vi.fn((callback: (tx: MockPrismaService) => Promise<unknown>) =>
        callback(mockPrisma)
      )
    };

    inventoryService = new InventoryService(mockPrisma as unknown as PrismaService);
  });

  describe('findAll', () => {
    it('should return paginated inventory items and calculate summary metrics', async () => {
      mockPrisma.inventory.count.mockResolvedValueOnce(1);
      mockPrisma.inventory.findMany
        .mockResolvedValueOnce([
          {
            id: mockInventoryId,
            productId: mockProductId,
            storeId: mockStoreId,
            availableQuantity: 5,
            reservedQuantity: 0,
            reorderThreshold: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: {
              id: mockProductId,
              title: 'Office Backpack',
              slug: 'office-backpack',
              sku: 'BPK-001',
              priceMinor: 299900,
              currency: 'INR',
              status: ProductStatus.ACTIVE
            }
          }
        ])
        .mockResolvedValueOnce([
          { availableQuantity: 5, reorderThreshold: 10 },
          { availableQuantity: 0, reorderThreshold: 10 }
        ]);

      const result = await inventoryService.findAll(mockTenantId, {
        page: 1,
        limit: 10,
        lowStockOnly: false
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.isLowStock).toBe(true);
      expect(result.data[0]?.isOutOfStock).toBe(false);
      expect(result.summary?.totalAvailableStock).toBe(5);
      expect(result.summary?.lowStockCount).toBe(2);
      expect(result.summary?.outOfStockCount).toBe(1);
    });
  });

  describe('findLowStock', () => {
    it('should return only items with availableQuantity <= reorderThreshold', async () => {
      mockPrisma.inventory.findMany.mockResolvedValueOnce([
        {
          id: 'inv-1',
          productId: 'p-1',
          storeId: mockStoreId,
          availableQuantity: 5,
          reservedQuantity: 0,
          reorderThreshold: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'inv-2',
          productId: 'p-2',
          storeId: mockStoreId,
          availableQuantity: 50,
          reservedQuantity: 0,
          reorderThreshold: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      const result = await inventoryService.findLowStock(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('inv-1');
      expect(result[0]?.isLowStock).toBe(true);
    });
  });

  describe('findByProduct', () => {
    it('should throw NotFoundException if product is not found for tenant', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(inventoryService.findByProduct(mockTenantId, mockProductId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should auto-create inventory record if product exists without one', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        title: 'Office Backpack',
        slug: 'office-backpack',
        sku: 'BPK-001',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.ACTIVE,
        inventory: null
      });

      mockPrisma.inventory.create.mockResolvedValueOnce({
        id: mockInventoryId,
        productId: mockProductId,
        storeId: mockStoreId,
        availableQuantity: 0,
        reservedQuantity: 0,
        reorderThreshold: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await inventoryService.findByProduct(mockTenantId, mockProductId);

      expect(result.id).toBe(mockInventoryId);
      expect(result.availableQuantity).toBe(0);
      expect(result.isOutOfStock).toBe(true);
      expect(mockPrisma.inventory.create).toHaveBeenCalledWith({
        data: {
          productId: mockProductId,
          storeId: mockStoreId,
          availableQuantity: 0,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock with DELTA mode and sync status to OUT_OF_STOCK when hits 0', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.ACTIVE,
        inventory: {
          id: mockInventoryId,
          availableQuantity: 10,
          reservedQuantity: 0,
          reorderThreshold: 5
        }
      });

      mockPrisma.inventory.update.mockResolvedValueOnce({
        id: mockInventoryId,
        productId: mockProductId,
        storeId: mockStoreId,
        availableQuantity: 0,
        reservedQuantity: 0,
        reorderThreshold: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockPrisma.product.update.mockResolvedValueOnce({
        id: mockProductId,
        title: 'Office Backpack',
        slug: 'office-backpack',
        sku: 'BPK-001',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.OUT_OF_STOCK
      });

      const result = await inventoryService.adjustStock(
        mockTenantId,
        mockProductId,
        {
          mode: StockAdjustmentMode.DELTA,
          quantity: -10,
          reason: 'Sold out via orders'
        },
        mockUserId
      );

      expect(result.availableQuantity).toBe(0);
      expect(result.isOutOfStock).toBe(true);
      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockProductId },
          data: { status: ProductStatus.OUT_OF_STOCK }
        })
      );
      expect(mockPrisma.auditLog.create).toHaveBeenCalledTimes(1);
      const auditCall = mockPrisma.auditLog.create.mock.calls[0]?.[0] as {
        data: {
          merchantId: string;
          userId: string;
          entityName: string;
          entityId: string;
          beforeState: { availableQuantity: number };
          afterState: { availableQuantity: number; adjustment: number };
        };
      };
      expect(auditCall.data.merchantId).toBe(mockTenantId);
      expect(auditCall.data.userId).toBe(mockUserId);
      expect(auditCall.data.entityName).toBe('Inventory');
      expect(auditCall.data.entityId).toBe(mockInventoryId);
      expect(auditCall.data.beforeState.availableQuantity).toBe(10);
      expect(auditCall.data.afterState.availableQuantity).toBe(0);
      expect(auditCall.data.afterState.adjustment).toBe(-10);
    });

    it('should throw BadRequestException if delta adjustment causes negative stock', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.ACTIVE,
        inventory: {
          id: mockInventoryId,
          availableQuantity: 5,
          reservedQuantity: 0,
          reorderThreshold: 5
        }
      });

      await expect(
        inventoryService.adjustStock(
          mockTenantId,
          mockProductId,
          {
            mode: StockAdjustmentMode.DELTA,
            quantity: -10
          },
          mockUserId
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should restore product status to ACTIVE when replenished from 0', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.OUT_OF_STOCK,
        inventory: {
          id: mockInventoryId,
          availableQuantity: 0,
          reservedQuantity: 0,
          reorderThreshold: 5
        }
      });

      mockPrisma.inventory.update.mockResolvedValueOnce({
        id: mockInventoryId,
        productId: mockProductId,
        storeId: mockStoreId,
        availableQuantity: 25,
        reservedQuantity: 0,
        reorderThreshold: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockPrisma.product.update.mockResolvedValueOnce({
        id: mockProductId,
        title: 'Office Backpack',
        slug: 'office-backpack',
        sku: 'BPK-001',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.ACTIVE
      });

      const result = await inventoryService.adjustStock(
        mockTenantId,
        mockProductId,
        {
          mode: StockAdjustmentMode.ABSOLUTE,
          quantity: 25,
          reason: 'Supplier shipment received'
        },
        mockUserId
      );

      expect(result.availableQuantity).toBe(25);
      expect(result.isOutOfStock).toBe(false);
      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockProductId },
          data: { status: ProductStatus.ACTIVE }
        })
      );
    });
  });

  describe('update', () => {
    it('should update inventory threshold parameters', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.ACTIVE,
        inventory: {
          id: mockInventoryId,
          availableQuantity: 50,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });

      mockPrisma.inventory.update.mockResolvedValueOnce({
        id: mockInventoryId,
        productId: mockProductId,
        storeId: mockStoreId,
        availableQuantity: 50,
        reservedQuantity: 5,
        reorderThreshold: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockPrisma.product.update.mockResolvedValueOnce({
        id: mockProductId,
        title: 'Office Backpack',
        slug: 'office-backpack',
        sku: 'BPK-001',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.ACTIVE
      });

      const result = await inventoryService.update(
        mockTenantId,
        mockProductId,
        {
          reservedQuantity: 5,
          reorderThreshold: 20,
          reason: 'Peak season threshold increase'
        },
        mockUserId
      );

      expect(result.reorderThreshold).toBe(20);
      expect(result.reservedQuantity).toBe(5);
    });
  });

  describe('getAuditTrail', () => {
    it('should return audit trail history for product inventory', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        inventory: { id: mockInventoryId }
      });

      mockPrisma.auditLog.findMany.mockResolvedValueOnce([
        {
          id: 'log-1',
          action: 'UPDATE',
          actorType: 'MERCHANT_USER',
          actorId: mockUserId,
          correlationId: 'corr-1',
          beforeState: { availableQuantity: 10 },
          afterState: { availableQuantity: 20 },
          createdAt: new Date()
        }
      ]);

      const result = await inventoryService.getAuditTrail(mockTenantId, mockProductId);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('log-1');
    });
  });
});
