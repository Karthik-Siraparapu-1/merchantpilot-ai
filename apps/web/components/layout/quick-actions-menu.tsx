'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus, Package, ShoppingCart, Boxes, FileText, Megaphone, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActionsMenu() {
  const router = useRouter();

  const actions = [
    { icon: Package, label: 'Create Product', href: '/products?action=create' },
    { icon: ShoppingCart, label: 'Create Order', href: '/orders?action=create' },
    { icon: Boxes, label: 'Adjust Stock', href: '/inventory' },
    { icon: FileText, label: 'Generate Report', href: '/reports' },
    { icon: Megaphone, label: 'Launch Campaign', href: '/marketing' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 rounded-lg border-border/80 hover:border-indigo-500/30 hover:bg-indigo-500/5"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Quick Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={action.label}
              onClick={() => router.push(action.href)}
              className="gap-2 text-xs cursor-pointer"
            >
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1">{action.label}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
