import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { Prisma, ProductStatus } from '@merchantpilot/database';
import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ProductResponseDto,
  ProductListResponseDto,
  DeleteProductResponseDto
} from './dto/product-response.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const productInclude = {
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
} as const;

@Injectable()
export class ProductService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Create a new product scoped to the merchant's store
   */
  async create(tenantId: string, dto: CreateProductDto): Promise<ProductResponseDto> {
    const rawTitle = dto.title || dto.name;
    if (!rawTitle) {
      throw new BadRequestException('Product title is required');
    }
    const title = rawTitle.trim();
    const sku = dto.sku.trim();

    // 1. Resolve Store and verify tenant ownership
    let storeId = dto.storeId;
    if (storeId) {
      const store = await this.prisma.store.findFirst({
        where: { id: storeId, merchantId: tenantId }
      });
      if (!store) {
        throw new BadRequestException(
          `Store with ID "${storeId}" not found or does not belong to this merchant`
        );
      }
    } else {
      const defaultStore = await this.prisma.store.findFirst({
        where: { merchantId: tenantId }
      });
      if (!defaultStore) {
        throw new BadRequestException(
          `No store found for merchant "${tenantId}". Please create a store first.`
        );
      }
      storeId = defaultStore.id;
    }

    // 2. Validate SKU uniqueness in this store
    const existingSku = await this.prisma.product.findUnique({
      where: {
        storeId_sku: {
          storeId,
          sku
        }
      }
    });

    if (existingSku) {
      throw new ConflictException(`Product with SKU "${sku}" already exists in store "${storeId}"`);
    }

    // 3. Verify category if provided
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId }
      });
      if (!category) {
        throw new BadRequestException(`Category with ID "${dto.categoryId}" does not exist`);
      }
    }

    // 4. Generate slug
    const generatedSlug = dto.slug ? slugify(dto.slug) : slugify(title);
    const slug = generatedSlug || `product-${Date.now()}`;

    // 5. Create product and optional initial inventory
    const createdProduct = await this.prisma.product.create({
      data: {
        storeId,
        title,
        slug,
        sku,
        description: dto.description ?? null,
        priceMinor: dto.priceMinor,
        currency: dto.currency || 'INR',
        status: dto.status || ProductStatus.ACTIVE,
        categoryId: dto.categoryId ?? null,
        ...(dto.initialStock !== undefined && dto.initialStock >= 0
          ? {
              inventory: {
                create: {
                  storeId,
                  availableQuantity: dto.initialStock,
                  reservedQuantity: 0,
                  reorderThreshold: 10
                }
              }
            }
          : {})
      },
      include: productInclude
    });

    return createdProduct;
  }

  /**
   * List all products for a merchant with search, filtering, and pagination
   */
  async findAll(tenantId: string, query: QueryProductDto): Promise<ProductListResponseDto> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      store: {
        merchantId: tenantId
      }
    };

    if (query.storeId) {
      where.storeId = query.storeId;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.status) {
      where.status = query.status;
    } else if (!query.includeArchived) {
      where.status = { not: ProductStatus.ARCHIVED };
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: productInclude
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  /**
   * Get single product by ID, verified under merchant tenant
   */
  async findOne(tenantId: string, id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        store: {
          merchantId: tenantId
        }
      },
      include: productInclude
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found for this merchant tenant`);
    }

    return product;
  }

  /**
   * Update product details, verifying tenant ownership and SKU uniqueness
   */
  async update(tenantId: string, id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const existing = await this.prisma.product.findFirst({
      where: {
        id,
        store: {
          merchantId: tenantId
        }
      }
    });

    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" not found for this merchant tenant`);
    }

    // SKU collision check if changing SKU
    if (dto.sku && dto.sku.trim() !== existing.sku) {
      const newSku = dto.sku.trim();
      const duplicateSku = await this.prisma.product.findFirst({
        where: {
          storeId: existing.storeId,
          sku: newSku,
          id: { not: id }
        }
      });

      if (duplicateSku) {
        throw new ConflictException(`Product with SKU "${newSku}" already exists in this store`);
      }
    }

    // Category check if categoryId is updated
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId }
      });
      if (!category) {
        throw new BadRequestException(`Category with ID "${dto.categoryId}" does not exist`);
      }
    }

    const rawTitle = dto.title || dto.name;
    const title = rawTitle ? rawTitle.trim() : undefined;
    const slug = dto.slug ? slugify(dto.slug) : title ? slugify(title) : undefined;

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(dto.sku && { sku: dto.sku.trim() }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priceMinor !== undefined && { priceMinor: dto.priceMinor }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.status && { status: dto.status })
      },
      include: productInclude
    });

    return updated;
  }

  /**
   * Soft delete (archive) or hard delete product, verified under merchant tenant
   */
  async remove(tenantId: string, id: string, hard = false): Promise<DeleteProductResponseDto> {
    const existing = await this.prisma.product.findFirst({
      where: {
        id,
        store: {
          merchantId: tenantId
        }
      }
    });

    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" not found for this merchant tenant`);
    }

    if (hard) {
      await this.prisma.product.delete({
        where: { id }
      });
      return {
        success: true,
        message: 'Product permanently deleted',
        id
      };
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED }
    });

    return {
      success: true,
      message: 'Product successfully archived',
      id
    };
  }
}
