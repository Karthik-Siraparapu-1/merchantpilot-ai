'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown } from 'lucide-react';

interface ReasoningStep {
  label: string;
  value?: string | undefined;
}

interface ReasoningPipelineProps {
  steps: ReasoningStep[];
  conclusion?: string | undefined;
  className?: string | undefined;
}

export function ReasoningPipeline({ steps, conclusion, className }: ReasoningPipelineProps) {
  if (steps.length === 0) return null;

  return (
    <div className={cn('space-y-0', className)}>
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-start">
          {/* Step node */}
          <div className="flex items-start gap-2.5 py-1.5">
            <div className="flex flex-col items-center mt-0.5">
              <div
                className={cn(
                  'h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                  'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                )}
              >
                {idx + 1}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-medium text-foreground">{step.label}</span>
              {step.value && (
                <span className="text-[11px] text-muted-foreground ml-1">— {step.value}</span>
              )}
            </div>
          </div>

          {/* Connector line */}
          {idx < steps.length - 1 && (
            <div className="flex items-center ml-[9px]">
              <div className="w-px h-3 bg-border" />
              <ChevronDown className="h-2.5 w-2.5 text-muted-foreground/50 -ml-[5px]" />
            </div>
          )}
        </div>
      ))}

      {/* Conclusion */}
      {conclusion && (
        <>
          <div className="flex items-center ml-[9px]">
            <div className="w-px h-3 bg-emerald-500/40" />
          </div>
          <div className="flex items-start gap-2.5 py-1.5">
            <div className="flex flex-col items-center mt-0.5">
              <div className="h-5 w-5 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              💡 {conclusion}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
