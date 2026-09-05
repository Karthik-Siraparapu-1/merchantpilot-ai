'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Feature & Brand Showcase Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-950 p-12 text-white relative overflow-hidden border-r border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">MerchantPilot AI</span>
            <span className="block text-xs font-mono text-indigo-400">Enterprise Commerce OS</span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-xs">
            <Zap className="h-3.5 w-3.5" /> High-Performance Multi-Tenant Commerce
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Unified inventory control, orders & intelligence for modern commerce.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminate stockouts, automate fulfillment workflows, and scale your merchant catalog
            with bank-grade reliability and explainable analytics.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xs">
              <ShieldCheck className="h-5 w-5 text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">Tenant Isolation</div>
              <div className="text-xs text-slate-400 mt-1">
                Multi-tenant role-based access control
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xs">
              <Layers className="h-5 w-5 text-indigo-400 mb-2" />
              <div className="text-sm font-semibold text-white">Atomic Transactions</div>
              <div className="text-xs text-slate-400 mt-1">
                Zero race conditions on stock reservations
              </div>
            </div>
          </div>
        </div>

        {/* Customer / Security Footer */}
        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800/80 pt-6 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} MerchantPilot AI Inc.</span>
          <span className="font-mono text-slate-400">
            Multi-Tenant Isolation &middot; TLS 1.3 &middot; RBAC
          </span>
        </div>
      </div>

      {/* Right Interactive Form Area */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
