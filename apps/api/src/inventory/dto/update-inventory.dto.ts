import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInventoryDto {
  @ApiPropertyOptional({
    description: 'Updated available inventory stock quantity',
    example: 75,
    minimum: 0
  })
  @IsOptional()
  @IsInt({ message: 'availableQuantity must be an integer' })
  @Min(0, { message: 'availableQuantity cannot be negative' })
  availableQuantity?: number;

  @ApiPropertyOptional({
    description: 'Updated reserved inventory stock quantity (e.g. allocated to pending checkouts)',
    example: 5,
    minimum: 0
  })
  @IsOptional()
  @IsInt({ message: 'reservedQuantity must be an integer' })
  @Min(0, { message: 'reservedQuantity cannot be negative' })
  reservedQuantity?: number;

  @ApiPropertyOptional({
    description: 'Threshold below which the product is considered low in stock',
    example: 15,
    minimum: 0
  })
  @IsOptional()
  @IsInt({ message: 'reorderThreshold must be an integer' })
  @Min(0, { message: 'reorderThreshold cannot be negative' })
  reorderThreshold?: number;

  @ApiPropertyOptional({
    description: 'Reason for updating inventory configuration / parameters',
    example: 'Adjusted low-stock alert threshold for festive peak season'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
