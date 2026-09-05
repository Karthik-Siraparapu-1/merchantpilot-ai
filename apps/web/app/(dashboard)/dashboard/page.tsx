'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Mic,
  Send,
  Activity,
  Zap,
  Play,
  Brain
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ActionCenter } from '@/components/ai/action-center';
import { BusinessDigitalTwin } from '@/components/ai/business-digital-twin';
import { VoiceAIModal } from '@/components/ai/voice-ai-modal';
import { WorkflowBuilderModal } from '@/components/ai/workflow-builder-modal';
import { ReportsGeneratorModal } from '@/components/ai/reports-generator-modal';
import { ExecutiveBriefingCard } from '@/components/ai/executive-briefing-card';
import { ContinuousThinkingTicker } from '@/components/ai/continuous-thinking-ticker';
import { DigitalCEOCockpit } from '@/components/ai/digital-ceo-cockpit';
import { AIActivityFeed } from '@/components/ai/ai-activity-feed';
import { LiveAgentReasoningTrace } from '@/components/ai/live-agent-reasoning-trace';
import { ThreeBandForecastCard } from '@/components/ai/three-band-forecast-card';
import { FraudRiskDetailCard } from '@/components/ai/fraud-risk-detail-card';
import { DynamicPricingCard } from '@/components/ai/dynamic-pricing-card';
import { PaymentIntelligenceMatrix } from '@/components/ai/payment-intelligence-matrix';
import { CustomerIntelligenceMatrix } from '@/components/ai/customer-intelligence-matrix';
import { SupplierIntelligenceCard } from '@/components/ai/supplier-intelligence-card';
import { AIMemoryTimelineModal } from '@/components/ai/ai-memory-timeline-modal';
import { AIMeetingModeModal } from '@/components/ai/ai-meeting-mode-modal';
import { MultiAgentPanel } from '@/components/ai/multi-agent-panel';
import { BusinessGraphViz } from '@/components/ai/business-graph-viz';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { activeTenantId } = useAuth();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');

  const {
    data: metrics,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['dashboard', activeTenantId],
    queryFn: () => api.dashboard.getMetrics(),
    enabled: !!activeTenantId
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Failed to Load Operational Metrics"
        description="Could not connect to the backend server. Please ensure the API is running and try again."
        actionLabel="Retry Connection"
        onAction={() => void refetch()}
      />
    );
  }

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    router.push(`/copilot?q=${encodeURIComponent(copilotInput)}`);
  };

  return (
    <>
      <VoiceAIModal open={isVoiceOpen} onOpenChange={setIsVoiceOpen} />
      <WorkflowBuilderModal open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen} />
      <ReportsGeneratorModal open={isReportsOpen} onOpenChange={setIsReportsOpen} />
      <AIMemoryTimelineModal open={isMemoryOpen} onOpenChange={setIsMemoryOpen} />
      <AIMeetingModeModal open={isMeetingOpen} onOpenChange={setIsMeetingOpen} />

      <div className="space-y-6">
        {/* Continuous AI Thinking Ticker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <ContinuousThinkingTicker />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMemoryOpen(true)}
              className="h-8 text-xs gap-1.5 font-medium border-border/80 hover:bg-muted"
            >
              <Brain className="h-3.5 w-3.5 text-purple-500" />
              <span>Merchant Memory</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMeetingOpen(true)}
              className="h-8 text-xs gap-1.5 font-medium border-border/80 hover:bg-muted"
            >
              <Play className="h-3.5 w-3.5 fill-current text-indigo-500" />
              <span>Meeting Mode</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWorkflowOpen(true)}
              className="h-8 text-xs gap-1.5 font-medium border-border/80 hover:bg-muted"
            >
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
              <span>Workflows</span>
            </Button>
          </div>
        </div>

        {/* Priority 1: Executive Command Center Card */}
        <ExecutiveBriefingCard
          onOpenRestock={() => router.push('/inventory')}
          onOpenFraud={() => router.push('/orders')}
          onOpenCampaign={() => router.push('/marketing')}
        />

        {/* Front-and-Center AI Business Copilot Bar */}
        <Card className="p-4 border-border/80 bg-card shadow-sm space-y-3">
          <form onSubmit={handleCopilotSubmit} className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <Input
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask MerchantPilot AI anything... (e.g. 'Explain my business', 'Which customer may churn?', 'Increase Mouse price 8%')"
              className="flex-1 text-xs h-10 border-border/80 font-medium"
            />
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 text-muted-foreground hover:text-indigo-500 rounded-lg transition-colors shrink-0"
              title="Speak hands-free with Voice AI"
            >
              <Mic className="h-4 w-4" />
            </button>
            <Button
              type="submit"
              size="sm"
              className="h-10 px-4 gap-1.5 shadow-xs shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <span>Execute</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">Recommended:</span>
            {[
              'Explain my business',
              'Compare with last month',
              'Which customer may churn?',
              'Increase price of Wireless Mouse 8%',
              'Show risky or fraudulent orders',
              'Draft VIP retention campaign'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCopilotInput(chip);
                  router.push(`/copilot?q=${encodeURIComponent(chip)}`);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 bg-muted/40 hover:bg-muted text-foreground transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </Card>

        {/* Priority 1 & 5: Digital CEO Cockpit Mode */}
        <DigitalCEOCockpit />

        {/* KPI Telemetry Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Today's Revenue</span>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground">
              {formatCurrency(metrics.revenue.todayRevenueMinor, metrics.revenue.currency)}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-500 font-medium font-mono">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              <span>+14% vs baseline</span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Orders</span>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground">
              {metrics.orders.totalOrders}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-mono">
              {metrics.orders.ordersToday} placed today
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Catalog SKUs</span>
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground">
              {metrics.products.activeProducts}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-mono">
              {metrics.products.totalProducts} total catalog items
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Warehouse Units</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground">
              {metrics.inventory.totalUnitsInStock}
            </div>
            <div className="mt-1 text-xs text-amber-500 font-medium font-mono">
              {metrics.inventory.lowStockItemsCount} low stock alerts
            </div>
          </Card>
        </div>

        {/* Priority 1: Multi-Agent Reasoning Consensus & Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveAgentReasoningTrace />
          <AIActivityFeed />
        </div>

        {/* AI Action Center */}
        <ActionCenter />

        {/* Priority 2: 3-Band Forecast & Granular Fraud Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreeBandForecastCard />
          <FraudRiskDetailCard />
        </div>

        {/* Priority 2: Dynamic Pricing Card & Payment Intelligence Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DynamicPricingCard />
          <PaymentIntelligenceMatrix />
        </div>

        {/* Priority 2: Customer Cohort Intelligence */}
        <CustomerIntelligenceMatrix />

        {/* Priority 2: Supplier Performance Radar */}
        <SupplierIntelligenceCard />

        {/* Embedded Business Digital Twin & Scenario Simulator */}
        <BusinessDigitalTwin />

        {/* Live Multi-Agent Panel & Business Graph Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MultiAgentPanel />
          <BusinessGraphViz />
        </div>

        {/* Live Recent Orders Feed from API */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Live Transactions Stream</CardTitle>
              <CardDescription className="text-xs">
                Real-time incoming orders from multi-tenant backend
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="text-xs h-8">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No orders placed yet in this store tenant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground uppercase text-[10px]">
                    <th className="py-2.5">Order Number</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-mono text-foreground font-semibold">
                        {order.orderNumber}
                      </td>
                      <td className="py-2.5 font-mono font-bold">
                        {formatCurrency(order.totalAmountMinor, order.currency)}
                      </td>
                      <td className="py-2.5">
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right font-mono text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
