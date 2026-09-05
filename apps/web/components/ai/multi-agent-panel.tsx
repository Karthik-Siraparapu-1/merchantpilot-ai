'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Boxes,
  TrendingUp,
  ShieldAlert,
  Megaphone,
  CreditCard,
  Users,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiCore, type AutonomousAgent } from '@/lib/ai/core';

const ICON_MAP: Record<string, React.ElementType> = {
  Crown,
  Boxes,
  TrendingUp,
  ShieldAlert,
  Megaphone,
  CreditCard,
  Users,
  Zap
};

const STATUS_CONFIG = {
  ACTIVE: { color: 'bg-emerald-500', label: 'Active', pulse: false },
  PROCESSING: { color: 'bg-blue-500', label: 'Working...', pulse: true },
  IDLE: { color: 'bg-muted-foreground/40', label: 'Idle', pulse: false }
};

// Simulate dynamic status changes for visual effect
const CYCLING_STATUSES: Array<AutonomousAgent['status']> = [
  'ACTIVE',
  'PROCESSING',
  'ACTIVE',
  'PROCESSING',
  'ACTIVE'
];

export function MultiAgentPanel({ className }: { className?: string }) {
  const baseAgents = aiCore.getAgents();
  const [agents, setAgents] = useState(baseAgents);

  // Simulate agent activity cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent, idx) => ({
          ...agent,
          status: CYCLING_STATUSES[(Math.floor(Date.now() / 3000) + idx) % CYCLING_STATUSES.length]!
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn('p-5 border-border/80', className)}>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-indigo-500" />
          Autonomous Agent Network
        </CardTitle>
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-emerald-500 border-emerald-500/30"
        >
          {agents.filter((a) => a.status === 'ACTIVE' || a.status === 'PROCESSING').length}/
          {agents.length} Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {agents.map((agent) => {
          const Icon = ICON_MAP[agent.avatarIcon] || Zap;
          const status = STATUS_CONFIG[agent.status];

          return (
            <div
              key={agent.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 shrink-0">
                <Icon className="h-4 w-4 text-indigo-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-foreground truncate">
                    {agent.name.replace(' Agent', '')}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {agent.currentObjective.slice(0, 60)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    status.color,
                    status.pulse && 'animate-pulse'
                  )}
                />
                <span
                  className={cn(
                    'text-[9px] font-medium',
                    agent.status === 'PROCESSING' ? 'text-blue-500' : 'text-muted-foreground'
                  )}
                >
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
