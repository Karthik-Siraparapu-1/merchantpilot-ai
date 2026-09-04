import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus, AuditAction, ActorType } from '@merchantpilot/database';
import { PaginationMetaDto } from '../../products/dto/product-response.dto';

export class ProductSummaryInInventoryDto {
  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ example: 'ergonomic-office-backpack-20l' })
  slug!: string;

  @ApiProperty({ example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiProperty({ example: 299900 })
  priceMinor!: number;

  @ApiProperty({ example: 'INR' })
  currency!: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status!: ProductStatus;
}

export class InventoryResponseDto {
  @ApiProperty({ example: 'i0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  productId!: string;

  @ApiProperty({ example: 's0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiProperty({ example: 45 })
  availableQuantity!: number;

  @ApiProperty({ example: 5 })
  reservedQuantity!: number;

  @ApiProperty({ example: 10 })
  reorderThreshold!: number;

  @ApiProperty({ example: false })
  isLowStock!: boolean;

  @ApiProperty({ example: false })
  isOutOfStock!: boolean;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ type: () => ProductSummaryInInventoryDto })
  product?: ProductSummaryInInventoryDto | null;
}

export class InventorySummaryMetricsDto {
  @ApiProperty({ example: 1250, description: 'Total units in stock across merchant catalog' })
  totalAvailableStock!: number;

  @ApiProperty({
    example: 3,
    description: 'Number of SKUs currently at or below reorder threshold'
  })
  lowStockCount!: number;

  @ApiProperty({ example: 1, description: 'Number of SKUs currently out of stock' })
  outOfStockCount!: number;
}

export class InventoryListResponseDto {
  @ApiProperty({ type: [InventoryResponseDto] })
  data!: InventoryResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiPropertyOptional({ type: InventorySummaryMetricsDto })
  summary?: InventorySummaryMetricsDto;
}

export class InventoryAuditLogDto {
  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ enum: AuditAction, example: AuditAction.UPDATE })
  action!: AuditAction;

  @ApiProperty({ enum: ActorType, example: ActorType.MERCHANT_USER })
  actorType!: ActorType;

  @ApiProperty({ example: 'u0000000-0000-0000-0000-000000000001' })
  actorId!: string;

  @ApiProperty({ example: 'corr-018f3c77-0d4f' })
  correlationId!: string;

  @ApiPropertyOptional({ example: { availableQuantity: 35 } })
  beforeState?: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: { availableQuantity: 45, reason: 'Restocked' } })
  afterState?: Record<string, unknown> | null;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;
}
