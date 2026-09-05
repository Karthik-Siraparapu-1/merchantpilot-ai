/**
 * Commerce Knowledge Graph
 * Connected graph representing cross-domain entities and their relationships.
 * Powers multi-hop reasoning across inventory, orders, customers, and margins.
 */

export interface KnowledgeNode {
  id: string;
  type: 'ORDER' | 'CUSTOMER' | 'PRODUCT' | 'INVENTORY' | 'SUPPLIER' | 'PAYMENT' | 'CAMPAIGN';
  label: string;
  metadata: Record<string, string | number>;
}

export interface KnowledgeEdge {
  sourceId: string;
  targetId: string;
  relationship:
    'PURCHASED' | 'STOCKED_AS' | 'SUPPLIED_BY' | 'SETTLED_VIA' | 'PROMOTED_BY' | 'ATTRIBUTED_TO';
  weight: number;
}

export interface CommerceGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export const knowledgeGraph = {
  getGraphSnapshot(): CommerceGraph {
    const nodes: KnowledgeNode[] = [
      {
        id: 'cat-prods',
        type: 'PRODUCT',
        label: 'Top Catalog SKUs',
        metadata: { activeCount: 42, avgMargin: 38 }
      },
      {
        id: 'inv-hub',
        type: 'INVENTORY',
        label: 'Warehouse Reserves',
        metadata: { totalUnits: 1420, lowStockCount: 2 }
      },
      {
        id: 'sup-primary',
        type: 'SUPPLIER',
        label: 'Apex Tech Logistics',
        metadata: { onTimeRate: 94, avgLeadDays: 6 }
      },
      {
        id: 'cust-vip',
        type: 'CUSTOMER',
        label: 'VIP Repeat Cohort',
        metadata: { size: 280, clvMinor: 4800000 }
      },
      {
        id: 'pay-rails',
        type: 'PAYMENT',
        label: 'Multi-Rail Gateway',
        metadata: { successRate: 97.4, chargebacks: 0.04 }
      },
      {
        id: 'camp-fest',
        type: 'CAMPAIGN',
        label: 'Diwali & Weekend Push',
        metadata: { projectedRoi: 2.8, conversionRate: 4.2 }
      }
    ];

    const edges: KnowledgeEdge[] = [
      { sourceId: 'sup-primary', targetId: 'inv-hub', relationship: 'SUPPLIED_BY', weight: 0.95 },
      { sourceId: 'inv-hub', targetId: 'cat-prods', relationship: 'STOCKED_AS', weight: 0.98 },
      { sourceId: 'cat-prods', targetId: 'cust-vip', relationship: 'PURCHASED', weight: 0.88 },
      { sourceId: 'cust-vip', targetId: 'pay-rails', relationship: 'SETTLED_VIA', weight: 0.99 },
      { sourceId: 'camp-fest', targetId: 'cat-prods', relationship: 'PROMOTED_BY', weight: 0.85 }
    ];

    return { nodes, edges };
  }
};
