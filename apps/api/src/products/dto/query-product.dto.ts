import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ProductStatus } from '@merchantpilot/database';

export class QueryProductDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    default: 1,
    minimum: 1,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    description: 'Search substring across title, SKU, or description',
    example: 'backpack'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific Store UUID',
    example: 'b0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4')
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Category UUID',
    example: 'a0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by product status',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Whether to include soft-deleted / ARCHIVED products in response',
    default: false,
    example: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  includeArchived: boolean = false;
}
