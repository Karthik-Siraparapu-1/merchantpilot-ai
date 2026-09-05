'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Crown,
  Heart,
  AlertTriangle,
  UserX,
  Sparkles,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/use-animated-counter';
import { toast } from 'sonner';

// ─── Mock Customer Data (derived from order patterns) ────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
  segment: 'VIP' | 'REPEAT' | 'AT_RISK' | 'CHURNED';
  lifetimeValue: number;
  totalOrders: number;
  lastOrderDays: number;
  avgOrderValue: number;
  rfmScore: { recency: number; frequency: number; monetary: number };
  trend: 'UP' | 'DOWN' | 'STABLE';
}

const CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    segment: 'VIP',
    lifetimeValue: 128500,
    totalOrders: 24,
    lastOrderDays: 2,
    avgOrderValue: 5354,
    rfmScore: { recency: 95, frequency: 92, monetary: 98 },
    trend: 'UP'
  },
  {
    id: 'c-2',
    name: 'Rahul Mehta',
    email: 'rahul@example.com',
    segment: 'VIP',
    lifetimeValue: 94200,
    totalOrders: 18,
    lastOrderDays: 5,
    avgOrderValue: 5233,
    rfmScore: { recency: 88, frequency: 85, monetary: 91 },
    trend: 'UP'
  },
  {
    id: 'c-3',
    name: 'Anita Desai',
    email: 'anita@example.com',
    segment: 'REPEAT',
    lifetimeValue: 56700,
    totalOrders: 12,
    lastOrderDays: 14,
    avgOrderValue: 4725,
    rfmScore: { recency: 72, frequency: 70, monetary: 76 },
    trend: 'STABLE'
  },
  {
    id: 'c-4',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    segment: 'REPEAT',
    lifetimeValue: 43200,
    totalOrders: 9,
    lastOrderDays: 21,
    avgOrderValue: 4800,
    rfmScore: { recency: 60, frequency: 55, monetary: 68 },
    trend: 'STABLE'
  },
  {
    id: 'c-5',
    name: 'Deepa Nair',
    email: 'deepa@example.com',
    segment: 'REPEAT',
    lifetimeValue: 38100,
    totalOrders: 8,
    lastOrderDays: 18,
    avgOrderValue: 4762,
    rfmScore: { recency: 65, frequency: 52, monetary: 62 },
    trend: 'UP'
  },
  {
    id: 'c-6',
    name: 'Arjun Reddy',
    email: 'arjun@example.com',
    segment: 'AT_RISK',
    lifetimeValue: 28400,
    totalOrders: 6,
    lastOrderDays: 42,
    avgOrderValue: 4733,
    rfmScore: { recency: 30, frequency: 40, monetary: 55 },
    trend: 'DOWN'
  },
  {
    id: 'c-7',
    name: 'Neha Gupta',
    email: 'neha@example.com',
    segment: 'AT_RISK',
    lifetimeValue: 22100,
    totalOrders: 5,
    lastOrderDays: 38,
    avgOrderValue: 4420,
    rfmScore: { recency: 35, frequency: 35, monetary: 48 },
    trend: 'DOWN'
  },
  {
    id: 'c-8',
    name: 'Sameer Khan',
    email: 'sameer@example.com',
    segment: 'CHURNED',
    lifetimeValue: 12600,
    totalOrders: 3,
    lastOrderDays: 95,
    avgOrderValue: 4200,
    rfmScore: { recency: 10, frequency: 20, monetary: 30 },
    trend: 'DOWN'
  },
  {
    id: 'c-9',
    name: 'Kavita Joshi',
    email: 'kavita@example.com',
    segment: 'CHURNED',
    lifetimeValue: 8400,
    totalOrders: 2,
    lastOrderDays: 120,
    avgOrderValue: 4200,
    rfmScore: { recency: 5, frequency: 12, monetary: 22 },
    trend: 'DOWN'
  },
  {
    id: 'c-10',
    name: 'Ravi Patel',
    email: 'ravi@example.com',
    segment: 'VIP',
    lifetimeValue: 76800,
    totalOrders: 15,
    lastOrderDays: 3,
    avgOrderValue: 5120,
    rfmScore: { recency: 92, frequency: 82, monetary: 88 },
    trend: 'UP'
  }
];

const SEGMENT_CONFIG = {
  VIP: {
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    label: 'VIP'
  },
  REPEAT: {
    icon: Heart,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    label: 'Repeat'
  },
  AT_RISK: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    label: 'At Risk'
  },
  CHURNED: {
    icon: UserX,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Churned'
  }
};

