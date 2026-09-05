'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DigitalCEOCockpit() {
  const router = useRouter();
  const [mode, setMode] = React.useState<'EXECUTIVE' | 'OPERATOR'>('EXECUTIVE');

  return (
    <Card className="p-6 border-border/80 bg-gradient-to-br from-purple-500/10 via-card to-indigo-500/5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">Digital CEO Assistant</CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-purple-500 border-purple-500/30"
              >
                {mode === 'EXECUTIVE' ? 'Executive Mode' : 'Operator Mode'}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Macro operational orchestration across sales, stock, margin, and cash velocity
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/60">
            <button
              onClick={() => setMode('EXECUTIVE')}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                mode === 'EXECUTIVE'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setMode('OPERATOR')}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                mode === 'OPERATOR'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Operator
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-background/80 border border-border/80 text-center font-mono min-w-[120px]">
            <span className="text-[10px] text-muted-foreground block uppercase">
              Business Health
            </span>
            <span className="text-xl font-bold text-primary">95/100</span>
          </div>
        </div>
      </div>

      {/* 4 CEO Pillar Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase">Revenue</span>
            <span className="text-emerald-500 font-bold">Excellent</span>
          </div>
          <div className="text-lg font-bold text-foreground">₹2.42L / Day</div>
          <span className="text-[10px] text-emerald-500 block">↑ 14% vs baseline</span>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-card space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase">Inventory</span>
            <span className="text-amber-500 font-bold">Needs Attention</span>
          </div>
          <div className="text-lg font-bold text-foreground">2 Low SKUs</div>
          <span className="text-[10px] text-amber-500 block">Restock PO drafted</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase">Cash Flow</span>
            <span className="text-emerald-500 font-bold">Healthy</span>
          </div>
          <div className="text-lg font-bold text-foreground">38.2% Margin</div>
          <span className="text-[10px] text-muted-foreground block">T+0 settlement 65%</span>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-card space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground uppercase">Next Week Projection</span>
            <span className="text-primary font-bold">+18% Lift</span>
          </div>
          <div className="text-lg font-bold text-foreground">₹16.4L Target</div>
          <span className="text-[10px] text-primary block">96% confidence</span>
        </div>
      </div>

      {/* CEO Executive Summary & Guidance */}
      <div className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            Executive Synthesis & Strategic Directives
          </span>
          <Badge variant="secondary" className="text-[10px] font-mono">
            Updated 5 mins ago
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Your business is performing in the top 5th percentile of consumer hardware brands on
          checkout velocity. Customer acquisition costs (CAC) decreased 9% with WhatsApp VIP
          engagement. To protect the ₹16.4L weekly GMV target, execute the 120-unit Wireless Mouse
          replenishment and apply the +8% price lift on high-demand accessories.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => router.push('/scenario-lab')}
            className="h-8 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
          >
            <span>Run Digital CEO Scenario</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push('/reports')}
            className="h-8 text-xs gap-1.5"
          >
            <span>Generate Full Board Report</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
