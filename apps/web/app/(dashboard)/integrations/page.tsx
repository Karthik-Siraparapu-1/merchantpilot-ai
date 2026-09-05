'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Puzzle,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Sheet,
  Zap,
  Globe,
  CreditCard,
  PackageCheck,
  Store,
  Search,
  ExternalLink,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  category:
    | 'COMMERCE'
    | 'MARKETPLACE'
    | 'MESSAGING'
    | 'PRODUCTIVITY'
    | 'AUTOMATION'
    | 'PAYMENT'
    | 'LOGISTICS'
    | 'RETAIL';
  icon: React.ElementType;
  status: 'CONNECTED' | 'AVAILABLE' | 'COMING_SOON';
  docsUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync products, orders, and inventory with your Shopify store.',
    category: 'COMMERCE',
    icon: ShoppingBag,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Full WordPress + WooCommerce integration with real-time sync.',
    category: 'COMMERCE',
    icon: Globe,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'amazon',
    name: 'Amazon Seller',
    description: 'Manage Amazon seller inventory and pricing from MerchantPilot.',
    category: 'MARKETPLACE',
    icon: PackageCheck,
    status: 'COMING_SOON'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    description: 'Sync Flipkart seller listings, orders, and returns.',
    category: 'MARKETPLACE',
    icon: Store,
    status: 'COMING_SOON'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    description: 'Connect your Meesho supplier catalog with AI pricing.',
    category: 'MARKETPLACE',
    icon: Store,
    status: 'COMING_SOON'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Send AI-generated marketing messages and order updates.',
    category: 'MESSAGING',
    icon: MessageCircle,
    status: 'CONNECTED'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get AI alerts, anomaly notifications, and daily briefs in Slack.',
    category: 'MESSAGING',
    icon: MessageCircle,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Export reports, analytics, and forecasts to Google Sheets.',
    category: 'PRODUCTIVITY',
    icon: Sheet,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect MerchantPilot to 5000+ apps via Zapier automations.',
    category: 'AUTOMATION',
    icon: Zap,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Payment gateway integration with settlement tracking.',
    category: 'PAYMENT',
    icon: CreditCard,
    status: 'CONNECTED'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Global payment processing with fraud detection.',
    category: 'PAYMENT',
    icon: CreditCard,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'erp',
    name: 'ERP / SAP',
    description: 'Enterprise resource planning integration for large enterprises.',
    category: 'AUTOMATION',
    icon: PackageCheck,
    status: 'COMING_SOON'
  },
  {
    id: 'shiprocket',
    name: 'Shiprocket',
    description: 'Logistics and shipping integration for Indian merchants.',
    category: 'LOGISTICS',
    icon: PackageCheck,
    status: 'AVAILABLE',
    docsUrl: '#'
  },
  {
    id: 'pos',
    name: 'POS Systems',
    description: 'In-store point-of-sale sync for omnichannel inventory.',
    category: 'RETAIL',
    icon: Store,
    status: 'COMING_SOON'
  }
];

const STATUS_CONFIG = {
  CONNECTED: { label: 'Connected', color: 'text-emerald-500 border-emerald-500/30', icon: Check },
  AVAILABLE: { label: 'Available', color: 'text-blue-500 border-blue-500/30', icon: ArrowRight },
  COMING_SOON: { label: 'Coming Soon', color: 'text-muted-foreground border-border', icon: Clock }
};

const CATEGORIES = [
  'ALL',
  'COMMERCE',
  'MARKETPLACE',
  'MESSAGING',
  'PRODUCTIVITY',
  'AUTOMATION',
  'PAYMENT',
  'LOGISTICS',
  'RETAIL'
] as const;

export default function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('ALL');

  const filtered = INTEGRATIONS.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || i.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const connectedCount = INTEGRATIONS.filter((i) => i.status === 'CONNECTED').length;
  const availableCount = INTEGRATIONS.filter((i) => i.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Puzzle className="h-3 w-3 text-indigo-500" />
            Integrations Hub
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-mono text-emerald-500 border-emerald-500/30"
          >
            {connectedCount} Connected
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Connect MerchantPilot AI to your commerce ecosystem. {availableCount} integrations
          available.
        </p>
      </div>

      {/* AI Banner */}
      <Card className="p-4 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-card to-blue-500/5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">AI Integration Recommendations</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Based on your business profile, connecting <strong>Shopify</strong> and{' '}
              <strong>Slack</strong> would enable real-time inventory sync and AI alert
              notifications, reducing stockout risk by an estimated <strong>34%</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={activeCategory === cat ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat)}
            className="h-7 text-[11px]"
          >
            {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </Button>
        ))}
        <div className="ml-auto relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="h-8 pl-8 text-xs w-48"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((integration) => {
          const Icon = integration.icon;
          const statusCfg = STATUS_CONFIG[integration.status];
          const StatusIcon = statusCfg.icon;

          return (
            <Card
              key={integration.id}
              className={cn(
                'p-5 border-border/80 hover:shadow-md transition-all hover:border-indigo-500/30',
                integration.status === 'CONNECTED' && 'border-emerald-500/20 bg-emerald-500/[0.02]'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                      integration.status === 'CONNECTED' ? 'bg-emerald-500/10' : 'bg-muted/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        integration.status === 'CONNECTED'
                          ? 'text-emerald-500'
                          : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                    <Badge variant="outline" className={cn('text-[9px] mt-0.5', statusCfg.color)}>
                      <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                      {statusCfg.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2">
                {integration.description}
              </p>

              <div className="flex items-center gap-2">
                {integration.status === 'CONNECTED' && (
                  <Button size="sm" variant="outline" className="h-7 text-[11px] flex-1">
                    Configure
                  </Button>
                )}
                {integration.status === 'AVAILABLE' && (
                  <Button size="sm" className="h-7 text-[11px] flex-1 gap-1">
                    Connect <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                {integration.status === 'COMING_SOON' && (
                  <Button size="sm" variant="outline" disabled className="h-7 text-[11px] flex-1">
                    Coming Soon
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
