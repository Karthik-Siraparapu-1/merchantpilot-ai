import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { OrderStatus } from '@merchantpilot/database';
import { OrdersController } from './orders.controller';
import type { OrdersService } from './orders.service';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { QueryOrderDto } from './dto/query-order.dto';

interface MockOrdersService {
  create: Mock;
  findAll: Mock;
  findOne: Mock;
  updateStatus: Mock;
}

describe('OrdersController', () => {
  let controller: OrdersController;
  let mockOrdersService: MockOrdersService;

  const mockTenantId = 'm-tenant-123';
  const mockUserId = 'u-user-456';
  const mockOrderId = 'o-order-789';

  beforeEach(() => {
    mockOrdersService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      updateStatus: vi.fn()
    };

    controller = new OrdersController(mockOrdersService as unknown as OrdersService);
  });

  describe('create', () => {
    it('should delegate create to OrdersService', async () => {
      const dto: CreateOrderDto = {
        items: [{ productId: 'p-1', quantity: 2 }]
      };

      const expectedOrder = {
        id: mockOrderId,
        orderNumber: 'ORD-123',
        status: OrderStatus.PENDING_PAYMENT,
        totalAmountMinor: 599800
      };

      mockOrdersService.create.mockResolvedValueOnce(expectedOrder);

      const result = await controller.create(mockTenantId, dto, mockUserId);

      expect(mockOrdersService.create).toHaveBeenCalledWith(mockTenantId, dto, mockUserId);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('findAll', () => {
    it('should delegate findAll to OrdersService', async () => {
      const query: QueryOrderDto = {
        page: 1,
        limit: 20,
        status: OrderStatus.PAID
      };

      const expectedList = {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 1 }
      };

      mockOrdersService.findAll.mockResolvedValueOnce(expectedList);

      const result = await controller.findAll(mockTenantId, query);

      expect(mockOrdersService.findAll).toHaveBeenCalledWith(mockTenantId, query);
      expect(result).toEqual(expectedList);
    });
  });

  describe('findOne', () => {
    it('should delegate findOne to OrdersService', async () => {
      const expectedOrder = {
        id: mockOrderId,
        orderNumber: 'ORD-123',
        status: OrderStatus.PAID
      };

      mockOrdersService.findOne.mockResolvedValueOnce(expectedOrder);

      const result = await controller.findOne(mockTenantId, mockOrderId);

      expect(mockOrdersService.findOne).toHaveBeenCalledWith(mockTenantId, mockOrderId);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('updateStatus', () => {
    it('should delegate updateStatus to OrdersService', async () => {
      const dto: UpdateOrderStatusDto = {
        status: OrderStatus.PAID,
        reason: 'Payment confirmed'
      };

      const expectedUpdated = {
        id: mockOrderId,
        status: OrderStatus.PAID
      };

      mockOrdersService.updateStatus.mockResolvedValueOnce(expectedUpdated);

      const result = await controller.updateStatus(mockTenantId, mockOrderId, dto, mockUserId);

      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(
        mockTenantId,
        mockOrderId,
        dto,
        mockUserId
      );
      expect(result).toEqual(expectedUpdated);
    });
  });
});
