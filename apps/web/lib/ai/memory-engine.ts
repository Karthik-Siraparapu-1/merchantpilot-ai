/**
 * Merchant Behavioral Memory Engine v2
 * Stores merchant operating preferences, behavioral habits, historical heuristics,
 * and autonomous decision timelines so every agent customizes reasoning.
 */

export interface BehavioralHabit {
  pattern: string;
  frequency: number;
  lastObserved: string;
  category: 'PRICING' | 'INVENTORY' | 'MARKETING' | 'OPERATIONS' | 'PAYMENTS';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  agentName: string;
  status: 'APPROVED' | 'REJECTED' | 'AUTO_EXECUTED';
  impact?: string | undefined;
  details?: string | undefined;
  confidence?: number;
}

export interface LearnedHeuristic {
  id: string;
  rule: string;
  confidence: number;
  lastReinforced: string;
  source: 'EXPLICIT_SETTING' | 'AI_LEARNING_LOOP';
}

export interface MerchantMemory {
  merchantName: string;
  targetGrossMarginPercent: number;
  minSafetyStockUnits: number;
  priorityGoal: 'PROFIT_MAXIMIZATION' | 'VOLUME_SCALE' | 'BALANCED';
  discountingHabit: 'WEEKEND_FLASH' | 'HOLIDAY_ONLY' | 'CONSERVATIVE';
  preferredPaymentGateways: string[];
  supplierRiskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  learnedHeuristics: LearnedHeuristic[];
  behavioralHabits: BehavioralHabit[];
  auditLog: AuditEntry[];
}

const DEFAULT_MEMORY: MerchantMemory = {
  merchantName: 'Karthik Commerce Pvt Ltd',
  targetGrossMarginPercent: 35,
  minSafetyStockUnits: 50,
  priorityGoal: 'PROFIT_MAXIMIZATION',
  discountingHabit: 'CONSERVATIVE',
  preferredPaymentGateways: ['UPI', 'Razorpay', 'Stripe'],
  supplierRiskTolerance: 'LOW',
  learnedHeuristics: [
    {
      id: 'h-1',
      rule: 'Prefers higher gross margins over raw checkout volume.',
      confidence: 0.98,
      lastReinforced: new Date().toISOString(),
      source: 'AI_LEARNING_LOOP'
    },
    {
      id: 'h-2',
      rule: 'Usually approves automated restock purchase orders without reduction.',
      confidence: 0.96,
      lastReinforced: new Date().toISOString(),
      source: 'AI_LEARNING_LOOP'
    },
    {
      id: 'h-3',
      rule: 'Avoids deep discount campaigns — protects premium brand positioning.',
      confidence: 0.95,
      lastReinforced: new Date().toISOString(),
      source: 'AI_LEARNING_LOOP'
    },
    {
      id: 'h-4',
      rule: 'Prioritizes UPI rails for domestic transactions to reduce gateway MDR.',
      confidence: 0.94,
      lastReinforced: new Date().toISOString(),
      source: 'EXPLICIT_SETTING'
    },
    {
      id: 'h-5',
      rule: 'Operates mostly evenings — schedules reviews between 6:00 PM and 9:30 PM.',
      confidence: 0.91,
      lastReinforced: new Date().toISOString(),
      source: 'AI_LEARNING_LOOP'
    }
  ],
  behavioralHabits: [
    {
      pattern: 'prefers higher margins',
      frequency: 14,
      lastObserved: 'Today, 2:30 PM',
      category: 'PRICING'
    },
    {
      pattern: 'usually approves restocking',
      frequency: 11,
      lastObserved: 'Today, 11:15 AM',
      category: 'INVENTORY'
    },
    {
      pattern: 'avoids discount campaigns',
      frequency: 8,
      lastObserved: 'Yesterday',
      category: 'MARKETING'
    },
    {
      pattern: 'prefers UPI payment routing',
      frequency: 24,
      lastObserved: 'Yesterday',
      category: 'PAYMENTS'
    },
    {
      pattern: 'operates mostly evenings',
      frequency: 19,
      lastObserved: 'Last Week',
      category: 'OPERATIONS'
    }
  ],
  auditLog: [
    {
      id: 'aud-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
      action: 'Held suspicious order ORD-9921',
      agentName: 'Fraud & Risk Shield Agent',
      status: 'APPROVED',
      impact: 'Mitigated ₹4,998 chargeback',
      details: '92% risk score — proxy VPN + geo mismatch',
      confidence: 94
    },
    {
      id: 'aud-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      action: 'Auto-drafted restock PO for Ergonomic Mouse (120 units)',
      agentName: 'Inventory & Supply Agent',
      status: 'APPROVED',
      impact: 'Prevented ₹38,400 in lost GMV',
      details: 'Dispatched purchase order to Apex Logistics',
      confidence: 96
    },
    {
      id: 'aud-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
      action: 'Increased price +8% on Ergonomic Pro Mouse',
      agentName: 'Dynamic Pricing Agent',
      status: 'APPROVED',
      impact: '+₹42,000/month margin lift',
      details: '₹2,499 → ₹2,699',
      confidence: 92
    },
    {
      id: 'aud-4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // Yesterday
      action: 'Rejected 25% site-wide discount campaign',
      agentName: 'Autonomous Marketing Agent',
      status: 'REJECTED',
      impact: 'Safeguarded 14% gross margin threshold',
      details: 'Strategy adjusted to VIP exclusive 10% flash instead',
      confidence: 91
    },
    {
      id: 'aud-5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // Last week
      action: 'Learned merchant prefers conservative pricing & high margin retention',
      agentName: 'CEO Executive Agent',
      status: 'AUTO_EXECUTED',
      impact: 'Continuous Policy Sync',
      details: 'Reinforced heuristic model h-1',
      confidence: 98
    },
    {
      id: 'aud-6',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // Last week
      action: 'Restocked 100 units of Wireless Keyboard',
      agentName: 'Inventory & Supply Agent',
      status: 'APPROVED',
      impact: 'Zero warehouse stockouts during weekend',
      details: 'Apex Logistics PO confirmed',
      confidence: 95
    }
  ]
};

