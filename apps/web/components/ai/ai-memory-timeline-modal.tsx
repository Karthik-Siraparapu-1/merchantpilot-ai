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
import { Brain, CheckCircle2, RotateCcw, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { memoryEngine, type MerchantMemory, type AuditEntry } from '@/lib/ai/memory-engine';
import { toast } from 'sonner';

interface AIMemoryTimelineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIMemoryTimelineModal({ open, onOpenChange }: AIMemoryTimelineModalProps) {
  const [memory, setMemory] = useState<MerchantMemory>(memoryEngine.getMemory());
  const [timeline, setTimeline] = useState(memoryEngine.getTimelineGrouped());

  useEffect(() => {
    if (open) {
      setMemory(memoryEngine.getMemory());
      setTimeline(memoryEngine.getTimelineGrouped());
    }
  }, [open]);

  const handleReset = () => {
    memoryEngine.resetMemory();
    setMemory(memoryEngine.getMemory());
    setTimeline(memoryEngine.getTimelineGrouped());
    toast.info('Merchant memory reset to default operating heuristics.');
  };

  const renderTimelineItem = (item: AuditEntry) => (
    <div
      key={item.id}
      className="p-3 rounded-xl border border-border/70 bg-card hover:border-indigo-500/30 transition-all space-y-1 text-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Badge
            variant={
              item.status === 'APPROVED'
                ? 'default'
                : item.status === 'REJECTED'
                  ? 'destructive'
                  : 'secondary'
            }
            className="text-[9px] py-0 px-1.5 font-mono"
          >
            {item.status}
          </Badge>
          <span className="font-semibold text-foreground">{item.agentName}</span>
        </div>
        {item.confidence && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {item.confidence}% Conf.
          </span>
        )}
      </div>

      <p className="font-medium text-foreground text-[11px]">{item.action}</p>
      {item.impact && (
        <p className="text-[10px] text-emerald-500 font-mono">Impact: {item.impact}</p>
      )}
      {item.details && <p className="text-[10px] text-muted-foreground">{item.details}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="gap-1 text-xs font-semibold">
              <Brain className="h-3.5 w-3.5 text-purple-500" />
              Merchant Behavioral Memory Studio
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Continuous Learning v3.1
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Learned Merchant Heuristics & Operating Habits
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            MerchantPilot AI watches and adapts to your operational decisions. All recommendations
            are personalized by this continuous memory profile.
          </DialogDescription>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto bg-muted/20">
          {/* Active Learned Habits Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                Active Behavioral Habits
              </h4>
              <span className="text-[10px] text-muted-foreground font-mono">
                Reinforced over 76 operational events
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {memory.behavioralHabits.map((habit, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border/80 bg-card flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-foreground">{habit.pattern}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      Observed: {habit.lastObserved}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    {habit.frequency}x reinforced
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Heuristics Rules */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              Strategic Policy Guardrails
            </h4>
            <div className="space-y-2">
              {memory.learnedHeuristics.map((heuristic) => (
                <div
                  key={heuristic.id}
                  className="p-3 rounded-xl border border-border/70 bg-card flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground text-[11px]">{heuristic.rule}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Source:{' '}
                      {heuristic.source === 'AI_LEARNING_LOOP'
                        ? 'Autonomous Feedback'
                        : 'Explicit Policy'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px] text-primary">
                    {Math.round(heuristic.confidence * 100)}% Confidence
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Decision Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Decision Memory Timeline
            </h4>

            {/* Today */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-primary block">Today</span>
              <div className="space-y-2">
                {timeline.today.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic">
                    No decisions logged yet today.
                  </p>
                ) : (
                  timeline.today.map(renderTimelineItem)
                )}
              </div>
            </div>

            {/* Yesterday */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground block">Yesterday</span>
              <div className="space-y-2">{timeline.yesterday.map(renderTimelineItem)}</div>
            </div>

            {/* Last Week */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground block">Last Week</span>
              <div className="space-y-2">{timeline.lastWeek.map(renderTimelineItem)}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-background border-t border-border/60 flex items-center justify-between sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-muted-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Reset Memory
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
