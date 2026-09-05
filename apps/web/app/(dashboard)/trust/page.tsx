'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Activity,
  Zap,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  AlertCircle
} from 'lucide-react';

export default function TrustCenterPage() {
  const metrics = [
    {
      label: "Today's AI Actions",
      value: '62',
      sub: '+12% vs yesterday',
      color: 'text-indigo-400'
    },
    {
      label: 'Executed Successfully',
      value: '59',
      sub: '95.1% auto-resolved',
      color: 'text-emerald-400'
    },
    {
      label: 'Merchant Overrides',
      value: '2',
      sub: '3.2% human adjustment',
      color: 'text-amber-400'
    },
    { label: 'Actions Rolled Back', value: '1', sub: '1.6% undo rate', color: 'text-rose-400' },
    {
      label: 'Model Prediction Accuracy',
      value: '98.4%',
      sub: '+2.1% past 30d',
      color: 'text-emerald-400'
    },
    {
      label: 'Average Decision Latency',
      value: '420 ms',
      sub: 'Sub-second execution',
      color: 'text-purple-400'
    }
  ];

  const recentAudits = [
    {
      time: '11:45 AM',
      action: 'Dynamic Price Adjustment: Ergonomic Mouse to ₹1,099',
      agent: 'Vega',
      status: 'EXECUTED',
      confidence: '98%'
    },
    {
      time: '11:42 AM',
      action: 'Auto-Draft Purchase Order #PO-8812 for 120 units',
      agent: 'Atlas',
      status: 'EXECUTED',
      confidence: '96%'
    },
    {
      time: '11:15 AM',
      action: 'Order Hold: High Fraud Risk #ORD-3847',
      agent: 'Sentinel',
      status: 'EXECUTED',
      confidence: '99%'
    },
    {
      time: '10:30 AM',
      action: 'WhatsApp Retention Blast to 280 VIP buyers',
      agent: 'Nova',
      status: 'OVERRIDDEN',
      confidence: '91%'
    },
    {
      time: '09:12 AM',
      action: 'Checkout Gateway Failover: Razorpay -> Cashfree',
      agent: 'Pulse',
      status: 'ROLLED_BACK',
      confidence: '94%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              AI Trust & Transparency Center
              <Badge className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                VERIFIED SAFE
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Comprehensive telemetry, decision accuracy metrics, audit logs, and safety guardrails
            </p>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="p-4 bg-card/90 backdrop-blur-xl border-border/80">
            <div className="text-[11px] font-mono uppercase text-muted-foreground">{m.label}</div>
            <div className={`text-2xl font-bold font-mono mt-1 ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{m.sub}</div>
          </Card>
        ))}
      </div>

      {/* Real-time Audit Stream */}
      <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <CardTitle className="text-base font-bold">Real-time Trust & Audit Trail</CardTitle>
            <CardDescription className="text-xs">
              Live execution log with model confidence scores and verification status
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-emerald-500/30 text-emerald-400"
          >
            ● Live Stream
          </Badge>
        </div>

        <div className="space-y-3">
          {recentAudits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-muted-foreground text-[10px]">{item.time}</span>
                <span className="font-semibold text-foreground">{item.action}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <Badge variant="outline" className="text-[9px]">
                  {item.agent}
                </Badge>
                <span className="text-emerald-400 font-bold">{item.confidence} Confidence</span>
                <Badge
                  className={`text-[9px] ${
                    item.status === 'EXECUTED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : item.status === 'OVERRIDDEN'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
