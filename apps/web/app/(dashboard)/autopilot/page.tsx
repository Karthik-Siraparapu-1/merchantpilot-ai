'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sliders, ShieldCheck, Zap, AlertTriangle, Lock } from 'lucide-react';

interface DomainGovernance {
  id: string;
  name: string;
  department: string;
  mode: 'MANUAL' | 'SEMI_AUTO' | 'FULLY_AUTONOMOUS';
  agent: string;
  description: string;
  threshold: string;
}

const INITIAL_DOMAINS: DomainGovernance[] = [
  {
    id: 'gov-1',
    name: 'Inventory Restocking & Purchase Orders',
    department: 'Inventory Intelligence',
    mode: 'FULLY_AUTONOMOUS',
    agent: 'Atlas',
    description: 'Auto-draft and submit POs for stock below safety thresholds under ₹1,00,000.',
    threshold: '< ₹1,00,000 auto-approved'
  },
  {
    id: 'gov-2',
    name: 'Dynamic Product Pricing Elasticity',
    department: 'Pricing Intelligence',
    mode: 'SEMI_AUTO',
    agent: 'Vega',
    description: 'Propose price shifts within ±15% range. Requires 1-click executive approval.',
    threshold: '±15% bounds require approval'
  },
  {
    id: 'gov-3',
    name: 'Fraud Mitigation & Order Holds',
    department: 'Fraud Sentinel',
    mode: 'FULLY_AUTONOMOUS',
    agent: 'Sentinel',
    description: 'Automatically place holds on high-risk orders with risk scores > 85/100.',
    threshold: 'Risk Score > 85 auto-held'
  },
  {
    id: 'gov-4',
    name: 'Checkout Payment Gateway Failover',
    department: 'Payment Intelligence',
    mode: 'FULLY_AUTONOMOUS',
    agent: 'Pulse',
    description: 'Instant failover routing between Razorpay, Cashfree, and PayU upon error spikes.',
    threshold: '> 5% error rate triggers failover'
  },
  {
    id: 'gov-5',
    name: 'VIP Repurchase WhatsApp Campaigns',
    department: 'Marketing AI',
    mode: 'SEMI_AUTO',
    agent: 'Nova',
    description: 'Generates promotional discount blasts. Requires merchant schedule confirmation.',
    threshold: 'Merchant sign-off required'
  },
  {
    id: 'gov-6',
    name: 'Churn Mitigation Offers',
    department: 'Customer Retention',
    mode: 'MANUAL',
    agent: 'Orion',
    description: 'Identifies churning high-LTV customers and drafts tailored retention perks.',
    threshold: 'Manual dispatch only'
  }
];

export default function AutoPilotCenterPage() {
  const [domains, setDomains] = useState<DomainGovernance[]>(INITIAL_DOMAINS);

  const handleModeChange = (id: string, mode: DomainGovernance['mode']) => {
    setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, mode } : d)));
  };

  const getModeBadge = (mode: DomainGovernance['mode']) => {
    switch (mode) {
      case 'FULLY_AUTONOMOUS':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] font-mono">
            FULLY AUTONOMOUS
          </Badge>
        );
      case 'SEMI_AUTO':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px] font-mono">
            SEMI-AUTO (APPROVAL)
          </Badge>
        );
      case 'MANUAL':
        return (
          <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30 text-[9px] font-mono">
            MANUAL CONTROL
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              AI AutoPilot Governance Center
              <Badge className="text-[9px] font-mono bg-purple-500/10 text-purple-400 border-purple-500/30">
                Enterprise Guardrails
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure autonomy levels, safety thresholds, and human-in-the-loop approval
              requirements per domain
            </p>
          </div>
        </div>
      </div>

      {/* Governance Level Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80 text-center">
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {domains.filter((d) => d.mode === 'FULLY_AUTONOMOUS').length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Fully Autonomous Domains
          </div>
        </Card>

        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80 text-center">
          <div className="text-2xl font-bold font-mono text-amber-400">
            {domains.filter((d) => d.mode === 'SEMI_AUTO').length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            Semi-Auto (1-Click Approval)
          </div>
        </Card>

        <Card className="p-4 bg-card/90 backdrop-blur-xl border-border/80 text-center">
          <div className="text-2xl font-bold font-mono text-slate-400">
            {domains.filter((d) => d.mode === 'MANUAL').length}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">Manual Oversight</div>
        </Card>
      </div>

      {/* Domain Governance List */}
      <div className="space-y-4">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className="p-5 border-border/80 bg-card/90 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{domain.name}</h3>
                  {getModeBadge(domain.mode)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{domain.description}</p>
              </div>

              <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/60 shrink-0">
                <button
                  onClick={() => handleModeChange(domain.id, 'MANUAL')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                    domain.mode === 'MANUAL'
                      ? 'bg-slate-700 text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => handleModeChange(domain.id, 'SEMI_AUTO')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                    domain.mode === 'SEMI_AUTO'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Semi-Auto
                </button>
                <button
                  onClick={() => handleModeChange(domain.id, 'FULLY_AUTONOMOUS')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md transition-all ${
                    domain.mode === 'FULLY_AUTONOMOUS'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Full Auto
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>
                Assigned Agent: <strong className="text-foreground">{domain.agent}</strong>
              </span>
              <span>
                Guardrail: <strong className="text-primary">{domain.threshold}</strong>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
