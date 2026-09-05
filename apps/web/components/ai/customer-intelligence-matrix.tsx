'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Crown,
  AlertTriangle,
  UserCheck,
  UserPlus,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

const CUSTOMER_COHORTS = [
  {
    name: 'VIP Champions',
    count: 280,
    share: '14%',
    revenueShare: '42%',
    aov: '₹5,420',
    icon: Crown,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    action: 'Targeted with 15% festival flash discount'
  },
  {
    name: 'High Lifetime Value',
    count: 512,
    share: '26%',
    revenueShare: '34%',
    aov: '₹3,890',
    icon: Sparkles,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    action: 'High repeat order velocity'
  },
  {
    name: 'At-Risk Churn',
    count: 88,
    share: '4%',
    revenueShare: '8%',
    aov: '₹2,640',
    icon: AlertTriangle,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    action: 'No purchase in 45 days. WhatsApp win-back queued'
  },
  {
    name: 'Loyal Returning',
    count: 420,
    share: '21%',
    revenueShare: '18%',
    aov: '₹2,180',
    icon: UserCheck,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    action: 'Regular 21-day replenishment cycle'
  },
  {
    name: 'First-Time Checkouts',
    count: 340,
    share: '17%',
    revenueShare: '11%',
    aov: '₹1,840',
    icon: UserPlus,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    action: 'Nurture sequence active via email'
  },
  {
    name: 'One-Time Shoppers',
    count: 360,
    share: '18%',
    revenueShare: '7%',
    aov: '₹1,250',
    icon: ShoppingBag,
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    action: 'Cross-sell recommendation candidate'
  }
];

export function CustomerIntelligenceMatrix() {
  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Customer Cohort Intelligence</CardTitle>
            <CardDescription className="text-xs">
              AI RFM segmentation and churn risk matrix across active buyers
            </CardDescription>
          </div>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-500 border-emerald-500/30"
        >
          2,000 Active Profiles
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CUSTOMER_COHORTS.map((cohort) => {
          const Icon = cohort.icon;
          return (
            <div
              key={cohort.name}
              className="p-4 rounded-xl border border-border/70 bg-card hover:border-purple-500/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center border ${cohort.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{cohort.name}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {cohort.count} buyers
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2 rounded-lg bg-muted/40 border border-border/50">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Revenue Share</span>
                  <span className="font-bold text-foreground">{cohort.revenueShare}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Average Order</span>
                  <span className="font-bold text-primary">{cohort.aov}</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                <span className="font-semibold text-foreground">AI Policy: </span>
                {cohort.action}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
