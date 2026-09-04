import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus, ProductStatus } from '@merchantpilot/database';
import type { PrismaService } from '../common/prisma.service';
import { OrdersService } from './orders.service';

interface MockPrismaStore {
  findFirst: Mock;
}

interface MockPrismaProduct {
  findMany: Mock;
  findUnique: Mock;
  update: Mock;
}

interface MockPrismaInventory {
  findFirst: Mock;
  update: Mock;
}

interface MockPrismaOrder {
  create: Mock;
  count: Mock;
  findMany: Mock;
  findFirst: Mock;
  update: Mock;
}

interface MockPrismaAuditLog {
  create: Mock;
}

interface MockPrismaService {
  store: MockPrismaStore;
  product: MockPrismaProduct;
  inventory: MockPrismaInventory;
  order: MockPrismaOrder;
  auditLog: MockPrismaAuditLog;
  $transaction: Mock;
}

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let mockPrisma: MockPrismaService;

  const mockTenantId = 'm-tenant-123';
  const mockUserId = 'u-user-456';
  const mockStoreId = 's-store-789';
  const mockProductId = 'p-prod-111';
  const mockInventoryId = 'inv-222';
  const mockOrderId = 'o-order-333';

  beforeEach(() => {
    mockPrisma = {
      store: {
        findFirst: vi.fn()
      },
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
      },
      inventory: {
        findFirst: vi.fn(),
        update: vi.fn()
      },
      order: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn()
      },
      auditLog: {
        create: vi.fn()
      },
      $transaction: vi.fn((callback: (tx: MockPrismaService) => Promise<unknown>) =>
        callback(mockPrisma)
      )
    };

    ordersService = new OrdersService(mockPrisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('should throw BadRequestException if merchant has no store configured', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce(null);

      await expect(
        ordersService.create(
          mockTenantId,
          {
            items: [{ productId: mockProductId, quantity: 2 }]
          },
          mockUserId
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if product is not found in store', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findMany.mockResolvedValueOnce([]);

      await expect(
        ordersService.create(
          mockTenantId,
          {
            items: [{ productId: mockProductId, quantity: 2 }]
          },
          mockUserId
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if product is ARCHIVED', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findMany.mockResolvedValueOnce([
        {
          id: mockProductId,
          title: 'Archived Backpack',
          status: ProductStatus.ARCHIVED,
          priceMinor: 299900,
          inventory: { id: mockInventoryId, availableQuantity: 10 }
        }
      ]);

      await expect(
        ordersService.create(
          mockTenantId,
          {
            items: [{ productId: mockProductId, quantity: 1 }]
          },
          mockUserId
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if product has insufficient stock', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findMany.mockResolvedValueOnce([
        {
          id: mockProductId,
          title: 'Office Backpack',
          status: ProductStatus.ACTIVE,
          priceMinor: 299900,
          inventory: { id: mockInventoryId, availableQuantity: 1 }
        }
      ]);

      await expect(
        ordersService.create(
          mockTenantId,
          {
            items: [{ productId: mockProductId, quantity: 5 }]
          },
          mockUserId
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should create order, decrement inventory, update status, and log audit event', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findMany.mockResolvedValueOnce([
        {
          id: mockProductId,
          title: 'Office Backpack',
          sku: 'BPK-001',
          status: ProductStatus.ACTIVE,
          priceMinor: 299900,
          inventory: { id: mockInventoryId, availableQuantity: 2 }
        }
      ]);

      mockPrisma.order.create.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        storeId: mockStoreId,
        orderNumber: 'ORD-TEST-001',
        status: OrderStatus.PENDING_PAYMENT,
        totalAmountMinor: 599800,
        currency: 'INR',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'oi-1',
            productId: mockProductId,
            title: 'Office Backpack',
            sku: 'BPK-001',
            quantity: 2,
            priceMinor: 299900,
            createdAt: new Date()
          }
        ],
        customer: null,
        store: { id: mockStoreId, name: 'Bharat Crafts', slug: 'bharat-crafts' }
      });

      const result = await ordersService.create(
        mockTenantId,
        {
          items: [{ productId: mockProductId, quantity: 2 }]
        },
        mockUserId
      );

      expect(result.id).toBe(mockOrderId);
      expect(result.totalAmountMinor).toBe(599800);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.subtotalMinor).toBe(599800);

      // Inventory decrement
      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: mockInventoryId },
        data: { availableQuantity: 0 }
      });

      // Product status sync to OUT_OF_STOCK
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: { status: ProductStatus.OUT_OF_STOCK }
      });

      // Audit log creation
      expect(mockPrisma.auditLog.create).toHaveBeenCalledTimes(1);
      const auditCall = mockPrisma.auditLog.create.mock.calls[0]?.[0] as {
        data: {
          merchantId: string;
          userId: string;
          entityName: string;
          entityId: string;
          action: string;
        };
      };
      expect(auditCall.data.merchantId).toBe(mockTenantId);
      expect(auditCall.data.userId).toBe(mockUserId);
      expect(auditCall.data.entityName).toBe('Order');
      expect(auditCall.data.entityId).toBe(mockOrderId);
      expect(auditCall.data.action).toBe('CREATE');
    });
  });

  describe('findAll', () => {
    it('should return paginated list of orders for tenant', async () => {
      mockPrisma.order.count.mockResolvedValueOnce(1);
      mockPrisma.order.findMany.mockResolvedValueOnce([
        {
          id: mockOrderId,
          merchantId: mockTenantId,
          storeId: mockStoreId,
          orderNumber: 'ORD-TEST-001',
          status: OrderStatus.PAID,
          totalAmountMinor: 299900,
          currency: 'INR',
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
          customer: null,
          store: { id: mockStoreId, name: 'Bharat Crafts', slug: 'bharat-crafts' }
        }
      ]);

      const result = await ordersService.findAll(mockTenantId, {
        page: 1,
        limit: 10,
        status: OrderStatus.PAID
      });

      expect(result.meta.total).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.status).toBe(OrderStatus.PAID);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if order does not exist for merchant', async () => {
      mockPrisma.order.findFirst.mockResolvedValueOnce(null);

      await expect(ordersService.findOne(mockTenantId, 'non-existent-order')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return order details when found', async () => {
      mockPrisma.order.findFirst.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        storeId: mockStoreId,
        orderNumber: 'ORD-TEST-001',
        status: OrderStatus.PENDING_PAYMENT,
        totalAmountMinor: 299900,
        currency: 'INR',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'oi-1',
            productId: mockProductId,
            title: 'Office Backpack',
            sku: 'BPK-001',
            quantity: 1,
            priceMinor: 299900,
            createdAt: new Date()
          }
        ],
        customer: null,
        store: { id: mockStoreId, name: 'Bharat Crafts', slug: 'bharat-crafts' }
      });

      const result = await ordersService.findOne(mockTenantId, mockOrderId);

      expect(result.id).toBe(mockOrderId);
      expect(result.items[0]?.subtotalMinor).toBe(299900);
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException if order does not exist', async () => {
      mockPrisma.order.findFirst.mockResolvedValueOnce(null);

      await expect(
        ordersService.updateStatus(
          mockTenantId,
          'non-existent-order',
          { status: OrderStatus.PAID },
          mockUserId
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('should update status to PAID without replenishing inventory', async () => {
      mockPrisma.order.findFirst.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        status: OrderStatus.PENDING_PAYMENT,
        items: []
      });

      mockPrisma.order.update.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        storeId: mockStoreId,
        orderNumber: 'ORD-TEST-001',
        status: OrderStatus.PAID,
        totalAmountMinor: 299900,
        currency: 'INR',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        customer: null
      });

      const result = await ordersService.updateStatus(
        mockTenantId,
        mockOrderId,
        { status: OrderStatus.PAID, reason: 'Payment confirmed' },
        mockUserId
      );

      expect(result.status).toBe(OrderStatus.PAID);
      expect(mockPrisma.inventory.update).not.toHaveBeenCalled();
    });

    it('should replenish inventory and restore ACTIVE status when order is CANCELLED', async () => {
      mockPrisma.order.findFirst.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        status: OrderStatus.PENDING_PAYMENT,
        items: [{ productId: mockProductId, quantity: 2 }]
      });

      mockPrisma.inventory.findFirst.mockResolvedValueOnce({
        id: mockInventoryId,
        productId: mockProductId,
        availableQuantity: 0
      });

      mockPrisma.product.findUnique.mockResolvedValueOnce({
        id: mockProductId,
        status: ProductStatus.OUT_OF_STOCK
      });

      mockPrisma.order.update.mockResolvedValueOnce({
        id: mockOrderId,
        merchantId: mockTenantId,
        storeId: mockStoreId,
        orderNumber: 'ORD-TEST-001',
        status: OrderStatus.CANCELLED,
        totalAmountMinor: 599800,
        currency: 'INR',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        customer: null
      });

      const result = await ordersService.updateStatus(
        mockTenantId,
        mockOrderId,
        { status: OrderStatus.CANCELLED, reason: 'Customer requested cancellation' },
        mockUserId
      );

      expect(result.status).toBe(OrderStatus.CANCELLED);
      expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
        where: { id: mockInventoryId },
        data: { availableQuantity: 2 }
      });
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: { status: ProductStatus.ACTIVE }
      });
    });
  });
});
