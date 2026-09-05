'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Mic, ArrowUpRight, X, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VoiceAIModal } from '@/components/ai/voice-ai-modal';

export function FloatingAIOrb() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // If on public landing or auth screens, don't show the dashboard floating orb
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  // Get current page context & smart recommendations
  const getPageContext = () => {
    if (pathname.includes('/products')) {
      return {
        title: 'Catalog Optimization',
        description: 'Competitor stockout detected on 1 SKU. +8% margin lift available.',
        actionLabel: 'Apply +8% Price Lift',
        targetRoute: '/products'
      };
    }
    if (pathname.includes('/inventory')) {
      return {
        title: 'Warehouse Telemetry',
        description: '2 SKUs require restock replenishment within 48 hours.',
        actionLabel: 'Auto-Draft Restock POs',
        targetRoute: '/inventory'
      };
    }
    if (pathname.includes('/orders')) {
      return {
        title: 'Payment & Fraud Shield',
        description: 'Order ORD-9921 flagged with 92% risk score (proxy VPN).',
        actionLabel: 'Inspect Fraud Order',
        targetRoute: '/orders'
      };
    }
    if (pathname.includes('/analytics')) {
      return {
        title: 'Executive Intelligence',
        description: "Today's GMV is tracking +14% above yesterday. AOV expanded ₹230.",
        actionLabel: 'Deep Dive Analytics',
        targetRoute: '/analytics'
      };
    }
    if (pathname.includes('/predictions')) {
      return {
        title: 'Predictive Forecasting',
        description: '30-day revenue projection: ₹42.5L with 94% model confidence.',
        actionLabel: 'View Stockout Risks',
        targetRoute: '/predictions'
      };
    }
    if (pathname.includes('/marketing')) {
      return {
        title: 'AI Marketing Engine',
        description: 'Friday flash campaign drafted. Predicted 3.2x ROI on WhatsApp.',
        actionLabel: 'Review Campaign',
        targetRoute: '/marketing'
      };
    }
    if (pathname.includes('/copilot')) {
      return {
        title: 'AI Copilot Active',
        description: 'Multi-agent reasoning ready. Ask anything about your commerce data.',
        actionLabel: 'Run Scenario',
        targetRoute: '/scenario-lab'
      };
    }
    if (pathname.includes('/settings')) {
      return {
        title: 'System Configuration',
        description: 'AI Memory Preferences are synced. 6 active learning policies.',
        actionLabel: 'Tune AI Memory',
        targetRoute: '/settings'
      };
    }
    return {
      title: 'Command Center',
      description: "Yesterday's revenue expanded +14%. Daily operations are healthy.",
      actionLabel: 'Run Scenario Simulation',
      targetRoute: '/scenario-lab'
    };
  };

  const context = getPageContext();

  return (
    <>
      <VoiceAIModal open={isVoiceOpen} onOpenChange={setIsVoiceOpen} />

      {/* Floating Widget Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Expanded Panel */}
        {isOpen && (
          <div className="mb-3 w-80 sm:w-96 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-primary/5 to-blue-500/10 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">MerchantPilot AI Copilot</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Autonomous Context Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Page Context Card */}
            <div className="p-4 space-y-3">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">
                    {context.title}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 text-emerald-500 border-emerald-500/30"
                  >
                    Live
                  </Badge>
                </div>
                <p className="text-xs text-foreground font-medium">{context.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    router.push(context.targetRoute);
                    setIsOpen(false);
                  }}
                  className="w-full text-xs h-7 gap-1 mt-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <span>{context.actionLabel}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>

              {/* Quick Assistant Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsVoiceOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted text-left transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Voice AI</span>
                    <span className="text-[10px] text-muted-foreground">Talk naturally</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    router.push('/copilot');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted text-left transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      Full Copilot
                    </span>
                    <span className="text-[10px] text-muted-foreground">Ask anything</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer Navigation link */}
            <div className="p-3 bg-muted/40 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Multi-Agent Continuous Learning
              </span>
              <button
                onClick={() => {
                  router.push('/scenario-lab');
                  setIsOpen(false);
                }}
                className="text-primary font-medium hover:underline flex items-center"
              >
                Scenario Lab <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Pulsing Trigger Orb */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 items-center gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Animated Ambient Glow */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />
          <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
          </span>
          <span className="relative z-10 text-xs font-bold tracking-tight pr-1">
            MerchantPilot AI
          </span>
        </button>
      </div>
    </>
  );
}
