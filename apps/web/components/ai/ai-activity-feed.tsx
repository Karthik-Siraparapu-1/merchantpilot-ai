'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface ActivityEvent {
  id: string;
  time: string;
  agent: 'Pricing' | 'Inventory' | 'Fraud' | 'Executive' | 'Marketing';
  title: string;
  confidence: number;
  impact?: string;
  route?: string;
  category: 'OPTIMIZATION' | 'ALERT' | 'AUTOMATION';
}

const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'act-1',
    time: '09:25',
    agent: 'Fraud',
    title: 'Fraud agent flagged Order #2191 (92% risk)',
    confidence: 94,
    impact: 'Protected ₹4,998',
    route: '/orders',
    category: 'ALERT'
  },
  {
    id: 'act-2',
    time: '09:23',
    agent: 'Pricing',
    title: 'Pricing agent recommends +8% price lift on Wireless Mouse',
    confidence: 92,
    impact: '+₹42,000/mo profit',
    route: '/products',
    category: 'OPTIMIZATION'
  },
  {
    id: 'act-3',
    time: '09:21',
    agent: 'Inventory',
    title: 'Inventory agent created draft PO for 120 units',
    confidence: 96,
    impact: 'Stockout prevented',
    route: '/inventory',
    category: 'AUTOMATION'
  },
  {
    id: 'act-4',
    time: '09:18',
    agent: 'Executive',
    title: 'AI detected sudden weekend demand spike (+34% velocity)',
    confidence: 95,
    impact: 'Catalyzed dynamic restock',
    route: '/analytics',
    category: 'ALERT'
  },
  {
    id: 'act-5',
    time: '09:10',
    agent: 'Marketing',
    title: 'Marketing agent drafted 3-channel VIP Flash campaign',
    confidence: 89,
    impact: '2.8x projected ROI',
    route: '/marketing',
    category: 'AUTOMATION'
  }
];

export function AIActivityFeed() {
  const router = useRouter();
  const [events] = useState<ActivityEvent[]>(INITIAL_EVENTS);

  const getAgentColor = (agent: ActivityEvent['agent']) => {
    switch (agent) {
      case 'Pricing':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Inventory':
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
      case 'Fraud':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Marketing':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              AI Activity Live Stream
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Autonomous agent telemetry running in background
            </CardDescription>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          Real-time Event Stream
        </Badge>
      </div>

      <div className="space-y-2.5">
        {events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => evt.route && router.push(evt.route)}
            className="p-3 rounded-xl border border-border/70 bg-card hover:border-indigo-500/40 hover:bg-muted/40 transition-all cursor-pointer space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-foreground">{evt.time}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getAgentColor(
                    evt.agent
                  )}`}
                >
                  {evt.agent} Agent
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono text-primary">
                {evt.confidence}% Confidence
              </Badge>
            </div>

            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
              {evt.title}
            </p>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 font-mono">
              <span>{evt.impact}</span>
              <span className="flex items-center gap-0.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Inspect <ArrowRight className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
