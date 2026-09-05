'use client';

import React, { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphNode {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  value: string;
  detail: string;
  x: number;
  y: number;
}

const NODES: GraphNode[] = [
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    value: '280 VIP',
    detail: '₹4.8L avg CLV',
    x: 50,
    y: 15
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    value: '450/mo',
    detail: '₹3.5L GMV/day',
    x: 80,
    y: 35
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    value: '42 SKUs',
    detail: '38% avg margin',
    x: 50,
    y: 55
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Boxes,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    value: '1,420 units',
    detail: '2 low stock alerts',
    x: 20,
    y: 35
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: Truck,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    value: 'Apex Logistics',
    detail: '94% on-time rate',
    x: 20,
    y: 75
  },
  {
    id: 'revenue',
    label: 'Revenue',
    icon: CreditCard,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    value: '₹3.5L/day',
    detail: '97.4% gateway success',
    x: 80,
    y: 75
  }
];

const EDGES: Array<{ from: string; to: string; label: string }> = [
  { from: 'customers', to: 'orders', label: 'Purchase' },
  { from: 'orders', to: 'products', label: 'Contains' },
  { from: 'products', to: 'inventory', label: 'Stocked As' },
  { from: 'inventory', to: 'suppliers', label: 'Supplied By' },
  { from: 'orders', to: 'revenue', label: 'Generates' },
  { from: 'suppliers', to: 'revenue', label: 'Cost Flow' }
];

export function BusinessGraphViz({ className }: { className?: string }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodePosition = (id: string) => {
    const node = NODES.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 50, y: 50 };
  };

  return (
    <Card className={cn('p-5 border-border/80 overflow-hidden', className)}>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Business Intelligence Graph
        </CardTitle>
        <Badge
          variant="outline"
          className="text-[10px] font-mono text-emerald-500 border-emerald-500/30"
        >
          Live Data
        </Badge>
      </div>

      {/* Graph Visualization */}
      <div className="relative h-[280px] w-full">
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {EDGES.map((edge) => {
            const from = getNodePosition(edge.from);
            const to = getNodePosition(edge.to);
            const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
                {/* Edge label */}
                <text
                  x={`${(from.x + to.x) / 2}%`}
                  y={`${(from.y + to.y) / 2}%`}
                  textAnchor="middle"
                  dy="-4"
                  className={cn(
                    'text-[8px] fill-muted-foreground transition-opacity duration-300',
                    isHighlighted ? 'opacity-100' : 'opacity-40'
                  )}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((node) => {
          const Icon = node.icon;
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;

          return (
            <button
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300 cursor-pointer z-10',
                isHovered || isSelected
                  ? 'border-primary/50 bg-card shadow-lg scale-110'
                  : 'border-border/50 bg-card/80 hover:shadow-md'
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
                  node.bgColor
                )}
              >
                <Icon className={cn('h-4 w-4', node.color)} />
              </div>
              <span className="text-[10px] font-bold text-foreground whitespace-nowrap">
                {node.label}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">
                {node.value}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Detail */}
      {selectedNode &&
        (() => {
          const node = NODES.find((n) => n.id === selectedNode);
          if (!node) return null;
          const Icon = node.icon;
          const connectedEdges = EDGES.filter(
            (e) => e.from === selectedNode || e.to === selectedNode
          );

          return (
            <div className="mt-3 p-3 rounded-lg border border-border/60 bg-muted/10">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    'h-6 w-6 rounded-md flex items-center justify-center',
                    node.bgColor
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', node.color)} />
                </div>
                <span className="text-xs font-semibold text-foreground">{node.label}</span>
                <Badge variant="secondary" className="text-[9px] font-mono">
                  {node.value}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">{node.detail}</p>
              <div className="flex flex-wrap gap-1.5">
                {connectedEdges.map((edge) => {
                  const otherNodeId = edge.from === selectedNode ? edge.to : edge.from;
                  const otherNode = NODES.find((n) => n.id === otherNodeId);
                  if (!otherNode) return null;

                  return (
                    <Badge
                      key={`${edge.from}-${edge.to}`}
                      variant="outline"
                      className="text-[9px] gap-1"
                    >
                      <ArrowRight className="h-2.5 w-2.5" />
                      {edge.label} → {otherNode.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })()}
    </Card>
  );
}
