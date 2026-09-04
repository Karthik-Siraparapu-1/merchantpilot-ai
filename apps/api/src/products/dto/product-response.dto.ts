import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@merchantpilot/database';

export class CategorySummaryDto {
  @ApiProperty({ type: String, example: 'a0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'Travel & Luggage' })
  name!: string;

  @ApiProperty({ type: String, example: 'travel-luggage' })
  slug!: string;
}

export class InventorySummaryDto {
  @ApiProperty({ type: String, example: 'i0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: Number, example: 50 })
  availableQuantity!: number;

  @ApiProperty({ type: Number, example: 0 })
  reservedQuantity!: number;

  @ApiProperty({ type: Number, example: 10 })
  reorderThreshold!: number;
}

export class ProductResponseDto {
  @ApiProperty({ type: String, example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'b0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiPropertyOptional({ type: String, example: 'a0000000-0000-0000-0000-000000000001' })
  categoryId!: string | null;

  @ApiProperty({ type: String, example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ type: String, example: 'ergonomic-office-backpack-20l' })
  slug!: string;

  @ApiProperty({ type: String, example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiPropertyOptional({ type: String, example: 'Lightweight water-resistant backpack.' })
  description!: string | null;

  @ApiProperty({ type: Number, example: 299900 })
  priceMinor!: number;

  @ApiProperty({ type: String, example: 'INR' })
  currency!: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ type: () => CategorySummaryDto })
  category?: CategorySummaryDto | null;

  @ApiPropertyOptional({ type: () => InventorySummaryDto })
  inventory?: InventorySummaryDto | null;
}

export class PaginationMetaDto {
  @ApiProperty({ type: Number, example: 42 })
  total!: number;

  @ApiProperty({ type: Number, example: 1 })
  page!: number;

  @ApiProperty({ type: Number, example: 20 })
  limit!: number;

  @ApiProperty({ type: Number, example: 3 })
  totalPages!: number;
}

export class ProductListResponseDto {
  @ApiProperty({ type: () => [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}

export class DeleteProductResponseDto {
  @ApiProperty({ type: Boolean, example: true })
  success!: boolean;

  @ApiProperty({ type: String, example: 'Product successfully archived' })
  message!: string;

  @ApiProperty({ type: String, example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;
}
