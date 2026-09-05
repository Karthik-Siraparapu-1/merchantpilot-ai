/**
 * AI Mutation Rollback Manager
 * Provides Git-like undo / revert capability for any automated price changes,
 * inventory adjustments, or catalog status mutations.
 */

export interface MutationHistoryEntry {
  id: string;
  action: string;
  targetEntity: string;
  previousValue: string;
  currentValue: string;
  agentName: string;
  appliedAt: string;
  canRollback: boolean;
  isRolledBack: boolean;
}

const DEFAULT_MUTATIONS: MutationHistoryEntry[] = [
  {
    id: 'mut-01',
    action: 'Dynamic Price Adjustment (+8%)',
    targetEntity: 'Wireless Ergonomic Mouse',
    previousValue: '₹999',
    currentValue: '₹1,099',
    agentName: 'Vega (Pricing)',
    appliedAt: 'Today at 09:45 AM',
    canRollback: true,
    isRolledBack: false
  },
  {
    id: 'mut-02',
    action: 'Safety Reorder Point Bump',
    targetEntity: 'Mechanical Gaming Keyboard',
    previousValue: '10 units reorder trigger',
    currentValue: '18 units reorder trigger',
    agentName: 'Atlas (Inventory)',
    appliedAt: 'Yesterday at 04:12 PM',
    canRollback: true,
    isRolledBack: false
  },
  {
    id: 'mut-03',
    action: 'Payment Rail Failover Threshold',
    targetEntity: 'UPI Intent Gateway Rail',
    previousValue: 'Failover after 3 consecutive 504 errors',
    currentValue: 'Failover after 2 consecutive 504 errors',
    agentName: 'Pulse (Revenue)',
    appliedAt: 'Yesterday at 11:30 AM',
    canRollback: true,
    isRolledBack: false
  }
];

class RollbackManager {
  private history: MutationHistoryEntry[] = [...DEFAULT_MUTATIONS];
  private listeners: Set<() => void> = new Set();

  getHistory(): MutationHistoryEntry[] {
    return [...this.history];
  }

  getLatestRollbackable(): MutationHistoryEntry | undefined {
    return this.history.find((entry) => entry.canRollback && !entry.isRolledBack);
  }

  recordMutation(
    entry: Omit<MutationHistoryEntry, 'id' | 'appliedAt' | 'canRollback' | 'isRolledBack'>
  ): MutationHistoryEntry {
    const newEntry: MutationHistoryEntry = {
      ...entry,
      id: `mut-${Date.now()}`,
      appliedAt: 'Just now',
      canRollback: true,
      isRolledBack: false
    };
    this.history.unshift(newEntry);
    this.notify();
    return newEntry;
  }

  rollback(id: string): { success: boolean; message: string } {
    const entry = this.history.find((e) => e.id === id);
    if (!entry) return { success: false, message: 'Action not found' };
    if (entry.isRolledBack) return { success: false, message: 'Action already reverted' };

    entry.isRolledBack = true;
    this.notify();
    return {
      success: true,
      message: `Reverted ${entry.action} on ${entry.targetEntity} back to ${entry.previousValue}.`
    };
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

export const rollbackManager = new RollbackManager();
