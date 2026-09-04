import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@merchantpilot/database';
import { PaginationMetaDto } from '../../products/dto/product-response.dto';

export class OrderItemResponseDto {
  @ApiProperty({ example: 'oi000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  productId!: string;

  @ApiProperty({ example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 299900, description: 'Unit price in minor currency units' })
  priceMinor!: number;

  @ApiProperty({ example: 599800, description: 'Subtotal for this line item in minor units' })
  subtotalMinor!: number;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;
}

export class OrderCustomerSummaryDto {
  @ApiProperty({ example: 'u0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'customer@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Aarav' })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Patel' })
  lastName?: string | null;
}

export class OrderStoreSummaryDto {
  @ApiProperty({ example: 's0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'Bharat Crafts Flagship Store' })
  name!: string;

  @ApiProperty({ example: 'bharat-crafts-flagship' })
  slug!: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: 'o0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'm0000000-0000-0000-0000-000000000001' })
  merchantId!: string;

  @ApiProperty({ example: 's0000000-0000-0000-0000-000000000001' })
  storeId!: string;

  @ApiProperty({ example: 'ORD-2026-90812' })
  orderNumber!: string;

  @ApiPropertyOptional({ example: 'order_Nxv8976QW981' })
  razorpayOrderId?: string | null;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING_PAYMENT })
  status!: OrderStatus;

  @ApiProperty({ example: 599800, description: 'Total amount in minor currency units' })
  totalAmountMinor!: number;

  @ApiProperty({ example: 'INR' })
  currency!: string;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];

  @ApiPropertyOptional({ type: () => OrderCustomerSummaryDto })
  customer?: OrderCustomerSummaryDto | null;

  @ApiPropertyOptional({ type: () => OrderStoreSummaryDto })
  store?: OrderStoreSummaryDto | null;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data!: OrderResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
