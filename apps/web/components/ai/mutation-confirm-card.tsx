'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Zap, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfidenceGauge } from './confidence-gauge';
import { AgentBadge } from './agent-badge';
import { ReasoningPipeline } from './reasoning-pipeline';
import { memoryEngine } from '@/lib/ai/memory-engine';
import type { AgentToolCall, AgentExplainability } from '@/lib/ai/agent-router';

interface MutationConfirmCardProps {
  tool: AgentToolCall;
  explainability: AgentExplainability;
  onExecuted?: () => void;
  onDismissed?: () => void;
  className?: string;
}

export function MutationConfirmCard({
  tool,
  explainability,
  onExecuted,
  onDismissed,
  className
}: MutationConfirmCardProps) {
  const [status, setStatus] = useState<'PENDING' | 'EXECUTING' | 'SUCCESS' | 'ERROR'>('PENDING');
  const [showReasoning, setShowReasoning] = useState(false);

  const handleAuthorize = async () => {
    setStatus('EXECUTING');
    try {
      await tool.apiCall();
      setStatus('SUCCESS');

      // Log to audit trail
      memoryEngine.logAction({
        action: tool.description,
        agentName: tool.agentName,
        status: 'APPROVED',
        impact: tool.estimatedImpact,
        details: tool.changeDetail
      });

      // Record behavioral habit
      if (tool.toolName === 'UPDATE_PRICE') {
        memoryEngine.recordHabit('Approved AI price adjustment recommendation.', 'PRICING');
      } else if (tool.toolName === 'ADJUST_STOCK') {
        memoryEngine.recordHabit('Approved AI inventory restock recommendation.', 'INVENTORY');
      }

      memoryEngine.recordFeedback(tool.description, true);

      toast.success(`Action executed: ${tool.description}`, {
        description: `Impact: ${tool.estimatedImpact}`
      });

      if (onExecuted) onExecuted();
    } catch {
      setStatus('ERROR');
      toast.error('Action failed. Please try again or check the API connection.');
    }
  };

  const handleDismiss = () => {
    memoryEngine.logAction({
      action: tool.description,
      agentName: tool.agentName,
      status: 'REJECTED',
      details: 'Merchant dismissed recommendation'
    });
    memoryEngine.recordFeedback(tool.description, false);
    toast.info('Recommendation dismissed. AI heuristics adjusted.');
    if (onDismissed) onDismissed();
  };

  if (status === 'SUCCESS') {
    return (
      <Card className={cn('p-4 border-emerald-500/30 bg-emerald-500/5', className)}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Action Executed Successfully
            </p>
            <p className="text-[11px] text-muted-foreground">{tool.description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'p-4 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-card to-blue-500/5 space-y-3',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 shrink-0 mt-0.5">
            <Zap className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-foreground">AI Action</span>
              <Badge
                variant="outline"
                className="text-[9px] font-mono text-indigo-500 border-indigo-500/30"
              >
                {tool.toolName.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-[11px] text-foreground font-medium">{tool.description}</p>
          </div>
        </div>

        <ConfidenceGauge score={explainability.confidence} size="sm" showLabel={false} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        {tool.targetEntity && (
          <div className="p-2 rounded-md bg-muted/30 border border-border/50">
            <span className="text-muted-foreground">Target</span>
            <p className="font-semibold text-foreground mt-0.5">{tool.targetEntity}</p>
          </div>
        )}
        {tool.changeDetail && (
          <div className="p-2 rounded-md bg-muted/30 border border-border/50">
            <span className="text-muted-foreground">Change</span>
            <p className="font-semibold text-foreground mt-0.5">{tool.changeDetail}</p>
          </div>
        )}
        <div className="p-2 rounded-md bg-muted/30 border border-border/50 col-span-2">
          <span className="text-muted-foreground">Expected Impact</span>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {tool.estimatedImpact}
          </p>
        </div>
      </div>

      {/* Agent Badge */}
      <AgentBadge agentName={explainability.agentName} confidence={explainability.confidence} />

      {/* Reasoning Toggle */}
      <button
        onClick={() => setShowReasoning(!showReasoning)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {showReasoning ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        Why did AI recommend this?
      </button>

      {showReasoning && (
        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
          <p className="text-[11px] text-foreground">{explainability.why}</p>

          <ReasoningPipeline
            steps={explainability.reasoningChain.map((step) => {
              const parts = step.split(':');
              return {
                label: parts[0]?.trim() || step,
                value: parts.slice(1).join(':').trim() || undefined
              };
            })}
            conclusion={`Recommendation: ${tool.description}`}
          />

          <div className="flex flex-wrap gap-1 pt-1">
            {explainability.dataSources.map((src, idx) => (
              <Badge key={idx} variant="outline" className="text-[9px] font-mono">
                {src}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => {
            void handleAuthorize();
          }}
          disabled={status === 'EXECUTING'}
          className="h-8 text-xs gap-1.5 shadow-sm flex-1"
        >
          {status === 'EXECUTING' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Authorize & Execute
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDismiss}
          disabled={status === 'EXECUTING'}
          className="h-8 text-xs gap-1.5"
        >
          <XCircle className="h-3.5 w-3.5" />
          Dismiss
        </Button>
      </div>

      {status === 'ERROR' && (
        <p className="text-[11px] text-destructive">
          Execution failed. Check API connection and retry.
        </p>
      )}
    </Card>
  );
}
