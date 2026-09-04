import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Inject
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import {
  InventoryResponseDto,
  InventoryListResponseDto,
  InventoryAuditLogDto
} from './dto/inventory-response.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Merchant Tenant UUID for multi-tenant isolation'
})
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(UserRole.MERCHANT_OWNER, UserRole.MERCHANDISER, UserRole.PLATFORM_OPERATOR)
@Controller('inventory')
export class InventoryController {
  constructor(@Inject(InventoryService) private readonly inventoryService: InventoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List inventory stock levels',
    description:
      'Retrieves inventory items across merchant catalog with search, low-stock filter, and catalog summary metrics.'
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: () => InventoryListResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryInventoryDto
  ): Promise<InventoryListResponseDto> {
    return this.inventoryService.findAll(tenantId, query);
  }

  @Get('low-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get low stock alerts',
    description: 'Returns products where available inventory is at or below the reorder threshold.'
  })
  @ApiQuery({ name: 'storeId', required: false, type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Low stock products retrieved successfully',
    type: () => [InventoryResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findLowStock(
    @TenantId() tenantId: string,
    @Query('storeId') storeId?: string
  ): Promise<InventoryResponseDto[]> {
    return this.inventoryService.findLowStock(tenantId, storeId);
  }

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get inventory by product ID',
    description:
      'Fetches current stock levels, reservations, and thresholds for a specific product.'
  })
  @ApiParam({ name: 'productId', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Inventory details retrieved successfully',
    type: () => InventoryResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found for this merchant' })
  async findByProduct(
    @TenantId() tenantId: string,
    @Param('productId', ParseUUIDPipe) productId: string
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.findByProduct(tenantId, productId);
  }

  @Patch(':productId/adjust')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Adjust stock quantity',
    description:
      'Increments/decrements stock or sets absolute count, automatically updating product status and logging an audit event.'
  })
  @ApiParam({ name: 'productId', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Stock adjusted successfully',
    type: () => InventoryResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid quantity or would result in negative stock' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found for this merchant' })
  async adjustStock(
    @TenantId() tenantId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser('id') userId: string
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.adjustStock(tenantId, productId, dto, userId);
  }

  @Patch(':productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update inventory parameters',
    description: 'Updates thresholds, available stock, or reserved allocations directly.'
  })
  @ApiParam({ name: 'productId', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Inventory parameters updated successfully',
    type: () => InventoryResponseDto
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found for this merchant' })
  async update(
    @TenantId() tenantId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateInventoryDto,
    @CurrentUser('id') userId: string
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.update(tenantId, productId, dto, userId);
  }

  @Get(':productId/audit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get inventory audit history',
    description: 'Retrieves historical stock changes and reasons for a given product.'
  })
  @ApiParam({ name: 'productId', description: 'Product UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Audit history retrieved successfully',
    type: () => [InventoryAuditLogDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Inventory not found for product' })
  async getAuditTrail(
    @TenantId() tenantId: string,
    @Param('productId', ParseUUIDPipe) productId: string
  ): Promise<InventoryAuditLogDto[]> {
    return this.inventoryService.getAuditTrail(tenantId, productId);
  }
}
