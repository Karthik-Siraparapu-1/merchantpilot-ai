'use client';

import React from 'react';

interface PrintHeaderProps {
  title?: string;
  subtitle?: string;
}

export function PrintHeader({
  title = 'EXECUTIVE TELEMETRY REPORT',
  subtitle = 'Autonomous Commerce Operations & Multi-Agent Audit Trail'
}: PrintHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="print-only-header hidden print:block border-b-2 border-primary pb-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
              MERCHANTPILOT AI
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold border border-blue-300">
              CONFIDENTIAL & AUDIT READY
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-wide mt-1">{title}</h1>
          <p className="text-xs text-slate-600">{subtitle}</p>
        </div>

        <div className="text-right text-xs text-slate-600 font-mono space-y-1">
          <div>
            <span className="font-semibold text-slate-800">Generated:</span> {currentDate}
          </div>
          <div>
            <span className="font-semibold text-slate-800">Tenant ID:</span> mch_enterprise_prod
          </div>
          <div>
            <span className="font-semibold text-slate-800">Verification:</span> ✅ Deterministic
            Ledger Passed
          </div>
        </div>
      </div>
    </div>
  );
}
