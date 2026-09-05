'use client';

import React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SUPPLIERS = [
  {
    name: 'Apex Logistics & Hardware Corp',
    category: 'Computer Peripherals',
    reliabilityScore: '94%',
    avgDelayDays: '+0.8 days',
    qualityRating: '4.8/5',
    leadTime: '4 Days',
    riskLevel: 'LOW',
    recommendation: 'Primary partner for Ergonomic Mouse & Keyboards. Highly stable lead times.'
  },
  {
    name: 'Shenzhen Tech Components Ltd',
    category: 'Circuitry & Sensors',
    reliabilityScore: '81%',
    avgDelayDays: '+3.8 days',
    qualityRating: '4.2/5',
    leadTime: '9 Days',
    riskLevel: 'MEDIUM',
    recommendation: 'Customs delays frequent. Maintain 15-day buffer stock for Tier-1 SKUs.'
  },
  {
    name: 'Bharat Packaging Solutions',
    category: 'Eco Cartons & Envelopes',
    reliabilityScore: '99%',
    avgDelayDays: '0.0 days',
    qualityRating: '4.9/5',
    leadTime: '2 Days',
    riskLevel: 'OPTIMAL',
    recommendation: 'Consistently on-time. Eligible for automated restock authorization.'
  }
];

export function SupplierIntelligenceCard() {
  const handleRebalance = (supplierName: string) => {
    toast.success(`AI buffer rebalanced for ${supplierName}. Purchase orders updated.`);
  };

  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Supplier Performance & Risk Radar
            </CardTitle>
            <CardDescription className="text-xs">
              Lead time variance, reliability scores, and transit disruption monitoring
            </CardDescription>
          </div>
        </div>

        <Badge
          variant="outline"
          className="text-xs font-mono text-emerald-500 border-emerald-500/30"
        >
          3 Active Suppliers Linked
        </Badge>
      </div>

      <div className="space-y-3">
        {SUPPLIERS.map((sup) => (
          <div
            key={sup.name}
            className="p-4 rounded-xl border border-border/70 bg-card hover:border-amber-500/30 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-foreground">{sup.name}</h4>
                <span className="text-[10px] text-muted-foreground font-mono">{sup.category}</span>
              </div>
              <Badge
                variant={
                  sup.riskLevel === 'OPTIMAL'
                    ? 'default'
                    : sup.riskLevel === 'LOW'
                      ? 'secondary'
                      : 'destructive'
                }
                className="text-[10px] font-mono self-start sm:self-auto"
              >
                {sup.riskLevel} RISK
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono p-2.5 rounded-lg bg-muted/40 border border-border/60">
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">
                  Reliability
                </span>
                <span className="font-bold text-foreground">{sup.reliabilityScore}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Avg Delay</span>
                <span className="font-bold text-amber-500">{sup.avgDelayDays}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Quality</span>
                <span className="font-bold text-foreground">{sup.qualityRating}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block uppercase">Lead Time</span>
                <span className="font-bold text-primary">{sup.leadTime}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-muted-foreground pt-1">
              <p>
                <span className="font-semibold text-foreground">AI Guidance: </span>
                {sup.recommendation}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRebalance(sup.name)}
                className="h-6 text-[10px] px-2.5 shrink-0 self-end sm:self-auto"
              >
                Rebalance Buffer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
