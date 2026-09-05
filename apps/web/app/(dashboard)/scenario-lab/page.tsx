'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { BusinessDigitalTwin } from '@/components/ai/business-digital-twin';

export default function ScenarioLabPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Business Digital Twin Sandbox
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Deterministic Simulation Engine
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Scenario Lab & Strategy Simulator
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test business strategies in virtual simulation before deploying to production commerce
            channels.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            Live Catalog Linked
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Elasticity Model Active
          </span>
        </div>
      </div>

      {/* Embedded Full Digital Twin Simulator */}
      <BusinessDigitalTwin />
    </div>
  );
}
