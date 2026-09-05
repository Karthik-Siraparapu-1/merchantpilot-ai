'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  TrendingUp,
  Users,
  CreditCard,
  Crown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface AgentReasoningStep {
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
  finding: string;
  durationMs: number;
}

const DEFAULT_AGENTS: AgentReasoningStep[] = [
  {
    name: 'Inventory Agent',
    role: 'Warehouse Telemetry',
    icon: Boxes,
    color: 'text-indigo-500',
    finding: 'Scanned 42 SKUs — 2 items at risk of 48h stockout with 4-day supplier lead time.',
    durationMs: 350
  },
  {
    name: 'Revenue Agent',
    role: 'Demand Forecasting',
    icon: TrendingUp,
    color: 'text-emerald-500',
    finding: 'Projected 7-day GMV at ₹14.8L (+14% trend). High demand velocity on Ergonomic line.',
    durationMs: 400
  },
  {
    name: 'Customer Agent',
    role: 'Cohort & Churn Analysis',
    icon: Users,
    color: 'text-purple-500',
    finding: 'Identified 280 VIP buyers with high repurchase propensity; churn risk low (<4%).',
    durationMs: 300
  },
  {
    name: 'Pricing Agent',
    role: 'Elasticity Modeling',
    icon: CreditCard,
    color: 'text-amber-500',
    finding: 'Competitor stockout validated. +8% price lift maintains 98.2% sales conversion.',
    durationMs: 350
  },
  {
    name: 'Payment Agent',
    role: 'Gateway Reliability',
    icon: Cpu,
    color: 'text-blue-500',
    finding: 'Multi-rail gateway health optimal at 97.4% success. UPI latency 210ms.',
    durationMs: 250
  },
  {
    name: 'CEO Consensus Agent',
    role: 'Unified Strategy Formulation',
    icon: Crown,
    color: 'text-rose-500',
    finding:
      'Consensus synthesized: execute restock PO, deploy +8% price lift, and notify merchant.',
    durationMs: 300
  }
];

interface LiveAgentReasoningTraceProps {
  isStreaming?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function LiveAgentReasoningTrace({
  isStreaming = false,
  onComplete,
  className
}: LiveAgentReasoningTraceProps) {
  const [completedSteps, setCompletedSteps] = useState<number>(
    isStreaming ? 0 : DEFAULT_AGENTS.length
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (!isStreaming) {
      setCompletedSteps(DEFAULT_AGENTS.length);
      return;
    }

    setCompletedSteps(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setCompletedSteps(current);
      if (current >= DEFAULT_AGENTS.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isStreaming, onComplete]);

  const totalTime = '1.4s';

  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-muted/30 backdrop-blur-sm overflow-hidden text-xs transition-all shadow-xs',
        className
      )}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/60 transition-colors border-b border-border/50 text-left"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin-slow" />
          <span className="font-semibold text-foreground">Multi-Agent Reasoning Consensus</span>
          <Badge
            variant="outline"
            className="text-[10px] font-mono text-emerald-500 border-emerald-500/30"
          >
            {completedSteps}/{DEFAULT_AGENTS.length} Agents Active
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
          <span className="font-mono">Reasoned in {totalTime}</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>

      {/* Expanded Agent Sequence */}
      {isExpanded && (
        <div className="p-3.5 space-y-2.5">
          {DEFAULT_AGENTS.map((agent, idx) => {
            const isFinished = idx < completedSteps;
            const isCurrent = idx === completedSteps;
            const Icon = agent.icon;

            return (
              <div
                key={agent.name}
                className={cn(
                  'flex items-start gap-3 p-2 rounded-lg border transition-all duration-300',
                  isFinished
                    ? 'bg-card border-border/60'
                    : isCurrent
                      ? 'bg-primary/5 border-primary/30 animate-pulse'
                      : 'opacity-40 border-transparent'
                )}
              >
                <div
                  className={cn(
                    'h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5',
                    isFinished ? 'bg-muted text-foreground' : 'bg-primary/10 text-primary'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', agent.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-[11px]">{agent.name}</span>
                    {isFinished ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-mono text-primary animate-pulse">
                        Analyzing...
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">Queued</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {agent.finding}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
