import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsEnum, IsUUID, MaxLength } from 'class-validator';
import { ProductStatus } from '@merchantpilot/database';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated product title / name',
    example: 'Ergonomic Office Backpack 25L Pro',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Alternative alias for title / name',
    example: 'Ergonomic Office Backpack 25L Pro'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated Stock Keeping Unit',
    example: 'BPK-ERGO-002'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Updated URL-friendly slug',
    example: 'ergonomic-office-backpack-25l-pro'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Updated product description',
    example: 'Premium version with ballistic nylon and ergonomic strap system.'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated price in minor currency units',
    example: 349900,
    minimum: 0
  })
  @IsOptional()
  @IsInt({ message: 'priceMinor must be an integer in minor units' })
  @Min(0, { message: 'priceMinor must not be negative' })
  priceMinor?: number;

  @ApiPropertyOptional({
    description: 'Updated currency ISO code',
    example: 'INR'
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Updated Category UUID (or null to detach)',
    example: 'a0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string | null;

  @ApiPropertyOptional({
    description: 'Updated product availability status',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'status must be a valid ProductStatus' })
  status?: ProductStatus;
}
