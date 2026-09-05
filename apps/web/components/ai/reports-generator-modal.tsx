'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Sparkles, Printer, CheckCircle2 } from 'lucide-react';
import { reportsEngine, type ExecutiveReport } from '@/lib/ai/reports-engine';
import { toast } from 'sonner';

interface ReportsGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportsGeneratorModal({ open, onOpenChange }: ReportsGeneratorModalProps) {
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
    const rep = reportsEngine.generateReport(type);
    setActiveReport(rep);
  };

  const handleDownloadCsv = () => {
    const encodedUri = encodeURI(activeReport.csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReport.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Executive report CSV downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary/10 via-indigo-500/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-1.5">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              Autonomous Executive Reporting Engine
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Generate Enterprise Reports
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            1-click synthesized executive summaries, investor updates, and operational audit briefs.
          </DialogDescription>
        </div>

        {/* Report Selector Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-border/60 overflow-x-auto pb-2">
          {[
            { id: 'CEO_BRIEF', label: 'CEO Morning Brief' },
            { id: 'INVESTOR_UPDATE', label: 'Investor & Board Brief' },
            { id: 'DAILY_OPERATIONS', label: 'Daily Operations' },
            { id: 'WEEKLY_FINANCIALS', label: 'Weekly P&L Margins' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectType(tab.id as typeof selectedType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedType === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Content Preview */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="border border-border/80 rounded-xl p-5 bg-card space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-foreground">{activeReport.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>Audience: {activeReport.preparedFor}</span>
                <span>•</span>
                <span>Generated: {new Date(activeReport.generatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Executive Synthesis
              </span>
              <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50">
                {activeReport.executiveSummary}
              </p>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeReport.keyPerformanceIndicators.map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-border/70 bg-background space-y-0.5"
                >
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {kpi.label}
                  </span>
                  <span className="text-sm font-bold font-mono text-foreground block">
                    {kpi.value}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium block">
                    {kpi.periodDelta}
                  </span>
                </div>
              ))}
            </div>

            {/* Strategic Action Items */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Recommended Strategic Actions
              </span>
              <div className="space-y-1">
                {activeReport.strategicActionItems.map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 bg-muted/30 border-t border-border/80 flex sm:justify-between items-center">
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5">
            <Printer className="h-3.5 w-3.5" /> Print Briefing
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
            <Button size="sm" onClick={handleDownloadCsv} className="h-8 text-xs gap-1.5 shadow-xs">
              <Download className="h-3.5 w-3.5" /> Download CSV
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
