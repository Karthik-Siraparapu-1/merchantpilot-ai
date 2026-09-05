'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, Database, TrendingUp, Layers } from 'lucide-react';
import type { ExplainabilityRecord } from '@/lib/ai/explainability-engine';

import { AgentBadge } from '@/components/ai/agent-badge';
import { ConfidenceGauge } from '@/components/ai/confidence-gauge';

interface ExplainabilityDrawerProps {
  open?: boolean | undefined;
  isOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  onClose?: (() => void) | undefined;
  record?: ExplainabilityRecord | null | undefined;
  onApproveAction?: (() => void) | undefined;
  title?: string | undefined;
  badge?: string | undefined;
  recommendation?: string | undefined;
  confidence?: number | undefined;
  impact?: string | undefined;
  evidence?:
    | Array<{
        factor: string;
        value: string;
        weight?: number | undefined;
        impact?: string | undefined;
      }>
    | undefined;
  formula?: string | undefined;
  dataSources?: string[] | undefined;
}

export function ExplainabilityDrawer({
  open,
  isOpen,
  onOpenChange,
  onClose,
  record,
  onApproveAction,
  title,
  badge,
  recommendation,
  confidence,
  impact,
  evidence,
  formula,
  dataSources
}: ExplainabilityDrawerProps) {
  const isSheetOpen = open ?? isOpen ?? false;
  const handleOpenChange = (val: boolean) => {
    onOpenChange?.(val);
    if (!val) onClose?.();
  };

  if (!isSheetOpen) return null;

  const activeTitle = record?.recommendationTitle ?? title ?? 'Explainable AI Proof';
  const activeAgent = record?.agentName ?? badge ?? 'Executive Agent';
  const activeConfidence = record ? Math.round(record.confidenceScore * 100) : (confidence ?? 95);
  const activeReasoning =
    record?.strategicReasoning ?? recommendation ?? impact ?? 'Multi-factor empirical evaluation.';
  const activeEvidence =
    record?.empiricalEvidence ?? evidence?.map((e) => ({ factor: e.factor, value: e.value })) ?? [];
  const activeSources = record?.dataSources ??
    dataSources ?? ['Transactional Audit Log', 'Real-time Telemetry'];
  const activeFormula =
    record?.mathematicalProof.formula ?? formula ?? 'Optimized(t) = Baseline(t) × Delta';
  const activeImpact =
    record?.mathematicalProof.projectedFinancialLift ?? impact ?? '+₹18,400 Projected Margin Lift';

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto space-y-6">
        <SheetHeader className="border-b border-border/80 pb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <AgentBadge agentName={activeAgent} confidence={activeConfidence} />
            <ConfidenceGauge score={activeConfidence} size="sm" showLabel={false} />
          </div>
          <SheetTitle className="text-lg font-bold text-foreground">{activeTitle}</SheetTitle>
          <SheetDescription className="text-xs">
            Multi-factor empirical proof, data sources, and strategic attribution.
          </SheetDescription>
        </SheetHeader>

        {/* Strategic Reasoning */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Strategic Reasoning & Impact
          </h4>
          <div className="rounded-lg bg-muted/50 p-3.5 text-xs text-foreground leading-relaxed border border-border/60">
            {activeReasoning}
          </div>
        </div>

        {/* Empirical Evidence */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Observed Evidence & Drivers
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {activeEvidence.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-card text-xs"
              >
                <span className="text-muted-foreground">{item.factor}</span>
                <span className="font-semibold text-foreground font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources Used */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-primary" />
            Verified Data Sources
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {activeSources.map((source, idx) => (
              <Badge key={idx} variant="outline" className="text-[11px] py-0.5 px-2 bg-background">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mathematical Proof & Impact */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Financial & Formulaic Impact
          </h4>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 space-y-2">
            <div className="text-xs font-mono text-primary font-medium">
              Formula: {activeFormula}
            </div>
            <div className="text-xs font-semibold text-foreground">
              Projected Outcome: {activeImpact}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border/80 pt-4 flex gap-2 sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
            Close Proof Panel
          </Button>
          {onApproveAction && (
            <Button
              size="sm"
              onClick={() => {
                onApproveAction();
                handleOpenChange(false);
              }}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Authorize & Execute
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
