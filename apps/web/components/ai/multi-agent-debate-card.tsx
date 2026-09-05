'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SAMPLE_DEBATES, type MultiAgentDebate } from '@/lib/ai/multi-agent-debate';
import { ChevronDown, ChevronUp, Gavel, MessageSquare } from 'lucide-react';

export function MultiAgentDebateCard() {
  const [expandedDebate, setExpandedDebate] = useState<string | null>(
    SAMPLE_DEBATES[0]?.id ?? null
  );

  const toggleDebate = (id: string) => {
    setExpandedDebate((prev) => (prev === id ? null : id));
  };

  const getConfidenceColor = (c: number) => {
    if (c >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (c >= 80) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Multi-Agent Debate Engine</CardTitle>
            <CardDescription className="text-xs">
              AI employees deliberate and reason before executing decisions
            </CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-amber-500/30 text-amber-400"
        >
          {SAMPLE_DEBATES.length} Debates Resolved
        </Badge>
      </div>

      <div className="space-y-4">
        {SAMPLE_DEBATES.map((debate: MultiAgentDebate) => {
          const isExpanded = expandedDebate === debate.id;
          return (
            <div
              key={debate.id}
              className="rounded-xl border border-border/70 bg-muted/20 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleDebate(debate.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">{debate.topic}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                    <span>{debate.timestamp}</span>
                    <span>•</span>
                    <span>{debate.participants.length} Agents Involved</span>
                    <span>•</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px]">
                      Resolved
                    </Badge>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Expanded Debate View */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Participant Stances */}
                  <div className="space-y-3">
                    {debate.participants.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-lg border border-border/50 bg-background/60"
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${p.avatarColor}`}
                        >
                          {p.avatarInitials}
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">
                                {p.agentName}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {p.agentRole}
                              </span>
                            </div>
                            <Badge
                              className={`text-[9px] font-mono ${getConfidenceColor(p.confidence)}`}
                            >
                              {p.confidence}% Confidence
                            </Badge>
                          </div>
                          <p className="text-xs font-semibold text-primary">{p.stance}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {p.keyArgument}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {p.evidenceData.map((ev, evIdx) => (
                              <Badge key={evIdx} variant="outline" className="text-[9px] font-mono">
                                {ev}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Executive Verdict */}
                  <div className="p-4 rounded-xl border-2 border-purple-500/30 bg-purple-500/5 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Gavel className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-bold text-purple-300 uppercase">
                        Executive Verdict — {debate.executiveVerdict.arbiter}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                        {debate.executiveVerdict.approvedAt}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {debate.executiveVerdict.decision}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {debate.executiveVerdict.rationale}
                    </p>
                    <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono">
                      Expected: {debate.executiveVerdict.expectedOutcome}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
