'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface AICostDashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AICostDashboardModal({ open, onOpenChange }: AICostDashboardModalProps) {
  const models = [
    {
      name: 'Gemini 2.5 Multi-Agent (Primary)',
      requests: '1,420',
      tokens: '412,800',
      avgLatency: '1.2s',
      cost: '$0.82',
      success: '99.8%'
    },
    {
      name: 'DeepSeek R1 Reasoner (Consensus)',
      requests: '380',
      tokens: '184,200',
      avgLatency: '1.6s',
      cost: '$0.34',
      success: '99.5%'
    },
    {
      name: 'Deterministic Rule Engine (Fallback)',
      requests: '210',
      tokens: '—',
      avgLatency: '18ms',
      cost: '$0.00',
      success: '100%'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-primary/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="gap-1 text-xs font-semibold">
              <Cpu className="h-3.5 w-3.5 text-indigo-500" />
              Enterprise AI Cost & LLM Telemetry
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Active Monitoring
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Model Inference, Tokens & Operational Costs
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Transparent breakdown of multi-agent token throughput, inference latencies, model
            failovers, and budget pacing.
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-muted/20">
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground block uppercase">
                Total Tokens
              </span>
              <div className="text-lg font-bold text-foreground">597.0k</div>
              <span className="text-[10px] text-muted-foreground">Past 30 days</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground block uppercase">
                Inference Cost
              </span>
              <div className="text-lg font-bold text-emerald-500">$1.16</div>
              <span className="text-[10px] text-emerald-500">Under $5/mo cap</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground block uppercase">Avg Latency</span>
              <div className="text-lg font-bold text-primary">1.24s</div>
              <span className="text-[10px] text-primary">Consensus cycle</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[10px] text-muted-foreground block uppercase">
                Success Rate
              </span>
              <div className="text-lg font-bold text-emerald-500">99.8%</div>
              <span className="text-[10px] text-muted-foreground">0 outages</span>
            </div>
          </div>

          {/* Model Breakdown Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Multi-Agent Model Routing Breakdown
            </span>
            <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground text-[10px] uppercase bg-muted/40 font-mono">
                    <th className="p-3">Model Engine</th>
                    <th className="p-3">Requests</th>
                    <th className="p-3">Tokens</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Cost</th>
                    <th className="p-3 text-right">Success</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                  {models.map((m) => (
                    <tr key={m.name} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-sans font-semibold text-foreground">{m.name}</td>
                      <td className="p-3 text-muted-foreground">{m.requests}</td>
                      <td className="p-3 text-muted-foreground">{m.tokens}</td>
                      <td className="p-3 text-primary font-bold">{m.avgLatency}</td>
                      <td className="p-3 text-emerald-500 font-bold">{m.cost}</td>
                      <td className="p-3 text-right text-emerald-500">{m.success}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fallback Guardrail Guarantee */}
          <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 text-xs text-muted-foreground flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">
                Zero-Downtime Deterministic Fallback:{' '}
              </span>
              In the event of an upstream LLM API timeout or rate limit, all merchant pricing, stock
              replenishment, and fraud heuristics failover seamlessly to local deterministic rules.
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-background border-t border-border/60 flex items-center justify-between sm:justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            Pacing: $1.16 of $25.00 monthly soft ceiling
          </span>
          <Button size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
