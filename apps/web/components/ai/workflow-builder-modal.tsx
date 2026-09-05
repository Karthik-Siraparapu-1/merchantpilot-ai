'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkflowBuilderModal({ open, onOpenChange }: WorkflowBuilderModalProps) {
  const [isActive, setIsActive] = useState(true);

  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive) {
      toast.success('Autonomous workflow deployed and listening to real-time triggers.');
    } else {
      toast.info('Autonomous workflow paused.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-1.5">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Zap className="h-3 w-3 text-emerald-500" />
              Visual Autonomous Workflow Canvas
            </Badge>
            <Badge
              variant={isActive ? 'default' : 'outline'}
              className="text-xs gap-1 cursor-pointer"
              onClick={toggleActive}
            >
              {isActive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active & Listening
                </>
              ) : (
                'Paused'
              )}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Automated Restock & Price Guardian
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            No-code execution chain. Ingests catalog events, computes predictive demand, and
            dispatches POs.
          </DialogDescription>
        </div>

        {/* Visual Node Flow Canvas */}
        <div className="p-6 space-y-4 bg-muted/20">
          <div className="space-y-3">
            {/* Step 1: Trigger */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="flex-1 p-3.5 rounded-xl border border-border/80 bg-card shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Event Trigger
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Real-time Webhook
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-0.5">
                  IF Available Inventory &lt; 20 units AND Daily Velocity &gt; 10 units
                </h4>
              </div>
            </div>

            {/* Connector Arrow */}
            <div className="pl-6 text-muted-foreground">
              <ArrowRight className="h-4 w-4 rotate-90 ml-[-2px]" />
            </div>

            {/* Step 2: AI Calculation */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="flex-1 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    AI Agent Reasoning
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-indigo-500 border-indigo-500/30"
                  >
                    Inventory & Pricing Agent
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-0.5">
                  Predict supplier arrival date against 6-day lead times and calculate optimal PO
                  size
                </h4>
              </div>
            </div>

            {/* Connector Arrow */}
            <div className="pl-6 text-muted-foreground">
              <ArrowRight className="h-4 w-4 rotate-90 ml-[-2px]" />
            </div>

            {/* Step 3: Action Dispatch */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="flex-1 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Autonomous Dispatch
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-600 border-emerald-500/30"
                  >
                    Automated Task
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-0.5">
                  Generate draft purchase order in Action Center and send notification to Store
                  Manager
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-muted/30 border-t border-border/80 flex sm:justify-between items-center">
          <Button
            variant={isActive ? 'destructive' : 'default'}
            size="sm"
            onClick={toggleActive}
            className="h-8 text-xs gap-1.5"
          >
            {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isActive ? 'Pause Automation' : 'Resume Automation'}
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs shadow-xs">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
