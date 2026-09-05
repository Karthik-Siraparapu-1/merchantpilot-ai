'use client';

import React, { useState, useEffect } from 'react';
import { autoPilotStore, type AutoPilotMode } from '@/lib/ai/auto-pilot-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AutoPilotApprovalModal } from './auto-pilot-approval-modal';
import { toast } from 'sonner';

export function AutoPilotToggle() {
  const [mode, setMode] = useState<AutoPilotMode>(autoPilotStore.getMode());
  const [pendingCount, setPendingCount] = useState(autoPilotStore.getPendingActions().length);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsub = autoPilotStore.subscribe(() => {
      setMode(autoPilotStore.getMode());
      setPendingCount(autoPilotStore.getPendingActions().length);
    });
    return unsub;
  }, []);

  const handleSelectMode = (newMode: AutoPilotMode) => {
    autoPilotStore.setMode(newMode);
    if (newMode === 'AUTO') {
      toast.success('AI Autopilot set to AUTO: Executing low-risk optimizations autonomously.');
    } else if (newMode === 'SUGGEST') {
      toast.info('AI Autopilot set to SUGGEST: Actions queued for human-in-the-loop review.');
    } else {
      toast.warning('AI Autopilot paused (OFF).');
    }
  };

  return (
    <>
      <AutoPilotApprovalModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-mono border-border/80 bg-background/80 hover:bg-muted"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    mode === 'AUTO'
                      ? 'bg-emerald-400'
                      : mode === 'SUGGEST'
                        ? 'bg-indigo-400'
                        : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    mode === 'AUTO'
                      ? 'bg-emerald-500'
                      : mode === 'SUGGEST'
                        ? 'bg-indigo-500'
                        : 'bg-slate-500'
                  }`}
                />
              </span>
              <span className="font-semibold text-foreground">Autopilot:</span>
              <span
                className={`font-bold ${
                  mode === 'AUTO'
                    ? 'text-emerald-500'
                    : mode === 'SUGGEST'
                      ? 'text-indigo-500'
                      : 'text-muted-foreground'
                }`}
              >
                {mode}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <DropdownMenuLabel className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Governance Mode</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {mode}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleSelectMode('AUTO')}
              className="flex items-start gap-2 p-2 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-foreground block">Auto Execution</span>
                <span className="text-[10px] text-muted-foreground">
                  Self-operating with safety guardrails
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleSelectMode('SUGGEST')}
              className="flex items-start gap-2 p-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Suggest & Review
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Drafts actions requiring 1-click review
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleSelectMode('OFF')}
              className="flex items-start gap-2 p-2 cursor-pointer"
            >
              <Shield className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-foreground block">Manual (Off)</span>
                <span className="text-[10px] text-muted-foreground">
                  Advisory only, zero autonomous actions
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Approval Queue Badge Button */}
        {pendingCount > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 h-8 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-500 transition-all text-xs font-medium cursor-pointer"
            title="Review pending autonomous actions"
          >
            <span className="font-bold font-mono">{pendingCount}</span>
            <span className="hidden sm:inline text-[11px]">Actions</span>
          </button>
        )}
      </div>
    </>
  );
}
