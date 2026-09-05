'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { memoryEngine } from '@/lib/ai/memory-engine';
import { toast } from 'sonner';

export function DynamicPricingCard() {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    memoryEngine.recordFeedback('Dynamic pricing +10% lift on Ergonomic Mouse', true);
    memoryEngine.logAction({
      action: 'Updated Ergonomic Mouse price to ₹1,099',
      agentName: 'Dynamic Pricing Agent',
      status: 'APPROVED',
      impact: '+18% expected gross margin lift',
      details: 'Competitor stockout optimization applied',
      confidence: 93
    });
    toast.success('AI Price applied! Updated from ₹999 to ₹1,099 across all channels.');
  };

  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Dynamic Pricing Optimizer</CardTitle>
            <CardDescription className="text-xs">
              Microeconomic elasticity tracking competitor pricing & inventory levels
            </CardDescription>
          </div>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-500 border-emerald-500/30"
        >
          93% Model Confidence
        </Badge>
      </div>

      {/* Target Product */}
      <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-foreground">Ergonomic Wireless Mouse</h4>
            <span className="text-[11px] text-muted-foreground font-mono">
              SKU: SKU-PRO-001 • Category: Electronics
            </span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            Competitor Stockout
          </Badge>
        </div>

        {/* Price Comparison Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground block uppercase">Current Price</span>
            <span className="text-base font-bold font-mono text-foreground">₹999</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase font-bold">
              AI Recommended
            </span>
            <span className="text-base font-bold font-mono text-emerald-500">₹1,099</span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground block uppercase">Expected Lift</span>
            <span className="text-base font-bold font-mono text-emerald-500">+18% Profit</span>
          </div>

          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground block uppercase">Confidence</span>
            <span className="text-base font-bold font-mono text-primary">93% High</span>
          </div>
        </div>

        {/* Explainability Breakdown */}
        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Why: </span>
          Competitor stockout detected on Amazon & Flipkart. Demand elasticity shows &lt; 1.5% drop
          in checkout velocity at ₹1,099, producing an immediate +₹42,000 monthly margin expansion.
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-end">
        {applied ? (
          <Badge variant="default" className="gap-1 py-1 px-3 text-xs bg-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Price Active at ₹1,099
          </Badge>
        ) : (
          <Button
            size="sm"
            onClick={handleApply}
            className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Apply AI Price (₹1,099)
          </Button>
        )}
      </div>
    </Card>
  );
}
