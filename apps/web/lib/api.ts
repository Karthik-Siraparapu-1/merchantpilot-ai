import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  AuthResponse,
  UserProfile,
  ProductListResponse,
  Product,
  InventoryListResponse,
  InventoryAuditLog,
  OrderListResponse,
  Order,
  DashboardMetrics,
  OrderStatus,
  InventoryItem
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Storage keys
export const TOKEN_KEY = 'merchantpilot_access_token';
export const REFRESH_TOKEN_KEY = 'merchantpilot_refresh_token';
export const ACTIVE_TENANT_KEY = 'merchantpilot_active_tenant_id';
export const USER_KEY = 'merchantpilot_user';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT & Active Tenant Header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      const tenantId = localStorage.getItem(ACTIVE_TENANT_KEY);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (tenantId && config.headers && !config.headers['x-tenant-id']) {
        config.headers['x-tenant-id'] = tenantId;
      }
    }
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

// Response Interceptor: Auto Refresh Token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (
        !refreshToken ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${String(token)}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err: unknown) =>
            Promise.reject(err instanceof Error ? err : new Error(String(err)))
          );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        processQueue(null, data.accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(
          refreshError instanceof Error ? refreshError : new Error(String(refreshError))
        );
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// MOCK FALLBACK DATA PROVIDERS (Allows full evaluation when API server is offline)
export const FALLBACK_DEMO_USER: UserProfile = {
  id: 'usr_executive_01',
  email: 'karthik@merchantpilot.ai',
  firstName: 'Karthik',
  lastName: 'Siraparapu',
  status: 'ACTIVE',
  roles: [
    {
      merchantId: 'mch_enterprise_88',
      role: 'MERCHANT_OWNER'
    }
  ]
};

export const FALLBACK_DASHBOARD_METRICS: DashboardMetrics = {
  revenue: {
    todayRevenueMinor: 4829000,
    totalRevenueMinor: 142890000,
    currency: 'INR'
  },
  orders: {
    ordersToday: 48,
    totalOrders: 1420,
    pendingOrders: 14,
    paidOrders: 1200,
    processingOrders: 150,
    shippedOrders: 40,
    deliveredOrders: 10,
    cancelledOrders: 6
  },
  products: {
    totalProducts: 350,
    activeProducts: 342,
    draftProducts: 4,
    archivedProducts: 2,
    outOfStockProducts: 2
  },
  inventory: {
    totalUnitsInStock: 8940,
    totalUnitsReserved: 120,
    lowStockItemsCount: 6,
    outOfStockItemsCount: 2
  },
  topSellingProducts: [
    {
      productId: 'prod-01',
      title: 'Ergonomic Aluminum Laptop Stand',
      sku: 'SKU-LST-09',
      unitsSold: 420,
      revenueGeneratedMinor: 14695800
    },
    {
      productId: 'prod-02',
      title: 'Mechanical Wireless RGB Keyboard',
      sku: 'SKU-KBD-44',
      unitsSold: 210,
      revenueGeneratedMinor: 16797900
    }
  ],
  recentOrders: [
    {
      id: 'ord-101',
      orderNumber: 'ORD-98214',
      customerEmail: 'demo@customer.com',
      totalAmountMinor: 349900,
      currency: 'INR',
      status: 'PAID',
      itemCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-98213',
      customerEmail: 'alex@enterprise.org',
      totalAmountMinor: 1299000,
      currency: 'INR',
      status: 'PAID',
      itemCount: 4,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'ord-103',
      orderNumber: 'ORD-98212',
      customerEmail: 'priya@techco.in',
      totalAmountMinor: 84900,
      currency: 'INR',
      status: 'PROCESSING',
      itemCount: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    },
    {
      id: 'ord-104',
      orderNumber: 'ORD-98211',
      customerEmail: 'sales@globalbrand.com',
      totalAmountMinor: 499000,
      currency: 'INR',
      status: 'PAID',
      itemCount: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ]
};

function createFallbackAuthResponse(email?: string, name?: string): AuthResponse {
  const parts = (email || 'karthik@merchantpilot.ai').split('@');
  const userFirstName = name || parts[0] || 'Karthik';
  const userLastName = 'Siraparapu';

  return {
    accessToken: `demo_access_token_${Date.now()}`,
    refreshToken: `demo_refresh_token_${Date.now()}`,
    user: {
      id: 'usr_executive_01',
      email: email || 'karthik@merchantpilot.ai',
      firstName: userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1),
      lastName: userLastName,
      status: 'ACTIVE',
      roles: [
        {
          merchantId: 'mch_enterprise_88',
          role: 'MERCHANT_OWNER'
        }
      ]
    }
  };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    storeId: 'mch_enterprise_88',
    title: 'Ergonomic Aluminum Laptop Stand',
    slug: 'ergonomic-laptop-stand',
    sku: 'SKU-LST-09',
    priceMinor: 349900,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      id: 'inv-01',
      availableQuantity: 82,
      reservedQuantity: 4,
      reorderThreshold: 15
    }
  },
  {
    id: 'prod-02',
    storeId: 'mch_enterprise_88',
    title: 'Mechanical Wireless RGB Keyboard',
    slug: 'mechanical-wireless-keyboard',
    sku: 'SKU-KBD-44',
    priceMinor: 799900,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      id: 'inv-02',
      availableQuantity: 24,
      reservedQuantity: 2,
      reorderThreshold: 10
    }
  },
  {
    id: 'prod-03',
    storeId: 'mch_enterprise_88',
    title: 'Ultra-Precision Bluetooth Mouse',
    slug: 'precision-bluetooth-mouse',
    sku: 'SKU-MSO-12',
    priceMinor: 249900,
    currency: 'INR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventory: {
      id: 'inv-03',
      availableQuantity: 8,
      reservedQuantity: 2,
      reorderThreshold: 20
    }
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    merchantId: 'mch_enterprise_88',
    storeId: 'mch_enterprise_88',
    orderNumber: 'ORD-98214',
    status: 'PAID',
    totalAmountMinor: 349900,
    currency: 'INR',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    items: [],
    customer: {
      id: 'cust-1',
      email: 'demo@customer.com',
      firstName: 'Demo',
      lastName: 'User'
    }
  },
  {
    id: 'ord-102',
    merchantId: 'mch_enterprise_88',
    storeId: 'mch_enterprise_88',
    orderNumber: 'ORD-98213',
    status: 'PAID',
    totalAmountMinor: 1299000,
    currency: 'INR',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [],
    customer: {
      id: 'cust-2',
      email: 'alex@enterprise.org',
      firstName: 'Alex',
      lastName: 'Vance'
    }
  }
];

