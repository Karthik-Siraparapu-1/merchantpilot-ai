'use client';

import React, { useState, useEffect } from 'react';
import { continuousThinking, type AIThought } from '@/lib/ai/continuous-thinking';
import { Brain, Boxes, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContinuousThinkingTicker({ className }: { className?: string }) {
  const [thought, setThought] = useState<AIThought>(continuousThinking.getCurrentThought());
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const unsub = continuousThinking.subscribe((newThought) => {
      setIsFading(true);
      setTimeout(() => {
        setThought(newThought);
        setIsFading(false);
      }, 200);
    });
    return unsub;
  }, []);

  const getAgentIcon = (agent: AIThought['agent']) => {
    switch (agent) {
      case 'Inventory':
        return <Boxes className="h-3 w-3 text-indigo-400 shrink-0 animate-pulse" />;
      case 'Pricing':
        return <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0 animate-pulse" />;
      case 'Fraud':
        return <ShieldAlert className="h-3 w-3 text-rose-400 shrink-0 animate-pulse" />;
      case 'Payments':
        return <Cpu className="h-3 w-3 text-blue-400 shrink-0 animate-pulse" />;
      default:
        return <Brain className="h-3 w-3 text-purple-400 shrink-0 animate-pulse" />;
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-xs text-xs font-mono select-none transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {getAgentIcon(thought.agent)}
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {thought.agent} Agent
        </span>
      </div>

      <span className="text-muted-foreground/50 text-[10px]">•</span>

      <span
        className={cn(
          'text-[11px] text-foreground/90 font-medium truncate max-w-[280px] sm:max-w-md transition-opacity duration-200',
          isFading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {thought.text}
      </span>

      <span className="hidden md:inline-flex text-[9px] text-muted-foreground font-mono ml-auto">
        {thought.timestamp}
      </span>
    </div>
  );
}
