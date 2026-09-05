'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
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
import { TrendingUp } from 'lucide-react';

const FORECAST_3BAND_DATA = [
  { day: 'Mon', actual: 24000, worstCase: 22000, expected: 24000, bestCase: 26000 },
  { day: 'Tue', actual: 32000, worstCase: 28000, expected: 32000, bestCase: 36000 },
  { day: 'Wed', actual: 48000, worstCase: 42000, expected: 48000, bestCase: 54000 },
  { day: 'Thu', actual: 45000, worstCase: 40000, expected: 45000, bestCase: 52000 },
  { day: 'Fri', actual: 64000, worstCase: 58000, expected: 64000, bestCase: 72000 },
  { day: 'Sat (Proj)', worstCase: 62000, expected: 78000, bestCase: 92000 },
  { day: 'Sun (Proj)', worstCase: 70000, expected: 88000, bestCase: 106000 },
  { day: 'Next Mon', worstCase: 65000, expected: 82000, bestCase: 98000 }
];

export function ThreeBandForecastCard() {
  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Predictive Revenue Forecasting
              <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
                3-Band Confidence
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Bayesian multi-scenario projection model (96% historical confidence)
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">Expected 7-Day GMV:</span>
          <span className="font-bold text-foreground">₹5.14 Lakh</span>
        </div>
      </div>

      {/* 3 Confidence Badges */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center font-mono">
        <div>
          <span className="text-[10px] text-muted-foreground block">Worst Case</span>
          <span className="text-xs font-bold text-amber-500">₹4.27L (-14%)</span>
        </div>
        <div className="border-x border-border/60">
          <span className="text-[10px] text-muted-foreground block">Expected Base</span>
          <span className="text-xs font-bold text-emerald-500">₹5.14L (+18%)</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Best Case</span>
          <span className="text-xs font-bold text-primary">₹6.18L (+32%)</span>
        </div>
      </div>

      {/* 3-Band Area Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={FORECAST_3BAND_DATA}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(val: unknown) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

            <Area
              type="monotone"
              dataKey="bestCase"
              name="Best Case (+32%)"
              stroke="#6366f1"
              strokeDasharray="4 4"
              fill="url(#colorBest)"
            />
            <Area
              type="monotone"
              dataKey="expected"
              name="Expected Velocity"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorExpected)"
            />
            <Area
              type="monotone"
              dataKey="worstCase"
              name="Worst Case (-14%)"
              stroke="#f59e0b"
              strokeDasharray="2 2"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
