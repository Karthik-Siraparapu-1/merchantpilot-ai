import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength
} from 'class-validator';
import { OrderStatus } from '@merchantpilot/database';

export class OrderItemInputDto {
  @ApiProperty({
    description: 'UUID of the product to purchase',
    example: 'p0000000-0000-0000-0000-000000000001'
  })
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId!: string;

  @ApiProperty({
    description: 'Quantity of items to purchase',
    example: 2,
    minimum: 1
  })
  @IsInt({ message: 'quantity must be an integer' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array of products and quantities to purchase',
    type: [OrderItemInputDto]
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items!: OrderItemInputDto[];

  @ApiPropertyOptional({
    description: 'Target store UUID (defaults to merchant active store if omitted)',
    example: 's0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4')
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Customer UUID if associated with an existing user',
    example: 'u0000000-0000-0000-0000-000000000001'
  })
  @IsOptional()
  @IsUUID('4')
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Initial order status',
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT,
    example: OrderStatus.PENDING_PAYMENT
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Order currency ISO code',
    example: 'INR',
    default: 'INR'
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}
