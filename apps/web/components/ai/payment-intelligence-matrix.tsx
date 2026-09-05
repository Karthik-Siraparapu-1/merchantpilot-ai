'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';

const PAYMENT_RAILS = [
  {
    rail: 'Unified UPI Rails (Direct Intent)',
    share: '65%',
    successRate: '98.6%',
    latency: '210ms',
    failuresToday: 2,
    settlement: 'T+0 (Instant)',
    status: 'OPTIMAL'
  },
  {
    rail: 'Domestic & Global Credit/Debit Cards',
    share: '25%',
    successRate: '94.8%',
    latency: '580ms',
    failuresToday: 5,
    settlement: 'T+1',
    status: 'HEALTHY'
  },
  {
    rail: 'NetBanking (Top 10 Indian Banks)',
    share: '6%',
    successRate: '91.2%',
    latency: '820ms',
    failuresToday: 3,
    settlement: 'T+2',
    status: 'DEGRADED'
  },
  {
    rail: 'Digital Wallets & Buy Now Pay Later',
    share: '4%',
    successRate: '96.2%',
    latency: '340ms',
    failuresToday: 1,
    settlement: 'T+1',
    status: 'HEALTHY'
  }
];

export function PaymentIntelligenceMatrix() {
  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Payment Rail Intelligence</CardTitle>
            <CardDescription className="text-xs">
              Live multi-rail routing telemetry across Stripe, Razorpay, PhonePe, and UPI
            </CardDescription>
          </div>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-500 border-emerald-500/30"
        >
          97.4% Aggregate Success
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground uppercase text-[10px]">
              <th className="py-2.5">Payment Rail</th>
              <th className="py-2.5">Volume Share</th>
              <th className="py-2.5">Success %</th>
              <th className="py-2.5">Latency</th>
              <th className="py-2.5">Failures</th>
              <th className="py-2.5 text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-medium">
            {PAYMENT_RAILS.map((rail) => (
              <tr key={rail.rail} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 font-semibold text-foreground flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      rail.status === 'OPTIMAL'
                        ? 'bg-emerald-500'
                        : rail.status === 'HEALTHY'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                    }`}
                  />
                  <span>{rail.rail}</span>
                </td>
                <td className="py-3 font-mono text-foreground">{rail.share}</td>
                <td className="py-3 font-mono font-bold text-emerald-500">{rail.successRate}</td>
                <td className="py-3 font-mono text-muted-foreground">{rail.latency}</td>
                <td className="py-3 font-mono text-amber-500">{rail.failuresToday}</td>
                <td className="py-3 font-mono text-right text-muted-foreground">
                  {rail.settlement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
        ⚡ <span className="font-semibold text-foreground">AI Smart-Routing Active: </span>
        Routing 88% of sub-₹2,000 transactions through UPI Intent rails, saving an estimated
        ₹14,200/month in gateway processing fees.
      </div>
    </Card>
  );
}
