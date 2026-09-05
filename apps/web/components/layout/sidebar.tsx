'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
  Sparkles,
  Building2,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Store,
  Users,
  Clock,
  Puzzle
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAuth } from '@/features/auth/auth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Sliders, TrendingUp, Megaphone, FileText, Bot, Server } from 'lucide-react';

export const navigationItems = [
  {
    name: 'AI Command Center',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Boxes
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  }
];

export const aiSuiteItems = [
  {
    name: 'AI Workforce',
    href: '/ai-workforce',
    icon: Users,
    badge: '7 Agents'
  },
  {
    name: 'AI Features Showcase',
    href: '/ai-features',
    icon: Sparkles,
    badge: 'Guide'
  },
  {
    name: 'AI Copilot',
    href: '/copilot',
    icon: Bot,
    badge: 'Live'
  },
  {
    name: 'Scenario Lab',
    href: '/scenario-lab',
    icon: Sliders,
    badge: 'Simulator'
  },
  {
    name: 'Predictions',
    href: '/predictions',
    icon: TrendingUp,
    badge: '96%'
  },
  {
    name: 'Marketing AI',
    href: '/marketing',
    icon: Megaphone
  },
  {
    name: 'AI Activity',
    href: '/audit-log',
    icon: Clock,
    badge: 'Log'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText
  },
  {
    name: 'AutoPilot Center',
    href: '/autopilot',
    icon: Sliders,
    badge: 'Rules'
  },
  {
    name: 'AI Marketplace',
    href: '/marketplace',
    icon: Store,
    badge: 'New'
  },
  {
    name: 'System Health',
    href: '/system',
    icon: Server,
    badge: '99.9%'
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: Puzzle
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, activeTenantId, switchTenant, logout } = useAuth();

  const userInitials = getInitials(
    user ? `${user.firstName || ''} ${user.lastName || ''}` : '',
    user?.email
  );

  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col border-r border-border/80 bg-sidebar-background text-sidebar-foreground select-none transition-all',
        className
      )}
    >
      {/* Brand & Multi-Tenant Switcher */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate text-foreground leading-tight">
                  MerchantPilot
                </span>
                <span className="text-xs text-muted-foreground truncate flex items-center gap-1 font-mono">
                  <Store className="h-3 w-3 inline text-primary" />
                  {activeTenantId ? `${activeTenantId.slice(0, 8)}...` : 'Select Store'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Merchant Organizations
            </DropdownMenuLabel>
            {user?.roles && user.roles.length > 0 ? (
              user.roles.map((r) => (
                <DropdownMenuItem
                  key={r.merchantId}
                  onClick={() => switchTenant(r.merchantId)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="truncate font-mono text-xs">
                      {r.merchantId.slice(0, 12)}...
                    </span>
                  </div>
                  {activeTenantId === r.merchantId && (
                    <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No merchant assigned</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Organization Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Core Operations
        </div>
        {navigationItems.map((item) => {
          const isActive =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-105',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* AI Intelligence Suite Section */}
        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-primary/90 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          AI Intelligence Suite
        </div>
        {aiSuiteItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-transform group-hover:scale-105',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-mono font-medium',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom User Profile Section */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
              <Avatar className="h-8 w-8 rounded-lg border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-foreground">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || 'Merchant User'}
                </span>
                <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500 inline" />
                  {user?.roles?.[0]?.role?.replace('_', ' ') || 'Merchant Owner'}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => void logout()}
              className="flex items-center gap-2 text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
