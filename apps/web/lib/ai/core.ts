/**
 * Core AI Orchestrator & Autonomous Agent Network
 * Coordinates specialized agents, maintains the live chronological business timeline,
 * and manages the AI Action Center execution queue.
 */

export interface AutonomousAgent {
  id: string;
  name: string;
  role: string;
  avatarIcon: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE';
  currentObjective: string;
  confidenceScore: number;
}

export interface BusinessTimelineEvent {
  id: string;
  time: string;
  category: 'REVENUE' | 'INVENTORY' | 'PRICING' | 'FRAUD' | 'MARKETING' | 'AUTOMATION';
  title: string;
  description: string;
  impactTier: 'CRITICAL' | 'OPPORTUNITY' | 'INFO' | 'AUTOMATION';
  agentName: string;
  actionable?: boolean;
}

export interface AutonomousActionItem {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  summary: string;
  agentName: string;
  confidenceScore: number;
  expectedFinancialImpact: string;
  reasoningChain: string[];
  actionType: 'RESTOCK' | 'PRICE_LIFT' | 'HOLD_ORDER' | 'LAUNCH_CAMPAIGN';
  targetEntityId?: string;
  payload?: Record<string, unknown>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SCHEDULED';
}

export const aiCore = {
  getAgents(): AutonomousAgent[] {
    return [
      {
        id: 'ag-ceo',
        name: 'CEO Executive Agent',
        role: 'Strategic Synthesis & Growth',
        avatarIcon: 'Crown',
        status: 'ACTIVE',
        currentObjective: 'Synthesizing morning briefing and monitoring 35% margin floor',
        confidenceScore: 0.98
      },
      {
        id: 'ag-inv',
        name: 'Inventory & Supply Agent',
        role: 'Demand Forecasting & POs',
        avatarIcon: 'Boxes',
        status: 'ACTIVE',
        currentObjective: 'Auditing replenishment runways against 6-day lead times',
        confidenceScore: 0.96
      },
      {
        id: 'ag-prc',
        name: 'Dynamic Pricing Agent',
        role: 'Elasticity & Margin Expansion',
        avatarIcon: 'TrendingUp',
        status: 'ACTIVE',
        currentObjective: 'Tracking competitor out-of-stock surges on key SKUs',
        confidenceScore: 0.94
      },
      {
        id: 'ag-frd',
        name: 'Fraud & Risk Shield Agent',
        role: 'Payment Telemetry & Chargebacks',
        avatarIcon: 'ShieldAlert',
        status: 'ACTIVE',
        currentObjective: 'Scanning checkout velocity & IP proxy signatures',
        confidenceScore: 0.99
      },
      {
        id: 'ag-mkt',
        name: 'Autonomous Marketing Agent',
        role: 'Multi-Channel Acquisition & ROI',
        avatarIcon: 'Megaphone',
        status: 'ACTIVE',
        currentObjective: 'A/B testing Diwali VIP discount codes on WhatsApp',
        confidenceScore: 0.91
      },
      {
        id: 'ag-fin',
        name: 'Finance & Gateway Agent',
        role: 'Multi-Rail Settlement & Fees',
        avatarIcon: 'CreditCard',
        status: 'ACTIVE',
        currentObjective: 'Optimizing UPI vs Card settlement routing speeds',
        confidenceScore: 0.97
      },
      {
        id: 'ag-cst',
        name: 'Customer Retention Agent',
        role: 'CLV & Churn Prevention',
        avatarIcon: 'Users',
        status: 'ACTIVE',
        currentObjective: 'Segmenting top 20% LTV repeat buyer cohort',
        confidenceScore: 0.93
      },
      {
        id: 'ag-wrk',
        name: 'Workflow Automation Agent',
        role: 'Event-Driven Autonomous Tasks',
        avatarIcon: 'Zap',
        status: 'ACTIVE',
        currentObjective: 'Executing inventory threshold alerts and PO drafting',
        confidenceScore: 0.99
      }
    ];
  },

  getTimeline(): BusinessTimelineEvent[] {
    return [
      {
        id: 'evt-1',
        time: '09:21 AM',
        category: 'FRAUD',
        title: 'Suspicious proxy checkout intercepted',
        description: 'Order ORD-9921 flagged with 92% risk score due to 1,200 km geo-mismatch.',
        impactTier: 'CRITICAL',
        agentName: 'Fraud Shield Agent',
        actionable: true
      },
      {
        id: 'evt-2',
        time: '09:43 AM',
        category: 'INVENTORY',
        title: 'Runway threshold alert triggered',
        description: 'Wireless Keyboard stock projected to exhaust in 48 hours.',
        impactTier: 'CRITICAL',
        agentName: 'Inventory Agent',
        actionable: true
      },
      {
        id: 'evt-3',
        time: '10:11 AM',
        category: 'REVENUE',
        title: 'Revenue milestone surpassed',
        description: 'Morning velocity exceeded baseline targets by +14% (₹2.4 Lakh GMV).',
        impactTier: 'OPPORTUNITY',
        agentName: 'CEO Executive Agent'
      },
      {
        id: 'evt-4',
        time: '11:02 AM',
        category: 'PRICING',
        title: 'Competitor stockout detected',
        description: 'Recommended +8% price lift on Ergonomic Pro Mouse to capture margin.',
        impactTier: 'OPPORTUNITY',
        agentName: 'Dynamic Pricing Agent',
        actionable: true
      },
      {
        id: 'evt-5',
        time: '11:17 AM',
        category: 'AUTOMATION',
        title: 'Autonomous PO drafted',
        description: 'Drafted 120-unit replenishment order for primary logistics hub.',
        impactTier: 'AUTOMATION',
        agentName: 'Workflow Agent'
      }
    ];
  },

  getTodayActions(): AutonomousActionItem[] {
    return [
      {
        id: 'act-1',
        severity: 'CRITICAL',
        title: 'Apply +8% Price Lift on Ergonomic Pro Mouse',
        summary:
          'Competitors out of stock across all major channels. Demand elasticity is -0.24, supporting an immediate price adjustment from ₹2,499 to ₹2,699 with zero conversion loss.',
        agentName: 'Dynamic Pricing Agent',
        confidenceScore: 0.94,
        expectedFinancialImpact: '+₹42,000 / month net profit',
        reasoningChain: [
          'Competitor marketplace stock: 0 units',
          '7-day SKU velocity: +31%',
          'Elasticity coefficient: -0.24 (Inelastic)',
          'Estimated conversion variance: < 1.8%'
        ],
        actionType: 'PRICE_LIFT',
        status: 'PENDING'
      },
      {
        id: 'act-2',
        severity: 'CRITICAL',
        title: 'Auto-Draft Restock PO for Wireless Keyboard',
        summary:
          'Current warehouse stock is 12 units. With daily sales of 8 units and a 6-day supplier lead time from Apex Logistics, expected stockout is in 1.5 days.',
        agentName: 'Inventory & Supply Agent',
        confidenceScore: 0.96,
        expectedFinancialImpact: 'Prevents ₹38,400 in lost GMV',
        reasoningChain: [
          'Current inventory: 12 units',
          'Average burn rate: 8 units / day',
          'Supplier transit: 6 days',
          'Probability of stockout: 96%'
        ],
        actionType: 'RESTOCK',
        status: 'PENDING'
      },
      {
        id: 'act-3',
        severity: 'HIGH',
        title: 'Review & Hold Suspicious Order ORD-9921',
        summary:
          'Order value of ₹4,998 flagged by multi-rail fraud filter due to proxy IP routing and a 1,200 km billing/shipping mismatch.',
        agentName: 'Fraud Shield Agent',
        confidenceScore: 0.92,
        expectedFinancialImpact: 'Mitigates ₹4,998 chargeback liability',
        reasoningChain: [
          'Order value: ₹4,998 (3.4x average)',
          'IP check: Commercial VPN proxy',
          'Card history: Zero prior transactions',
          'Recommendation: Hold payment settlement'
        ],
        actionType: 'HOLD_ORDER',
        status: 'PENDING'
      },
      {
        id: 'act-4',
        severity: 'MEDIUM',
        title: 'Deploy Multi-Channel Festival Campaign',
        summary:
          'Pre-drafted WhatsApp and Instagram push targeting top 280 VIP buyers with exclusive 15% holiday coupon code.',
        agentName: 'Autonomous Marketing Agent',
        confidenceScore: 0.91,
        expectedFinancialImpact: 'Projected 2.8x campaign ROI',
        reasoningChain: [
          'Target cohort: 280 VIP repeat buyers',
          'Historical open rate: 74% on WhatsApp',
          'Expected conversion rate: 4.2%',
          'Projected gross sales: ₹1,65,000'
        ],
        actionType: 'LAUNCH_CAMPAIGN',
        status: 'PENDING'
      }
    ];
  },

  getMerchantHealthScore(): {
    overallScore: number;
    inventoryScore: number;
    salesScore: number;
    customerScore: number;
    cashflowScore: number;
    grade: string;
    summary: string;
  } {
    return {
      overallScore: 94,
      inventoryScore: 95,
      salesScore: 90,
      customerScore: 93,
      cashflowScore: 98,
      grade: 'A+ Enterprise Grade',
      summary:
        'Operations are performing in the 94th percentile of mid-market merchants. Multi-rail payment rails are operating at peak 97.4% reliability, with inventory stockouts successfully contained.'
    };
  }
};
