/**
 * Named AI Digital Executives & Agent Workforce Registry
 * Represents the autonomous AI employees running the merchant business.
 */

export interface AIEmployee {
  id: string;
  name: string;
  callsign: string;
  role: string;
  department: 'Executive' | 'Supply Chain' | 'Pricing' | 'Security' | 'Finance' | 'CRM' | 'Growth';
  avatarInitials: string;
  avatarColor: string; // Tailwind color token
  borderColor: string;
  accentColor: string;
  status: 'ACTIVE' | 'WORKING' | 'DELIBERATING' | 'STANDBY';
  confidence: number;
  currentTask: string;
  lastAction: string;
  specialization: string[];
  metricsHandled: string[];
  monthlyImpact: string;
  voicePitch: number;
}

export const AI_WORKFORCE: AIEmployee[] = [
  {
    id: 'emp-athena',
    name: 'Athena',
    callsign: 'Executive Chief of Staff',
    role: 'Autonomous Strategic Orchestrator',
    department: 'Executive',
    avatarInitials: 'AT',
    avatarColor: 'bg-purple-600 text-purple-100',
    borderColor: 'border-purple-500/40',
    accentColor: 'text-purple-400',
    status: 'ACTIVE',
    confidence: 99,
    currentTask: 'Synthesizing multi-agent consensus for weekly inventory allocation',
    lastAction: 'Published Executive Briefing & held fraudulent order #2191',
    specialization: [
      'Strategic Planning',
      'Consensus Arbitration',
      'Risk Prioritization',
      'Board Reports'
    ],
    metricsHandled: [
      'Overall Health Score',
      'GMV Run Rate',
      'Operating Margin',
      'Total Value Protected'
    ],
    monthlyImpact: '+₹3,18,000 GMV / 42 hrs saved',
    voicePitch: 1.05
  },
  {
    id: 'emp-atlas',
    name: 'Atlas',
    callsign: 'Supply Chain & Inventory Specialist',
    role: 'Lead Inventory Intelligence Engineer',
    department: 'Supply Chain',
    avatarInitials: 'AL',
    avatarColor: 'bg-blue-600 text-blue-100',
    borderColor: 'border-blue-500/40',
    accentColor: 'text-blue-400',
    status: 'WORKING',
    confidence: 97,
    currentTask: 'Calculating supplier lead-time buffers for Shenzhen Tech transit delay',
    lastAction: 'Created draft Restock PO for 120 units Wireless Mouse',
    specialization: [
      'Stockout Prevention',
      'Lead Time Modeling',
      'PO Auto-Drafting',
      'Safety Buffer Calculation'
    ],
    metricsHandled: [
      'Days of Inventory',
      'Stockout Risk Index',
      'Supplier Reliability',
      'Reorder Velocity'
    ],
    monthlyImpact: '0 Stockouts prevented on Top 20 SKUs',
    voicePitch: 0.95
  },
  {
    id: 'emp-vega',
    name: 'Vega',
    callsign: 'Pricing & Elasticity Specialist',
    role: 'Dynamic Pricing & Gross Margin Architect',
    department: 'Pricing',
    avatarInitials: 'VG',
    avatarColor: 'bg-emerald-600 text-emerald-100',
    borderColor: 'border-emerald-500/40',
    accentColor: 'text-emerald-400',
    status: 'WORKING',
    confidence: 94,
    currentTask: 'Simulating price elasticity curve for Mechanical Gaming Keyboard',
    lastAction: 'Applied +8% price lift on Wireless Ergonomic Mouse (₹999 → ₹1,099)',
    specialization: [
      'Price Elasticity',
      'Competitor Scraping',
      'Margin Maximization',
      'Discount Defense'
    ],
    metricsHandled: [
      'Gross Margin %',
      'Average Order Value',
      'Discount Burn Rate',
      'Price Realization'
    ],
    monthlyImpact: '+18.2% Gross Margin Expansion',
    voicePitch: 1.1
  },
  {
    id: 'emp-sentinel',
    name: 'Sentinel',
    callsign: 'Risk & Fraud Shield Specialist',
    role: 'Autonomous Fraud Detection & Loss Prevention Officer',
    department: 'Security',
    avatarInitials: 'SN',
    avatarColor: 'bg-rose-600 text-rose-100',
    borderColor: 'border-rose-500/40',
    accentColor: 'text-rose-400',
    status: 'ACTIVE',
    confidence: 98,
    currentTask: 'Analyzing real-time IP velocity surge across gateway ingress',
    lastAction: 'Intercepted and held high-risk order #2191 (Risk Score: 92/100)',
    specialization: [
      'VPN/Proxy Detection',
      'Device Fingerprinting',
      'Chargeback Prevention',
      'Address Verification'
    ],
    metricsHandled: [
      'Fraud Rate %',
      'Chargeback Volume',
      'Held GMV',
      'False Positive Ratio (<0.1%)'
    ],
    monthlyImpact: 'Protected ₹84,200 from fraud',
    voicePitch: 0.9
  },
  {
    id: 'emp-pulse',
    name: 'Pulse',
    callsign: 'Revenue & Financial Velocity Specialist',
    role: 'Forecasting & Cash Flow Strategist',
    department: 'Finance',
    avatarInitials: 'PL',
    avatarColor: 'bg-amber-600 text-amber-100',
    borderColor: 'border-amber-500/40',
    accentColor: 'text-amber-400',
    status: 'DELIBERATING',
    confidence: 96,
    currentTask: 'Generating 3-band probabilistic revenue forecast for Q3',
    lastAction: 'Recalibrated expected 7-day run rate to ₹14.8 Lakh (+12.4%)',
    specialization: [
      'Probabilistic Modeling',
      'Payment Rail Optimization',
      'Working Capital Forecasting',
      'Settlement Auditing'
    ],
    metricsHandled: [
      'Daily Run Rate',
      'Payment Gateway Latency',
      'T+0 Settlement Ratio',
      'Refund Velocity'
    ],
    monthlyImpact: '97.4% UPI success rate achieved',
    voicePitch: 1.0
  },
  {
    id: 'emp-orion',
    name: 'Orion',
    callsign: 'Customer Retention & Cohort Specialist',
    role: 'RFM Segmentation & Lifetime Value Strategist',
    department: 'CRM',
    avatarInitials: 'OR',
    avatarColor: 'bg-indigo-600 text-indigo-100',
    borderColor: 'border-indigo-500/40',
    accentColor: 'text-indigo-400',
    status: 'ACTIVE',
    confidence: 92,
    currentTask: 'Tracking repeat purchase velocity for VIP Tier (280 customers)',
    lastAction: 'Flagged 14 High-LTV buyers showing early churn risk patterns',
    specialization: [
      'RFM Clustering',
      'Churn Prediction',
      'Repurchase Cycles',
      'Customer Health Score'
    ],
    metricsHandled: [
      'LTV:CAC Ratio',
      '30-Day Repeat Rate',
      'Net Promoter Score',
      'Dormancy Recovery %'
    ],
    monthlyImpact: '+24% Repeat Purchase Lift',
    voicePitch: 1.02
  },
  {
    id: 'emp-nova',
    name: 'Nova',
    callsign: 'Omnichannel Marketing & Campaign Specialist',
    role: 'Autonomous Growth & Promotion Architect',
    department: 'Growth',
    avatarInitials: 'NV',
    avatarColor: 'bg-pink-600 text-pink-100',
    borderColor: 'border-pink-500/40',
    accentColor: 'text-pink-400',
    status: 'STANDBY',
    confidence: 91,
    currentTask: 'Awaiting executive authorization for VIP Flash Campaign',
    lastAction: 'Drafted 3-channel WhatsApp/Instagram/SMS promo (2.8x ROI projected)',
    specialization: [
      'Campaign Generation',
      'Coupon Margin Defense',
      'Audience Personalization',
      'ROAS Optimization'
    ],
    metricsHandled: [
      'Campaign ROI',
      'WhatsApp Open Rate',
      'Checkout Conversion',
      'Ad Spend Efficiency'
    ],
    monthlyImpact: '2.8x Projected Campaign ROI',
    voicePitch: 1.15
  }
];

class AgentWorkforceStore {
  private employees: AIEmployee[] = [...AI_WORKFORCE];
  private listeners: Set<() => void> = new Set();

  getEmployees(): AIEmployee[] {
    return [...this.employees];
  }

  getEmployeeById(id: string): AIEmployee | undefined {
    return this.employees.find((e) => e.id === id);
  }

  updateEmployeeStatus(id: string, status: AIEmployee['status'], currentTask?: string): void {
    const emp = this.employees.find((e) => e.id === id);
    if (emp) {
      emp.status = status;
      if (currentTask) emp.currentTask = currentTask;
      this.notify();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const agentWorkforce = new AgentWorkforceStore();
