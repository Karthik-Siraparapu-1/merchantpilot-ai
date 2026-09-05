'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ROICalculator() {
  const [monthlyRevenueLakhs, setMonthlyRevenueLakhs] = useState<number>(25); // ₹25L default
  const [monthlyOrders, setMonthlyOrders] = useState<number>(1200);
  const [catalogSKUs, setCatalogSKUs] = useState<number>(150);

  // Computations
  const moneySaved = Math.round(monthlyRevenueLakhs * 100000 * 0.048); // ~4.8% saved from prevented stockouts & fraud
  const timeSavedHours = Math.round(20 + (monthlyOrders / 80)); // hours saved on manual pricing, PO drafting, reconciliation
  const extraRevenueProfit = Math.round(monthlyRevenueLakhs * 100000 * 0.082); // +8.2% gross profit expansion from dynamic pricing

  return (
    <Card className="p-8 border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-xs px-3 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 gap-1.5 font-mono">
          <Calculator className="h-3.5 w-3.5" />
          Interactive ROI Calculator
        </Badge>
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Calculate Your Autonomous Enterprise ROI
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Adjust your store metrics below to calculate estimated savings, autonomous hours reclaimed, and net margin lift.
        </p>
      </div>

      {/* Input Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-slate-950/60 border border-slate-800/80">
        {/* Slider 1: Monthly GMV */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Monthly Store Revenue</span>
            <span className="font-mono font-bold text-indigo-400">₹{monthlyRevenueLakhs} Lakhs</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={monthlyRevenueLakhs}
            onChange={(e) => setMonthlyRevenueLakhs(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">₹5L - ₹1.5 Cr</span>
        </div>

        {/* Slider 2: Monthly Orders */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Monthly Checkouts</span>
            <span className="font-mono font-bold text-indigo-400">{monthlyOrders.toLocaleString()} orders</span>
          </div>
          <input
            type="range"
            min="200"
            max="10000"
            step="200"
            value={monthlyOrders}
            onChange={(e) => setMonthlyOrders(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">200 - 10,000 orders</span>
        </div>

        {/* Slider 3: Active SKUs */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Catalog SKUs</span>
            <span className="font-mono font-bold text-indigo-400">{catalogSKUs} items</span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="20"
            value={catalogSKUs}
            onChange={(e) => setCatalogSKUs(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block">20 - 1,000 SKUs</span>
        </div>
      </div>

      {/* ROI Projection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1 text-center">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400">Estimated Money Saved</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            ₹{moneySaved.toLocaleString('en-IN')}<span className="text-xs text-slate-400">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            From prevented stockouts, MDR routing & fraud
          </span>
        </div>

        <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1 text-center">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400">Executive Time Saved</span>
          <div className="text-2xl font-extrabold font-mono text-indigo-400">
            {timeSavedHours} Hours<span className="text-xs text-slate-400">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Replaced manual pricing, POs & reconciliation
          </span>
        </div>

        <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1 text-center">
          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="text-[11px] uppercase font-bold text-slate-400">Extra Net Profit</span>
          <div className="text-2xl font-extrabold font-mono text-purple-400">
            +₹{extraRevenueProfit.toLocaleString('en-IN')}<span className="text-xs text-slate-400">/mo</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Via dynamic elasticity +8% price adjustments
          </span>
        </div>
      </div>

      <div className="text-center pt-2">
        <Button asChild size="lg" className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30">
          <Link href="/register">
            Unlock This ROI in Your Store <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
