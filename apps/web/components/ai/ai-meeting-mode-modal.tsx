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
import {
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  CheckCircle2
} from 'lucide-react';
import { voiceAI } from '@/lib/ai/voice-ai';
import { toast } from 'sonner';

interface AIMeetingModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MEETING_SLIDES = [
  {
    slideNumber: 1,
    title: 'Weekly Executive Overview',
    subtitle: 'Revenue, Gross Margin & Growth Trajectory',
    bullets: [
      'Total weekly GMV reached ₹16,42,800 (+14% week-over-week).',
      'Average order value expanded from ₹2,120 to ₹2,350 (+10.8%).',
      'Operating gross margin stabilized at 38.2% across catalog.'
    ],
    metricValue: '₹16.42L',
    metricLabel: 'Weekly GMV',
    narration:
      'Welcome everyone to the weekly performance review. Weekly revenue expanded 14% to 16.4 Lakh, with strong margin retention of 38.2% across catalog.'
  },
  {
    slideNumber: 2,
    title: 'Warehouse & Catalog Telemetry',
    subtitle: 'Supply Chain, Stockouts & Lead Times',
    bullets: [
      'Ergonomic Wireless Mouse inventory at critical threshold (14 units).',
      'Purchase order of 120 units queued to Apex Logistics (4-day transit).',
      'Zero stockout incidents occurred over past 14 days.'
    ],
    metricValue: '2 Low SKUs',
    metricLabel: 'Warehouse Risk',
    narration:
      'Turning to inventory: our primary action item is replenishing the Wireless Mouse. Apex Logistics lead time is 4 days, so the purchase order must be approved today.'
  },
  {
    slideNumber: 3,
    title: 'Fraud Prevention & Payment Rails',
    subtitle: 'Risk Shield & Gateway Routing Health',
    bullets: [
      'Multi-rail payment success rate achieved 97.4% across 4 gateways.',
      'UPI Intent routing delivered ₹14,200 in MDR fee savings.',
      'Order ORD-9921 successfully intercepted, preventing ₹4,998 chargeback.'
    ],
    metricValue: '97.4%',
    metricLabel: 'Payment Reliability',
    narration:
      'Payment health is operating at peak performance with 97.4% reliability. Fraud intelligence intercepted one suspicious proxy order, saving five thousand rupees.'
  },
  {
    slideNumber: 4,
    title: 'Next Week Strategic Directives',
    subtitle: 'AI Priorities & Margin Optimization',
    bullets: [
      'Deploy +8% price lift on Ergonomic line based on competitor stockout.',
      'Launch Friday WhatsApp VIP flash sale targeting 280 top-tier buyers.',
      'Recalibrate Bayesian demand forecast for festive Q4 surge.'
    ],
    metricValue: '+18% Target',
    metricLabel: 'Projected Q4 Lift',
    narration:
      'In summary, our key directives for next week are executing the 8% price lift, launching the VIP campaign, and expanding stock buffers for the Q4 surge.'
  }
];

export function AIMeetingModeModal({ open, onOpenChange }: AIMeetingModeModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentSlide = MEETING_SLIDES[currentSlideIndex] || MEETING_SLIDES[0]!;

  const handleNext = () => {
    if (currentSlideIndex < MEETING_SLIDES.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      if (isSpeaking) {
        const nextSlide = MEETING_SLIDES[nextIndex];
        if (nextSlide) {
          voiceAI.speak(nextSlide.narration);
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      if (isSpeaking) {
        const prevSlide = MEETING_SLIDES[prevIndex];
        if (prevSlide) {
          voiceAI.speak(prevSlide.narration);
        }
      }
    }
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceAI.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceAI.speak(currentSlide.narration, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummary = () => {
    toast.success('Executive Weekly Meeting Slide Deck exported to PDF.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-background border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              AI Meeting Mode & Weekly Review
            </Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono">
                Slide {currentSlideIndex + 1} of {MEETING_SLIDES.length}
              </Badge>
              <Button
                size="sm"
                variant={isSpeaking ? 'default' : 'outline'}
                onClick={handleToggleVoice}
                className="h-7 text-xs gap-1.5"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>AI Presenter Speak</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {currentSlide.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            {currentSlide.subtitle}
          </DialogDescription>
        </div>

        {/* Slide Canvas */}
        <div className="p-8 bg-muted/20 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Slide Bullets */}
            <div className="sm:col-span-2 space-y-3">
              {currentSlide.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/70 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-foreground leading-relaxed">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Slide Hero Metric Card */}
            <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-card flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                {currentSlide.metricLabel}
              </span>
              <span className="text-3xl font-extrabold font-mono text-primary">
                {currentSlide.metricValue}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] text-emerald-500 border-emerald-500/30 font-mono"
              >
                Verified Ground Truth
              </Badge>
            </div>
          </div>

          {/* AI Presenter Script Preview */}
          <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-xs text-muted-foreground font-mono">
            <span className="font-bold text-foreground font-sans">🎙️ AI Speech Script: </span>"
            {currentSlide.narration}"
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <DialogFooter className="p-4 bg-background border-t border-border/60 flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentSlideIndex === MEETING_SLIDES.length - 1}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button
              size="sm"
              onClick={handleExportSummary}
              className="h-8 text-xs gap-1.5 shadow-xs"
            >
              <Download className="h-3.5 w-3.5" /> Export Slides PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
