import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@merchantpilot/database';

export class CategorySummaryDto {
  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'Travel & Luggage' })
  name!: string;

  @ApiProperty({ example: 'travel-luggage' })
  slug!: string;
}

export class InventorySummaryDto {
  @ApiProperty({ example: 'i0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 50 })
  availableQuantity!: number;

  @ApiProperty({ example: 0 })
  reservedQuantity!: number;

  @ApiProperty({ example: 10 })
  reorderThreshold!: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'b0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiPropertyOptional({ example: 'a0000000-0000-0000-0000-000000000001' })
  categoryId!: string | null;

  @ApiProperty({ example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ example: 'ergonomic-office-backpack-20l' })
  slug!: string;

  @ApiProperty({ example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiPropertyOptional({ example: 'Lightweight water-resistant backpack.' })
  description!: string | null;

  @ApiProperty({ example: 299900 })
  priceMinor!: number;

  @ApiProperty({ example: 'INR' })
  currency!: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ type: () => CategorySummaryDto })
  category?: CategorySummaryDto | null;

  @ApiPropertyOptional({ type: () => InventorySummaryDto })
  inventory?: InventorySummaryDto | null;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}

export class DeleteProductResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Product successfully archived' })
  message!: string;

  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  id!: string;
}
