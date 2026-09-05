'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { api, TOKEN_KEY, REFRESH_TOKEN_KEY, ACTIVE_TENANT_KEY, USER_KEY } from '@/lib/api';
import type { UserProfile, AuthResponse } from '@/types/api';

interface AuthContextType {
  user: UserProfile | null;
  activeTenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    merchantName: string;
    merchantSlug: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  switchTenant: (tenantId: string) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleAuthSuccess = useCallback((authData: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));

    setUser(authData.user);

    // Pick first merchantId as active tenant if available
    const initialTenantId = authData.user.roles?.[0]?.merchantId || null;
    if (initialTenantId) {
      localStorage.setItem(ACTIVE_TENANT_KEY, initialTenantId);
      setActiveTenantId(initialTenantId);
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    try {
      const profile = await api.auth.getProfile();
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));

      const storedTenant = localStorage.getItem(ACTIVE_TENANT_KEY);
      const hasStoredTenant = profile.roles?.some((r) => r.merchantId === storedTenant);

      if (storedTenant && hasStoredTenant) {
        setActiveTenantId(storedTenant);
      } else if (profile.roles?.[0]?.merchantId) {
        const fallback = profile.roles[0].merchantId;
        localStorage.setItem(ACTIVE_TENANT_KEY, fallback);
        setActiveTenantId(fallback);
      }
    } catch {
      // Failed to get profile
      setUser(null);
      setActiveTenantId(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACTIVE_TENANT_KEY);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      const storedTenant = localStorage.getItem(ACTIVE_TENANT_KEY);

      if (token) {
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser) as UserProfile);
          } catch {
            // invalid JSON
          }
        }
        if (storedTenant) {
          setActiveTenantId(storedTenant);
        }

        await refreshUserProfile();
      }
      setIsLoading(false);
    };

    void initAuth();
  }, [refreshUserProfile]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const authData = await api.auth.login(credentials);
      handleAuthSuccess(authData);
      toast.success('Welcome back to MerchantPilot AI!');
      router.push('/dashboard');
    } catch (error: unknown) {
      let message = 'Invalid email or password';
      if (
        axios.isAxiosError<{ message?: string | string[] }>(error) &&
        error.response?.data?.message
      ) {
        const errData = error.response.data.message;
        message = Array.isArray(errData) ? errData.join(', ') : String(errData);
      }
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    merchantName: string;
    merchantSlug: string;
  }) => {
    setIsLoading(true);
    try {
      const authData = await api.auth.register(payload);
      handleAuthSuccess(authData);
      toast.success('Merchant organization created successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      let message = 'Registration failed. Please check your inputs.';
      if (
        axios.isAxiosError<{ message?: string | string[] }>(error) &&
        error.response?.data?.message
      ) {
        const errData = error.response.data.message;
        message = Array.isArray(errData) ? errData.join(', ') : String(errData);
      }
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACTIVE_TENANT_KEY);
      setUser(null);
      setActiveTenantId(null);
      toast.info('You have been signed out.');
      router.push('/login');
    }
  };

  const switchTenant = (tenantId: string) => {
    localStorage.setItem(ACTIVE_TENANT_KEY, tenantId);
    setActiveTenantId(tenantId);
    toast.info('Switched active merchant organization.');
    window.location.reload();
  };

  // Route protection redirect
  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

    if (!user && !isAuthRoute && pathname !== '/') {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeTenantId,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchTenant,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
