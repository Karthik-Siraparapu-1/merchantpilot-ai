export type UserRole =
  | 'MERCHANT_OWNER'
  | 'MERCHANDISER'
  | 'SUPPORT_AGENT'
  | 'PLATFORM_OPERATOR'
  | 'CUSTOMER';

export interface UserRoleAssignment {
  merchantId: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status: string;
  roles: UserRoleAssignment[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'OUT_OF_STOCK';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface InventorySnapshot {
  id: string;
  availableQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  sku: string;
  priceMinor: number;
  currency: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  category?: CategorySummary | null;
  inventory?: InventorySnapshot | null;
}

export interface ProductListResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface InventoryItem {
  id: string;
  productId: string;
  storeId: string;
  availableQuantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    priceMinor: number;
    currency: string;
    status: ProductStatus;
  };
}

export interface InventorySummaryMetrics {
  totalAvailableStock: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryListResponse {
  data: InventoryItem[];
  meta: PaginationMeta;
  summary: InventorySummaryMetrics;
}

export interface InventoryAuditLog {
  id: string;
  productId: string;
  storeId: string;
  action: string;
  actorType: string;
  actorId?: string | null;
  quantityDelta: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  sku: string;
  quantity: number;
  priceMinor: number;
  subtotalMinor: number;
  createdAt: string;
}

export interface OrderCustomer {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface OrderStore {
  id: string;
  name: string;
  slug: string;
}

export interface Order {
  id: string;
  merchantId: string;
  storeId: string;
  orderNumber: string;
  razorpayOrderId?: string | null;
  status: OrderStatus;
  totalAmountMinor: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: OrderCustomer | null;
  store?: OrderStore | null;
}

export interface OrderListResponse {
  data: Order[];
  meta: PaginationMeta;
}

export interface DashboardMetrics {
  revenue: {
    todayRevenueMinor: number;
    totalRevenueMinor: number;
    currency: string;
  };
  orders: {
    ordersToday: number;
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    archivedProducts: number;
    outOfStockProducts: number;
  };
  inventory: {
    totalUnitsInStock: number;
    totalUnitsReserved: number;
    lowStockItemsCount: number;
    outOfStockItemsCount: number;
  };
  topSellingProducts: {
    productId: string;
    title: string;
    sku: string;
    unitsSold: number;
    revenueGeneratedMinor: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerEmail?: string | null;
    totalAmountMinor: number;
    currency: string;
    status: OrderStatus;
    itemCount: number;
    createdAt: string;
  }[];
}
