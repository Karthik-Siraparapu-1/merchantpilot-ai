'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INITIAL_TASKS, type QueuedAITask } from '@/lib/ai/task-queue-store';
import { ListChecks, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export function AITaskQueue() {
  const tasks = INITIAL_TASKS;

  const getStatusConfig = (status: QueuedAITask['status']) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30'
        };
      case 'RUNNING':
        return {
          icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'WAITING_APPROVAL':
        return {
          icon: <Clock className="h-3.5 w-3.5 text-amber-400" />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30'
        };
      case 'PENDING':
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          color: 'text-slate-400',
          bg: 'bg-slate-500/10 border-slate-500/30'
        };
      case 'FAILED':
        return {
          icon: <AlertCircle className="h-3.5 w-3.5" />,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30'
        };
    }
  };

  const getPriorityColor = (p: QueuedAITask['priority']) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">AI Task Pipeline & Orchestration</CardTitle>
            <CardDescription className="text-xs">
              Real-time view of all autonomous employee background steps
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-blue-500/30 text-blue-400"
          >
            {tasks.filter((t) => t.status === 'RUNNING').length} Active
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-amber-500/30 text-amber-400"
          >
            {tasks.filter((t) => t.status === 'WAITING_APPROVAL').length} Pending Review
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const config = getStatusConfig(task.status);
          const completedSteps = task.steps.filter((s) => s.status === 'COMPLETED').length;
          const progressPercent = Math.round((completedSteps / task.steps.length) * 100);

          return (
            <div
              key={task.id}
              className="p-3.5 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/25 transition-colors space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 ${config.color}`}>{config.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{task.title}</span>
                    <Badge
                      className={`text-[8px] font-mono shrink-0 ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                    <span>{task.agent}</span>
                    <span>•</span>
                    <span>Started: {task.startedAt}</span>
                  </div>
                </div>

                <Badge className={`text-[9px] font-mono shrink-0 ${config.bg}`}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Step pipeline indicator */}
              <div className="space-y-1 pt-1 border-t border-border/40">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>
                    Steps ({completedSteps}/{task.steps.length})
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1 italic mt-1">
                  "{task.logSummary}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
