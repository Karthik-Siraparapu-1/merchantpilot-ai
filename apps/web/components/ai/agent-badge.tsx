'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Boxes,
  ShieldAlert,
  Megaphone,
  Crown,
  ShoppingCart,
  Sparkles,
  Zap,
  Users,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AGENT_ICONS: Record<string, React.ElementType> = {
  TrendingUp,
  Boxes,
  ShieldAlert,
  Megaphone,
  Crown,
  ShoppingCart,
  Sparkles,
  Zap,
  Users,
  CreditCard
};

interface AgentBadgeProps {
  agentName: string;
  agentIcon?: string | undefined;
  confidence?: number | undefined;
  className?: string | undefined;
  variant?: 'inline' | 'card' | undefined;
}

export function AgentBadge({
  agentName,
  agentIcon,
  confidence,
  className,
  variant = 'inline'
}: AgentBadgeProps) {
  const Icon = agentIcon ? AGENT_ICONS[agentIcon] || Sparkles : Sparkles;

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-muted/20',
          className
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10">
          <Icon className="h-3.5 w-3.5 text-indigo-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-foreground">{agentName}</span>
          {confidence !== undefined && (
            <span className="text-[9px] font-mono text-muted-foreground">
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn('gap-1 text-[10px] font-medium px-2 py-0.5', className)}
    >
      <Icon className="h-3 w-3 text-indigo-500" />
      {agentName}
      {confidence !== undefined && (
        <span className="font-mono text-muted-foreground ml-1">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </Badge>
  );
}
