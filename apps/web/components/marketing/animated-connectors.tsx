'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, CheckCircle2 } from 'lucide-react';

const CONNECTORS = [
  { name: 'Shopify', category: 'Storefront', protocol: 'Webhooks / GraphQL', status: 'Active Sync', color: 'text-emerald-400 border-emerald-500/30' },
  { name: 'WooCommerce', category: 'Storefront', protocol: 'REST v3', status: 'Active Sync', color: 'text-purple-400 border-purple-500/30' },
  { name: 'UPI Intent', category: 'Payment Rail', protocol: 'Direct NPCI Rail', status: 'Sub-200ms', color: 'text-blue-400 border-blue-500/30' },
  { name: 'Stripe Radar', category: 'Payments & Risk', protocol: 'OAuth 2.0', status: 'Active Sync', color: 'text-indigo-400 border-indigo-500/30' },
  { name: 'PhonePe', category: 'Payment Gateway', protocol: 'SDK v2', status: 'Active Sync', color: 'text-violet-400 border-violet-500/30' },
  { name: 'PayPal', category: 'Global Checkout', protocol: 'REST v2', status: 'Active Sync', color: 'text-amber-400 border-amber-500/30' },
  { name: 'QuickBooks', category: 'Accounting', protocol: 'Double-Entry Sync', status: 'Nightly Sync', color: 'text-emerald-400 border-emerald-500/30' },
  { name: 'Google Sheets', category: 'Telemetry Export', protocol: 'Automated Export', status: 'Streaming', color: 'text-green-400 border-green-500/30' },
  { name: 'Slack Alerts', category: 'Notifications', protocol: 'Incoming Webhooks', status: 'Instant', color: 'text-rose-400 border-rose-500/30' }
];

export function AnimatedConnectors() {
  return (
    <Card className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-xs px-3 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1.5 font-mono">
          <Layers className="h-3.5 w-3.5" />
          Omnichannel Ecosystem
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Animated Omnichannel Connectors
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          MerchantPilot AI acts as the central brain, dynamically routing inventory, payments, and orders across your entire commercial stack.
        </p>
      </div>

      {/* Central Hub Animated Visualization */}
      <div className="relative py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONNECTORS.map((c) => (
            <div
              key={c.name}
              className="relative p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {c.name}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">{c.category}</span>
                <span className="text-indigo-400">{c.status}</span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>{c.protocol}</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Live
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
