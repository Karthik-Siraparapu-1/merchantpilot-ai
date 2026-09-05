/**
 * Autonomous AI Auto-Pilot State Management
 * Supports 3 autonomous governance modes:
 * - OFF: All AI actions are strictly advisory
 * - SUGGEST: AI automatically drafts actions and queues them in the Approval Center (Default)
 * - AUTO: AI executes low-risk optimizations autonomously, requesting review only for major decisions
 */

export type AutoPilotMode =
  | 'OFF'
  | 'SUGGEST'
  | 'AUTO'
  | 'MANUAL'
  | 'RECOMMENDATIONS'
  | 'SEMI_AUTONOMOUS'
  | 'FULLY_AUTONOMOUS';

export interface AutonomyTierDetail {
  mode: AutoPilotMode;
  label: string;
  badge: string;
  description: string;
  riskTolerance: string;
  autoExecuteScope: string;
}

export const AUTONOMY_TIERS: AutonomyTierDetail[] = [
  {
    mode: 'MANUAL',
    label: 'Manual Mode',
    badge: 'Human Only',
    description: 'AI operates strictly as a read-only telemetry observer. Zero automated changes.',
    riskTolerance: 'Zero Risk',
    autoExecuteScope: 'None'
  },
  {
    mode: 'RECOMMENDATIONS',
    label: 'Recommendations Mode',
    badge: 'Advisory',
    description:
      'AI drafts recommendations with explainability. Merchant must manually initiate each action.',
    riskTolerance: 'Low Risk',
    autoExecuteScope: 'Drafts only'
  },
  {
    mode: 'SEMI_AUTONOMOUS',
    label: 'Semi-Autonomous (Default)',
    badge: 'Supervised',
    description:
      'AI auto-executes low-risk reversible adjustments (<₹5,000). High-impact actions require 1-click sign-off.',
    riskTolerance: 'Balanced',
    autoExecuteScope: 'Reversible pricing & stock buffers'
  },
  {
    mode: 'FULLY_AUTONOMOUS',
    label: 'Fully Autonomous',
    badge: 'Hands Free',
    description:
      'AI workforce operates 24/7. Auto-dispatches POs, dynamic price shifts, and fraud holds within budget caps.',
    riskTolerance: 'Enterprise Bound',
    autoExecuteScope: 'All routine commerce operations'
  }
];

export interface AutonomousAction {
  id: string;
  category: 'INVENTORY' | 'PRICING' | 'FRAUD' | 'MARKETING' | 'PAYMENTS';
  title: string;
  description: string;
  impact: string;
  confidenceScore: number;
  evidence: string;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

const DEFAULT_ACTIONS: AutonomousAction[] = [
  {
    id: 'auto-1',
    category: 'INVENTORY',
    title: 'Draft Restock PO for Wireless Mouse (120 units)',
    description: 'Predicted warehouse depletion within 48 hours based on weekend order velocity.',
    impact: 'Prevents ₹38,400 in lost GMV',
    confidenceScore: 96,
    evidence: 'Lead time 4 days from Apex Logistics. Current runway: 2 days.',
    timestamp: '10 mins ago',
    status: 'PENDING',
    riskLevel: 'LOW'
  },
  {
    id: 'auto-2',
    category: 'FRAUD',
    title: 'Isolate & Hold Order #ORD-9921',
    description: 'Order flagged with 92% risk score due to proxy VPN and geo-location mismatch.',
    impact: 'Safeguards ₹4,998 against chargeback dispute',
    confidenceScore: 94,
    evidence:
      'IP originating in Romania, shipping destination Bengaluru. Card velocity 3 attempts.',
    timestamp: '25 mins ago',
    status: 'PENDING',
    riskLevel: 'MEDIUM'
  },
  {
    id: 'auto-3',
    category: 'PRICING',
    title: 'Apply +8% Margin Lift on Ergonomic Pro Mouse',
    description:
      'Competitor stockout detected. Price elasticity allows adjustment from ₹2,499 to ₹2,699.',
    impact: '+₹42,000 projected monthly profit lift',
    confidenceScore: 92,
    evidence: 'Zero elasticity penalty observed during past 3 holiday surges.',
    timestamp: '42 mins ago',
    status: 'PENDING',
    riskLevel: 'LOW'
  },
  {
    id: 'auto-4',
    category: 'MARKETING',
    title: 'Deploy WhatsApp VIP Retention Flash Sale',
    description: 'Targeted cohort of 280 repeat customers with coupon "VIP15".',
    impact: 'Estimated 2.8x ROI (₹84,000 projected revenue)',
    confidenceScore: 89,
    evidence: 'Cohort checkout propensity 34% higher on Friday evenings.',
    timestamp: '1 hour ago',
    status: 'PENDING',
    riskLevel: 'MEDIUM'
  }
];

const AUTOPILOT_KEY = 'merchantpilot_autopilot_mode';
const AUTOPILOT_ACTIONS_KEY = 'merchantpilot_autopilot_actions';

class AutoPilotStore {
  private mode: AutoPilotMode = 'SUGGEST';
  private actions: AutonomousAction[] = DEFAULT_ACTIONS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedMode = localStorage.getItem(AUTOPILOT_KEY) as AutoPilotMode | null;
        if (storedMode) this.mode = storedMode;

        const storedActions = localStorage.getItem(AUTOPILOT_ACTIONS_KEY);
        if (storedActions) this.actions = JSON.parse(storedActions) as AutonomousAction[];
      } catch {
        // storage fallback
      }
    }
  }

  public getMode(): AutoPilotMode {
    return this.mode;
  }

  public setMode(mode: AutoPilotMode): void {
    this.mode = mode;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTOPILOT_KEY, mode);
      } catch {
        // ignored
      }
    }
    this.notify();
  }

  public getPendingActions(): AutonomousAction[] {
    return this.actions.filter((a) => a.status === 'PENDING');
  }

  public getAllActions(): AutonomousAction[] {
    return this.actions;
  }

  public approveAction(id: string): void {
    this.actions = this.actions.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a));
    this.saveActions();
  }

  public rejectAction(id: string): void {
    this.actions = this.actions.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a));
    this.saveActions();
  }

  public approveAll(): void {
    this.actions = this.actions.map((a) =>
      a.status === 'PENDING' ? { ...a, status: 'APPROVED' } : a
    );
    this.saveActions();
  }

  public rejectAll(): void {
    this.actions = this.actions.map((a) =>
      a.status === 'PENDING' ? { ...a, status: 'REJECTED' } : a
    );
    this.saveActions();
  }

  private saveActions(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUTOPILOT_ACTIONS_KEY, JSON.stringify(this.actions));
      } catch {
        // ignored
      }
    }
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const autoPilotStore = new AutoPilotStore();
