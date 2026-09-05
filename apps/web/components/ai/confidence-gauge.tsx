'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ConfidenceGaugeProps {
  score: number; // 0 - 1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceGauge({
  score,
  size = 'md',
  showLabel = true,
  className
}: ConfidenceGaugeProps) {
  const percent = Math.round(score * 100);

  const sizeMap = {
    sm: { width: 48, stroke: 4, fontSize: 'text-[10px]', labelSize: 'text-[8px]' },
    md: { width: 64, stroke: 5, fontSize: 'text-xs', labelSize: 'text-[9px]' },
    lg: { width: 80, stroke: 6, fontSize: 'text-sm', labelSize: 'text-[10px]' }
  };

  const s = sizeMap[size];
  const radius = (s.width - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const getColor = () => {
    if (percent >= 90)
      return { stroke: '#10b981', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (percent >= 70)
      return { stroke: '#6366f1', text: 'text-indigo-500', bg: 'bg-indigo-500/10' };
    if (percent >= 50) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const color = getColor();

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: s.width, height: s.width }}>
        <svg width={s.width} height={s.width} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={s.width / 2}
            cy={s.width / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={s.stroke}
          />
          {/* Progress arc */}
          <circle
            cx={s.width / 2}
            cy={s.width / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold font-mono', s.fontSize, color.text)}>{percent}%</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('font-medium text-muted-foreground', s.labelSize)}>Confidence</span>
      )}
    </div>
  );
}
