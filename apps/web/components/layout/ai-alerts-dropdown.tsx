'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Sparkles,
  Boxes,
  ShieldAlert,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AlertItem {
  id: string;
  category: 'AI' | 'PAYMENTS' | 'ORDERS' | 'INVENTORY' | 'SECURITY';
  title: string;
  description: string;
  urgency: 'HIGH' | 'MEDIUM' | 'INFO';
  actionLabel: string;
  route: string;
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    category: 'INVENTORY',
    title: 'Inventory Stockout Imminent',
    description: 'Wireless Mouse stock down to 14 units (2 days runway).',
    urgency: 'HIGH',
    actionLabel: '1-Click Restock PO',
    route: '/inventory'
  },
  {
    id: 'alt-2',
    category: 'SECURITY',
    title: 'Fraud Alert on Order ORD-9921',
    description: 'Proxy VPN + 1,200km geo mismatch flagged with 92% risk score.',
    urgency: 'HIGH',
    actionLabel: 'Hold Payment',
    route: '/orders'
  },
  {
    id: 'alt-3',
    category: 'AI',
    title: 'Autonomous Campaign Ready',
    description: 'VIP WhatsApp flash sale drafted for 280 high-LTV buyers (2.8x ROI).',
    urgency: 'MEDIUM',
    actionLabel: 'Review Campaign',
    route: '/marketing'
  },
  {
    id: 'alt-4',
    category: 'PAYMENTS',
    title: 'Payment Rail Failover Succeeded',
    description: 'Rerouted 4 HDFC checkout spikes through UPI intent rail with 100% success.',
    urgency: 'INFO',
    actionLabel: 'View Telemetry',
    route: '/analytics'
  },
  {
    id: 'alt-5',
    category: 'ORDERS',
    title: 'Supplier Delay Notice',
    description: 'Apex Logistics shipment delayed +4 days due to customs backlog.',
    urgency: 'MEDIUM',
    actionLabel: 'Re-route Supplier',
    route: '/inventory'
  }
];

export function AIAlertsDropdown() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [selectedGroup, setSelectedGroup] = useState<
    'ALL' | 'AI' | 'PAYMENTS' | 'ORDERS' | 'INVENTORY' | 'SECURITY'
  >('ALL');

  const filteredAlerts =
    selectedGroup === 'ALL' ? alerts : alerts.filter((a) => a.category === selectedGroup);

  const handleAction = (alert: AlertItem) => {
    toast.success(`Action initiated for ${alert.title}`);
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    router.push(alert.route);
  };

  const getUrgencyBadge = (urgency: AlertItem['urgency']) => {
    switch (urgency) {
      case 'HIGH':
        return (
          <Badge variant="destructive" className="text-[9px] px-1.5 py-0 font-mono">
            High Urgency
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 font-mono text-amber-500 border-amber-500/30"
          >
            Action Required
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono text-emerald-500">
            Autonomous
          </Badge>
        );
    }
  };

  const getCategoryIcon = (category: AlertItem['category']) => {
    switch (category) {
      case 'INVENTORY':
        return <Boxes className="h-3.5 w-3.5 text-indigo-500 shrink-0" />;
      case 'SECURITY':
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
      case 'PAYMENTS':
        return <CreditCard className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
      case 'ORDERS':
        return <Truck className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-purple-500 shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
          )}
          <span className="sr-only">AI Alerts Center</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-88 sm:w-96 p-0 shadow-2xl overflow-hidden border-border/80"
      >
        {/* Header */}
        <div className="p-3.5 bg-gradient-to-r from-indigo-500/10 via-primary/5 to-background border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-foreground">AI Intelligence & Alerts</span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {alerts.length} Active Alerts
          </Badge>
        </div>

        {/* Group Tabs */}
        <div className="flex gap-1 p-2 bg-muted/30 border-b border-border/50 overflow-x-auto text-[10px] font-medium">
          {(['ALL', 'AI', 'INVENTORY', 'SECURITY', 'PAYMENTS', 'ORDERS'] as const).map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                selectedGroup === group
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Alerts Stream */}
        <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 space-y-1 text-muted-foreground text-xs">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <span>All alerts resolved in this category.</span>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(alert.category)}
                    <span className="text-[11px] font-semibold text-foreground">{alert.title}</span>
                  </div>
                  {getUrgencyBadge(alert.urgency)}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>

                <div className="flex items-center justify-end pt-1">
                  <Button
                    size="sm"
                    onClick={() => handleAction(alert)}
                    className="h-6 text-[10px] gap-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-muted/40 border-t border-border/60 text-center">
          <button
            onClick={() => {
              setAlerts([]);
              toast.success('All notifications marked as read.');
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Clear All Alerts
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
