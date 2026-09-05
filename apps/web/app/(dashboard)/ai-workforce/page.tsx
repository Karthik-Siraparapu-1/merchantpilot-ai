'use client';

import React from 'react';
import { AgentWorkforceGrid } from '@/components/ai/agent-workforce-grid';
import { AIOrgChart } from '@/components/ai/ai-org-chart';
import { MultiAgentDebateCard } from '@/components/ai/multi-agent-debate-card';
import { AIGoalsDashboard } from '@/components/ai/ai-goals-dashboard';
import { AILearningDashboard } from '@/components/ai/ai-learning-dashboard';
import { AITaskQueue } from '@/components/ai/ai-task-queue';
import { StrategyPlanner } from '@/components/ai/strategy-planner';
import { RollbackHistory } from '@/components/ai/rollback-history';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles } from 'lucide-react';

export default function AIWorkforcePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              AI Workforce Command
              <Badge className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                <Sparkles className="h-2.5 w-2.5 mr-1" /> 7 Employees Active
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Your autonomous digital employees — monitor, assign goals, review decisions, and audit
              actions
            </p>
          </div>
        </div>
      </div>

      {/* AI Org Chart - Full Width */}
      <AIOrgChart />

      {/* Agent Workforce Grid */}
      <AgentWorkforceGrid />

      {/* Goals & Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIGoalsDashboard />
        <AITaskQueue />
      </div>

      {/* Multi-Agent Debate Engine */}
      <MultiAgentDebateCard />

      {/* Strategy Planner */}
      <StrategyPlanner />

      {/* Learning & Rollback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AILearningDashboard />
        <RollbackHistory />
      </div>
    </div>
  );
}
