import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '@merchantpilot/database';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New target order status',
    enum: OrderStatus,
    example: OrderStatus.PAID
  })
  @IsEnum(OrderStatus, {
    message:
      'status must be a valid OrderStatus (PENDING_PAYMENT, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)'
  })
  status!: OrderStatus;

  @ApiPropertyOptional({
    description: 'Optional reason or note for the status change',
    example: 'Payment captured successfully via Razorpay test'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
