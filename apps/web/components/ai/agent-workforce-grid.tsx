'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { agentWorkforce, type AIEmployee } from '@/lib/ai/agent-workforce';
import {
  Users,
  Mic,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { VoiceAIModal } from './voice-ai-modal';

// Simulated recent action logs per agent (keyed by agent id)
const AGENT_ACTION_LOGS: Record<
  string,
  Array<{ action: string; time: string; impact: string; status: 'DONE' | 'PENDING' | 'RUNNING' }>
> = {
  'agent-atlas': [
    {
      action: 'Auto-drafted PO-8821 for 120 units (Wireless Mouse)',
      time: '14 min ago',
      impact: 'Prevented ₹38,400 stockout loss',
      status: 'DONE'
    },
    {
      action: 'Recalculated safety stock thresholds across 42 SKUs',
      time: '1h ago',
      impact: 'Optimized warehouse buffer by 18%',
      status: 'DONE'
    },
    {
      action: 'Monitoring Apex Logistics transit ETA for PO-8819',
      time: 'Ongoing',
      impact: 'Tracking 4-day lead time window',
      status: 'RUNNING'
    }
  ],
  'agent-vega': [
    {
      action: 'Proposed +8% price lift on Ergonomic Mouse (₹2,499 → ₹2,699)',
      time: '22 min ago',
      impact: '+₹42,000/mo margin lift',
      status: 'PENDING'
    },
    {
      action: 'Validated competitor stockout on Amazon & Flipkart',
      time: '45 min ago',
      impact: 'Confirmed pricing window opportunity',
      status: 'DONE'
    },
    {
      action: 'Simulated 10,000 demand elasticity scenarios',
      time: '2h ago',
      impact: 'Elasticity = -0.32 (inelastic)',
      status: 'DONE'
    }
  ],
  'agent-sentinel': [
    {
      action: 'Flagged Order #ORD-9921 — 92% risk score (proxy VPN)',
      time: '8 min ago',
      impact: 'Prevented ₹4,998 potential chargeback',
      status: 'DONE'
    },
    {
      action: 'Scanned 41 orders in last 24h for fraud signals',
      time: '30 min ago',
      impact: '1 flagged, 40 cleared',
      status: 'DONE'
    }
  ],
  'agent-pulse': [
    {
      action: 'Executed failover from Razorpay → Cashfree on error spike',
      time: '3h ago',
      impact: 'Recovered 97.4% gateway success rate',
      status: 'DONE'
    },
    {
      action: 'Monitoring UPI Intent settlement velocity',
      time: 'Ongoing',
      impact: 'T+0 settlement at 65%',
      status: 'RUNNING'
    }
  ],
  'agent-nova': [
    {
      action: 'Generated WhatsApp VIP re-engagement campaign draft',
      time: '1h ago',
      impact: 'Targets 88 at-risk customers',
      status: 'PENDING'
    },
    {
      action: 'A/B tested "WELCOMEBACK10" vs "VIP15OFF" coupon copy',
      time: '4h ago',
      impact: 'WELCOMEBACK10 won (+12% open rate)',
      status: 'DONE'
    }
  ],
  'agent-orion': [
    {
      action: 'Identified 88 high-LTV customers at churn risk',
      time: '2h ago',
      impact: '₹84,000 revenue at risk',
      status: 'DONE'
    },
    {
      action: 'Drafted personalized retention perks for top 20 VIPs',
      time: '3h ago',
      impact: 'Projected 24% win-back rate',
      status: 'PENDING'
    }
  ],
  'agent-cortex': [
    {
      action: 'Synthesized multi-agent consensus for weekly board report',
      time: '1h ago',
      impact: 'Executive summary ready',
      status: 'DONE'
    },
    {
      action: 'Resolved conflicting pricing vs inventory recommendations',
      time: '2h ago',
      impact: 'Prioritized stockout prevention over margin lift',
      status: 'DONE'
    }
  ]
};

export function AgentWorkforceGrid() {
  const [employees, setEmployees] = useState<AIEmployee[]>(agentWorkforce.getEmployees());
  const [selectedAgent, setSelectedAgent] = useState<AIEmployee | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  useEffect(() => {
    return agentWorkforce.subscribe(() => {
      setEmployees(agentWorkforce.getEmployees());
    });
  }, []);

  const getStatusBadge = (status: AIEmployee['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
            Active
          </Badge>
        );
      case 'WORKING':
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px] gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Executing Task
          </Badge>
        );
      case 'DELIBERATING':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            Deliberating
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            Standby
          </Badge>
        );
    }
  };

  const getActionStatusBadge = (status: 'DONE' | 'PENDING' | 'RUNNING') => {
    switch (status) {
      case 'DONE':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-mono px-1.5">
            ✓ Done
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px] font-mono px-1.5">
            ⏳ Awaiting
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[9px] font-mono px-1.5 gap-1">
            <span className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
            Live
          </Badge>
        );
    }
  };

  const handleTalkToAgent = (emp: AIEmployee) => {
    setSelectedAgent(emp);
    setVoiceModalOpen(true);
  };

  const toggleExpand = (agentId: string) => {
    setExpandedAgentId((prev) => (prev === agentId ? null : agentId));
  };

  return (
    <>
      <VoiceAIModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        initialPrompt={
          selectedAgent
            ? `Hello ${selectedAgent.name}, what are you working on right now?`
            : undefined
        }
      />

      <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Autonomous Digital Executives
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-purple-500/30 text-purple-400 bg-purple-500/5"
                >
                  7 Active Agents
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Your dedicated AI workforce orchestrating commerce operations 24/7. Click any agent
                to inspect its live activity.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Consensus Engine: Active</span>
          </div>
        </div>

        {/* 7 Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((emp) => {
            const isExpanded = expandedAgentId === emp.id;
            const actionLogs = AGENT_ACTION_LOGS[emp.id] || [];

            return (
              <div
                key={emp.id}
                className={`rounded-xl border bg-muted/20 transition-all flex flex-col ${emp.borderColor} ${
                  isExpanded
                    ? 'ring-1 ring-purple-500/40 shadow-lg bg-muted/30'
                    : 'hover:bg-muted/40'
                }`}
              >
                {/* Clickable agent card header */}
                <button
                  onClick={() => toggleExpand(emp.id)}
                  className="p-4 text-left space-y-2.5 w-full cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs shadow-md ${emp.avatarColor}`}
                      >
                        {emp.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          {emp.name}
                          <span className={`text-[10px] font-normal ${emp.accentColor}`}>
                            ({emp.callsign})
                          </span>
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{emp.role}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {getStatusBadge(emp.status)}
                    <span className="text-[11px] font-mono font-semibold text-primary">
                      {emp.confidence}% Confidence
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-background/60 border border-border/50 text-[11px] space-y-1">
                    <span className="text-[10px] font-mono text-muted-foreground block uppercase">
                      Current Task:
                    </span>
                    <p className="text-foreground leading-relaxed line-clamp-2">
                      {emp.currentTask}
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{emp.monthlyImpact}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded Action Detail Panel */}
                {isExpanded && actionLogs.length > 0 && (
                  <div className="px-4 pb-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-t border-border/40 pt-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Zap className="h-3 w-3 text-purple-400" />
                        <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">
                          Recent Actions & Decisions
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {actionLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-background/70 border border-border/40 space-y-1"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[11px] text-foreground leading-snug font-medium">
                                {log.action}
                              </p>
                              {getActionStatusBadge(log.status)}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                              <span className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                {log.time}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-400">
                                <ArrowRight className="h-2.5 w-2.5" />
                                {log.impact}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-4 pb-4 pt-2 border-t border-border/40 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExpand(emp.id)}
                    className={`flex-1 text-xs h-8 gap-1.5 transition-all ${
                      isExpanded
                        ? 'border-purple-500/40 text-purple-400 bg-purple-500/5'
                        : 'hover:border-purple-500/40 hover:text-purple-400'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>{isExpanded ? 'Hide Actions' : 'View Actions'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTalkToAgent(emp)}
                    className="flex-1 text-xs h-8 gap-1.5 hover:border-indigo-500/40 hover:text-indigo-400"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    <span>Talk</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
