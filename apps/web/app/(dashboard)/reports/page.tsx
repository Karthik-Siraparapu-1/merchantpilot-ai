'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { reportsEngine, type ExecutiveReport } from '@/lib/ai/reports-engine';
import { toast } from 'sonner';

import { downloadRawCsvString, triggerPrintView } from '@/lib/export-utils';
import { PrintHeader } from '@/components/layout/print-header';

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<
    'CEO_BRIEF' | 'INVESTOR_UPDATE' | 'DAILY_OPERATIONS' | 'WEEKLY_FINANCIALS'
  >('CEO_BRIEF');

  const [activeReport, setActiveReport] = useState<ExecutiveReport>(() =>
    reportsEngine.generateReport('CEO_BRIEF')
  );

  const handleSelectType = (
    type: 'CEO_BRIEF' | 'INVESTOR_UPDATE' | 'DAILY_OPERATIONS' | 'WEEKLY_FINANCIALS'
  ) => {
    setSelectedType(type);
    setActiveReport(reportsEngine.generateReport(type));
  };

  const handleDownloadCsv = () => {
    downloadRawCsvString(`${activeReport.id}.csv`, activeReport.csvContent);
    toast.success('Executive report CSV downloaded!');
  };

  const handlePrint = () => {
    triggerPrintView(activeReport.title);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto printable-area">
      <PrintHeader
        title={activeReport.title}
        subtitle={`Prepared for: ${activeReport.preparedFor}`}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Autonomous Executive Reporting
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Audit-Ready
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            One-click synthesized briefings for CEOs, investors, board members, and operations
            heads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 h-9 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print Briefing
          </Button>
          <Button size="sm" onClick={handleDownloadCsv} className="gap-1.5 h-9 text-xs shadow-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/70 pb-3 overflow-x-auto no-print">
        {[
          { id: 'CEO_BRIEF', label: 'CEO Morning Brief' },
          { id: 'INVESTOR_UPDATE', label: 'Investor & Board Update' },
          { id: 'DAILY_OPERATIONS', label: 'Daily Operations' },
          { id: 'WEEKLY_FINANCIALS', label: 'Weekly P&L Margins' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelectType(tab.id as typeof selectedType)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedType === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formatted Report Card */}
      <Card className="p-8 border-border/80 shadow-md space-y-6">
        <div className="border-b border-border/70 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">{activeReport.title}</h2>
            <span className="text-xs text-muted-foreground">
              Prepared for: {activeReport.preparedFor}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {new Date(activeReport.generatedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Badge>
        </div>

        {/* Executive Synthesis */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Executive Synthesis
          </h4>
          <p className="text-xs text-foreground leading-relaxed p-4 rounded-xl bg-muted/30 border border-border/60">
            {activeReport.executiveSummary}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeReport.keyPerformanceIndicators.map((kpi, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[11px] text-muted-foreground block">{kpi.label}</span>
              <span className="text-base font-bold font-mono text-foreground block">
                {kpi.value}
              </span>
              <span className="text-[11px] text-emerald-500 font-medium block">
                {kpi.periodDelta}
              </span>
            </div>
          ))}
        </div>

        {/* Strategic Recommendations */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Strategic Action Items
          </h4>
          <div className="space-y-2">
            {activeReport.strategicActionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs text-foreground p-2 rounded-lg bg-muted/20 border border-border/40"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
