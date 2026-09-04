import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ProductStatus } from '@merchantpilot/database';
import type { PrismaService } from '../common/prisma.service';
import { ProductService } from './product.service';

interface MockPrismaStore {
  findFirst: Mock;
}

interface MockPrismaProduct {
  findUnique: Mock;
  findFirst: Mock;
  findMany: Mock;
  create: Mock;
  update: Mock;
  delete: Mock;
  count: Mock;
}

interface MockPrismaCategory {
  findUnique: Mock;
}

interface MockPrismaService {
  store: MockPrismaStore;
  product: MockPrismaProduct;
  category: MockPrismaCategory;
}

describe('ProductService', () => {
  let productService: ProductService;
  let mockPrisma: MockPrismaService;

  const mockTenantId = 'm-tenant-123';
  const mockStoreId = 's-store-456';
  const mockProductId = 'p-prod-789';

  beforeEach(() => {
    mockPrisma = {
      store: {
        findFirst: vi.fn()
      },
      product: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn()
      },
      category: {
        findUnique: vi.fn()
      }
    };

    productService = new ProductService(mockPrisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('should throw BadRequestException if title is missing', async () => {
      await expect(
        productService.create(mockTenantId, {
          title: '',
          sku: 'SKU-001',
          priceMinor: 1000
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if merchant has no store configured', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce(null);

      await expect(
        productService.create(mockTenantId, {
          title: 'Office Backpack',
          sku: 'SKU-001',
          priceMinor: 299900
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if explicit storeId does not belong to merchant', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce(null);

      await expect(
        productService.create(mockTenantId, {
          title: 'Office Backpack',
          sku: 'SKU-001',
          priceMinor: 299900,
          storeId: 'foreign-store-id'
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if SKU already exists in the store', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findUnique.mockResolvedValueOnce({
        id: 'existing-product-id',
        storeId: mockStoreId,
        sku: 'SKU-001'
      });

      await expect(
        productService.create(mockTenantId, {
          title: 'Office Backpack',
          sku: 'SKU-001',
          priceMinor: 299900
        })
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if categoryId does not exist', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findUnique.mockResolvedValueOnce(null);
      mockPrisma.category.findUnique.mockResolvedValueOnce(null);

      await expect(
        productService.create(mockTenantId, {
          title: 'Office Backpack',
          sku: 'SKU-001',
          priceMinor: 299900,
          categoryId: 'non-existent-cat'
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully create product with default store and initial inventory', async () => {
      mockPrisma.store.findFirst.mockResolvedValueOnce({
        id: mockStoreId,
        merchantId: mockTenantId
      });
      mockPrisma.product.findUnique.mockResolvedValueOnce(null);
      mockPrisma.product.create.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        title: 'Ergonomic Office Backpack 20L',
        slug: 'ergonomic-office-backpack-20l',
        sku: 'SKU-001',
        description: 'Test description',
        priceMinor: 299900,
        currency: 'INR',
        status: ProductStatus.ACTIVE,
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        inventory: {
          id: 'inv-123',
          availableQuantity: 50,
          reservedQuantity: 0,
          reorderThreshold: 10
        }
      });

      const result = await productService.create(mockTenantId, {
        title: 'Ergonomic Office Backpack 20L',
        sku: 'SKU-001',
        description: 'Test description',
        priceMinor: 299900,
        initialStock: 50
      });

      expect(result.id).toBe(mockProductId);
      expect(result.sku).toBe('SKU-001');
      expect(result.inventory?.availableQuantity).toBe(50);
      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            storeId: mockStoreId,
            title: 'Ergonomic Office Backpack 20L',
            slug: 'ergonomic-office-backpack-20l',
            sku: 'SKU-001',
            description: 'Test description',
            priceMinor: 299900,
            currency: 'INR',
            status: ProductStatus.ACTIVE,
            categoryId: null,
            inventory: {
              create: {
                storeId: mockStoreId,
                availableQuantity: 50,
                reservedQuantity: 0,
                reorderThreshold: 10
              }
            }
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            inventory: {
              select: {
                id: true,
                availableQuantity: true,
                reservedQuantity: true,
                reorderThreshold: true
              }
            }
          }
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated list of products scoped to tenant', async () => {
      mockPrisma.product.count.mockResolvedValueOnce(1);
      mockPrisma.product.findMany.mockResolvedValueOnce([
        {
          id: mockProductId,
          storeId: mockStoreId,
          title: 'Office Backpack',
          slug: 'office-backpack',
          sku: 'SKU-001',
          priceMinor: 299900,
          currency: 'INR',
          status: ProductStatus.ACTIVE,
          categoryId: null
        }
      ]);

      const result = await productService.findAll(mockTenantId, {
        page: 1,
        limit: 10,
        search: 'backpack',
        includeArchived: false
      });

      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.sku).toBe('SKU-001');
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            store: { merchantId: mockTenantId },
            status: { not: ProductStatus.ARCHIVED },
            OR: [
              { title: { contains: 'backpack', mode: 'insensitive' } },
              { sku: { contains: 'backpack', mode: 'insensitive' } },
              { description: { contains: 'backpack', mode: 'insensitive' } }
            ]
          },
          skip: 0,
          take: 10
        })
      );
    });

    it('should include ARCHIVED products when includeArchived is true', async () => {
      mockPrisma.product.count.mockResolvedValueOnce(2);
      mockPrisma.product.findMany.mockResolvedValueOnce([
        { id: 'p-1', status: ProductStatus.ACTIVE },
        { id: 'p-2', status: ProductStatus.ARCHIVED }
      ]);

      const result = await productService.findAll(mockTenantId, {
        page: 1,
        limit: 20,
        includeArchived: true
      });

      expect(result.data).toHaveLength(2);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { store: { merchantId: mockTenantId } }
        })
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if product does not exist or tenant mismatch', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(productService.findOne(mockTenantId, 'non-existent-product')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should return product details when found for tenant', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        title: 'Office Backpack',
        sku: 'SKU-001',
        priceMinor: 299900,
        status: ProductStatus.ACTIVE
      });

      const result = await productService.findOne(mockTenantId, mockProductId);

      expect(result.id).toBe(mockProductId);
      expect(result.sku).toBe('SKU-001');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if product does not exist for merchant', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        productService.update(mockTenantId, mockProductId, { title: 'Updated Title' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new SKU collides with another product in same store', async () => {
      mockPrisma.product.findFirst
        .mockResolvedValueOnce({
          id: mockProductId,
          storeId: mockStoreId,
          sku: 'SKU-001'
        })
        .mockResolvedValueOnce({
          id: 'other-product-id',
          storeId: mockStoreId,
          sku: 'SKU-COLLISION'
        });

      await expect(
        productService.update(mockTenantId, mockProductId, { sku: 'SKU-COLLISION' })
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if categoryId does not exist', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        sku: 'SKU-001'
      });
      mockPrisma.category.findUnique.mockResolvedValueOnce(null);

      await expect(
        productService.update(mockTenantId, mockProductId, { categoryId: 'invalid-cat' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should update product successfully', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        sku: 'SKU-001'
      });
      mockPrisma.product.update.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        title: 'Updated Office Backpack',
        slug: 'updated-office-backpack',
        sku: 'SKU-001',
        priceMinor: 349900,
        status: ProductStatus.ACTIVE
      });

      const result = await productService.update(mockTenantId, mockProductId, {
        title: 'Updated Office Backpack',
        priceMinor: 349900
      });

      expect(result.title).toBe('Updated Office Backpack');
      expect(result.priceMinor).toBe(349900);
      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockProductId },
          data: {
            title: 'Updated Office Backpack',
            slug: 'updated-office-backpack',
            priceMinor: 349900
          }
        })
      );
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if product not found for merchant', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(productService.remove(mockTenantId, 'non-existent-product')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should soft delete product by setting status to ARCHIVED by default', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.ACTIVE
      });
      mockPrisma.product.update.mockResolvedValueOnce({
        id: mockProductId,
        status: ProductStatus.ARCHIVED
      });

      const result = await productService.remove(mockTenantId, mockProductId);

      expect(result.success).toBe(true);
      expect(result.message).toContain('archived');
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: { status: ProductStatus.ARCHIVED }
      });
    });

    it('should hard delete product when hard is true', async () => {
      mockPrisma.product.findFirst.mockResolvedValueOnce({
        id: mockProductId,
        storeId: mockStoreId,
        status: ProductStatus.ACTIVE
      });
      mockPrisma.product.delete.mockResolvedValueOnce({
        id: mockProductId
      });

      const result = await productService.remove(mockTenantId, mockProductId, true);

      expect(result.success).toBe(true);
      expect(result.message).toContain('permanently deleted');
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: mockProductId }
      });
    });
  });
});
