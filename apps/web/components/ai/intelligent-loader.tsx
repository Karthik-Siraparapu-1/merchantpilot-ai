'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Package, BarChart3, TrendingUp, Brain, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const THINKING_STEPS = [
  { icon: Sparkles, text: 'Thinking...', color: 'text-indigo-500' },
  { icon: Package, text: 'Checking inventory levels...', color: 'text-blue-500' },
  { icon: BarChart3, text: 'Analyzing demand curves...', color: 'text-emerald-500' },
  { icon: TrendingUp, text: 'Comparing competitor pricing...', color: 'text-amber-500' },
  { icon: Brain, text: 'Building recommendation...', color: 'text-purple-500' },
  { icon: CheckCircle2, text: 'Done.', color: 'text-emerald-500' }
];

interface IntelligentLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  className?: string;
  steps?: Array<{ icon: React.ElementType; text: string; color: string }>;
}

export function IntelligentLoader({
  isLoading,
  onComplete,
  className,
  steps = THINKING_STEPS
}: IntelligentLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isLoading, steps.length, onComplete]);

  if (!isLoading) return null;

  return (
    <div className={cn('space-y-1.5 py-3', className)}>
      {steps.slice(0, currentStep + 1).map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        const isDone = idx < currentStep;

        return (
          <div
            key={idx}
            className={cn(
              'flex items-center gap-2 text-xs transition-all duration-300',
              isActive ? 'opacity-100' : isDone ? 'opacity-50' : 'opacity-0',
              isActive && 'animate-pulse'
            )}
          >
            <Icon className={cn('h-3.5 w-3.5', step.color)} />
            <span
              className={cn(
                'font-medium',
                isDone ? 'text-muted-foreground line-through' : step.color
              )}
            >
              {step.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
