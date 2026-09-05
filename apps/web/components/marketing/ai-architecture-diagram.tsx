'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Network,
  Cpu,
  Zap,
  Layers,
  Wrench
} from 'lucide-react';

interface NodeDetail {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  tagline: string;
  description: string;
  telemetry: string;
}

const ARCHITECTURE_NODES: NodeDetail[] = [
  {
    id: 'planner',
    name: 'Autonomous Planner',
    category: 'Goal Decomposition',
    icon: Brain,
    color: 'text-indigo-400 bg-indigo-500/10',
    borderColor: 'border-indigo-500/30 hover:border-indigo-500',
    tagline: 'Formulates multi-agent execution DAGs from natural language',
    description:
      'Translates commercial intent ("Protect weekend margins") into discrete operational sub-tasks across inventory, pricing, and fraud systems.',
    telemetry: '99.4% DAG plan validity'
  },
  {
    id: 'memory',
    name: 'Merchant Memory',
    category: 'Continuous Context',
    icon: Layers,
    color: 'text-purple-400 bg-purple-500/10',
    borderColor: 'border-purple-500/30 hover:border-purple-500',
    tagline: 'Persistent store of merchant habits & operating heuristics',
    description:
      'Learns that you prefer margin protection over unit velocity, always review manual restocks, and avoid discounting premium SKUs.',
    telemetry: '6 active learned policies'
  },
  {
    id: 'router',
    name: 'Multi-Agent Router',
    category: 'Intent Classification',
    icon: Network,
    color: 'text-blue-400 bg-blue-500/10',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
    tagline: 'Scores intent and routes to 8 specialized domain agents',
    description:
      'Dispatches incoming customer inquiries, webhook anomalies, or merchant queries to Inventory, Pricing, Fraud, or Executive agents.',
    telemetry: '18ms dispatch latency'
  },
  {
    id: 'reasoner',
    name: 'Consensus Reasoner',
    category: 'Multi-Agent Debate',
    icon: Cpu,
    color: 'text-emerald-400 bg-emerald-500/10',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500',
    tagline: 'Cross-validates recommendations before mutations are proposed',
    description:
      'Finance agent validates pricing elasticity, Fraud agent verifies payment legitimacy, and Supply agent verifies lead time runway.',
    telemetry: '1.4s consensus cycle'
  },
  {
    id: 'executor',
    name: 'Deterministic Executor',
    category: 'Transactional Core',
    icon: Zap,
    color: 'text-amber-400 bg-amber-500/10',
    borderColor: 'border-amber-500/30 hover:border-amber-500',
    tagline: 'Executes store updates with human-in-the-loop governance',
    description:
      'Performs atomic mutations on the database with audit-trail logging and instant rollback support if thresholds are breached.',
    telemetry: '100% rollback guarantee'
  },
  {
    id: 'tools',
    name: 'Domain Tool Suite',
    category: 'Production Tooling',
    icon: Wrench,
    color: 'text-rose-400 bg-rose-500/10',
    borderColor: 'border-rose-500/30 hover:border-rose-500',
    tagline: 'REST APIs, Web Speech, Recharts, and Webhook dispatchers',
    description:
      'Equips agents with tools to update catalog prices, draft supplier POs, place fraud holds, and speak natural responses aloud.',
    telemetry: '14 production tools'
  }
];

export function AIArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<NodeDetail>(ARCHITECTURE_NODES[0]!);

  const ActiveIcon = activeNode.icon;

  return (
    <Card className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-xs px-3 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1.5 font-mono">
          <Network className="h-3.5 w-3.5" />
          Interactive System Architecture
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Neural Architecture: How the 6 Subsystems Interact
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Hover or click any subsystem node below to inspect its operational role, live telemetry, and data flow.
        </p>
      </div>

      {/* Grid of Interactive Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ARCHITECTURE_NODES.map((node) => {
          const NIcon = node.icon;
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node)}
              onMouseEnter={() => setActiveNode(node)}
              className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                isSelected
                  ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${node.color}`}>
                  <NIcon className="h-4 w-4" />
                </div>
                {isSelected && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{node.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{node.category}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${activeNode.color}`}>
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{activeNode.name}</h4>
                <Badge variant="secondary" className="text-[10px] font-mono bg-slate-800 text-indigo-400 border-slate-700">
                  {activeNode.category}
                </Badge>
              </div>
              <p className="text-xs text-indigo-400 font-medium">{activeNode.tagline}</p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase block">Telemetry</span>
            <span className="font-bold text-emerald-400">{activeNode.telemetry}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeNode.description}
        </p>
      </div>
    </Card>
  );
}
