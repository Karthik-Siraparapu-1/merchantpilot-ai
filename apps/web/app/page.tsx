'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Mic,
  Shield,
  Zap,
  TrendingUp,
  Cpu,
  BarChart3,
  Sliders,
  CheckCircle2,
  Play,
  Lock,
  Boxes,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/auth-context';
import { ROICalculator } from '@/components/marketing/roi-calculator';
import { AnimatedConnectors } from '@/components/marketing/animated-connectors';
import { AIArchitectureDiagram } from '@/components/marketing/ai-architecture-diagram';

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Demo Query State
  const [demoQuery, setDemoQuery] = useState('Why did revenue fall yesterday?');
  const [demoResponse, setDemoResponse] = useState({
    title: 'Revenue Drop Analysis',
    badge: 'Finance & Inventory Agents',
    summary:
      'Yesterday revenue fell 8.4% primarily due to stockouts in High-Margin Laptop Stands (SKU-LST-09) during peak 2 PM - 6 PM traffic, causing ₹34,200 in uncaptured orders.',
    confidence: 96,
    recommendation:
      'Auto-restock 80 units & dynamically raise price by +4.5% on remaining inventory.',
    actionLabel: 'Execute Restock Order'
  });

  const demoPresets = [
    {
      q: 'Why did revenue fall yesterday?',
      title: 'Revenue Drop Analysis',
      badge: 'Finance & Inventory Agents',
      summary:
        'Yesterday revenue fell 8.4% primarily due to stockouts in High-Margin Laptop Stands (SKU-LST-09) during peak 2 PM - 6 PM traffic, causing ₹34,200 in uncaptured orders.',
      confidence: 96,
      recommendation:
        'Auto-restock 80 units & dynamically raise price by +4.5% on remaining inventory.',
      actionLabel: 'Execute Restock Order'
    },
    {
      q: 'Predict Diwali sales spike',
      title: 'Demand Spike Forecasting',
      badge: 'Predictive Demand Engine',
      summary:
        'Projecting +142% order velocity starting Oct 18th. Expected gross revenue ₹18.4 Lakhs with 89% probability. Critical risk: Wireless Earbuds will run out in 6 days.',
      confidence: 93,
      recommendation:
        'Pre-order 250 units before Oct 12 to capitalize on supplier volume discount of 12%.',
      actionLabel: 'Issue Supplier PO'
    },
    {
      q: 'Simulate +8% price increase',
      title: 'Business Digital Twin Simulation',
      badge: 'Pricing Elasticity Agent',
      summary:
        'Demand elasticity is -0.32 (inelastic). Increasing prices by +8% results in only -2.1% order dip while net profit margin jumps from 34.2% to 41.8% (+₹68,000/mo).',
      confidence: 98,
      recommendation: 'Apply dynamic price tag to top 15 non-price-sensitive catalog items.',
      actionLabel: 'Apply AI Pricing'
    },
    {
      q: 'Show high-risk fraud orders',
      title: 'Fraud & Payment Intelligence',
      badge: 'Fraud Detection Agent',
      summary:
        'Detected 2 high-risk orders totaling ₹46,800. Flags triggered: Data center VPN IP + billing country mismatch + 4 rapid payment retries within 90 seconds.',
      confidence: 99,
      recommendation: 'Placed automated payment verification hold to prevent chargeback fees.',
      actionLabel: 'Review Flagged Orders'
    }
  ];

  // Interactive Slider for Digital Twin Demo
  const [sliderPrice, setSliderPrice] = useState(10);
  const calculatedMargin = (32 + sliderPrice * 0.75).toFixed(1);
  const calculatedRevenue = Math.round(184000 * (1 + sliderPrice * 0.08 - sliderPrice * 0.02));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute top-[800px] -left-40 h-[450px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[1400px] -right-40 h-[450px] w-[600px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white">
                MerchantPilot AI
              </span>
              <span className="text-[10px] font-mono text-indigo-400 -mt-1">
                Commerce Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <Link
              href="/ai-features"
              className="text-indigo-400 hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              AI Features{' '}
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 py-0.2 rounded font-mono">
                NEW
              </span>
            </Link>
            <a href="#copilot" className="hover:text-white transition-colors">
              AI Copilot
            </a>
            <a href="#voice" className="hover:text-white transition-colors">
              Voice AI
            </a>
            <a href="#twin" className="hover:text-white transition-colors">
              Digital Twin
            </a>
            <a href="#agents" className="hover:text-white transition-colors">
              8 Agents
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20"
                >
                  Command Center <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-300 hover:text-white hover:bg-slate-900"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20"
                  >
                    Launch Workspace <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-3">
            <Link
              href="/ai-features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-indigo-400 py-1"
            >
              AI Features (New)
            </Link>
            <a
              href="#copilot"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 py-1"
            >
              AI Copilot
            </a>
            <a
              href="#voice"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 py-1"
            >
              Voice AI
            </a>
            <a
              href="#twin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 py-1"
            >
              Digital Twin
            </a>
            <a
              href="#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 py-1"
            >
              8 Agents
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 py-1"
            >
              Pricing
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-xs">
                  Launch Workspace
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative z-10 pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Next-Generation Autonomous Commerce Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          The AI Operating System for{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
            Modern Commerce
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Not another passive dashboard. MerchantPilot is an intelligent business partner powered by
          an 8-agent network, conversational voice AI, dynamic pricing, and real-time scenario
          simulation.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-7 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30"
            >
              Launch Workspace (14-Day Free Trial) <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-7 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm"
            >
              <Play className="mr-2 h-4 w-4 text-indigo-400 fill-indigo-400" /> Explore Live Command
              Center
            </Button>
          </Link>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹48.2M+</div>
            <div className="text-xs text-slate-400 mt-0.5">Live GMV Processed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              99.98%
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Payment Gateway Success</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
              0 Incidents
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Stockouts in Peak Sales</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">
              8 Agents
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Autonomous Operations</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE AI COPILOT PREVIEW */}
      <section id="copilot" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-2">
            Interactive AI Copilot
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ask Questions. Receive Proof. Execute Actions.
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Click any question below to see how MerchantPilot AI synthesizes live telemetry into
            immediate operational decisions.
          </p>
        </div>

        {/* Interactive Query Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Query Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {demoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoQuery(preset.q);
                    setDemoResponse(preset);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    demoQuery === preset.q
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-medium'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  &ldquo;{preset.q}&rdquo;
                </button>
              ))}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={demoQuery}
                readOnly
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white font-medium pr-24 focus:outline-none"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <span className="hidden sm:inline text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Enter ↵
                </span>
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Synthesized Response Area */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  AI
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{demoResponse.title}</h3>
                  <span className="text-xs text-indigo-400 font-mono">{demoResponse.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Confidence</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {demoResponse.confidence}%
                </Badge>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-mono">
              {demoResponse.summary}
            </p>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400">
                  Recommended Autonomous Action
                </div>
                <div className="text-xs text-slate-200 mt-0.5">{demoResponse.recommendation}</div>
              </div>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-xs shrink-0 text-white font-medium"
                >
                  {demoResponse.actionLabel} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE AI ARCHITECTURE DIAGRAM */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AIArchitectureDiagram />
      </section>

      {/* SECTION: ANIMATED INTEGRATION CONNECTORS */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedConnectors />
      </section>

      {/* SECTION 3: VOICE AI EXPERIENCE */}
      <section id="voice" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="border-violet-500/30 text-violet-400 mb-3">
              Conversational Voice Intelligence
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Talk to Your Business Like an Executive Partner
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              No clicking through nested menus. Click the microphone or speak your command.
              MerchantPilot AI listens, navigates across your catalog, verifies formulas with
              explainable proofs, and executes orders via voice confirmation.
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero-latency browser Web Speech synthesis with natural inflection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hands-free warehouse inventory adjustments and stock audits</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant voice-to-action confirmation before price changes</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-10 px-5">
                  <Mic className="mr-2 h-4 w-4" /> Try Voice in Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Voice Waveform Mockup */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center animate-pulse">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Voice Command Session</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    LISTENING &middot; DUAL-CHANNEL
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] border-slate-700 text-slate-400 font-mono"
              >
                16kHz PCM
              </Badge>
            </div>

            {/* Waveform graphic */}
            <div className="flex items-center justify-center gap-1.5 h-16 py-2">
              {[40, 65, 30, 85, 95, 45, 70, 90, 60, 80, 50, 95, 75, 40, 60, 30, 80, 95, 55, 35].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-gradient-to-t from-indigo-500 to-violet-400 rounded-full animate-pulse"
                  />
                )
              )}
            </div>

            {/* Simulated transcript */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <span className="font-semibold text-indigo-400">You:</span> &ldquo;Increase laptop
                stand prices by 6% and explain why.&rdquo;
              </div>
              <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-800/40 text-slate-200">
                <span className="font-semibold text-violet-400">MerchantPilot AI:</span>{' '}
                &ldquo;Updated 3 laptop stand SKUs to ₹1,499. Competitor stockouts surged local
                demand by 28%. Projected margin expansion is +₹14,200 this week.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BUSINESS DIGITAL TWIN (SCENARIO SIMULATOR) */}
      <section id="twin" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 backdrop-blur-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-2">
              Business Digital Twin
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Simulate the Future Before Spending a Rupee
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Adjust price elasticity in real-time. MerchantPilot recalculates customer retention,
              order volume, and net profit before you commit changes to your storefront.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Interactive Slider */}
            <div className="space-y-6 bg-slate-950/70 p-6 rounded-2xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Catalog Price Adjustment</span>
                  <span className="font-mono text-indigo-400">+{sliderPrice}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={sliderPrice}
                  onChange={(e) => setSliderPrice(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>Baseline (0%)</span>
                  <span>Max Stretch (+25%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">
                    Simulated Net Margin
                  </div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                    {calculatedMargin}%
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-0.5">
                    ↑ +{(Number(calculatedMargin) - 32).toFixed(1)}% lift
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">
                    Monthly Revenue Impact
                  </div>
                  <div className="text-xl font-bold text-white font-mono mt-0.5">
                    ₹{calculatedRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-indigo-400 mt-0.5">Optimized for profit</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
                <span className="text-indigo-400 font-semibold">Digital Twin Engine:</span> Demand
                elasticity remains in the safe zone up to +12% before churn accelerates. Recommended
                action: increment prices by +8% this weekend.
              </div>
            </div>

            {/* Comparative Visual Matrix */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sliders className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Ad Spend Multiplier</div>
                    <div className="text-[11px] text-slate-400">
                      Test ROAS across Meta & Google Ads
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-slate-700 text-xs font-mono text-slate-300"
                >
                  2.4x Target
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Boxes className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Supply Chain Delay Stress Test
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Simulate 7-day port or customs hold
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-xs font-mono text-amber-400"
                >
                  Zero Stockout Buffer
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Festival Campaign Simulation
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Diwali / Black Friday order spikes
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-xs font-mono text-emerald-400"
                >
                  +142% Velocity
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE 8-AGENT AUTONOMOUS NETWORK */}
      <section id="agents" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-2">
            Multi-Agent Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            An Entire Executive Team Running 24/7
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Eight specialized autonomous agents collaborate continuously, monitoring every
            transaction, inventory movement, and supplier timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              role: 'CEO Executive Agent',
              task: 'Morning briefings & cross-domain health telemetry (94/100)',
              icon: Cpu,
              color: 'text-indigo-400',
              badge: 'Executive'
            },
            {
              role: 'Inventory Agent',
              task: 'Predictive stockout alerts & autonomous supplier PO drafting',
              icon: Boxes,
              color: 'text-blue-400',
              badge: 'Supply Chain'
            },
            {
              role: 'Dynamic Pricing Agent',
              task: 'Demand-elasticity adjustments & competitor stockout surge pricing',
              icon: TrendingUp,
              color: 'text-emerald-400',
              badge: 'Revenue'
            },
            {
              role: 'Fraud Intelligence Agent',
              task: 'Unified risk scoring, VPN proxy detection & velocity hold logic',
              icon: Shield,
              color: 'text-red-400',
              badge: 'Security'
            },
            {
              role: 'Marketing AI Agent',
              task: 'WhatsApp, Instagram & SMS campaign generation with 1-click launch',
              icon: Sparkles,
              color: 'text-pink-400',
              badge: 'Growth'
            },
            {
              role: 'Finance & P&L Agent',
              task: 'Settlement velocity tracking & instant 1-click board reporting',
              icon: BarChart3,
              color: 'text-amber-400',
              badge: 'Treasury'
            },
            {
              role: 'Customer Intelligence Agent',
              task: 'LTV cohort analysis & high-value customer churn intervention',
              icon: Zap,
              color: 'text-purple-400',
              badge: 'Retention'
            },
            {
              role: 'Workflow Automation Agent',
              task: 'Event-driven triggers connecting inventory, orders, and suppliers',
              icon: Sliders,
              color: 'text-cyan-400',
              badge: 'Automation'
            }
          ].map((agent, i) => {
            const Icon = agent.icon;
            return (
              <Card
                key={i}
                className="border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl bg-slate-950 ${agent.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono border-slate-800 text-slate-400"
                    >
                      {agent.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.role}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{agent.task}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: ENTERPRISE SECURITY & DATA PRIVACY (FACTUAL) */}
      <section id="security" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 sm:p-12">
          <div className="max-w-2xl">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 mb-2">
              Enterprise Architecture
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Bank-Grade Tenant Isolation & Security
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Every merchant organization operates within an isolated cryptographic boundary with
              strict access control and real-time audit logging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <Lock className="h-5 w-5 text-indigo-400 mb-2" />
              <h3 className="text-xs font-semibold text-white">Multi-Tenant Isolation</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Strict database tenancy guarantees your catalog, orders, and customer lists are
                never accessible across organizations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <Shield className="h-5 w-5 text-emerald-400 mb-2" />
              <h3 className="text-xs font-semibold text-white">Role-Based Access (RBAC)</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Granular permissions for Owners, Administrators, Warehouse staff, and Accountants.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <Cpu className="h-5 w-5 text-violet-400 mb-2" />
              <h3 className="text-xs font-semibold text-white">Atomic Transaction Safety</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                PostgreSQL row-level locking ensures zero race conditions or overselling during
                flash-sale traffic spikes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <BarChart3 className="h-5 w-5 text-blue-400 mb-2" />
              <h3 className="text-xs font-semibold text-white">Immutable Audit Trail</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Every stock adjustment, price modification, and agent action is permanently logged
                with timestamp and user telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE ROI CALCULATOR */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ROICalculator />
      </section>

      {/* SECTION 7: PRICING TIERS */}
      <section id="pricing" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-2">
            Commercial Plans
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Transparent Pricing for Growing & Enterprise Brands
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Start with our 14-day full-access trial. Upgrade as your transaction volume expands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <Card className="border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">
                  For single-brand storefronts and early retailers.
                </p>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-slate-400"> / 14-day trial</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Up to 500 monthly orders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Core Inventory & Order
                  Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> AI Executive Morning
                  Briefing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Community support
                </li>
              </ul>
            </div>
            <Link href="/register" className="mt-8">
              <Button variant="outline" className="w-full text-xs border-slate-700">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Growth Plan (Featured) */}
          <Card className="border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 p-6 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Growth Commercial</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full autonomous operating system for scaling merchants.
                </p>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-extrabold text-white">₹4,999</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unlimited orders & catalog
                  SKUs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Full 8-Agent Autonomous
                  Network
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Conversational Voice AI
                  Assistant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Business Digital Twin
                  Simulator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Explainable AI (XAI) proofs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unified Multi-Gateway
                  Payment Intel
                </li>
              </ul>
            </div>
            <Link href="/register" className="mt-8">
              <Button className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30">
                Launch Growth Workspace
              </Button>
            </Link>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Custom multi-region infrastructure for retail enterprises.
                </p>
              </div>
              <div className="font-mono">
                <span className="text-3xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-slate-400"> / bespoke SLA</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dedicated VPC & multi-region
                  deployment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom ERP & SAP / Oracle
                  connectors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 99.99% Uptime guarantee with
                  SLA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dedicated Technical Account
                  Manager
                </li>
              </ul>
            </div>
            <Link href="/register" className="mt-8">
              <Button variant="outline" className="w-full text-xs border-slate-700">
                Contact Enterprise Sales
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* SECTION 8: ENTERPRISE TESTIMONIALS */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-2">
            Enterprise Proof
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Trusted by Modern Retail Operators
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            See how high-growth multichannel brands scale margins and protect operations with
            MerchantPilot AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "MerchantPilot's Dynamic Pricing agent lifted our gross margin by 6.2% in the first 30 days. The explainability drawers gave our executive team the exact mathematical backing we needed to trust AI execution.",
              author: 'Aditi Rao',
              role: 'VP of Growth',
              company: 'NexaRetail Global',
              metric: '+6.2% Gross Margin',
              initials: 'AR'
            },
            {
              quote:
                'The autonomous inventory forecasting prevented 4 major stockouts during our festive rush. What used to take two supply chain analysts 20 hours a week now executes in sub-second real-time.',
              author: 'Vikram Malhotra',
              role: 'Head of Operations',
              company: 'SilkRoute Commerce',
              metric: '0 Critical Stockouts',
              initials: 'VM'
            },
            {
              quote:
                'The conversational copilot and voice interface feel like having a seasoned commerce CTO and chief financial analyst in the room with you 24/7. It transformed our daily standups.',
              author: 'Pooja Sundaram',
              role: 'Founder & CEO',
              company: 'ArtisanHouse',
              metric: '14.2x ROI in 90 Days',
              initials: 'PS'
            }
          ].map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-200"
            >
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                >
                  {t.metric}
                </Badge>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-800/80 mt-6">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">
                    {t.role} &middot; {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-10">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 mb-2">
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does MerchantPilot AI differ from Shopify or traditional ERPs?',
              a: 'Traditional platforms are passive record-keeping systems where you must manually examine charts to spot issues. MerchantPilot is an active intelligence layer: it predicts demand spikes, detects fraud anomalies, simulates price elasticity, and drafts restock purchase orders autonomously.'
            },
            {
              q: 'How does Voice AI work inside the application?',
              a: 'MerchantPilot integrates the browser Web Speech API with low-latency LLM synthesis. You can speak commands like "Why did sales drop?" or "Restock Wireless Mouse" and receive spoken answers alongside synchronized UI navigation.'
            },
            {
              q: 'Can MerchantPilot automatically update product prices?',
              a: 'Yes. The Dynamic Pricing Engine suggests margin-optimized prices based on sales velocity and competitor inventory. You can execute price updates with a single click or configure automated rules within strict merchant-defined guardrails.'
            },
            {
              q: 'What payment gateways are supported?',
              a: 'MerchantPilot features an abstraction layer supporting multi-gateway payment intelligence across UPI, Cards, NetBanking, and Wallets (compatible with Stripe, Razorpay, PhonePe, Cashfree, and PayPal).'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-2"
            >
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" /> {item.q}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FINAL CTA & FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 p-8 sm:p-12 text-center mb-16 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Upgrade to Autonomous Commerce?
            </h2>
            <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
              Join leading modern retail merchants running on MerchantPilot AI. Deploy your isolated
              workspace in under 60 seconds.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-11 px-6 font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Launch Free Workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-300 text-xs h-11 px-6"
                >
                  Sign In to Existing Tenant
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-8 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold text-slate-300">MerchantPilot AI</span>
              <span>
                &copy; {new Date().getFullYear()} MerchantPilot AI Inc. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0 font-mono text-[11px]">
              <span>Multi-Tenant Isolation</span>
              <span>&middot;</span>
              <span>TLS 1.3 Encrypted</span>
              <span>&middot;</span>
              <span>Sub-50ms Multi-Agent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