import { downloadCsvFile, triggerPrintView } from '@/lib/export-utils';
import { PrintHeader } from '@/components/layout/print-header';
import { Download, Printer } from 'lucide-react';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<Customer['segment'] | 'ALL'>('ALL');

  const vipCount = CUSTOMERS.filter((c) => c.segment === 'VIP').length;
  const repeatCount = CUSTOMERS.filter((c) => c.segment === 'REPEAT').length;
  const atRiskCount = CUSTOMERS.filter((c) => c.segment === 'AT_RISK').length;
  const churnedCount = CUSTOMERS.filter((c) => c.segment === 'CHURNED').length;
  const totalCLV = CUSTOMERS.reduce((sum, c) => sum + c.lifetimeValue, 0);

  const totalCLVDisplay = useAnimatedCounter(Math.round(totalCLV / 100), {
    prefix: '₹',
    locale: 'en-IN'
  });
  const avgOrderDisplay = useAnimatedCounter(4855, { prefix: '₹', locale: 'en-IN' });

  const filtered = CUSTOMERS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = activeSegment === 'ALL' || c.segment === activeSegment;
    return matchesSearch && matchesSegment;
  });

  const handleExportCsv = () => {
    const headers = [
      'Customer Name',
      'Email',
      'Segment',
      'Lifetime Value (INR)',
      'Total Orders',
      'Last Order',
      'RFM Score'
    ];
    const rows = filtered.map((c) => [
      c.name,
      c.email,
      c.segment,
      (c.lifetimeValue / 100).toFixed(2),
      c.totalOrders,
      `${c.lastOrderDays}d ago`,
      Math.round((c.rfmScore.recency + c.rfmScore.frequency + c.rfmScore.monetary) / 3)
    ]);
    downloadCsvFile(`customer_roster_${Date.now()}`, headers, rows);
    toast.success('Customer roster CSV exported!');
  };

  const handlePrint = () => {
    triggerPrintView('MerchantPilot AI — Customer Intelligence Roster');
  };

  return (
    <div className="space-y-6 printable-area">
      <PrintHeader
        title="CUSTOMER INTELLIGENCE & SEGMENTATION ROSTER"
        subtitle="CLV estimation, RFM analysis, churn prediction, and AI-driven engagement"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Customer Intelligence
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-purple-500 border-purple-500/30"
            >
              AI-Powered Segmentation
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Intelligence</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            CLV estimation, RFM analysis, churn prediction, and AI-driven engagement
            recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 h-9 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print Roster
          </Button>
          <Button size="sm" onClick={handleExportCsv} className="gap-1.5 h-9 text-xs shadow-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="p-4 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-card to-purple-500/5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">AI Customer Insights</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              <strong>{atRiskCount} customers</strong> showing churn signals — no orders in 30+
              days. AI recommends a <strong>win-back campaign</strong> with personalized discounts
              targeting At-Risk segment. Projected recovery: <strong>₹50,500</strong> in reactivated
              GMV.
            </p>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Total Customers</span>
          </div>
          <p className="text-lg font-bold font-mono">{CUSTOMERS.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Total CLV</span>
          </div>
          <p className="text-lg font-bold font-mono">{totalCLVDisplay}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Avg. Order Value</span>
          </div>
          <p className="text-lg font-bold font-mono">{avgOrderDisplay}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] text-muted-foreground font-medium">VIP Customers</span>
          </div>
          <p className="text-lg font-bold font-mono">{vipCount}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-[10px] text-muted-foreground font-medium">At Risk</span>
          </div>
          <p className="text-lg font-bold font-mono text-orange-500">{atRiskCount}</p>
        </Card>
      </div>

      {/* Segment Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'VIP', 'REPEAT', 'AT_RISK', 'CHURNED'] as const).map((seg) => {
          const count =
            seg === 'ALL'
              ? CUSTOMERS.length
              : seg === 'VIP'
                ? vipCount
                : seg === 'REPEAT'
                  ? repeatCount
                  : seg === 'AT_RISK'
                    ? atRiskCount
                    : churnedCount;
          return (
            <Button
              key={seg}
              size="sm"
              variant={activeSegment === seg ? 'default' : 'outline'}
              onClick={() => setActiveSegment(seg)}
              className="h-8 text-xs gap-1.5"
            >
              {seg === 'ALL' ? 'All' : SEGMENT_CONFIG[seg].label}
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                {count}
              </Badge>
            </Button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="h-8 pl-8 text-xs w-48"
            />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <Card className="overflow-hidden border-border/80">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Segment</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">CLV</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Orders</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Last Order
                </th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
                  RFM Score
                </th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const seg = SEGMENT_CONFIG[customer.segment];
                const SegIcon = seg.icon;
                const avgRfm = Math.round(
                  (customer.rfmScore.recency +
                    customer.rfmScore.frequency +
                    customer.rfmScore.monetary) /
                    3
                );

                return (
                  <tr
                    key={customer.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-[10px] text-muted-foreground">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn('gap-1 text-[10px]', seg.color, seg.border)}
                      >
                        <SegIcon className="h-3 w-3" />
                        {seg.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      ₹{(customer.lifetimeValue / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{customer.totalOrders}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'font-mono',
                          customer.lastOrderDays > 30 ? 'text-orange-500' : 'text-foreground'
                        )}
                      >
                        {customer.lastOrderDays}d ago
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-700', {
                              'bg-emerald-500': avgRfm >= 70,
                              'bg-amber-500': avgRfm >= 40 && avgRfm < 70,
                              'bg-red-500': avgRfm < 40
                            })}
                            style={{ width: `${avgRfm}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] w-6 text-right">{avgRfm}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {customer.trend === 'UP' && (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mx-auto" />
                      )}
                      {customer.trend === 'DOWN' && (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                      {customer.trend === 'STABLE' && (
                        <BarChart3 className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
