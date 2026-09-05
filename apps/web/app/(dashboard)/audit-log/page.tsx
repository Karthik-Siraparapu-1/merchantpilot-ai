'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Sparkles, CheckCircle2, XCircle, Zap, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memoryEngine, type AuditEntry } from '@/lib/ai/memory-engine';
import { AgentBadge } from '@/components/ai/agent-badge';

const AGENT_ICON_MAP: Record<string, string> = {
  'Dynamic Pricing Agent': 'TrendingUp',
  'Inventory & Supply Agent': 'Boxes',
  'Fraud & Risk Shield Agent': 'ShieldAlert',
  'Autonomous Marketing Agent': 'Megaphone',
  'CEO Executive Agent': 'Crown',
  'Order Operations Agent': 'ShoppingCart',
  'MerchantPilot AI': 'Sparkles'
};

const STATUS_CONFIG = {
  APPROVED: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    label: 'Approved'
  },
  REJECTED: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Rejected' },
  AUTO_EXECUTED: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Auto-Executed' }
};

function groupEntriesByDate(entries: AuditEntry[]): Record<string, AuditEntry[]> {
  const groups: Record<string, AuditEntry[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  for (const entry of entries) {
    const entryTime = new Date(entry.timestamp).getTime();
    let label: string;

    if (entryTime >= today) label = 'Today';
    else if (entryTime >= yesterday) label = 'Yesterday';
    else {
      const daysAgo = Math.ceil((today - entryTime) / 86400000);
      label = `${daysAgo} days ago`;
    }

    const list = groups[label] ?? [];
    list.push(entry);
    groups[label] = list;
  }

  return groups;
}

export default function AuditLogPage() {
  const auditLog = memoryEngine.getAuditLog();
  const [filterStatus, setFilterStatus] = useState<AuditEntry['status'] | 'ALL'>('ALL');

  const filtered =
    filterStatus === 'ALL' ? auditLog : auditLog.filter((e) => e.status === filterStatus);

  const grouped = groupEntriesByDate(filtered);

  const approvedCount = auditLog.filter((e) => e.status === 'APPROVED').length;
  const rejectedCount = auditLog.filter((e) => e.status === 'REJECTED').length;
  const autoCount = auditLog.filter((e) => e.status === 'AUTO_EXECUTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Clock className="h-3 w-3 text-indigo-500" />
            AI Activity Timeline
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-mono text-emerald-500 border-emerald-500/30"
          >
            {auditLog.length} Actions Logged
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AI Audit Log</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Complete timeline of every AI action — approved, rejected, and automated.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Approved</span>
          </div>
          <p className="text-xl font-bold font-mono text-emerald-500">{approvedCount}</p>
        </Card>
        <Card className="p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Rejected</span>
          </div>
          <p className="text-xl font-bold font-mono text-red-500">{rejectedCount}</p>
        </Card>
        <Card className="p-4 border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Auto-Executed</span>
          </div>
          <p className="text-xl font-bold font-mono text-blue-500">{autoCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {(['ALL', 'APPROVED', 'REJECTED', 'AUTO_EXECUTED'] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filterStatus === status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(status)}
            className="h-7 text-[11px]"
          >
            {status === 'ALL'
              ? 'All'
              : status === 'AUTO_EXECUTED'
                ? 'Auto'
                : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateLabel, entries]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-foreground">{dateLabel}</span>
              <div className="flex-1 h-px bg-border" />
              <Badge variant="outline" className="text-[9px] font-mono">
                {entries.length} actions
              </Badge>
            </div>

            <div className="space-y-2">
              {entries.map((entry) => {
                const statusCfg = STATUS_CONFIG[entry.status];
                const StatusIcon = statusCfg.icon;
                const time = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const agentIcon = AGENT_ICON_MAP[entry.agentName] || 'Sparkles';

                return (
                  <Card
                    key={entry.id}
                    className={cn(
                      'p-4 border-border/60 hover:border-indigo-500/30 transition-all',
                      entry.status === 'APPROVED' && 'border-l-2 border-l-emerald-500',
                      entry.status === 'REJECTED' && 'border-l-2 border-l-red-500',
                      entry.status === 'AUTO_EXECUTED' && 'border-l-2 border-l-blue-500'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                          statusCfg.bg
                        )}
                      >
                        <StatusIcon className={cn('h-4 w-4', statusCfg.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-foreground">{entry.action}</p>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <AgentBadge agentName={entry.agentName} agentIcon={agentIcon} />
                          <Badge variant="outline" className={cn('text-[9px]', statusCfg.color)}>
                            {statusCfg.label}
                          </Badge>
                          {entry.impact && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-mono text-emerald-500"
                            >
                              {entry.impact}
                            </Badge>
                          )}
                        </div>

                        {entry.details && (
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {entry.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No AI actions logged yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Actions will appear here as AI agents execute operations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
