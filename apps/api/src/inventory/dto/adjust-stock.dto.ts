import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';

export enum StockAdjustmentMode {
  DELTA = 'DELTA',
  ABSOLUTE = 'ABSOLUTE'
}

export class AdjustStockDto {
  @ApiProperty({
    description:
      'Adjustment mode: DELTA adds/subtracts from current available stock; ABSOLUTE overrides the stock count.',
    enum: StockAdjustmentMode,
    default: StockAdjustmentMode.DELTA,
    example: StockAdjustmentMode.DELTA
  })
  @IsEnum(StockAdjustmentMode, {
    message: 'mode must be either DELTA or ABSOLUTE'
  })
  mode: StockAdjustmentMode = StockAdjustmentMode.DELTA;

  @ApiProperty({
    description:
      'Adjustment quantity (positive/negative integer for DELTA, non-negative integer for ABSOLUTE)',
    example: 10
  })
  @IsInt({ message: 'quantity must be an integer' })
  quantity!: number;

  @ApiPropertyOptional({
    description: 'Reason for inventory stock adjustment (audit trail purpose)',
    example: 'Restocked from supplier shipment #PO-90812'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
