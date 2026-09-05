/**
 * Multi-Agent Debate Engine
 * Simulates and visualizes live deliberations between specialized AI employees
 * leading up to executive consensus.
 */

export interface DebateParticipant {
  agentId: string;
  agentName: string;
  agentRole: string;
  avatarInitials: string;
  avatarColor: string;
  stance: string;
  confidence: number;
  keyArgument: string;
  evidenceData: string[];
}

export interface MultiAgentDebate {
  id: string;
  topic: string;
  timestamp: string;
  status: 'DELIBERATING' | 'RESOLVED';
  participants: DebateParticipant[];
  executiveVerdict: {
    arbiter: string;
    decision: string;
    rationale: string;
    expectedOutcome: string;
    approvedAt: string;
  };
}

export const SAMPLE_DEBATES: MultiAgentDebate[] = [
  {
    id: 'deb-001',
    topic: 'Replenishment Timing & Margin Elasticity for Wireless Ergonomic Mouse',
    timestamp: '10:14 AM',
    status: 'RESOLVED',
    participants: [
      {
        agentId: 'emp-atlas',
        agentName: 'Atlas',
        agentRole: 'Supply Chain & Inventory',
        avatarInitials: 'AL',
        avatarColor: 'bg-blue-600 text-blue-100',
        stance: 'IMMEDIATE REORDER (+120 units)',
        confidence: 94,
        keyArgument:
          'Current inventory is 4 units. Runout risk triggers in 36 hours. Shenzhen Tech lead time is 4 days.',
        evidenceData: [
          'Daily run-rate: 1.8 units/day',
          'Supplier delay variance: +1.2 days',
          'Safety stock breached'
        ]
      },
      {
        agentId: 'emp-vega',
        agentName: 'Vega',
        agentRole: 'Pricing & Elasticity',
        avatarInitials: 'VG',
        avatarColor: 'bg-emerald-600 text-emerald-100',
        stance: 'INCREASE PRICE (+8%) FIRST',
        confidence: 88,
        keyArgument:
          'Raise price to ₹1,099 immediately to temper velocity by 12% while boosting unit margins, postponing stockout.',
        evidenceData: [
          'Competitor price: ₹1,249',
          'Price elasticity: -0.62 (Inelastic)',
          'Gross profit expands +₹18,400'
        ]
      },
      {
        agentId: 'emp-pulse',
        agentName: 'Pulse',
        agentRole: 'Revenue Velocity',
        avatarInitials: 'PL',
        avatarColor: 'bg-amber-600 text-amber-100',
        stance: 'WEEKEND SURGE COMING',
        confidence: 91,
        keyArgument:
          'Weekend checkout velocity surges +28%. Raising price will protect margin but restock PO must dispatch today.',
        evidenceData: [
          'Historical Saturday uplift: +32%',
          'Cart abandonment risk: Low',
          'Working capital impact: ₹68,000'
        ]
      }
    ],
    executiveVerdict: {
      arbiter: 'Athena (Chief of Staff)',
      decision: 'HYBRID ACTION: Apply +8% price lift AND dispatch 120-unit restock PO',
      rationale:
        'Vega’s margin expansion dampens runout velocity just enough for Atlas’s supplier delivery window, maximizing total profit without zero-inventory downtime.',
      expectedOutcome: '+₹42,000 projected profit lift / Zero stockout gap',
      approvedAt: '10:18 AM'
    }
  },
  {
    id: 'deb-002',
    topic: 'Fraud Risk vs Customer Friction on Order #2191 (₹4,998)',
    timestamp: '09:22 AM',
    status: 'RESOLVED',
    participants: [
      {
        agentId: 'emp-sentinel',
        agentName: 'Sentinel',
        agentRole: 'Fraud & Risk Shield',
        avatarInitials: 'SN',
        avatarColor: 'bg-rose-600 text-rose-100',
        stance: 'HARD INTERCEPT & HOLD',
        confidence: 96,
        keyArgument:
          'Datacenter VPN IP detected with 3 failed checkout attempts in 4 minutes from fresh device fingerprint.',
        evidenceData: [
          'Risk score: 92/100',
          'IP Geolocation mismatch: 1,400km',
          'Card BIN origin: International'
        ]
      },
      {
        agentId: 'emp-orion',
        agentName: 'Orion',
        agentRole: 'Customer Retention',
        avatarInitials: 'OR',
        avatarColor: 'bg-indigo-600 text-indigo-100',
        stance: 'SOFT SMS VERIFICATION',
        confidence: 76,
        keyArgument:
          'Customer shipping address matches a recurring apartment complex in Pune. Do not immediately cancel without notification.',
        evidenceData: [
          'Delivery zip: 411014',
          'First-time email domain: gmail.com',
          'AOV matches store average'
        ]
      }
    ],
    executiveVerdict: {
      arbiter: 'Athena (Chief of Staff)',
      decision: 'EXECUTE FRAUD HOLD & DISPATCH ONE-TIME OTP CHALLENGE',
      rationale:
        'Prioritize balance-sheet protection against chargeback penalties while giving genuine buyer an instant SMS pathway to clear verification.',
      expectedOutcome: 'Zero chargeback liability / ₹4,998 protected',
      approvedAt: '09:25 AM'
    }
  }
];
