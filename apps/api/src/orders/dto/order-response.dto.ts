import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@merchantpilot/database';
import { PaginationMetaDto } from '../../products/dto/product-response.dto';

export class OrderItemResponseDto {
  @ApiProperty({ type: String, example: 'oi000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'p0000000-0000-0000-0000-000000000001' })
  productId!: string;

  @ApiProperty({ type: String, example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ type: String, example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiProperty({ type: Number, example: 2 })
  quantity!: number;

  @ApiProperty({ type: Number, example: 299900, description: 'Unit price in minor currency units' })
  priceMinor!: number;

  @ApiProperty({
    type: Number,
    example: 599800,
    description: 'Subtotal for this line item in minor units'
  })
  subtotalMinor!: number;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;
}

export class OrderCustomerSummaryDto {
  @ApiProperty({ type: String, example: 'u0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'customer@example.com' })
  email!: string;

  @ApiPropertyOptional({ type: String, example: 'Aarav' })
  firstName?: string | null;

  @ApiPropertyOptional({ type: String, example: 'Patel' })
  lastName?: string | null;
}

export class OrderStoreSummaryDto {
  @ApiProperty({ type: String, example: 's0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'Bharat Crafts Flagship Store' })
  name!: string;

  @ApiProperty({ type: String, example: 'bharat-crafts-flagship' })
  slug!: string;
}

export class OrderResponseDto {
  @ApiProperty({ type: String, example: 'o0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ type: String, example: 'm0000000-0000-0000-0000-000000000001' })
  merchantId!: string;

  @ApiProperty({ type: String, example: 's0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiProperty({ type: String, example: 'ORD-2026-90812' })
  orderNumber!: string;

  @ApiPropertyOptional({ type: String, example: 'order_Nxv8976QW981' })
  razorpayOrderId?: string | null;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING_PAYMENT })
  status!: OrderStatus;

  @ApiProperty({
    type: Number,
    example: 599800,
    description: 'Total amount in minor currency units'
  })
  totalAmountMinor!: number;

  @ApiProperty({ type: String, example: 'INR' })
  currency!: string;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: Date, example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: () => [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiPropertyOptional({ type: () => OrderCustomerSummaryDto })
  customer?: OrderCustomerSummaryDto | null;

  @ApiPropertyOptional({ type: () => OrderStoreSummaryDto })
  store?: OrderStoreSummaryDto | null;
}

export class OrderListResponseDto {
  @ApiProperty({ type: () => [OrderResponseDto] })
  data!: OrderResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
