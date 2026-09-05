'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { agentWorkforce, type AIEmployee } from '@/lib/ai/agent-workforce';
import { Users, Mic, Activity, CheckCircle2 } from 'lucide-react';
import { VoiceAIModal } from './voice-ai-modal';

export function AgentWorkforceGrid() {
  const [employees, setEmployees] = useState<AIEmployee[]>(agentWorkforce.getEmployees());
  const [selectedAgent, setSelectedAgent] = useState<AIEmployee | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

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

  const handleTalkToAgent = (emp: AIEmployee) => {
    setSelectedAgent(emp);
    setVoiceModalOpen(true);
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
                Your dedicated AI workforce orchestrating commerce operations 24/7
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
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-all space-y-3 flex flex-col justify-between ${emp.borderColor}`}
            >
              <div className="space-y-2.5">
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
                  <p className="text-foreground leading-relaxed line-clamp-2">{emp.currentTask}</p>
                </div>

                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{emp.monthlyImpact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTalkToAgent(emp)}
                  className="w-full text-xs h-8 gap-1.5 hover:border-purple-500/40 hover:text-purple-400"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Talk with {emp.name}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
