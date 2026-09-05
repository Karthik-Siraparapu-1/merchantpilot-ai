'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Download, Check, Sparkles, Star, ShieldCheck } from 'lucide-react';

interface MarketplaceAgent {
  id: string;
  name: string;
  category: string;
  author: string;
  rating: number;
  reviews: number;
  description: string;
  installed: boolean;
  version: string;
  iconBg: string;
}

const MARKETPLACE_AGENTS: MarketplaceAgent[] = [
  {
    id: 'agent-1',
    name: 'Atlas — Inventory & PO Specialist',
    category: 'Supply Chain',
    author: 'MerchantPilot Core',
    rating: 4.9,
    reviews: 128,
    description:
      'Autonomous safety stock management, supplier PO generation, and velocity forecasting.',
    installed: true,
    version: 'v2.4.0',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  },
  {
    id: 'agent-2',
    name: 'Vega — Dynamic Price Elasticity Engine',
    category: 'Revenue Optimization',
    author: 'MerchantPilot Core',
    rating: 4.95,
    reviews: 210,
    description:
      'Monte Carlo elasticity simulations, competitor web scrapers, and margin lift automation.',
    installed: true,
    version: 'v3.1.2',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  {
    id: 'agent-3',
    name: 'Sentinel — Ingress Fraud Interceptor',
    category: 'Risk & Fraud',
    author: 'MerchantPilot Core',
    rating: 4.88,
    reviews: 95,
    description:
      'Real-time order scoring, MaxMind IP/VPN velocity checks, and automated order holding.',
    installed: true,
    version: 'v2.0.1',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  },
  {
    id: 'agent-4',
    name: 'TaxPilot — GST & International Compliance',
    category: 'Finance & Tax',
    author: 'FinTech Labs',
    rating: 4.85,
    reviews: 64,
    description:
      'Automated Indian GST e-invoicing, HSN code classification, and monthly reconciliation.',
    installed: false,
    version: 'v1.4.0',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  },
  {
    id: 'agent-5',
    name: 'LogiBot — Multi-Courier Dispatch AI',
    category: 'Logistics',
    author: 'ExpressShip Systems',
    rating: 4.79,
    reviews: 42,
    description:
      'Dynamically routes orders across Delhivery, BlueDart, and Xpressbees for lowest SLA & cost.',
    installed: false,
    version: 'v1.1.0',
    iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30'
  },
  {
    id: 'agent-6',
    name: 'ReviewPulse — Sentiment & Social Monitor',
    category: 'Customer Experience',
    author: 'SocialPulse Inc.',
    rating: 4.91,
    reviews: 87,
    description:
      'Scrapes Google, Amazon, and Instagram reviews to detect product quality defects instantly.',
    installed: false,
    version: 'v2.0.0',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
  }
];

export default function AIAgentMarketplacePage() {
  const [agents, setAgents] = useState<MarketplaceAgent[]>(MARKETPLACE_AGENTS);

  const toggleInstall = (id: string) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, installed: !a.installed } : a)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              AI Agent & Plugin Marketplace
              <Badge className="text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                Modular AI Ecosystem
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Extend your commerce operating system with specialized domain agents built by top
              developers
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="p-5 border-border/80 bg-card/90 backdrop-blur-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div
                  className={`h-10 w-10 rounded-xl border flex items-center justify-center font-bold ${agent.iconBg}`}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[9px] font-mono">
                  {agent.category}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                  <span>By {agent.author}</span>
                  <span>•</span>
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="h-3 w-3 fill-current mr-0.5" />
                    {agent.rating} ({agent.reviews})
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[10px] font-mono text-muted-foreground">{agent.version}</span>
              <Button
                size="sm"
                variant={agent.installed ? 'outline' : 'default'}
                onClick={() => toggleInstall(agent.id)}
                className="text-xs h-8 px-3 gap-1.5 font-medium"
              >
                {agent.installed ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Installed</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Install Agent</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
