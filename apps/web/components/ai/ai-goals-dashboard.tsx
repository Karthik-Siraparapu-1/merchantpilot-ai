'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_GOALS, type AIBusinessGoal } from '@/lib/ai/ai-goals-store';
import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export function AIGoalsDashboard() {
  const goals = DEFAULT_GOALS;

  const getStatusStyle = (status: AIBusinessGoal['status']) => {
    switch (status) {
      case 'EXCEEDING':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          bar: 'bg-emerald-500',
          label: 'Exceeding Target'
        };
      case 'ON_TRACK':
        return {
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          bar: 'bg-blue-500',
          label: 'On Track'
        };
      case 'AT_RISK':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          bar: 'bg-amber-500',
          label: 'At Risk'
        };
    }
  };

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">AI Business Goals</CardTitle>
            <CardDescription className="text-xs">
              Autonomous objectives pursued by your AI workforce
            </CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-emerald-500/30 text-emerald-400"
        >
          {goals.filter((g) => g.status === 'EXCEEDING').length}/{goals.length} Exceeding
        </Badge>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const style = getStatusStyle(goal.status);
          return (
            <div
              key={goal.id}
              className="p-4 rounded-xl border border-border/60 bg-muted/15 space-y-3 hover:bg-muted/25 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {goal.status === 'EXCEEDING' && (
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    {goal.status === 'ON_TRACK' && (
                      <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                    )}
                    {goal.status === 'AT_RISK' && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <h4 className="text-sm font-semibold text-foreground">{goal.title}</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Assigned to:{' '}
                    <span className="font-semibold text-foreground">{goal.assignedAgent}</span>
                  </p>
                </div>
                <Badge className={`text-[9px] font-mono shrink-0 ${style.badge}`}>
                  {style.label}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{goal.currentValue}</span>
                  <span>{goal.targetValue}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`}
                    style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-primary font-semibold">
                    {goal.progressPercent}% Complete
                  </span>
                  <span className="text-muted-foreground">{goal.daysRemaining}d remaining</span>
                </div>
              </div>

              {/* Tactics */}
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">
                  Active Tactics:
                </span>
                {goal.tactics.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
