'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Volume2, VolumeX, TrendingUp, ShieldAlert, Boxes, Zap } from 'lucide-react';
import { voiceAI } from '@/lib/ai/voice-ai';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ExecutiveBriefingCardProps {
  onOpenRestock?: () => void;
  onOpenFraud?: () => void;
  onOpenCampaign?: () => void;
}

export function ExecutiveBriefingCard({
  onOpenRestock,
  onOpenFraud,
  onOpenCampaign
}: ExecutiveBriefingCardProps) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const briefingText =
    `${getGreeting()}, Karthik. Here is what happened since you were away. ` +
    `Today's revenue is tracking up 12.4% at ₹2,42,800. ` +
    `Inventory risk is detected on 3 catalog items with 48 hours runway. ` +
    `Fraud shield isolated 1 suspicious proxy order. ` +
    `Forecast improved by ₹38,400, and autonomous agents completed 4 background automations. ` +
    `Your top priority is approving the restock purchase order and deploying the price lift on Wireless Mouse.`;

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      voiceAI.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceAI.speak(briefingText, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleApproveRestock = () => {
    if (onOpenRestock) {
      onOpenRestock();
    } else {
      router.push('/inventory');
      toast.success('Navigating to warehouse replenishment.');
    }
  };

  const handleReviewFraud = () => {
    if (onOpenFraud) {
      onOpenFraud();
    } else {
      router.push('/orders');
      toast.info('Opening payment risk and fraud isolation dashboard.');
    }
  };

  const handleGenerateCampaign = () => {
    if (onOpenCampaign) {
      onOpenCampaign();
    } else {
      router.push('/marketing');
      toast.success('Opening Autonomous Marketing Campaign Generator.');
    }
  };

  return (
    <Card className="relative overflow-hidden p-6 border-border/80 bg-gradient-to-br from-indigo-500/10 via-card to-background shadow-md space-y-5">
      {/* Top Banner & Voice Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs font-semibold px-2.5 py-0.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              AI Command Center
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              Live Telemetry
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {getGreeting()}, Karthik.
          </h1>
          <p className="text-xs text-muted-foreground">
            Here is what happened across your commerce channels since you were away.
          </p>
        </div>

        {/* Voice Playback Button */}
        <Button
          onClick={handleToggleSpeech}
          size="sm"
          variant={isSpeaking ? 'default' : 'outline'}
          className="gap-2 h-9 text-xs font-semibold shadow-xs shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4 animate-pulse" />
              <span>Stop Briefing</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span>Listen to Briefing (AI Voice)</span>
            </>
          )}
        </Button>
      </div>

      {/* Highlights Stream */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Revenue</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">+12.4%</div>
          <span className="text-[10px] text-emerald-500 font-mono">₹2,42,800 today</span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Stock Risk
            </span>
            <Boxes className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">3 SKUs</div>
          <span className="text-[10px] text-amber-500 font-mono">Runway &lt; 48h</span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Fraud Shield
            </span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">1 Order Held</div>
          <span className="text-[10px] text-rose-500 font-mono">ORD-9921 (92% risk)</span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Forecast Lift
            </span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">+₹38,400</div>
          <span className="text-[10px] text-primary font-mono">96% Model Conf.</span>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Automations
            </span>
            <Zap className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div className="text-lg font-bold font-mono text-foreground">4 Completed</div>
          <span className="text-[10px] text-muted-foreground font-mono">All policies synced</span>
        </div>
      </div>

      {/* Today's Priority Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Today's Priorities:
          </span>
          <span className="text-[11px] text-muted-foreground hidden md:inline">
            Execute key operational workflows in 1 click
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleApproveRestock}
            className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Boxes className="h-3.5 w-3.5" />
            Approve Restock PO
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReviewFraud}
            className="h-8 text-xs gap-1.5 border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Review Flagged Fraud
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateCampaign}
            className="h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate VIP Campaign
          </Button>
        </div>
      </div>
    </Card>
  );
}
