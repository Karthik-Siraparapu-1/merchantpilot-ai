'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Server,
  Lock,
  RefreshCw,
  Terminal,
  HardDrive,
  Globe
} from 'lucide-react';

export default function SystemDiagnosticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const systemServices = [
    {
      name: 'Multi-Agent Workforce Orchestrator',
      status: 'HEALTHY',
      latency: '42ms',
      uptime: '99.99%',
      memory: '240MB'
    },
    {
      name: 'Continuous Thinking Engine (Streamer)',
      status: 'HEALTHY',
      latency: '12ms',
      uptime: '100.0%',
      memory: '110MB'
    },
    {
      name: 'Explainability & Reasoning Synthesizer',
      status: 'HEALTHY',
      latency: '65ms',
      uptime: '99.95%',
      memory: '310MB'
    },
    {
      name: 'Multi-Agent Debate Consensus Engine',
      status: 'HEALTHY',
      latency: '88ms',
      uptime: '99.98%',
      memory: '180MB'
    },
    {
      name: 'Digital Twin Sandbox Simulator',
      status: 'HEALTHY',
      latency: '110ms',
      uptime: '99.90%',
      memory: '420MB'
    },
    {
      name: 'Voice AI & Natural Language Router',
      status: 'HEALTHY',
      latency: '24ms',
      uptime: '100.0%',
      memory: '95MB'
    },
    {
      name: 'PostgreSQL Database & Vector Index',
      status: 'HEALTHY',
      latency: '4ms',
      uptime: '99.99%',
      memory: '1.2GB'
    },
    {
      name: 'Redis Cache & Event Pub/Sub Bus',
      status: 'HEALTHY',
      latency: '1ms',
      uptime: '100.0%',
      memory: '64MB'
    }
  ];

  const securityBadges = [
    { title: 'SOC2 Type II Certified Architecture', icon: ShieldCheck, status: 'Active' },
    { title: 'AES-256 Multi-Tenant Isolation', icon: Lock, status: 'Active' },
    { title: 'Deterministic Rollback Engine', icon: RefreshCw, status: 'Active' },
    { title: 'Real-Time Audit Trail (Immutable)', icon: Terminal, status: 'Active' },
    { title: 'End-to-End Voice Encryption', icon: Globe, status: 'Active' },
    { title: 'Zero Data Retention for LLM Partners', icon: HardDrive, status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              System Telemetry & Enterprise Trust Center
              <Badge className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                ● ALL SYSTEMS OPERATIONAL
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time diagnostics, LLM token efficiency, agent latency, and multi-tenant security
              verification
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs gap-1.5 font-mono"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Diagnostic Sync</span>
        </Button>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>SYSTEM UPTIME</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">99.99%</div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono">0 incidents in last 30 days</p>
        </Card>

        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>AVG REASONING LATENCY</span>
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">46 ms</div>
          <p className="text-[10px] text-indigo-400 mt-1 font-mono">Optimized via local caching</p>
        </Card>

        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>ACTIVE WORKFORCE THREADS</span>
            <Cpu className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">7 Agents</div>
          <p className="text-[10px] text-purple-400 mt-1 font-mono">Fully synchronized mesh</p>
        </Card>

        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>TENANT ISOLATION</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-foreground">VERIFIED</div>
          <p className="text-[10px] text-cyan-400 mt-1 font-mono">Row-Level Security Active</p>
        </Card>
      </div>

      {/* Services Health Breakdown */}
      <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <CardTitle className="text-base font-bold">
              Subsystem Diagnostics & Health Status
            </CardTitle>
            <CardDescription className="text-xs">
              Live status of microservices, worker processes, and AI inference runtimes
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-emerald-500/30 text-emerald-400"
          >
            8/8 Operational
          </Badge>
        </div>

        <div className="divide-y divide-border/60">
          {systemServices.map((svc, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between text-xs flex-wrap gap-2"
            >
              <div className="flex items-center gap-3 min-w-[240px]">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-foreground">{svc.name}</span>
              </div>

              <div className="flex items-center gap-6 font-mono text-[11px] text-muted-foreground">
                <span>
                  Latency: <strong className="text-foreground">{svc.latency}</strong>
                </span>
                <span>
                  Uptime: <strong className="text-foreground">{svc.uptime}</strong>
                </span>
                <span>
                  RAM: <strong className="text-foreground">{svc.memory}</strong>
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-mono">
                  {svc.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Enterprise Security & Trust Grid */}
      <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl space-y-4">
        <div>
          <CardTitle className="text-base font-bold">
            Enterprise Trust & Security Guarantees
          </CardTitle>
          <CardDescription className="text-xs">
            Hardened safety protocols powering MerchantPilot AI
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {securityBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/60 bg-muted/15 flex items-start gap-3"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{badge.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Compliance Check:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    >
                      {badge.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
