'use client';

import React, { useState, useEffect } from 'react';
import { AI_WORKFORCE, type AIEmployee } from '@/lib/ai/agent-workforce';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Activity } from 'lucide-react';

export function AIStatusBar() {
  const [agents, setAgents] = useState<AIEmployee[]>(AI_WORKFORCE);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  const statusMessages = [
    {
      agent: 'Atlas',
      message: 'Scanning supplier lead times & SKU velocities...',
      color: 'text-blue-400'
    },
    {
      agent: 'Vega',
      message: 'Running dynamic price elasticity simulation...',
      color: 'text-amber-400'
    },
    {
      agent: 'Sentinel',
      message: 'Scoring incoming order ingress for fraud signals...',
      color: 'text-rose-400'
    },
    {
      agent: 'Pulse',
      message: 'Optimizing checkout routing for HDFC gateway...',
      color: 'text-cyan-400'
    },
    {
      agent: 'Nova',
      message: 'Building VIP repurchase WhatsApp campaign...',
      color: 'text-purple-400'
    },
    {
      agent: 'Orion',
      message: 'Identifying high-LTV customer retention cohort...',
      color: 'text-emerald-400'
    },
    {
      agent: 'Athena',
      message: 'Synthesizing multi-agent consensus briefing...',
      color: 'text-indigo-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  const activeMsg = statusMessages[activeMessageIndex];

  return (
    <div className="fixed bottom-3 right-4 z-40 hidden sm:flex items-center gap-3 px-4 py-2 rounded-full border border-border/80 bg-background/90 backdrop-blur-xl shadow-xl text-xs">
      <div className="flex items-center gap-2 border-r border-border/60 pr-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-bold text-[11px] text-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-indigo-400" /> AI Workforce Mesh
        </span>
      </div>

      {/* Active Ticker Message */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground min-w-[280px]">
        <Badge className="text-[9px] font-mono bg-primary/10 text-primary border-primary/30">
          {activeMsg?.agent}
        </Badge>
        <span className={`truncate animate-in fade-in duration-300 ${activeMsg?.color}`}>
          {activeMsg?.message}
        </span>
      </div>
    </div>
  );
}