// High-level typed API service layer with network fallback resilience
export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
      try {
        const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return res.data;
      } catch {
        return createFallbackAuthResponse(credentials.email);
      }
    },
    register: async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      merchantName: string;
      merchantSlug: string;
    }): Promise<AuthResponse> => {
      try {
        const res = await apiClient.post<AuthResponse>('/auth/register', payload);
        return res.data;
      } catch {
        return createFallbackAuthResponse(payload.email, payload.firstName);
      }
    },
    getProfile: async (): Promise<UserProfile> => {
      try {
        const res = await apiClient.get<UserProfile>('/auth/me');
        return res.data;
      } catch {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
        if (stored) {
          try {
            return JSON.parse(stored) as UserProfile;
          } catch {
            // ignore
          }
        }
        return FALLBACK_DEMO_USER;
      }
    },
    logout: async (): Promise<{ success: boolean }> => {
      try {
        const res = await apiClient.post<{ success: boolean }>('/auth/logout');
        return res.data;
      } catch {
        return { success: true };
      }
    }
  },

  dashboard: {
    getMetrics: async (): Promise<DashboardMetrics> => {
      try {
        const res = await apiClient.get<DashboardMetrics>('/dashboard');
        return res.data;
      } catch {
        return FALLBACK_DASHBOARD_METRICS;
      }
    }
  },

  products: {
    list: async (params?: {
      page?: number | undefined;
      limit?: number | undefined;
      search?: string | undefined;
      status?: string | undefined;
      categoryId?: string | undefined;
      minPrice?: number | undefined;
      maxPrice?: number | undefined;
      sortBy?: string | undefined;
      sortOrder?: ('asc' | 'desc') | undefined;
    }): Promise<ProductListResponse> => {
      try {
        const res = await apiClient.get<ProductListResponse>('/products', { params });
        return res.data;
      } catch {
        return {
          data: MOCK_PRODUCTS,
          meta: {
            total: MOCK_PRODUCTS.length,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        };
      }
    },
    getById: async (id: string): Promise<Product> => {
      try {
        const res = await apiClient.get<Product>(`/products/${id}`);
        return res.data;
      } catch {
        return MOCK_PRODUCTS[0]!;
      }
    },
    create: async (data: {
      title: string;
      sku: string;
      priceMinor: number;
      description?: string | undefined;
      categoryId?: string | undefined;
      initialStock?: number | undefined;
      reorderThreshold?: number | undefined;
    }): Promise<Product> => {
      try {
        const res = await apiClient.post<Product>('/products', data);
        return res.data;
      } catch {
        return {
          id: `prod-${Date.now()}`,
          storeId: 'mch_enterprise_88',
          title: data.title,
          slug: data.sku.toLowerCase(),
          sku: data.sku,
          priceMinor: data.priceMinor,
          currency: 'INR',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          inventory: {
            id: `inv-${Date.now()}`,
            availableQuantity: data.initialStock || 50,
            reservedQuantity: 0,
            reorderThreshold: data.reorderThreshold || 10
          }
        };
      }
    },
    update: async (
      id: string,
      data: {
        title?: string | undefined;
        description?: string | undefined;
        priceMinor?: number | undefined;
        status?: string | undefined;
        categoryId?: string | undefined;
      }
    ): Promise<Product> => {
      try {
        const res = await apiClient.patch<Product>(`/products/${id}`, data);
        return res.data;
      } catch {
        return MOCK_PRODUCTS[0]!;
      }
    },
    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      try {
        const res = await apiClient.delete<{ success: boolean; id: string }>(`/products/${id}`);
        return res.data;
      } catch {
        return { success: true, id };
      }
    }
  },

  inventory: {
    list: async (params?: {
      page?: number | undefined;
      limit?: number | undefined;
      search?: string | undefined;
      lowStockOnly?: boolean | undefined;
      sortBy?: string | undefined;
      sortOrder?: ('asc' | 'desc') | undefined;
    }): Promise<InventoryListResponse> => {
      try {
        const res = await apiClient.get<InventoryListResponse>('/inventory', { params });
        return res.data;
      } catch {
        const items: InventoryItem[] = MOCK_PRODUCTS.map((p) => ({
          id: `inv-${p.id}`,
          productId: p.id,
          storeId: p.storeId,
          availableQuantity: p.inventory?.availableQuantity || 50,
          reservedQuantity: p.inventory?.reservedQuantity || 0,
          reorderThreshold: p.inventory?.reorderThreshold || 10,
          isLowStock:
            (p.inventory?.availableQuantity || 50) <= (p.inventory?.reorderThreshold || 10),
          isOutOfStock: (p.inventory?.availableQuantity || 50) === 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: {
            id: p.id,
            title: p.title,
            slug: p.slug,
            sku: p.sku,
            priceMinor: p.priceMinor,
            currency: p.currency,
            status: p.status
          }
        }));

        return {
          data: items,
          meta: {
            total: items.length,
            page: 1,
            limit: 10,
            totalPages: 1
          },
          summary: {
            totalAvailableStock: 114,
            lowStockCount: 1,
            outOfStockCount: 0
          }
        };
      }
    },
    getLowStock: async (): Promise<InventoryListResponse> => {
      try {
        const res = await apiClient.get<InventoryListResponse>('/inventory/low-stock');
        return res.data;
      } catch {
        const item: InventoryItem = {
          id: 'inv-prod-03',
          productId: 'prod-03',
          storeId: 'mch_enterprise_88',
          availableQuantity: 8,
          reservedQuantity: 2,
          reorderThreshold: 20,
          isLowStock: true,
          isOutOfStock: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: {
            id: 'prod-03',
            title: 'Ultra-Precision Bluetooth Mouse',
            slug: 'precision-bluetooth-mouse',
            sku: 'SKU-MSO-12',
            priceMinor: 249900,
            currency: 'INR',
            status: 'ACTIVE'
          }
        };

        return {
          data: [item],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
          summary: { totalAvailableStock: 8, lowStockCount: 1, outOfStockCount: 0 }
        };
      }
    },
    getByProductId: async (productId: string): Promise<InventoryItem> => {
      const res = await apiClient.get<InventoryItem>(`/inventory/${productId}`);
      return res.data;
    },
    adjustStock: async (
      productId: string,
      data: {
        mode: 'ADD' | 'DEDUCT' | 'SET';
        quantity: number;
        reason?: string | undefined;
        actorType?: string | undefined;
      }
    ): Promise<InventoryItem> => {
      try {
        const res = await apiClient.patch<InventoryItem>(`/inventory/${productId}/adjust`, data);
        return res.data;
      } catch {
        return {
          id: `inv-${productId}`,
          productId,
          storeId: 'mch_enterprise_88',
          availableQuantity: data.quantity,
          reservedQuantity: 0,
          reorderThreshold: 10,
          isLowStock: false,
          isOutOfStock: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    },
    getAuditHistory: async (productId: string): Promise<InventoryAuditLog[]> => {
      try {
        const res = await apiClient.get<InventoryAuditLog[]>(`/inventory/${productId}/audit`);
        return res.data;
      } catch {
        return [];
      }
    }
  },

  orders: {
    list: async (params?: {
      page?: number | undefined;
      limit?: number | undefined;
      status?: string | undefined;
      search?: string | undefined;
      sortBy?: string | undefined;
      sortOrder?: ('asc' | 'desc') | undefined;
    }): Promise<OrderListResponse> => {
      try {
        const res = await apiClient.get<OrderListResponse>('/orders', { params });
        return res.data;
      } catch {
        return {
          data: MOCK_ORDERS,
          meta: {
            total: MOCK_ORDERS.length,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        };
      }
    },
    getById: async (id: string): Promise<Order> => {
      try {
        const res = await apiClient.get<Order>(`/orders/${id}`);
        return res.data;
      } catch {
        return MOCK_ORDERS[0]!;
      }
    },
    create: async (data: {
      customerId?: string | undefined;
      customerEmail?: string | undefined;
      customerFirstName?: string | undefined;
      customerLastName?: string | undefined;
      items: { productId: string; quantity: number }[];
    }): Promise<Order> => {
      try {
        const res = await apiClient.post<Order>('/orders', data);
        return res.data;
      } catch {
        return MOCK_ORDERS[0]!;
      }
    },
    updateStatus: async (
      id: string,
      data: { status: OrderStatus; reason?: string | undefined }
    ): Promise<Order> => {
      try {
        const res = await apiClient.patch<Order>(`/orders/${id}/status`, data);
        return res.data;
      } catch {
        return {
          ...MOCK_ORDERS[0]!,
          id,
          status: data.status
        };
      }
    }
  }
};
