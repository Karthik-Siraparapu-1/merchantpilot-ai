import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { UserRole } from '@merchantpilot/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ProductResponseDto,
  ProductListResponseDto,
  DeleteProductResponseDto
} from './dto/product-response.dto';

@ApiTags('Products')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Merchant Tenant UUID for multi-tenant isolation'
})
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(UserRole.MERCHANT_OWNER, UserRole.MERCHANDISER, UserRole.PLATFORM_OPERATOR)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product in the store',
    description: 'Creates a product scoped to the authenticated merchant tenant and store.'
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: () => ProductResponseDto
  })
  @ApiResponse({ status: 400, description: 'Validation failure or invalid category/store ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (insufficient role or tenant mismatch)' })
  @ApiResponse({ status: 409, description: 'Duplicate SKU in this store' })
  async create(
    @TenantId() tenantId: string,
    @Body() dto: CreateProductDto
  ): Promise<ProductResponseDto> {
    return this.productService.create(tenantId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List products with search, filtering, and pagination',
    description:
      'Returns a paginated list of products belonging to the authenticated merchant tenant.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
    type: () => ProductListResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryProductDto
  ): Promise<ProductListResponseDto> {
    return this.productService.findAll(tenantId, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get product details by ID',
    description: 'Fetches details of a specific product verified under the merchant tenant.'
  })
  @ApiParam({ name: 'id', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: () => ProductResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(tenantId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update product by ID',
    description: 'Partially updates product fields under the merchant tenant.'
  })
  @ApiParam({ name: 'id', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: () => ProductResponseDto
  })
  @ApiResponse({ status: 400, description: 'Validation failure' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Duplicate SKU collision in this store' })
  async update(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete or archive product by ID',
    description:
      'Soft-deletes (archives) a product by default, preserving order referential integrity.'
  })
  @ApiParam({ name: 'id', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiQuery({
    name: 'hard',
    required: false,
    type: Boolean,
    description: 'Set true to permanently hard delete record instead of archiving'
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted or archived successfully',
    type: () => DeleteProductResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hard') hard?: boolean
  ): Promise<DeleteProductResponseDto> {
    return this.productService.remove(tenantId, id, hard);
  }
}
