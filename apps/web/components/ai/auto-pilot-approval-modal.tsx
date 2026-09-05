'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ShieldCheck, Zap } from 'lucide-react';
import { autoPilotStore, type AutonomousAction } from '@/lib/ai/auto-pilot-store';
import { memoryEngine } from '@/lib/ai/memory-engine';
import { toast } from 'sonner';

interface AutoPilotApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AutoPilotApprovalModal({ open, onOpenChange }: AutoPilotApprovalModalProps) {
  const [actions, setActions] = useState<AutonomousAction[]>(autoPilotStore.getPendingActions());

  useEffect(() => {
    const unsub = autoPilotStore.subscribe(() => {
      setActions(autoPilotStore.getPendingActions());
    });
    return unsub;
  }, []);

  const handleApprove = (action: AutonomousAction) => {
    autoPilotStore.approveAction(action.id);
    memoryEngine.recordFeedback(action.title, true);
    memoryEngine.logAction({
      action: action.title,
      agentName: `${action.category} Agent`,
      status: 'APPROVED',
      impact: action.impact,
      details: action.evidence,
      confidence: action.confidenceScore
    });
    toast.success(`Approved & Executed: ${action.title}`);
  };

  const handleReject = (action: AutonomousAction) => {
    autoPilotStore.rejectAction(action.id);
    memoryEngine.recordFeedback(action.title, false);
    memoryEngine.logAction({
      action: action.title,
      agentName: `${action.category} Agent`,
      status: 'REJECTED',
      impact: 'Rejected by merchant',
      details: action.evidence,
      confidence: action.confidenceScore
    });
    toast.info(`Rejected: ${action.title}`);
  };

  const handleApproveAll = () => {
    const count = actions.length;
    actions.forEach((a) => {
      memoryEngine.recordFeedback(a.title, true);
      memoryEngine.logAction({
        action: a.title,
        agentName: `${a.category} Agent`,
        status: 'APPROVED',
        impact: a.impact,
        details: a.evidence,
        confidence: a.confidenceScore
      });
    });
    autoPilotStore.approveAll();
    toast.success(`Approved & executed all ${count} autonomous actions!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-primary/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Zap className="h-3 w-3 text-indigo-500" />
              Autonomous Action Approval Queue
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Human-In-The-Loop
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Pending Autonomous Optimizations ({actions.length})
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Review decisions formulated by autonomous background agents. Approvals train your
            personal merchant memory.
          </DialogDescription>
        </div>

        {/* Action List */}
        <div className="p-6 space-y-3 max-h-[440px] overflow-y-auto bg-muted/20">
          {actions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">All Actions Cleared</h4>
              <p className="text-xs text-muted-foreground">
                Your autonomous agents are continuously scanning. New actions will appear here
                automatically.
              </p>
            </div>
          ) : (
            actions.map((action) => (
              <div
                key={action.id}
                className="p-4 rounded-xl border border-border/80 bg-card shadow-xs hover:border-indigo-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase">
                      {action.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {action.timestamp}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono text-primary">
                    {action.confidenceScore}% Confidence
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expected Impact:</span>
                    <span className="font-semibold text-emerald-500">{action.impact}</span>
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    <span className="font-semibold text-foreground">Evidence: </span>
                    {action.evidence}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(action)}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(action)}
                    className="h-7 text-xs gap-1 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve & Execute
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {actions.length > 0 && (
          <DialogFooter className="p-4 bg-background border-t border-border/60 flex items-center justify-between sm:justify-between">
            <span className="text-xs text-muted-foreground">
              {actions.length} action{actions.length > 1 ? 's' : ''} queued for review
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleApproveAll}
                className="h-8 text-xs gap-1.5 shadow-xs"
              >
                <Zap className="h-3.5 w-3.5" />
                Approve All Actions
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
