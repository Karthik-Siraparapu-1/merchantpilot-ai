'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  BarChart3,
  Settings,
  PlusCircle,
  LogOut,
  Bot,
  Mic,
  Sliders,
  TrendingUp,
  Megaphone,
  FileText,
  Sparkles,
  Users,
  Clock,
  Puzzle,
  Keyboard,
  ShieldAlert
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/auth-context';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    {
      category: 'Navigation',
      items: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          action: () => router.push('/dashboard'),
          shortcut: 'G D'
        },
        {
          label: 'Products',
          icon: Package,
          action: () => router.push('/products'),
          shortcut: 'G P'
        },
        {
          label: 'Inventory',
          icon: Boxes,
          action: () => router.push('/inventory'),
          shortcut: 'G I'
        },
        {
          label: 'Orders',
          icon: ShoppingCart,
          action: () => router.push('/orders'),
          shortcut: 'G O'
        },
        { label: 'Customers', icon: Users, action: () => router.push('/customers') },
        { label: 'Analytics', icon: BarChart3, action: () => router.push('/analytics') },
        { label: 'Integrations', icon: Puzzle, action: () => router.push('/integrations') },
        { label: 'Settings', icon: Settings, action: () => router.push('/settings') }
      ]
    },
    {
      category: 'AI Intelligence',
      items: [
        { label: 'AI Copilot', icon: Bot, action: () => router.push('/copilot'), shortcut: '⌘J' },
        { label: 'Voice AI', icon: Mic, action: () => router.push('/copilot'), shortcut: '⌘.' },
        { label: 'Scenario Lab', icon: Sliders, action: () => router.push('/scenario-lab') },
        { label: 'Predictions', icon: TrendingUp, action: () => router.push('/predictions') },
        { label: 'Marketing AI', icon: Megaphone, action: () => router.push('/marketing') },
        { label: 'AI Audit Log', icon: Clock, action: () => router.push('/audit-log') },
        {
          label: 'Fraud Scanner',
          icon: ShieldAlert,
          action: () => router.push('/copilot?q=Run+fraud+scan+on+recent+orders')
        },
        {
          label: 'Restock Recommendations',
          icon: Boxes,
          action: () => router.push('/copilot?q=Which+products+should+I+restock')
        }
      ]
    },
    {
      category: 'Quick Actions',
      items: [
        {
          label: 'Create Product',
          icon: PlusCircle,
          action: () => router.push('/products?action=create')
        },
        {
          label: 'Create Order',
          icon: PlusCircle,
          action: () => router.push('/orders?action=create')
        },
        { label: 'Adjust Stock', icon: Boxes, action: () => router.push('/inventory') },
        { label: 'Generate Report', icon: FileText, action: () => router.push('/reports') },
        { label: 'Launch Campaign', icon: Megaphone, action: () => router.push('/marketing') },
        {
          label: 'Ask AI Pricing',
          icon: Sparkles,
          action: () => router.push('/copilot?q=Analyze+pricing+and+suggest+increases')
        }
      ]
    },
    {
      category: 'System',
      items: [
        {
          label: 'Keyboard Shortcuts',
          icon: Keyboard,
          action: () => {
            /* handled by ? */
          }
        },
        { label: 'Sign Out', icon: LogOut, action: () => logout() }
      ]
    }
  ];

  const filtered = commands
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    }))
    .filter((section) => section.items.length > 0);

  const handleSelect = (action: () => void) => {
    setOpen(false);
    setQuery('');
    action();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-input bg-background/80 px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:border-border hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">Search or press ⌘K...</span>
        <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-md">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <DialogDescription className="sr-only">
            Quick search, navigation, and AI commands
          </DialogDescription>
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No matching commands found.
              </div>
            ) : (
              filtered.map((section) => (
                <div key={section.category} className="space-y-1">
                  <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {section.category}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleSelect(item.action)}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent transition-colors text-left"
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{item.label}</span>
                        {'shortcut' in item && item.shortcut && (
                          <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 h-5">
                            {item.shortcut}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
