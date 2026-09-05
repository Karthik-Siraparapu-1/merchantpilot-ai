'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, Share2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketingAIPage() {
  const [selectedChannel, setSelectedChannel] = useState<
    'WHATSAPP' | 'INSTAGRAM' | 'EMAIL' | 'SMS' | 'COUPONS'
  >('WHATSAPP');
  const [copied, setCopied] = useState(false);

  const campaigns = {
    WHATSAPP: {
      headline: 'VIP Diwali Special — Early Access for Karthik Commerce Members',
      content:
        '✨ Exclusive Early Access: Karthik Commerce Festival Sale is officially live!\n\nAs a valued VIP member, enjoy an extra 15% OFF your cart with code: FESTIVAL15.\n\n⚡ Complimentary express shipping on orders over ₹999.\nShop now: https://karthik-commerce.com/vip\n\nReply STOP to opt out.',
      predictedRoi: '3.2x ROI',
      targetAudience: 'Top 280 VIP Buyers (LTV > ₹15,000)'
    },
    INSTAGRAM: {
      headline: 'High-Impact Carousel Caption & Hashtag Matrix',
      content:
        'Work smarter, create faster. 🚀 Discover the brand new Ergonomic Pro Series engineered for modern creators and builders. \n\n✨ Precision tracking\n✨ Multi-device instant pairing\n✨ All-day ergonomic support\n\nTap the link in bio to claim your 15% festive launch discount! Limited units remaining.\n\n#KarthikCommerce #DeskSetup #ProductivityHacks #TechGear #FestiveDeals',
      predictedRoi: '2.6x ROI',
      targetAudience: 'Lookalike Audience: Tech & Productivity Enthusiasts'
    },
    EMAIL: {
      headline: 'Subject: Your exclusive festive invitation is waiting 🎁',
      content:
        'Dear Customer,\n\nOur annual festival collection has officially landed at Karthik Commerce. Because you are one of our core patrons, we are giving you 24-hour priority access before public inventory opens.\n\nUse your personalized code FESTIVAL15 at checkout for 15% off.\n\nBest regards,\nKarthik Siraparapu & the MerchantPilot Team',
      predictedRoi: '4.1x ROI',
      targetAudience: 'Active Subscribers (Opened in last 30 days)'
    },
    SMS: {
      headline: 'Urgent 160-Character Flash SMS',
      content:
        'Karthik Commerce: 15% OFF all top gear with code FESTIVAL15 today only. Stock is strictly limited. Order: https://karthik-commerce.com/go',
      predictedRoi: '2.9x ROI',
      targetAudience: 'SMS Opt-In Customers'
    },
    COUPONS: {
      headline: 'Dynamic Smart Coupon: FESTIVAL15',
      content:
        'CODE: FESTIVAL15\nDiscount: 15% (Min Order: ₹1,500)\nUsage Limit: 1 per user (Max 500 redemptions)\nStatus: Active in Payment Gateway\nEstimated Margin Impact: +₹1,24,000 net GMV',
      predictedRoi: '3.8x ROI',
      targetAudience: 'All Qualifying Store Checkout Visitors'
    }
  };

  const activeCampaign = campaigns[selectedChannel];

  const handleCopy = () => {
    void navigator.clipboard.writeText(activeCampaign.content);
    setCopied(true);
    toast.success('Campaign copy copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
    toast.success(`Autonomous Campaign "${selectedChannel}" queued for immediate dispatch!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Autonomous Marketing Agent
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-mono text-emerald-500 border-emerald-500/30"
            >
              High Conversion Matrix
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Multi-Channel Marketing AI
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instant AI campaign copy generation for WhatsApp, Instagram, Email, SMS, and Smart
            Coupons.
          </p>
        </div>

        <Button size="sm" onClick={handleDeploy} className="gap-1.5 shadow-xs">
          <Send className="h-3.5 w-3.5" />
          <span>Launch Campaign</span>
        </Button>
      </div>

      {/* Channel Switcher */}
      <div className="flex gap-2 border-b border-border/70 pb-3 overflow-x-auto">
        {(['WHATSAPP', 'INSTAGRAM', 'EMAIL', 'SMS', 'COUPONS'] as const).map((channel) => (
          <button
            key={channel}
            onClick={() => setSelectedChannel(channel)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedChannel === channel
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {channel === 'WHATSAPP' && 'WhatsApp Business'}
            {channel === 'INSTAGRAM' && 'Instagram Ad Copy'}
            {channel === 'EMAIL' && 'Email Newsletter'}
            {channel === 'SMS' && 'Flash SMS'}
            {channel === 'COUPONS' && 'Smart Coupon Generator'}
          </button>
        ))}
      </div>

      {/* Campaign Detail Card */}
      <Card className="p-6 border-border/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">{activeCampaign.headline}</h3>
            <span className="text-xs text-muted-foreground">
              Audience: {activeCampaign.targetAudience}
            </span>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
            {activeCampaign.predictedRoi}
          </Badge>
        </div>

        {/* Content Box */}
        <div className="relative rounded-xl border border-border/80 bg-muted/30 p-4 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed">
          {activeCampaign.content}

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-8 text-xs gap-1.5 bg-background"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Targeting rules & frequency caps enforced automatically.</span>
          <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 text-xs gap-1">
            <Share2 className="h-3.5 w-3.5" /> Share with Team
          </Button>
        </div>
      </Card>
    </div>
  );
}
