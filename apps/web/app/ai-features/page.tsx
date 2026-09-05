'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  Cpu,
  Mic,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  FileText,
  CheckCircle2,
  Layers,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AI_PILLARS = [
  {
    id: 'planner',
    title: 'Autonomous Goal Planner',
    icon: Brain,
    category: 'Architecture',
    badge: 'Multi-Agent',
    tagline: 'Decomposes complex commercial objectives into executable DAG tasks.',
    description:
      'Rather than executing simple reactive prompts, the Planner formulates a multi-agent Directed Acyclic Graph (DAG). When you ask "Prepare for Diwali surge", the planner simultaneously dispatches warehouse audits, computes elasticity thresholds, and drafts VIP outreach sequences.',
    metric: '99.2% Plan Feasibility',
    example:
      'Objective: "Mitigate 48-hour stockout" → Inventory Agent drafts PO → Finance Agent checks cashflow → CEO Agent signs off.'
  },
  {
    id: 'memory',
    title: 'Merchant Behavioral Memory',
    icon: Layers,
    category: 'Learning',
    badge: 'Continuous Sync',
    tagline: 'A persistent memory store that adapts to your strategic preferences over time.',
    description:
      'MerchantPilot AI watches your decisions. If you consistently reject discount campaigns and favor gross margin over unit volume, the memory engine encodes this heuristic into all future multi-agent consensus deliberations.',
    metric: '6 Active Learned Policies',
    example:
      'Learned: "prefers higher margins", "usually approves restocking", "avoids discount campaigns", "prefers UPI".'
  },
  {
    id: 'reasoning',
    title: 'Multi-Agent Consensus Engine',
    icon: Network,
    category: 'Agentic',
    badge: 'DeepSeek R1 / Gemini',
    tagline: '8 specialized domain agents debate and validate decisions before execution.',
    description:
      'Inventory, Pricing, Fraud, Payment, and Customer agents analyze raw telemetry in parallel. When a pricing change is suggested, the Finance agent stress-tests the margin impact while the Customer agent checks retention risk.',
    metric: '1.4s Consensus Latency',
    example:
      'Inventory Agent ✓ • Revenue Agent ✓ • Customer Agent ✓ • Pricing Agent ✓ • Payment Agent ✓'
  },
  {
    id: 'voice',
    title: 'Conversational Voice AI',
    icon: Mic,
    category: 'Interface',
    badge: 'Hands-Free Loop',
    tagline: 'Continuous two-way speech dialogue with spoken tool calling.',
    description:
      'A true conversational operating system. Speak naturally hands-free: "Increase price of Wireless Mouse". The AI responds with voice: "Competitor stockout detected. Would you like me to raise price to ₹2,699?" Say "Yes", and the tool executes in live production.',
    metric: 'Full Audio Waveform & Speech-to-Action',
    example:
      '"Why are sales low today?" → Spoken AI analysis + immediate PO drafting on voice confirmation.'
  },
  {
    id: 'forecasting',
    title: '3-Band Predictive Forecasting',
    icon: TrendingUp,
    category: 'Intelligence',
    badge: 'Bayesian Model',
    tagline:
      'Multi-scenario demand projection with Best, Expected, and Worst case confidence bands.',
    description:
      'Moving beyond single-line projections, the 3-Band Forecaster computes probabilistic revenue trajectories based on seasonality, day-of-week checkout velocity, and supplier transit lead times.',
    metric: '96% Model Accuracy',
    example: 'Best Case (+32%), Expected Base (+18%), Worst Case (-14%) confidence ribbons.'
  },
  {
    id: 'fraud',
    title: 'Fraud & Payment Risk Shield',
    icon: ShieldAlert,
    category: 'Security',
    badge: '0-Chargeback Guarantee',
    tagline: 'Real-time proxy VPN, device fingerprinting, and velocity anomaly detection.',
    description:
      'Every checkout session is scored across 14 biometric and network vectors. Datacenter IPs, rapid-fire card attempts, and address mismatches trigger automated holds with human-in-the-loop review.',
    metric: '92/100 Risk Anomaly Triggers',
    example: 'Order #ORD-9921 automatically intercepted: Datacenter IP + 1,200km billing mismatch.'
  },
  {
    id: 'pricing',
    title: 'Dynamic Elasticity Pricing',
    icon: Cpu,
    category: 'Optimization',
    badge: 'Real-Time Scraper',
    tagline: 'Captures margin expansion when competitor stockouts are detected.',
    description:
      'Continuous microeconomic monitoring measures real-time demand elasticity. If competitor inventory depletes on external marketplaces, prices adjust dynamically (+8%) with less than 2% impact on order volume.',
    metric: '+₹42,000/mo Margin Lift',
    example: 'Ergonomic Mouse adjusted from ₹999 to ₹1,099 with 93% model confidence.'
  },
  {
    id: 'reports',
    title: 'Executive Meeting & Reporting',
    icon: FileText,
    category: 'Executive',
    badge: 'Audio Slide Deck',
    tagline: 'One-click synthesized briefings for CEOs, investors, and operations leads.',
    description:
      'AI Meeting Mode generates slide decks with synchronized voice narration and instant PDF exports. One click prepares the entire weekly business review with verified ground truth data.',
    metric: 'Audit-Ready Reports in 1 Click',
    example:
      'Slide 1: GMV Trajectory → Slide 2: Supply Chain → Slide 3: Risk → Slide 4: Strategic Directives.'
  }
];

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState<string>('planner');

  const currentPillar = AI_PILLARS.find((p) => p.id === activeTab) || AI_PILLARS[0]!;
  const Icon = currentPillar.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute top-[600px] -right-40 h-[450px] w-[600px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">MerchantPilot AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-slate-300 hover:text-white"
            >
              <Link href="/dashboard">Launch Dashboard</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 px-6 text-center max-w-4xl mx-auto space-y-4">
        <Badge
          variant="outline"
          className="text-xs px-3 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1.5 font-mono"
        >
          <Sparkles className="h-3.5 w-3.5" />
          The AI Commerce Operating System
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Autonomous Architecture & Multi-Agent Capabilities
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore the 8 interconnected neural engines powering MerchantPilot AI — from continuous
          memory learning to hands-free voice tool calling.
        </p>
      </section>

      {/* Interactive Pillar Explorer */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {AI_PILLARS.map((pillar) => {
            const PIcon = pillar.icon;
            const isSelected = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <PIcon className="h-3.5 w-3.5" />
                <span>{pillar.title}</span>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Card */}
        <Card className="p-8 border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{currentPillar.title}</h2>
                  <Badge
                    variant="secondary"
                    className="text-xs font-mono bg-slate-800 text-indigo-400 border-slate-700"
                  >
                    {currentPillar.badge}
                  </Badge>
                </div>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">
                  {currentPillar.tagline}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Verified Telemetry</span>
              <span className="text-sm font-bold text-emerald-400">{currentPillar.metric}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>{currentPillar.description}</p>
          </div>

          {/* Practical Execution Example */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Live Production Execution Pattern
            </span>
            <p className="text-xs text-slate-200 font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800/60">
              {currentPillar.example}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Ready to see this engine in live multi-tenant production?
            </span>
            <Button
              asChild
              size="sm"
              className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              <Link href="/dashboard">
                <span>Explore in AI Command Center</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
