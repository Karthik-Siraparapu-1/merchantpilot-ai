'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AI_WORKFORCE } from '@/lib/ai/agent-workforce';
import { Network } from 'lucide-react';

export function AIOrgChart() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const ceoAgent = AI_WORKFORCE.find((a) => a.name === 'Athena');
  const specialistAgents = AI_WORKFORCE.filter((a) => a.name !== 'Athena');

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">AI Organization Chart</CardTitle>
            <CardDescription className="text-xs">
              Your autonomous digital workforce hierarchy
            </CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-indigo-500/30 text-indigo-400"
        >
          7 Digital Executives
        </Badge>
      </div>

      {/* Org Chart Visual */}
      <div className="flex flex-col items-center gap-4 py-4">
        {/* CEO (Merchant) */}
        <div
          className="px-5 py-3 rounded-xl border-2 border-amber-500/40 bg-amber-500/5 text-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10"
          onMouseEnter={() => setHoveredNode('ceo')}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Merchant CEO
          </div>
          <div className="text-[10px] text-muted-foreground">Store Executive · Human Decision-Maker</div>
        </div>

        {/* Connector */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500/40 to-purple-500/40" />

        {/* Chief of Staff - Athena */}
        {ceoAgent && (
          <div
            className={`px-5 py-3 rounded-xl border-2 text-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
              hoveredNode === ceoAgent.id
                ? 'border-purple-400 bg-purple-500/15 shadow-purple-500/20'
                : 'border-purple-500/40 bg-purple-500/5'
            }`}
            onMouseEnter={() => setHoveredNode(ceoAgent.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className={`h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-bold ${ceoAgent.avatarColor}`}
              >
                {ceoAgent.avatarInitials}
              </div>
              <div className="text-xs font-bold text-purple-400">{ceoAgent.name}</div>
            </div>
            <div className="text-[10px] text-muted-foreground">{ceoAgent.callsign}</div>
            <Badge className="mt-1 text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/30">
              {ceoAgent.confidence}% Confidence
            </Badge>
          </div>
        )}

        {/* Connector Fan */}
        <div className="relative w-full flex justify-center">
          <div className="w-0.5 h-4 bg-purple-500/30" />
        </div>
        <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Specialist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
          {specialistAgents.map((agent) => (
            <div
              key={agent.id}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.03] hover:shadow-md ${
                hoveredNode === agent.id
                  ? `${agent.borderColor} bg-muted/40 shadow-lg`
                  : `${agent.borderColor} bg-muted/10`
              }`}
              onMouseEnter={() => setHoveredNode(agent.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className={`h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-[10px] font-bold mb-1.5 ${agent.avatarColor}`}
              >
                {agent.avatarInitials}
              </div>
              <div className="text-[11px] font-bold text-foreground">{agent.name}</div>
              <div className="text-[9px] text-muted-foreground line-clamp-1">
                {agent.department}
              </div>
              <div className="mt-1.5 flex justify-center">
                <Badge
                  className={`text-[8px] font-mono ${
                    agent.status === 'WORKING'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : agent.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : agent.status === 'DELIBERATING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {agent.status === 'WORKING'
                    ? '● Working'
                    : agent.status === 'ACTIVE'
                      ? '● Active'
                      : agent.status === 'DELIBERATING'
                        ? '● Thinking'
                        : '○ Standby'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Connector */}
        <div className="w-3/4 h-0.5 bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
        <div className="w-0.5 h-4 bg-slate-500/30" />

        {/* Execution Layer */}
        <div className="flex gap-3 flex-wrap justify-center">
          {['Tool Execution', 'Database Sync', 'Webhook Dispatch', 'Memory Write'].map((item) => (
            <div
              key={item}
              className="px-3 py-1.5 rounded-md border border-border/50 bg-muted/10 text-[10px] font-mono text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
