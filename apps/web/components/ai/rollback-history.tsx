'use client';

import React, { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Clock, CheckCircle2, AlertTriangle, Undo2 } from 'lucide-react';

interface RollbackEntry {
  id: string;
  action: string;
  agent: string;
  timestamp: string;
  details: string;
  type: 'PRICE_CHANGE' | 'RESTOCK' | 'CAMPAIGN' | 'FLAG_ORDER' | 'AUTOMATION';
  canRollback: boolean;
}

const SAMPLE_HISTORY: RollbackEntry[] = [
  {
    id: 'rb-1',
    action: 'Price Adjusted: ₹899 → ₹749',
    agent: 'Vega',
    timestamp: '2 min ago',
    details: 'Competitor undercut detected. Dynamic pricing applied.',
    type: 'PRICE_CHANGE',
    canRollback: true
  },
  {
    id: 'rb-2',
    action: 'Restock Order: 200 units → SKU-204',
    agent: 'Atlas',
    timestamp: '15 min ago',
    details: 'Demand surge predicted. Supplier PO generated.',
    type: 'RESTOCK',
    canRollback: true
  },
  {
    id: 'rb-3',
    action: 'Fraud Flag: Order #ORD-3847',
    agent: 'Sentinel',
    timestamp: '1 hr ago',
    details: 'IP mismatch + velocity check failed. Order held.',
    type: 'FLAG_ORDER',
    canRollback: true
  },
  {
    id: 'rb-4',
    action: 'Campaign: "Summer Flash" activated',
    agent: 'Nova',
    timestamp: '3 hr ago',
    details: '15% discount on 12 SKUs. CTR target: 4.2%.',
    type: 'CAMPAIGN',
    canRollback: false
  },
  {
    id: 'rb-5',
    action: 'Auto-resolved: Low stock alert cleared',
    agent: 'Atlas',
    timestamp: '6 hr ago',
    details: 'Shipment confirmed. ETA 48hrs. Alert auto-resolved.',
    type: 'AUTOMATION',
    canRollback: false
  }
];

export function RollbackHistory() {
  const [entries] = useState<RollbackEntry[]>(SAMPLE_HISTORY);
  const [rolledBack, setRolledBack] = useState<string[]>([]);

  const handleRollback = (id: string) => {
    setRolledBack((prev) => [...prev, id]);
  };

  const getTypeColor = (type: RollbackEntry['type']) => {
    switch (type) {
      case 'PRICE_CHANGE':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      case 'RESTOCK':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CAMPAIGN':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'FLAG_ORDER':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'AUTOMATION':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className="p-6 border-border/80 bg-card/90 backdrop-blur-xl shadow-lg space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">AI Action Log & Rollback</CardTitle>
            <CardDescription className="text-xs">
              Full audit trail with one-click undo capability
            </CardDescription>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-orange-500/30 text-orange-400"
        >
          {entries.length} Actions Logged
        </Badge>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isRolledBack = rolledBack.includes(entry.id);
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isRolledBack
                  ? 'border-amber-500/30 bg-amber-500/5 opacity-70'
                  : 'border-border/50 bg-muted/10 hover:bg-muted/25'
              }`}
            >
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center shrink-0">
                {isRolledBack ? (
                  <Undo2 className="h-4 w-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-semibold ${isRolledBack ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {entry.action}
                  </span>
                  <Badge className={`text-[8px] font-mono ${getTypeColor(entry.type)}`}>
                    {entry.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{entry.details}</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <span>{entry.agent}</span>
                  <span>•</span>
                  <Clock className="h-2.5 w-2.5" />
                  <span>{entry.timestamp}</span>
                </div>
              </div>

              {/* Rollback Button */}
              {entry.canRollback && !isRolledBack && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-7 px-2.5 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  onClick={() => handleRollback(entry.id)}
                >
                  <Undo2 className="h-3 w-3 mr-1" /> Undo
                </Button>
              )}
              {isRolledBack && (
                <Badge className="text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/30 shrink-0">
                  <AlertTriangle className="h-2.5 w-2.5 mr-1" /> Rolled Back
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
