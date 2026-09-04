import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { ProductStatus } from '@merchantpilot/database';
import { ProductController } from './product.controller';
import type { ProductService } from './product.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import type { QueryProductDto } from './dto/query-product.dto';

interface MockProductService {
  create: Mock;
  findAll: Mock;
  findOne: Mock;
  update: Mock;
  remove: Mock;
}

describe('ProductController', () => {
  let controller: ProductController;
  let mockProductService: MockProductService;

  const mockTenantId = 'm-tenant-123';
  const mockProductId = 'p-prod-789';

  beforeEach(() => {
    mockProductService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn()
    };

    controller = new ProductController(mockProductService as unknown as ProductService);
  });

  describe('create', () => {
    it('should delegate create to ProductService with tenantId', async () => {
      const dto: CreateProductDto = {
        title: 'Ergonomic Backpack',
        sku: 'BPK-001',
        priceMinor: 299900
      };

      const expectedResponse = {
        id: mockProductId,
        storeId: 's-123',
        title: dto.title,
        sku: dto.sku,
        slug: 'ergonomic-backpack',
        priceMinor: dto.priceMinor,
        currency: 'INR',
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockProductService.create.mockResolvedValueOnce(expectedResponse);

      const result = await controller.create(mockTenantId, dto);

      expect(mockProductService.create).toHaveBeenCalledWith(mockTenantId, dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should delegate findAll to ProductService with tenantId and query', async () => {
      const query: QueryProductDto = {
        page: 1,
        limit: 20,
        search: 'backpack',
        includeArchived: false
      };

      const expectedListResponse = {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 1 }
      };

      mockProductService.findAll.mockResolvedValueOnce(expectedListResponse);

      const result = await controller.findAll(mockTenantId, query);

      expect(mockProductService.findAll).toHaveBeenCalledWith(mockTenantId, query);
      expect(result).toEqual(expectedListResponse);
    });
  });

  describe('findOne', () => {
    it('should delegate findOne to ProductService with tenantId and productId', async () => {
      const expectedProduct = {
        id: mockProductId,
        storeId: 's-123',
        title: 'Office Backpack',
        sku: 'BPK-001',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockProductService.findOne.mockResolvedValueOnce(expectedProduct);

      const result = await controller.findOne(mockTenantId, mockProductId);

      expect(mockProductService.findOne).toHaveBeenCalledWith(mockTenantId, mockProductId);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('update', () => {
    it('should delegate update to ProductService with tenantId, id, and dto', async () => {
      const dto: UpdateProductDto = {
        title: 'Updated Office Backpack',
        priceMinor: 349900
      };

      const expectedUpdated = {
        id: mockProductId,
        storeId: 's-123',
        title: 'Updated Office Backpack',
        sku: 'BPK-001',
        priceMinor: 349900,
        currency: 'INR',
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockProductService.update.mockResolvedValueOnce(expectedUpdated);

      const result = await controller.update(mockTenantId, mockProductId, dto);

      expect(mockProductService.update).toHaveBeenCalledWith(mockTenantId, mockProductId, dto);
      expect(result).toEqual(expectedUpdated);
    });
  });

  describe('remove', () => {
    it('should delegate remove to ProductService with tenantId, id, and hard flag', async () => {
      const expectedDeleteResponse = {
        success: true,
        message: 'Product successfully archived',
        id: mockProductId
      };

      mockProductService.remove.mockResolvedValueOnce(expectedDeleteResponse);

      const result = await controller.remove(mockTenantId, mockProductId, false);

      expect(mockProductService.remove).toHaveBeenCalledWith(mockTenantId, mockProductId, false);
      expect(result).toEqual(expectedDeleteResponse);
    });
  });
});
