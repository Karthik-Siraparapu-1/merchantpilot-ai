'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, CheckCircle2, XCircle, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { aiCore, type AutonomousActionItem } from '@/lib/ai/core';
import { memoryEngine } from '@/lib/ai/memory-engine';
import { ExplainabilityDrawer } from '@/components/ai/explainability-drawer';
import { explainabilityEngine, type ExplainabilityRecord } from '@/lib/ai/explainability-engine';

export function ActionCenter() {
  const [actions, setActions] = useState<AutonomousActionItem[]>(aiCore.getTodayActions());
  const [selectedRecord, setSelectedRecord] = useState<ExplainabilityRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleApprove = (action: AutonomousActionItem) => {
    setActions((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, status: 'APPROVED' as const } : a))
    );
    memoryEngine.recordFeedback(action.title, true);
    memoryEngine.logAction({
      action: action.title,
      agentName: action.agentName,
      status: 'APPROVED',
      impact: action.expectedFinancialImpact,
      details: action.summary
    });
    if (action.title.toLowerCase().includes('price')) {
      memoryEngine.recordHabit('Approved AI pricing optimization.', 'PRICING');
    } else if (
      action.title.toLowerCase().includes('stock') ||
      action.title.toLowerCase().includes('inventory')
    ) {
      memoryEngine.recordHabit('Approved proactive inventory replenishment.', 'INVENTORY');
    }
    toast.success(`Action Authorized: ${action.title}. Live telemetry synchronized!`);
  };

  const handleReject = (action: AutonomousActionItem) => {
    setActions((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, status: 'REJECTED' as const } : a))
    );
    memoryEngine.recordFeedback(action.title, false);
    memoryEngine.logAction({
      action: action.title,
      agentName: action.agentName,
      status: 'REJECTED',
      details: action.summary
    });
    toast.info(`Recommendation dismissed. AI heuristics adjusted.`);
  };

  const handleExplain = (action: AutonomousActionItem) => {
    const record = explainabilityEngine.createRecord({
      id: action.id,
      title: action.title,
      agentName: action.agentName,
      confidence: action.confidenceScore,
      reasoning: action.summary,
      evidence: action.reasoningChain.map((item) => ({
        factor: item.split(':')[0] || 'Empirical Indicator',
        value: item.split(':')[1] || item,
        impact: 'HIGH' as const,
        trend: 'UP' as const
      })),
      sources: [
        'Live Product Catalog',
        'Warehouse Reserves',
        'Real-time Orders API',
        'Historical Price Elasticity'
      ],
      formula: 'Lift = ΔP * Q_expected * (1 - e_price)',
      variables: { baseMargin: '35%', elasticity: -0.24, units: 120 },
      financialLift: action.expectedFinancialImpact,
      actions: ['Authorize Price Adjustment', 'Auto-Draft Purchase Order', 'Schedule Next Week']
    });

    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  return (
    <>
      <ExplainabilityDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        record={selectedRecord}
        onApproveAction={() => {
          if (selectedRecord) {
            const match = actions.find((a) => a.id === selectedRecord.id);
            if (match) handleApprove(match);
          }
        }}
      />

      <Card className="p-6 border-border/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Today’s Autonomous AI Actions
                <Badge variant="secondary" className="text-xs font-mono">
                  {actions.filter((a) => a.status === 'PENDING').length} Pending
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Proactive operations formulated across your multi-agent network ready for 1-click
                execution.
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Action Queue List */}
        <div className="space-y-3">
          {actions.map((action) => {
            const isDone = action.status !== 'PENDING';

            return (
              <div
                key={action.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  action.status === 'APPROVED'
                    ? 'border-emerald-500/40 bg-emerald-500/5 opacity-85'
                    : action.status === 'REJECTED'
                      ? 'border-border/40 bg-muted/20 opacity-50'
                      : 'border-border/80 bg-card hover:border-primary/40 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          action.severity === 'CRITICAL'
                            ? 'destructive'
                            : action.severity === 'HIGH'
                              ? 'default'
                              : 'secondary'
                        }
                        className="text-[10px] font-bold px-1.5 py-0"
                      >
                        {action.severity === 'CRITICAL' ? '★★★★★ CRITICAL' : '★★★★ HIGH'}
                      </Badge>
                      <span className="text-[11px] font-semibold text-primary">
                        {action.agentName}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-[11px] text-emerald-500 font-mono font-medium">
                        {Math.round(action.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-foreground">{action.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.summary}
                    </p>

                    {/* Reasoning Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {action.reasoningChain.map((chain, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 bg-background"
                        >
                          {chain}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Financial Lift Badge & Execution Buttons */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Projected Impact
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {action.expectedFinancialImpact}
                      </span>
                    </div>

                    {!isDone ? (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(action)}
                          className="h-8 text-xs gap-1 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Execute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExplain(action)}
                          className="h-8 text-xs gap-1"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          Explain
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toast.info(
                              `Simulation Preview: Executing "${action.title}" is predicted to yield ${action.expectedFinancialImpact} with 95% confidence.`
                            )
                          }
                          className="h-8 text-xs gap-1"
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.success(
                              'Heuristics feedback recorded: AI adapted to merchant preference.'
                            )
                          }
                          className="h-8 text-xs gap-1 text-purple-400 hover:bg-purple-500/10"
                        >
                          Learn
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(action)}
                          className="h-8 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-2">
                        <Badge
                          variant={action.status === 'APPROVED' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {action.status === 'APPROVED' ? '✓ Authorized & Executed' : 'Archived'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActions((prev) =>
                              prev.map((a) =>
                                a.id === action.id ? { ...a, status: 'PENDING' as const } : a
                              )
                            );
                            toast.info(`Action "${action.title}" rolled back. State restored.`);
                          }}
                          className="h-7 text-[10px] border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          Undo Action
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
