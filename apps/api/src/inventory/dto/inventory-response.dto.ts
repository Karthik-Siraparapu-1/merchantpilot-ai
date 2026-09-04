import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus, AuditAction, ActorType } from '@merchantpilot/database';
import { PaginationMetaDto } from '../../products/dto/product-response.dto';

export class ProductSummaryInInventoryDto {
  @ApiProperty({ type: String, example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ type: String, example: 'ergonomic-office-backpack-20l' })
  slug!: string;

  @ApiProperty({ type: String, example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiProperty({ type: Number, example: 299900 })
  priceMinor!: number;

  @ApiProperty({ type: String, example: 'INR' })
  currency!: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status!: ProductStatus;
}

export class InventoryResponseDto {
  @ApiProperty({ type: String, example: 'i0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'p0000000-0000-0000-0000-000000000001' })
  productId!: string;

  @ApiProperty({ type: String, example: 's0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiProperty({ type: Number, example: 45 })
  availableQuantity!: number;

  @ApiProperty({ type: Number, example: 5 })
  reservedQuantity!: number;

  @ApiProperty({ type: Number, example: 10 })
  reorderThreshold!: number;

  @ApiProperty({ type: Boolean, example: false })
  isLowStock!: boolean;

  @ApiProperty({ type: Boolean, example: false })
  isOutOfStock!: boolean;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ type: () => ProductSummaryInInventoryDto })
  product?: ProductSummaryInInventoryDto | null;
}

export class InventorySummaryMetricsDto {
  @ApiProperty({
    type: Number,
    example: 1250,
    description: 'Total units in stock across merchant catalog'
  })
  totalAvailableStock!: number;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Number of SKUs currently at or below reorder threshold'
  })
  lowStockCount!: number;

  @ApiProperty({ type: Number, example: 1, description: 'Number of SKUs currently out of stock' })
  outOfStockCount!: number;
}

export class InventoryListResponseDto {
  @ApiProperty({ type: () => [InventoryResponseDto] })
  data!: InventoryResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiPropertyOptional({ type: () => InventorySummaryMetricsDto })
  summary?: InventorySummaryMetricsDto;
}

export class InventoryAuditLogDto {
  @ApiProperty({ type: String, example: 'a0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ enum: AuditAction, example: AuditAction.UPDATE })
  action!: AuditAction;

  @ApiProperty({ enum: ActorType, example: ActorType.MERCHANT_USER })
  actorType!: ActorType;

  @ApiProperty({ type: String, example: 'u0000000-0000-0000-0000-000000000001' })
  actorId!: string;

  @ApiProperty({ type: String, example: 'corr-018f3c77-0d4f' })
  correlationId!: string;

  @ApiPropertyOptional({ example: { availableQuantity: 35 } })
  beforeState?: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: { availableQuantity: 45, reason: 'Restocked' } })
  afterState?: Record<string, unknown> | null;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;
}
