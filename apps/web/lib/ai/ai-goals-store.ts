/**
 * AI Goals Store
 * Represents autonomous business objectives pursued by the AI workforce
 * with real-time target metrics and progress tracking.
 */

export interface AIBusinessGoal {
  id: string;
  title: string;
  targetMetric: string;
  currentValue: string;
  targetValue: string;
  progressPercent: number;
  assignedAgent: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'EXCEEDING';
  tactics: string[];
  daysRemaining: number;
}

export const DEFAULT_GOALS: AIBusinessGoal[] = [
  {
    id: 'goal-gmv',
    title: 'Scale Monthly GMV to ₹45 Lakh',
    targetMetric: 'Monthly Gross Merchandise Value',
    currentValue: '₹38.5 Lakh',
    targetValue: '₹45.0 Lakh',
    progressPercent: 85,
    assignedAgent: 'Pulse (Revenue)',
    status: 'ON_TRACK',
    tactics: [
      'Multi-rail checkout optimization to reduce drop-offs',
      'Dynamic price adjustments on high-elasticity SKUs',
      'VIP customer repurchase flash reminders'
    ],
    daysRemaining: 18
  },
  {
    id: 'goal-margins',
    title: 'Expand Gross Operating Margin to 40%',
    targetMetric: 'Blended Gross Margin %',
    currentValue: '38.2%',
    targetValue: '40.0%',
    progressPercent: 91,
    assignedAgent: 'Vega (Pricing)',
    status: 'EXCEEDING',
    tactics: [
      'Raised Wireless Mouse price to ₹1,099 (+8%)',
      'Defended promo codes against sub-margin carts',
      'Dynamic freight surcharges on distant zones'
    ],
    daysRemaining: 12
  },
  {
    id: 'goal-stockouts',
    title: 'Zero Stockouts on Top 20 Revenue SKUs',
    targetMetric: 'Availability SLA %',
    currentValue: '96.4%',
    targetValue: '99.5%',
    progressPercent: 88,
    assignedAgent: 'Atlas (Inventory)',
    status: 'ON_TRACK',
    tactics: [
      'Reorder threshold dynamically set to 6-day lead times',
      'Draft PO generated for 120 units Ergonomic Mouse',
      'Supplier reliability tracking for Shenzhen Tech'
    ],
    daysRemaining: 24
  },
  {
    id: 'goal-fraud',
    title: 'Maintain Chargeback Rate Under 0.15%',
    targetMetric: 'Chargeback & Fraud Loss Ratio',
    currentValue: '0.04%',
    targetValue: '<0.15%',
    progressPercent: 98,
    assignedAgent: 'Sentinel (Fraud)',
    status: 'EXCEEDING',
    tactics: [
      'VPN and Tor exit node blocking on guest checkouts',
      'Real-time velocity scoring on credit card rails',
      'Held Order #2191 pending phone OTP verification'
    ],
    daysRemaining: 30
  },
  {
    id: 'goal-repeat',
    title: 'Increase 30-Day Repeat Buyer Ratio to 35%',
    targetMetric: 'VIP & Returning Customer Share',
    currentValue: '28.4%',
    targetValue: '35.0%',
    progressPercent: 74,
    assignedAgent: 'Orion & Nova',
    status: 'AT_RISK',
    tactics: [
      'Segmented 280 VIP buyers for personalized festival offer',
      'Automated replenishment reminders 21 days post-delivery',
      'WhatsApp interactive reorder catalog'
    ],
    daysRemaining: 14
  }
];

class AIGoalsStore {
  private goals: AIBusinessGoal[] = [...DEFAULT_GOALS];
  private listeners: Set<() => void> = new Set();

  getGoals(): AIBusinessGoal[] {
    return [...this.goals];
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const aiGoalsStore = new AIGoalsStore();
