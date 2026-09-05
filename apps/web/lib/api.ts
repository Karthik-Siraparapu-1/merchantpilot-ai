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
  timeout: 20000
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
      if (!refreshToken || originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
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
          .catch((err: unknown) => Promise.reject(err instanceof Error ? err : new Error(String(err))));
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
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// High-level typed API service layer
export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
      const res = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return res.data;
    },
    register: async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      merchantName: string;
      merchantSlug: string;
    }): Promise<AuthResponse> => {
      const res = await apiClient.post<AuthResponse>('/auth/register', payload);
      return res.data;
    },
    getProfile: async (): Promise<UserProfile> => {
      const res = await apiClient.get<UserProfile>('/auth/me');
      return res.data;
    },
    logout: async (): Promise<{ success: boolean }> => {
      const res = await apiClient.post<{ success: boolean }>('/auth/logout');
      return res.data;
    }
  },

  dashboard: {
    getMetrics: async (): Promise<DashboardMetrics> => {
      const res = await apiClient.get<DashboardMetrics>('/dashboard');
      return res.data;
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
      const res = await apiClient.get<ProductListResponse>('/products', { params });
      return res.data;
    },
    getById: async (id: string): Promise<Product> => {
      const res = await apiClient.get<Product>(`/products/${id}`);
      return res.data;
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
      const res = await apiClient.post<Product>('/products', data);
      return res.data;
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
      const res = await apiClient.patch<Product>(`/products/${id}`, data);
      return res.data;
    },
    delete: async (id: string): Promise<{ success: boolean; id: string }> => {
      const res = await apiClient.delete<{ success: boolean; id: string }>(`/products/${id}`);
      return res.data;
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
      const res = await apiClient.get<InventoryListResponse>('/inventory', { params });
      return res.data;
    },
    getLowStock: async (): Promise<InventoryListResponse> => {
      const res = await apiClient.get<InventoryListResponse>('/inventory/low-stock');
      return res.data;
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
      const res = await apiClient.patch<InventoryItem>(`/inventory/${productId}/adjust`, data);
      return res.data;
    },
    getAuditHistory: async (productId: string): Promise<InventoryAuditLog[]> => {
      const res = await apiClient.get<InventoryAuditLog[]>(`/inventory/${productId}/audit`);
      return res.data;
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
      const res = await apiClient.get<OrderListResponse>('/orders', { params });
      return res.data;
    },
    getById: async (id: string): Promise<Order> => {
      const res = await apiClient.get<Order>(`/orders/${id}`);
      return res.data;
    },
    create: async (data: {
      customerId?: string | undefined;
      customerEmail?: string | undefined;
      customerFirstName?: string | undefined;
      customerLastName?: string | undefined;
      items: { productId: string; quantity: number }[];
    }): Promise<Order> => {
      const res = await apiClient.post<Order>('/orders', data);
      return res.data;
    },
    updateStatus: async (
      id: string,
      data: { status: OrderStatus; reason?: string | undefined }
    ): Promise<Order> => {
      const res = await apiClient.patch<Order>(`/orders/${id}/status`, data);
      return res.data;
    }
  }
};
