import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@merchantpilot/database';

export class RevenueMetricsDto {
  @ApiProperty({
    example: 4599000,
    description: "Today's revenue in minor units (e.g. ₹45,990.00)"
  })
  todayRevenueMinor!: number;

  @ApiProperty({ example: 28450000, description: 'Total all-time revenue in minor units' })
  totalRevenueMinor!: number;

  @ApiProperty({ example: 'INR', description: 'Primary store currency' })
  currency!: string;
}

export class OrderMetricsDto {
  @ApiProperty({ example: 12, description: 'Number of orders placed today' })
  ordersToday!: number;

  @ApiProperty({ example: 148, description: 'Total orders placed all-time' })
  totalOrders!: number;

  @ApiProperty({ example: 4, description: 'Orders pending payment' })
  pendingOrders!: number;

  @ApiProperty({ example: 120, description: 'Paid orders' })
  paidOrders!: number;

  @ApiProperty({ example: 8, description: 'Orders currently processing' })
  processingOrders!: number;

  @ApiProperty({ example: 10, description: 'Orders shipped' })
  shippedOrders!: number;

  @ApiProperty({ example: 4, description: 'Orders delivered' })
  deliveredOrders!: number;

  @ApiProperty({ example: 2, description: 'Orders cancelled or refunded' })
  cancelledOrders!: number;
}

export class ProductMetricsDto {
  @ApiProperty({ example: 25, description: 'Total catalog products' })
  totalProducts!: number;

  @ApiProperty({ example: 22, description: 'Active products available for sale' })
  activeProducts!: number;

  @ApiProperty({ example: 2, description: 'Draft products not yet published' })
  draftProducts!: number;

  @ApiProperty({ example: 1, description: 'Archived products' })
  archivedProducts!: number;

  @ApiProperty({ example: 1, description: 'Products currently out of stock' })
  outOfStockProducts!: number;
}

export class InventoryMetricsDto {
  @ApiProperty({ example: 850, description: 'Total available units in stock across catalog' })
  totalUnitsInStock!: number;

  @ApiProperty({ example: 15, description: 'Total reserved units in pending checkouts' })
  totalUnitsReserved!: number;

  @ApiProperty({ example: 3, description: 'Number of SKUs at or below reorder threshold' })
  lowStockItemsCount!: number;

  @ApiProperty({ example: 1, description: 'Number of SKUs with 0 available stock' })
  outOfStockItemsCount!: number;
}

export class TopSellingProductDto {
  @ApiProperty({ example: 'p0000000-0000-0000-0000-000000000001' })
  productId!: string;

  @ApiProperty({ example: 'Ergonomic Office Backpack 20L' })
  title!: string;

  @ApiProperty({ example: 'BPK-ERGO-001' })
  sku!: string;

  @ApiProperty({ example: 34, description: 'Total units sold across all completed orders' })
  unitsSold!: number;

  @ApiProperty({ example: 10196600, description: 'Total revenue generated in minor units' })
  revenueGeneratedMinor!: number;
}

export class RecentOrderSummaryDto {
  @ApiProperty({ example: 'o0000000-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'ORD-2026-90812' })
  orderNumber!: string;

  @ApiPropertyOptional({ example: 'customer@example.com' })
  customerEmail?: string | null;

  @ApiProperty({ example: 599800, description: 'Total amount in minor units' })
  totalAmountMinor!: number;

  @ApiProperty({ example: 'INR' })
  currency!: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PAID })
  status!: OrderStatus;

  @ApiProperty({ example: 2, description: 'Number of line items in order' })
  itemCount!: number;

  @ApiProperty({ example: '2026-09-04T12:00:00.000Z' })
  createdAt!: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ type: RevenueMetricsDto })
  revenue!: RevenueMetricsDto;

  @ApiProperty({ type: OrderMetricsDto })
  orders!: OrderMetricsDto;

  @ApiProperty({ type: ProductMetricsDto })
  products!: ProductMetricsDto;

  @ApiProperty({ type: InventoryMetricsDto })
  inventory!: InventoryMetricsDto;

  @ApiProperty({ type: [TopSellingProductDto] })
  topSellingProducts!: TopSellingProductDto[];

  @ApiProperty({ type: [RecentOrderSummaryDto] })
  recentOrders!: RecentOrderSummaryDto[];
}
