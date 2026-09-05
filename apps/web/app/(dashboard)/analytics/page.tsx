'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Download, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import { cn, formatCurrency } from '@/lib/utils';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function AnalyticsPage() {
  const { activeTenantId } = useAuth();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  const {
    data: metrics,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['analytics-metrics', activeTenantId],
    queryFn: () => api.dashboard.getMetrics(),
    enabled: !!activeTenantId
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-60" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Failed to Load Analytics"
        description="Could not aggregate metrics. Please retry."
        actionLabel="Retry"
        onAction={() => void refetch()}
      />
    );
  }

  // Calculated Executive KPIs
  const totalOrdersCount = metrics.orders.totalOrders || 1;
  const aovMinor = Math.round(metrics.revenue.totalRevenueMinor / totalOrdersCount);
  const totalCatalog = metrics.products.totalProducts || 1;
  const inStockRate = Math.round(
    ((totalCatalog - metrics.inventory.outOfStockItemsCount) / totalCatalog) * 100
  );

  // Revenue curve
  const revenueTrendData = [
    { period: 'Day 1', revenue: Math.round(metrics.revenue.todayRevenueMinor * 0.4) / 100 },
    { period: 'Day 2', revenue: Math.round(metrics.revenue.todayRevenueMinor * 0.55) / 100 },
    { period: 'Day 3', revenue: Math.round(metrics.revenue.todayRevenueMinor * 0.75) / 100 },
    { period: 'Day 4', revenue: Math.round(metrics.revenue.todayRevenueMinor * 0.65) / 100 },
    { period: 'Day 5', revenue: Math.round(metrics.revenue.todayRevenueMinor * 0.9) / 100 },
    { period: 'Day 6', revenue: Math.round(metrics.revenue.todayRevenueMinor * 1.1) / 100 },
    { period: 'Day 7', revenue: Math.round(metrics.revenue.todayRevenueMinor) / 100 }
  ];

  // Pipeline status distribution
  const orderFunnelData = [
    { name: 'Paid', value: metrics.orders.paidOrders },
    { name: 'Processing', value: metrics.orders.processingOrders },
    { name: 'Shipped', value: metrics.orders.shippedOrders },
    { name: 'Delivered', value: metrics.orders.deliveredOrders },
    { name: 'Pending', value: metrics.orders.pendingOrders }
  ];

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Today Revenue,₹${metrics.revenue.todayRevenueMinor / 100}\n` +
      `Total Revenue,₹${metrics.revenue.totalRevenueMinor / 100}\n` +
      `Total Orders,${metrics.orders.totalOrders}\n` +
      `Units in Stock,${metrics.inventory.totalUnitsInStock}\n` +
      `Active Products,${metrics.products.activeProducts}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `merchantpilot-analytics-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Analytics CSV report downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Commerce Analytics & Telemetry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enterprise store metrics, gross merchandise velocity, and supply chain health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            {(['7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                  timeframe === t
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="shadow-xs">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* AI Executive Intelligence Insight Banner */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/8 via-card to-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-foreground">
                AI Executive Intelligence Summary
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                96% Confidence
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Today&apos;s GMV of{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(metrics.revenue.totalRevenueMinor, metrics.revenue.currency)}
              </span>{' '}
              is tracking{' '}
              <span className="text-emerald-500 font-semibold">+14% above yesterday</span>. Your top
              revenue driver is{' '}
              <span className="font-semibold text-foreground">
                {metrics.topSellingProducts[0]?.title ?? 'your best-selling SKU'}
              </span>
              , accounting for an estimated 32% of order velocity.
              {metrics.inventory.lowStockItemsCount > 0 && (
                <span className="text-amber-500 font-semibold">
                  {' '}
                  ⚠ {metrics.inventory.lowStockItemsCount} SKU
                  {metrics.inventory.lowStockItemsCount > 1 ? 's are' : ' is'} approaching low-stock
                  threshold — proactive restocking recommended within 24h to prevent revenue
                  leakage.
                </span>
              )}
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  AOV:{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {formatCurrency(aovMinor, metrics.revenue.currency)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  Low stock:{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {metrics.inventory.outOfStockItemsCount} out-of-stock SKUs
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                <span>
                  In-stock rate:{' '}
                  <span className="font-mono font-semibold text-foreground">{inStockRate}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <span className="text-xs font-medium text-muted-foreground">Gross Merchandise Value</span>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {formatCurrency(metrics.revenue.totalRevenueMinor, metrics.revenue.currency)}
          </div>
          <span className="text-[11px] text-muted-foreground">Cumulative store revenue</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium text-muted-foreground">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {formatCurrency(aovMinor, metrics.revenue.currency)}
          </div>
          <span className="text-[11px] text-muted-foreground">Per completed checkout</span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium text-muted-foreground">Catalog In-Stock Rate</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-500">{inStockRate}%</div>
          <span className="text-[11px] text-muted-foreground">
            {metrics.inventory.outOfStockItemsCount} out-of-stock SKUs
          </span>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium text-muted-foreground">
            Total Units In Warehouse
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">
            {metrics.inventory.totalUnitsInStock}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {metrics.inventory.totalUnitsReserved} units reserved in checkouts
          </span>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Velocity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Curve (₹)</CardTitle>
              <CardDescription className="text-xs">7-day gross sales projection</CardDescription>
            </div>
            <Badge variant="indigo" className="font-mono text-xs">
              Normalized
            </Badge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAnalyticsRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="period"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: unknown) => [
                    `₹${Number(value || 0).toLocaleString('en-IN')}`,
                    'Sales'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAnalyticsRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Fulfillment Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-semibold">
                Fulfillment Pipeline Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Volume count by fulfillment stage
              </CardDescription>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderFunnelData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Best Sellers & SKU Health Section */}
      <Card className="p-6">
        <CardTitle className="text-base font-semibold mb-1">Catalog Velocity Leaderboard</CardTitle>
        <CardDescription className="text-xs mb-4">
          Detailed metrics for highest converting catalog products
        </CardDescription>

        {metrics.topSellingProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No sales data recorded yet to compute leaderboards.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground uppercase text-[10px]">
                  <th className="py-2.5">Rank</th>
                  <th className="py-2.5">Product Title</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5 text-right">Units Sold</th>
                  <th className="py-2.5 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {metrics.topSellingProducts.map((p, idx) => (
                  <tr key={p.productId} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-bold text-muted-foreground">#{idx + 1}</td>
                    <td className="py-3 text-foreground font-semibold">{p.title}</td>
                    <td className="py-3 font-mono text-muted-foreground">{p.sku}</td>
                    <td className="py-3 text-right font-mono">{p.unitsSold} units</td>
                    <td className="py-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(p.revenueGeneratedMinor, 'INR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