const MEMORY_STORAGE_KEY = 'merchantpilot_ai_memory_v2';

export const memoryEngine = {
  getMemory(): MerchantMemory {
    if (typeof window === 'undefined') return DEFAULT_MEMORY;
    try {
      const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (!stored) return DEFAULT_MEMORY;
      const parsed = JSON.parse(stored) as Partial<MerchantMemory>;
      return {
        ...DEFAULT_MEMORY,
        ...parsed,
        learnedHeuristics: parsed.learnedHeuristics || DEFAULT_MEMORY.learnedHeuristics,
        behavioralHabits: parsed.behavioralHabits || DEFAULT_MEMORY.behavioralHabits,
        auditLog: parsed.auditLog || DEFAULT_MEMORY.auditLog
      };
    } catch {
      return DEFAULT_MEMORY;
    }
  },

  updateMemory(partial: Partial<MerchantMemory>): MerchantMemory {
    const current = this.getMemory();
    const updated: MerchantMemory = { ...current, ...partial };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
    }
    return updated;
  },

  resetMemory(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(MEMORY_STORAGE_KEY);
      } catch {
        // storage fallback
      }
    }
  },

  recordFeedback(actionTitle: string, accepted: boolean): void {
    const mem = this.getMemory();
    const newHeuristic: LearnedHeuristic = {
      id: `h-${Date.now()}`,
      rule: accepted
        ? `Accepted optimization: ${actionTitle}. Policy reinforced.`
        : `Rejected recommendation: ${actionTitle}. Policy shifted to conservative.`,
      confidence: accepted ? 0.96 : 0.88,
      lastReinforced: new Date().toISOString(),
      source: 'AI_LEARNING_LOOP'
    };
    this.updateMemory({
      learnedHeuristics: [newHeuristic, ...mem.learnedHeuristics.slice(0, 9)]
    });
  },

  recordHabit(pattern: string, category: BehavioralHabit['category']): void {
    const mem = this.getMemory();
    const existing = mem.behavioralHabits.find((h) => h.pattern === pattern);

    if (existing) {
      existing.frequency += 1;
      existing.lastObserved = 'Today';
    } else {
      mem.behavioralHabits.unshift({
        pattern,
        frequency: 1,
        lastObserved: 'Today',
        category
      });
    }

    this.updateMemory({
      behavioralHabits: mem.behavioralHabits.slice(0, 20)
    });
  },

  logAction(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
    const mem = this.getMemory();
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.updateMemory({
      auditLog: [newEntry, ...mem.auditLog.slice(0, 49)]
    });
  },

  getAuditLog(): AuditEntry[] {
    return this.getMemory().auditLog;
  },

  getHabits(): BehavioralHabit[] {
    return this.getMemory().behavioralHabits;
  },

  getTimelineGrouped(): {
    today: AuditEntry[];
    yesterday: AuditEntry[];
    lastWeek: AuditEntry[];
  } {
    const logs = this.getAuditLog();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const today: AuditEntry[] = [];
    const yesterday: AuditEntry[] = [];
    const lastWeek: AuditEntry[] = [];

    logs.forEach((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      const diff = now - itemTime;
      if (diff < oneDay) {
        today.push(item);
      } else if (diff < oneDay * 2) {
        yesterday.push(item);
      } else {
        lastWeek.push(item);
      }
    });

    return { today, yesterday, lastWeek };
  },

  getFormattedContextForPrompt(): string {
    const habits = this.getHabits();
    if (habits.length === 0) return '';
    const topHabits = habits
      .slice(0, 3)
      .map((h) => h.pattern)
      .join(', ');
    return `Based on your previous decisions (${topHabits})`;
  }
};
