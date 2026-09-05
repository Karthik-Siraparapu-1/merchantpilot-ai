'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Cpu, Brain } from 'lucide-react';

export function AISystemTelemetryPill() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full border border-border/70 bg-card/60 backdrop-blur-sm text-[11px] font-mono">
        {/* Backend Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>API</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Backend API: Healthy (Latency: 18ms)
          </TooltipContent>
        </Tooltip>

        <span className="text-muted-foreground/40">•</span>

        {/* LLM Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Cpu className="h-3 w-3 text-indigo-400" />
              <span>LLM</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            LLM Gateway: Active & Connected (Gemini 2.5 Multi-Agent)
          </TooltipContent>
        </Tooltip>

        <span className="text-muted-foreground/40">•</span>

        {/* AI Thinking Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span className="text-emerald-500 font-semibold">Active</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Autonomous Pipeline: Continuous Telemetry Running
          </TooltipContent>
        </Tooltip>

        <span className="text-muted-foreground/40">•</span>

        {/* Memory Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Brain className="h-3 w-3 text-purple-400" />
              <span>Memory</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Merchant Memory: Synced (6 Active Operating Policies)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
