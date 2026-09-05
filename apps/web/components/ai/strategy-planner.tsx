'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Beaker, TrendingUp, TrendingDown, Play, BarChart3 } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  impact: {
    revenue: string;
    orders: string;
    margin: string;
    risk: string;
  };
  recommendation: 'RECOMMENDED' | 'NEUTRAL' | 'RISKY';
  agent: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sim-1',
    title: 'Aggressive Growth: 25% Price Cut + Ad Spend ₹50K',
    description: 'What happens if we drop prices on top 20 products and increase ad spend?',
    impact: { revenue: '+₹2,45,000', orders: '+340', margin: '-8.2%', risk: 'MEDIUM' },
    recommendation: 'NEUTRAL',
    agent: 'Vega + Nova'
  },
  {
    id: 'sim-2',
    title: 'Premium Positioning: 15% Price Hike + Quality Campaign',
    description: 'Raise prices and run a quality perception campaign for top 10 products.',
    impact: { revenue: '+₹85,000', orders: '-45', margin: '+12.4%', risk: 'LOW' },
    recommendation: 'RECOMMENDED',
    agent: 'Vega + Athena'
  },
  {
    id: 'sim-3',
    title: 'Flash Sale: 40% Discount for 48 Hours',
    description: 'Emergency inventory clearance on 30 slow-moving SKUs.',
    impact: { revenue: '+₹1,80,000', orders: '+520', margin: '-22.1%', risk: 'HIGH' },
    recommendation: 'RISKY',
    agent: 'Atlas + Nova'
  }
];

export function StrategyPlanner() {
  const [selectedScenario, setSelectedScenario] = useState<string>(SCENARIOS[1]?.id ?? 'sim-2');
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2000);
  };

  const getRecColor = (rec: Scenario['recommendation']) => {
    switch (rec) {
      case 'RECOMMENDED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'NEUTRAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'RISKY':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Beaker className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Strategy Planner & Simulator</CardTitle>
            <CardDescription className="text-xs">
              AI-generated scenarios with predicted business outcomes
            </CardDescription>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSimulate}
          disabled={simulating}
          className="text-[10px] h-7 px-3 border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
        >
          {simulating ? (
            <>
              <Loader className="h-3 w-3 mr-1 animate-spin" /> Simulating...
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" /> Run Simulation
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {SCENARIOS.map((scenario) => {
          const isSelected = selectedScenario === scenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-500/40 bg-teal-500/5 shadow-lg shadow-teal-500/5'
                  : 'border-border/50 bg-muted/10 hover:bg-muted/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{scenario.title}</h4>
                    <Badge
                      className={`text-[8px] font-mono ${getRecColor(scenario.recommendation)}`}
                    >
                      {scenario.recommendation}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{scenario.description}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Simulated by: {scenario.agent}
                  </p>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded-lg bg-background/60 text-center">
                  <div className="text-[10px] text-muted-foreground font-mono">Revenue</div>
                  <div
                    className={`text-xs font-bold ${scenario.impact.revenue.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {scenario.impact.revenue}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-background/60 text-center">
                  <div className="text-[10px] text-muted-foreground font-mono">Orders</div>
                  <div
                    className={`text-xs font-bold ${scenario.impact.orders.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {scenario.impact.orders}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-background/60 text-center">
                  <div className="text-[10px] text-muted-foreground font-mono">Margin</div>
                  <div
                    className={`text-xs font-bold ${scenario.impact.margin.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {scenario.impact.margin}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-background/60 text-center">
                  <div className="text-[10px] text-muted-foreground font-mono">Risk</div>
                  <div
                    className={`text-xs font-bold ${
                      scenario.impact.risk === 'LOW'
                        ? 'text-emerald-400'
                        : scenario.impact.risk === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {scenario.impact.risk}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario Comparison Summary Table */}
      <div className="pt-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-2">
          Scenario Comparison Matrix
        </span>
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/10">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground text-[10px] bg-muted/20">
                <th className="py-2 px-3">Scenario</th>
                <th className="py-2 px-3">Est. Revenue</th>
                <th className="py-2 px-3">Gross Margin</th>
                <th className="py-2 px-3">Risk Level</th>
                <th className="py-2 px-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr className="hover:bg-muted/20">
                <td className="py-2 px-3 font-semibold text-foreground">Current Baseline</td>
                <td className="py-2 px-3 text-foreground">₹7,20,000</td>
                <td className="py-2 px-3 text-foreground">34.2%</td>
                <td className="py-2 px-3 text-emerald-400">LOW</td>
                <td className="py-2 px-3 text-right text-muted-foreground">Active</td>
              </tr>
              <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 font-bold">
                <td className="py-2 px-3 text-emerald-400">AI Recommended (+15% Hike)</td>
                <td className="py-2 px-3 text-emerald-400">₹8,05,000</td>
                <td className="py-2 px-3 text-emerald-400">46.6%</td>
                <td className="py-2 px-3 text-emerald-400">LOW</td>
                <td className="py-2 px-3 text-right text-emerald-400">RECOMMENDED</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="py-2 px-3 text-foreground">Aggressive Flash Sale</td>
                <td className="py-2 px-3 text-amber-400">₹9,65,000</td>
                <td className="py-2 px-3 text-rose-400">12.1%</td>
                <td className="py-2 px-3 text-rose-400">HIGH</td>
                <td className="py-2 px-3 text-right text-rose-400">RISKY</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

// Small Loader utility used only in this file
function Loader({ className }: { className?: string }) {
  return <BarChart3 className={className} />;
}
