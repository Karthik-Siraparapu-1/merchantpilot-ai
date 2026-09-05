'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

export function AILearningDashboard() {
  const metrics = [
    {
      label: 'Prediction Accuracy',
      yesterday: '81%',
      today: '92%',
      delta: '+11%',
      trend: 'up' as const
    },
    {
      label: 'Merchant Trust Score',
      yesterday: '88%',
      today: '94%',
      delta: '+6%',
      trend: 'up' as const
    },
    {
      label: 'False Positive Rate',
      yesterday: '2.4%',
      today: '0.8%',
      delta: '-1.6%',
      trend: 'up' as const
    },
    {
      label: 'Avg Decision Latency',
      yesterday: '1.8s',
      today: '1.2s',
      delta: '-0.6s',
      trend: 'up' as const
    }
  ];

  const habits = [
    { habit: 'Prefers higher margins over volume', reinforcements: 14, agent: 'Vega' },
    { habit: 'Usually approves restocking recommendations', reinforcements: 11, agent: 'Atlas' },
    { habit: 'Avoids discount campaigns under 15%', reinforcements: 8, agent: 'Nova' },
    { habit: 'Prefers UPI payment routing', reinforcements: 24, agent: 'Pulse' },
    { habit: 'Operates mostly in evening hours', reinforcements: 19, agent: 'Athena' }
  ];

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">AI Learning & Adaptation</CardTitle>
            <CardDescription className="text-xs">
              How your AI workforce improves over time
            </CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-violet-500/30 text-violet-400 gap-1"
        >
          <TrendingUp className="h-3 w-3" /> Actively Learning
        </Badge>
      </div>

      {/* Accuracy Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-xl border border-border/60 bg-muted/15 space-y-2"
          >
            <span className="text-[10px] text-muted-foreground font-mono uppercase">{m.label}</span>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-foreground">{m.today}</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5 mb-0.5">
                <ArrowUpRight className="h-3 w-3" />
                {m.delta}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Yesterday: <span className="text-foreground font-mono">{m.yesterday}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-emerald-400">24</div>
          <div className="text-[10px] text-muted-foreground font-mono">Actions Approved</div>
        </div>
        <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
          <div className="text-2xl font-bold text-blue-400">5</div>
          <div className="text-[10px] text-muted-foreground font-mono">Habits Confirmed</div>
        </div>
        <div className="p-3 rounded-xl border border-violet-500/20 bg-violet-500/5 text-center">
          <div className="text-2xl font-bold text-violet-400">3</div>
          <div className="text-[10px] text-muted-foreground font-mono">Overrides Integrated</div>
        </div>
      </div>

      {/* Learned Habits */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Confirmed Merchant Preferences
        </span>
        {habits.map((h, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-foreground">{h.habit}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[9px] font-mono">
                {h.agent}
              </Badge>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5" />
                {h.reinforcements}x
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
