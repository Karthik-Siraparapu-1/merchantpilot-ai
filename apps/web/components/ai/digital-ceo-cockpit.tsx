'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DigitalCEOCockpit() {
  const router = useRouter();
  const [mode, setMode] = React.useState<'EXECUTIVE' | 'OPERATOR'>('EXECUTIVE');

  return (
    <Card className="p-6 border-border/80 bg-gradient-to-br from-purple-500/10 via-card to-indigo-500/5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">Digital CEO Assistant</CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-purple-500 border-purple-500/30"
              >
                {mode === 'EXECUTIVE' ? 'Executive Mode' : 'Operator Mode'}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {mode === 'EXECUTIVE'
                ? 'Macro operational orchestration across sales, stock, margin, and cash velocity'
                : 'Sub-second tactical execution telemetry across worker threads, event queues, and agent guardrails'}
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/60">
            <button
              onClick={() => setMode('EXECUTIVE')}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                mode === 'EXECUTIVE'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setMode('OPERATOR')}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                mode === 'OPERATOR'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Operator
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-background/80 border border-border/80 text-center font-mono min-w-[120px]">
            <span className="text-[10px] text-muted-foreground block uppercase">
              {mode === 'EXECUTIVE' ? 'Business Health' : 'System Telemetry'}
            </span>
            <span className="text-xl font-bold text-primary">
              {mode === 'EXECUTIVE' ? '95/100' : '100% Online'}
            </span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE MODE: Business Pillar Cards */}
      {mode === 'EXECUTIVE' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  Revenue
                </span>
                <span className="text-emerald-500 font-bold">Excellent</span>
              </div>
              <div className="text-lg font-bold text-foreground">₹2.42L / Day</div>
              <span className="text-[10px] text-emerald-500 block">↑ 14% vs baseline</span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  Inventory
                </span>
                <span className="text-amber-500 font-bold">Needs Attention</span>
              </div>
              <div className="text-lg font-bold text-foreground">2 Low SKUs</div>
              <span className="text-[10px] text-amber-500 block">Restock PO drafted</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-emerald-500" />
                  Cash Flow
                </span>
                <span className="text-emerald-500 font-bold">Healthy</span>
              </div>
              <div className="text-lg font-bold text-foreground">38.2% Margin</div>
              <span className="text-[10px] text-muted-foreground block">T+0 settlement 65%</span>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Next Week Projection
                </span>
                <span className="text-primary font-bold">+18% Lift</span>
              </div>
              <div className="text-lg font-bold text-foreground">₹16.4L Target</div>
              <span className="text-[10px] text-primary block">96% confidence</span>
            </div>
          </div>

          {/* Executive Strategic Directives */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-500 uppercase">
                  Growth Lever
                </span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">
                Computer Peripherals line is surging at <strong>+32% MoM</strong>. Capitalize by
                expanding SKU depth with USB-C docks and hub accessories.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[11px] font-bold text-amber-500 uppercase">Bottleneck</span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">
                4-day supplier transit delay on Wireless Mice from Apex Logistics is constraining
                fulfillment velocity. Consider <strong>secondary supplier</strong> onboarding.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-[11px] font-bold text-purple-500 uppercase">Opportunity</span>
              </div>
              <p className="text-[11px] text-foreground leading-relaxed">
                Competitor stockout detected. +8% price lift on Ergonomic Mouse will add{' '}
                <strong>₹42,000/mo</strong> net margin with &lt;2% conversion impact.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* OPERATOR MODE: System Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-indigo-400" />
                  Worker Mesh
                </span>
                <span className="text-indigo-400 font-bold">8 Agents</span>
              </div>
              <div className="text-lg font-bold text-foreground">Active Mesh</div>
              <span className="text-[10px] text-emerald-500 block">100% thread uptime</span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <Zap className="h-3 w-3 text-emerald-400" />
                  Dispatch Latency
                </span>
                <span className="text-emerald-500 font-bold">Sub-Second</span>
              </div>
              <div className="text-lg font-bold text-foreground">14ms Avg</div>
              <span className="text-[10px] text-emerald-500 block">Zero bottlenecks</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  Queue Depth
                </span>
                <span className="text-emerald-500 font-bold">Healthy</span>
              </div>
              <div className="text-lg font-bold text-foreground">0 Pending</div>
              <span className="text-[10px] text-muted-foreground block">142 events / min</span>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-card space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground uppercase flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-indigo-400" />
                  RLS Guardrails
                </span>
                <span className="text-indigo-400 font-bold">Enforced</span>
              </div>
              <div className="text-lg font-bold text-foreground">Multi-Tenant</div>
              <span className="text-[10px] text-indigo-400 block">0 Policy Violations</span>
            </div>
          </div>

          {/* Operator Live Event Stream */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              <Activity className="h-3 w-3 animate-pulse" />
              Live Agent Event Stream
            </div>
            <div className="space-y-1.5">
              {[
                {
                  agent: 'Atlas',
                  event: 'PO-8821 submitted → Apex Logistics webhook ACK received',
                  time: '14ms',
                  color: 'text-emerald-400'
                },
                {
                  agent: 'Sentinel',
                  event: 'Fraud scan complete: 41/41 orders processed, 1 flagged',
                  time: '8ms',
                  color: 'text-red-400'
                },
                {
                  agent: 'Pulse',
                  event: 'Razorpay→Cashfree failover route healthy, latency 12ms',
                  time: '12ms',
                  color: 'text-blue-400'
                },
                {
                  agent: 'Vega',
                  event: 'Price elasticity model retrained on 10K synthetic scenarios',
                  time: '340ms',
                  color: 'text-purple-400'
                },
                {
                  agent: 'Cortex',
                  event: 'Consensus lock acquired — Atlas+Vega conflict resolved',
                  time: '6ms',
                  color: 'text-indigo-400'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-background/70 border border-border/50 text-[11px] font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`}
                    />
                    <span className={`font-bold ${item.color}`}>[{item.agent}]</span>
                    <span className="text-foreground">{item.event}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CEO Executive Summary & Guidance */}
      <div className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            {mode === 'EXECUTIVE'
              ? 'Executive Synthesis & Strategic Directives'
              : 'Operator Telemetry & Event Mesh Execution'}
          </span>
          <Badge variant="secondary" className="text-[10px] font-mono">
            Updated 1 min ago
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {mode === 'EXECUTIVE'
            ? 'Your business is performing in the top 5th percentile of consumer hardware brands on checkout velocity. Customer acquisition costs (CAC) decreased 9% with WhatsApp VIP engagement. To protect the ₹16.4L weekly GMV target, execute the 120-unit Wireless Mouse replenishment and apply the +8% price lift on high-demand accessories.'
            : 'All 8 autonomous agent workers are actively synchronized via Redis pub/sub. Ingress fraud monitoring intercepted 2 high-risk orders with zero checkout friction. Stock reservation locks are atomically verified with zero race conditions across 42 active catalog SKUs.'}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {mode === 'EXECUTIVE' ? (
            <>
              <Button
                size="sm"
                onClick={() => router.push('/scenario-lab')}
                className="h-8 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
              >
                <span>Run Digital CEO Scenario</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/reports')}
                className="h-8 text-xs gap-1.5"
              >
                <span>Generate Full Board Report</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => router.push('/ai-workforce')}
                className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <span>Inspect AI Workforce Mesh</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/audit-log')}
                className="h-8 text-xs gap-1.5"
              >
                <span>View System Audit Ledger</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
