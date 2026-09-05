/**
 * AI Task Queue & Orchestration Store
 * Tracks running, scheduled, completed, and pending approval automations
 * in a CI/CD-style execution pipeline.
 */

export interface TaskStep {
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  durationMs?: number;
}

export interface QueuedAITask {
  id: string;
  title: string;
  agent: string;
  status: 'PENDING' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'FAILED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  steps: TaskStep[];
  startedAt: string;
  completedAt?: string;
  logSummary: string;
}

export const INITIAL_TASKS: QueuedAITask[] = [
  {
    id: 'task-901',
    title: 'PO Auto-Draft & Supplier Lead Time Sync',
    agent: 'Atlas (Inventory)',
    status: 'COMPLETED',
    priority: 'HIGH',
    steps: [
      { name: 'Scan SKU velocities', status: 'COMPLETED', durationMs: 140 },
      { name: 'Evaluate safety stock', status: 'COMPLETED', durationMs: 210 },
      { name: 'Draft PO #PO-8812', status: 'COMPLETED', durationMs: 95 }
    ],
    startedAt: '10:14:02 AM',
    completedAt: '10:14:03 AM',
    logSummary:
      'Generated purchase order for 120 units Ergonomic Mouse with Apex Logistics routing.'
  },
  {
    id: 'task-902',
    title: 'Real-time Ingress Fraud Scoring',
    agent: 'Sentinel (Fraud)',
    status: 'WAITING_APPROVAL',
    priority: 'CRITICAL',
    steps: [
      { name: 'Ingress webhook parse', status: 'COMPLETED', durationMs: 45 },
      { name: 'MaxMind GeoIP & VPN check', status: 'COMPLETED', durationMs: 180 },
      { name: 'Velocity scoring', status: 'COMPLETED', durationMs: 60 },
      { name: 'Human authorization', status: 'RUNNING' }
    ],
    startedAt: '10:18:15 AM',
    logSummary: 'Intercepted high-risk Order #2191. Awaiting merchant confirmation to hold.'
  },
  {
    id: 'task-903',
    title: 'Dynamic Price Elasticity Simulation',
    agent: 'Vega (Pricing)',
    status: 'RUNNING',
    priority: 'MEDIUM',
    steps: [
      { name: 'Fetch competitor scrapers', status: 'COMPLETED', durationMs: 420 },
      { name: 'Run Monte Carlo price curve', status: 'RUNNING' },
      { name: 'Apply catalog mutation', status: 'PENDING' }
    ],
    startedAt: '10:20:00 AM',
    logSummary: 'Simulating profit delta for Mechanical Gaming Keyboard price change to ₹2,699.'
  },
  {
    id: 'task-904',
    title: 'VIP Repurchase WhatsApp Flash Campaign',
    agent: 'Nova (Marketing)',
    status: 'PENDING',
    priority: 'MEDIUM',
    steps: [
      { name: 'Cohort isolation (280 buyers)', status: 'PENDING' },
      { name: 'Coupon generation (FESTIVAL15)', status: 'PENDING' },
      { name: 'Dispatch API queue', status: 'PENDING' }
    ],
    startedAt: 'Scheduled for 02:00 PM',
    logSummary: 'Scheduled execution pending executive morning sign-off.'
  }
];

class TaskQueueStore {
  private tasks: QueuedAITask[] = [...INITIAL_TASKS];
  private listeners: Set<() => void> = new Set();

  getTasks(): QueuedAITask[] {
    return [...this.tasks];
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

export const taskQueueStore = new TaskQueueStore();
