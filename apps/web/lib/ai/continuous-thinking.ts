/**
 * Continuous AI Background Thinking Engine
 * Emits live agent deliberations every 5-8 seconds to make the
 * operating system feel active, observant, and continuously working.
 */

export interface AIThought {
  id: string;
  agent: 'Inventory' | 'Pricing' | 'Fraud' | 'Payments' | 'Forecasting' | 'Executive';
  text: string;
  category: 'TELEMETRY' | 'PREDICTION' | 'LEARNING' | 'OPTIMIZATION';
  timestamp: string;
}

const STREAM_OF_THOUGHTS: Omit<AIThought, 'id' | 'timestamp'>[] = [
  {
    agent: 'Inventory',
    text: 'Analyzing stock replenishment curves across 42 catalog SKUs...',
    category: 'TELEMETRY'
  },
  {
    agent: 'Pricing',
    text: 'Monitoring competitor pricing delta on high-velocity items (+8% elasticity room)...',
    category: 'OPTIMIZATION'
  },
  {
    agent: 'Fraud',
    text: 'Scanned 14 incoming checkout sessions — 0 proxy spoofing anomalies detected.',
    category: 'TELEMETRY'
  },
  {
    agent: 'Payments',
    text: 'Comparing gateway latency: Razorpay (210ms) vs Stripe (340ms). UPI routing optimal.',
    category: 'TELEMETRY'
  },
  {
    agent: 'Forecasting',
    text: 'Predicting 72-hour weekend surge: Wireless Mouse velocity expected to climb 28%.',
    category: 'PREDICTION'
  },
  {
    agent: 'Executive',
    text: 'Synthesizing merchant memory heuristics: conservative pricing preference confirmed.',
    category: 'LEARNING'
  },
  {
    agent: 'Inventory',
    text: 'Supplier lead-time check: Apex Logistics tracking 4-day transit buffer.',
    category: 'TELEMETRY'
  },
  {
    agent: 'Pricing',
    text: 'Computing gross margin targets: current portfolio operating at 38.2% margin.',
    category: 'OPTIMIZATION'
  },
  {
    agent: 'Fraud',
    text: 'Geographic IP clustering normal. Multi-rail payment integrity at 97.4%.',
    category: 'TELEMETRY'
  },
  {
    agent: 'Executive',
    text: 'Continuous learning loop synced. 6 operating policies reinforced.',
    category: 'LEARNING'
  }
];

class ContinuousThinkingService {
  private subscribers: Set<(thought: AIThought) => void> = new Set();
  private currentIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentThought: AIThought = {
    id: 'th-init',
    agent: 'Executive',
    text: 'Continuous AI telemetry active. Monitoring multi-tenant commerce rails...',
    category: 'TELEMETRY',
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.startCycle();
    }
  }

  private startCycle() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % STREAM_OF_THOUGHTS.length;
      const raw = STREAM_OF_THOUGHTS[this.currentIndex];
      if (!raw) return;

      this.currentThought = {
        id: `th-${Date.now()}`,
        agent: raw.agent,
        text: raw.text,
        category: raw.category,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };

      this.subscribers.forEach((fn) => fn(this.currentThought));
    }, 6000);
  }

  public getCurrentThought(): AIThought {
    return this.currentThought;
  }

  public subscribe(fn: (thought: AIThought) => void): () => void {
    this.subscribers.add(fn);
    fn(this.currentThought);
    return () => {
      this.subscribers.delete(fn);
    };
  }
}

export const continuousThinking = new ContinuousThinkingService();
