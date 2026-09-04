import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsUUID,
  MaxLength
} from 'class-validator';
import { ProductStatus } from '@merchantpilot/database';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title / name',
    example: 'Ergonomic Office Backpack 20L',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({
    description: 'Alternative alias for title / name',
    example: 'Ergonomic Office Backpack 20L'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (unique per store)',
    example: 'BPK-ERGO-001'
  })
  @IsString()
  @IsNotEmpty({ message: 'SKU is required' })
  @MaxLength(100)
  sku!: string;

  @ApiPropertyOptional({
    description: 'URL-friendly slug (auto-generated from title if omitted)',
    example: 'ergonomic-office-backpack-20l'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Detailed product description',
    example: 'Lightweight water-resistant backpack with dedicated 15-inch laptop sleeve.'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price in minor currency units (e.g. 299900 for ₹2,999.00)',
    example: 299900,
    minimum: 0
  })
  @IsInt({ message: 'priceMinor must be an integer in minor units (e.g., paise/cents)' })
  @Min(0, { message: 'priceMinor must not be negative' })
  priceMinor!: number;

  @ApiPropertyOptional({
    description: 'Currency ISO 4217 3-letter code',
    example: 'INR',
    default: 'INR'
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'UUID of the Category this product belongs to',
    example: 'a0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Product availability status',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
    example: ProductStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(ProductStatus, {
    message: 'status must be a valid ProductStatus (DRAFT, ACTIVE, ARCHIVED, OUT_OF_STOCK)'
  })
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'UUID of the specific Store (defaults to merchant active store if omitted)',
    example: 'b0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4', { message: 'storeId must be a valid UUID' })
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Initial available inventory stock quantity',
    example: 50,
    minimum: 0
  })
  @IsOptional()
  @IsInt({ message: 'initialStock must be an integer' })
  @Min(0, { message: 'initialStock must not be negative' })
  initialStock?: number;
}
