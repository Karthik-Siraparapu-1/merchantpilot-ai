'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { scenarioSimulator, type ScenarioInput } from '@/lib/ai/scenario-simulator';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function BusinessDigitalTwin() {
  const [inputs, setInputs] = useState<ScenarioInput>({
    priceAdjustmentPercent: 8,
    marketingSpendMultiplier: 1.2,
    supplierDelayDays: 3,
    inventoryBufferPercent: 15
  });

  const baseline = useMemo(
    () => ({
      monthlyRevenueMinor: 35000000,
      monthlyOrders: 420,
      grossMarginPercent: 35
    }),
    []
  );

  const simulation = useMemo(
    () => scenarioSimulator.simulate(baseline, inputs),
    [baseline, inputs]
  );

  const handleReset = () => {
    setInputs({
      priceAdjustmentPercent: 0,
      marketingSpendMultiplier: 1.0,
      supplierDelayDays: 0,
      inventoryBufferPercent: 0
    });
    toast.info('Simulator reset to historical baseline.');
  };

  const handleApplyStrategy = () => {
    toast.success(
      `Simulation strategy applied! Target price adjustments (+${inputs.priceAdjustmentPercent}%) queued for review.`
    );
  };

  return (
    <Card className="p-6 border-border/80 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              Business Digital Twin & Scenario Lab
              <Badge variant="outline" className="text-xs text-indigo-500 border-indigo-500/30">
                Predictive Model v4.2
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate microeconomic levers across prices, marketing multipliers, and supplier
              delays.
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="h-8 text-xs gap-1">
            <RotateCcw className="h-3 w-3" /> Reset Levers
          </Button>
          <Button size="sm" onClick={handleApplyStrategy} className="h-8 text-xs gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Deploy Strategy
          </Button>
        </div>
      </div>

      {/* Interactive Levers Control Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
        {/* Slider 1: Price Adjustment */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Price Adjustment</span>
            <span className="font-mono font-bold text-primary">
              {inputs.priceAdjustmentPercent > 0
                ? `+${inputs.priceAdjustmentPercent}%`
                : `${inputs.priceAdjustmentPercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="25"
            step="1"
            value={inputs.priceAdjustmentPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, priceAdjustmentPercent: Number(e.target.value) }))
            }
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground block">
            Simulates catalog price elasticity
          </span>
        </div>

        {/* Slider 2: Marketing Multiplier */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Marketing Multiplier</span>
            <span className="font-mono font-bold text-primary">
              {inputs.marketingSpendMultiplier}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={inputs.marketingSpendMultiplier}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, marketingSpendMultiplier: Number(e.target.value) }))
            }
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground block">
            Customer acquisition budget scaler
          </span>
        </div>

        {/* Slider 3: Supplier Lead Time Delay */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">Supplier Delay</span>
            <span className="font-mono font-bold text-primary">
              +{inputs.supplierDelayDays} Days
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="1"
            value={inputs.supplierDelayDays}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, supplierDelayDays: Number(e.target.value) }))
            }
            className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground block">Transit delay shock test</span>
        </div>
      </div>

      {/* Simulated KPI Projection Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground block">Projected Monthly GMV</span>
          <div className="text-lg font-bold font-mono text-foreground">
            {formatCurrency(simulation.projectedMonthlyRevenueMinor, 'INR')}
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
            {simulation.revenueDeltaPercent > 0
              ? `+${simulation.revenueDeltaPercent}%`
              : `${simulation.revenueDeltaPercent}%`}{' '}
            vs Base
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground block">Projected Monthly Profit</span>
          <div className="text-lg font-bold font-mono text-emerald-500">
            {formatCurrency(simulation.projectedMonthlyProfitMinor, 'INR')}
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
            {simulation.profitDeltaPercent > 0
              ? `+${simulation.profitDeltaPercent}%`
              : `${simulation.profitDeltaPercent}%`}{' '}
            lift
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground block">Projected Orders</span>
          <div className="text-lg font-bold font-mono text-foreground">
            {simulation.projectedOrderVolume} checkouts
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {simulation.orderVolumeDeltaPercent > 0
              ? `+${simulation.orderVolumeDeltaPercent}%`
              : `${simulation.orderVolumeDeltaPercent}%`}{' '}
            demand
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <span className="text-[11px] text-muted-foreground block">Supplier Risk & Churn</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Strain: {simulation.supplierStrainIndex}/100
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-semibold text-amber-500">
              Churn: {simulation.churnRiskIndex}%
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground block">Confidence: 94%</span>
        </div>
      </div>

      {/* Real-time Trajectory Chart */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          6-Month Simulated Trajectory (Baseline vs Simulated)
        </span>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={simulation.trajectoryPoints}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
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
                tickFormatter={(val) => `₹${Math.round(val / 100000)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(val: unknown) => [
                  `₹${(Number(val || 0) / 100).toLocaleString('en-IN')}`,
                  ''
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="baselineRevenueMinor"
                name="Historical Baseline"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.15}
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="simulatedRevenueMinor"
                name="Simulated Revenue"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
