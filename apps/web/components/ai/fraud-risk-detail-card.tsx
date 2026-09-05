'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function FraudRiskDetailCard() {
  const [isHeld, setIsHeld] = useState(false);

  const handleHold = () => {
    setIsHeld(true);
    toast.success('Order ORD-9921 placed on security hold. Payment settlement suspended.');
  };

  const handleRelease = () => {
    setIsHeld(false);
    toast.info('Order ORD-9921 released from security hold.');
  };

  return (
    <Card className="p-6 border-border/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Payment & Fraud Shield</CardTitle>
            <CardDescription className="text-xs">
              Real-time Bayesian risk scoring across 14 telemetry signals
            </CardDescription>
          </div>
        </div>

        <Badge variant={isHeld ? 'default' : 'destructive'} className="text-xs font-mono">
          {isHeld ? 'Held Securely' : 'Action Required'}
        </Badge>
      </div>

      {/* Target Order Info */}
      <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-foreground">Order #ORD-9921</span>
            <span className="text-xs font-bold text-foreground font-mono">₹4,998</span>
          </div>
          <span className="text-[11px] text-muted-foreground block mt-0.5">
            Customer: rajesh.k@temp-mail.org • 3 attempts in 4 mins
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right font-mono">
            <span className="text-[10px] text-muted-foreground block uppercase">Risk Score</span>
            <span className="text-xl font-bold text-rose-500">92/100</span>
          </div>
        </div>
      </div>

      {/* Granular Risk Vectors */}
      <div className="space-y-1.5 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
          Algorithmic Anomaly Breakdown
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/60">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="text-[11px] text-foreground font-medium">
              Datacenter VPN / Proxy (Bucharest IP)
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/60">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="text-[11px] text-foreground font-medium">
              Velocity Surge (3 tries in 4 mins)
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/60">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] text-foreground font-medium">
              New Device Fingerprint (Unverified browser)
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/60">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] text-foreground font-medium">
              Geo Mismatch (Shipping 1,200km from IP)
            </span>
          </div>
        </div>
      </div>

      {/* AI Recommendation & Action */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-between">
        <div className="text-xs">
          <span className="text-muted-foreground font-medium">AI Recommendation: </span>
          <span className="font-bold text-rose-500">HOLD ORDER IMMEDIATELY</span>
        </div>

        {isHeld ? (
          <Button size="sm" variant="outline" onClick={handleRelease} className="h-7 text-xs">
            Release Order
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleHold}
            className="h-7 text-xs gap-1 bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Hold Order Now
          </Button>
        )}
      </div>
    </Card>
  );
}
