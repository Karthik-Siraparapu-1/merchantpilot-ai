import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsUUID, IsBoolean } from 'class-validator';

export class QueryInventoryDto {
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
    description: 'Search substring across product title or SKU',
    example: 'backpack'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by Store UUID',
    example: 'b0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4')
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Filter only items where availableQuantity <= reorderThreshold',
    default: false,
    example: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  lowStockOnly: boolean = false;
}
