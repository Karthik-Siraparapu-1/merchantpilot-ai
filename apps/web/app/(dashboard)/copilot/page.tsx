'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Mic, Send, Bot, User, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { VoiceAIModal } from '@/components/ai/voice-ai-modal';
import { MutationConfirmCard } from '@/components/ai/mutation-confirm-card';
import { LiveAgentReasoningTrace } from '@/components/ai/live-agent-reasoning-trace';
import {
  agentRouter,
  type AgentResponse,
  type AgentToolCall,
  type AgentExplainability
} from '@/lib/ai/agent-router';
import { copilotEngine } from '@/lib/ai/copilot-engine';
import { useRouter, useSearchParams } from 'next/navigation';

interface CopilotChatMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  text: string;
  timestamp: string;
  agentName?: string | undefined;
  agentIcon?: string | undefined;
  confidenceScore?: number | undefined;
  confidenceLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | undefined;
  summaryMetrics?: Array<{ label: string; value: string; trend?: string | undefined }> | undefined;
  chartType?: 'AREA' | 'BAR' | undefined;
  chartData?: Array<Record<string, string | number>> | undefined;
  pendingTool?: AgentToolCall | undefined;
  explainability?: AgentExplainability | undefined;
  memoryContext?: string | undefined;
  actionButton?: { label: string; targetUrl: string } | undefined;
}

const QUICK_PROMPTS = [
  {
    label: 'Explain my business',
    query: 'Explain my business and overall operating health',
    icon: '👑'
  },
  {
    label: 'Compare last month',
    query: 'Compare revenue and order velocity with last month',
    icon: '📊'
  },
  { label: 'Which customer churns?', query: 'Which customers are at risk of churn?', icon: '⚠️' },
  {
    label: 'What to focus on today?',
    query: 'What should I focus on today to maximize profit?',
    icon: '🎯'
  },
  {
    label: 'Increase prices',
    query: 'Analyze pricing and suggest increases for top products',
    icon: '💰'
  },
  { label: 'Restock inventory', query: 'Which products should I restock immediately?', icon: '📦' },
  { label: 'Scan for fraud', query: 'Run fraud scan on recent orders', icon: '🛡️' },
  { label: 'Forecast sales', query: 'Predict next week revenue and demand', icon: '🔮' }
];

function CopilotInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputQuery, setInputQuery] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedExplain, setExpandedExplain] = useState<Record<string, boolean>>({});

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const [messages, setMessages] = useState<CopilotChatMessage[]>([
    {
      id: 'init',
      sender: 'COPILOT',
      text: `${getGreeting()}, Karthik. I am your MerchantPilot AI Copilot — an autonomous commerce operating system. I can analyze your business health, compare past performance, project churn risks, and execute live mutations across stock and pricing. What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentName: 'MerchantPilot AI',
      agentIcon: 'Sparkles',
      confidenceScore: 98,
      confidenceLevel: 'HIGH',
      summaryMetrics: [
        { label: 'Business Health', value: '95/100', trend: 'Optimal' },
        { label: 'Gateway Reliability', value: '97.4%', trend: 'Peak' },
        { label: 'Agents Online', value: '8/8', trend: 'All Active' }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      void handleSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: CopilotChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // First check if natural language query has specialized rich business response
      const richMsg = copilotEngine.processQuery(q);

      let agentResp: AgentResponse | null = null;
      try {
        agentResp = await agentRouter.routeQuery(q);
      } catch {
        // Fallback to richMsg
      }

      const aiMsg: CopilotChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'COPILOT',
        text: richMsg.text || agentResp?.text || 'Analysis completed across store rails.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: agentResp?.agentName || 'CEO Executive Agent',
        agentIcon: agentResp?.agentIcon || 'Crown',
        confidenceScore: richMsg.confidenceScore || 96,
        confidenceLevel: richMsg.confidenceLevel || 'HIGH',
        summaryMetrics: richMsg.dataPayload?.summaryMetrics || agentResp?.summaryMetrics,
        chartType: richMsg.dataPayload?.chartType as 'AREA' | 'BAR',
        chartData: richMsg.dataPayload?.chartData,
        pendingTool: agentResp?.pendingTool,
        explainability:
          agentResp?.explainability ||
          (richMsg.explainability
            ? {
                why: richMsg.explainability.why,
                confidence: (richMsg.confidenceScore || 96) / 100,
                dataSources: richMsg.explainability.dataSources,
                expectedImpact: 'Operational lift',
                agentName: 'CEO Executive Agent',
                reasoningChain: richMsg.explainability.reasoningChain
              }
            : undefined),
        memoryContext: agentResp?.memoryContext,
        actionButton: richMsg.dataPayload?.actionButton
          ? {
              label: richMsg.dataPayload.actionButton.label,
              targetUrl: richMsg.dataPayload.actionButton.targetUrl || '/dashboard'
            }
          : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: CopilotChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'COPILOT',
        text: 'I encountered an issue processing telemetry. All background safety systems remain operational.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: 'MerchantPilot AI',
        agentIcon: 'Sparkles'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleSend();
    }
  };

  const toggleExplain = (id: string) => {
    setExpandedExplain((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <VoiceAIModal open={isVoiceOpen} onOpenChange={setIsVoiceOpen} />

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Autonomous AI Commerce Operator
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-mono text-emerald-500 border-emerald-500/30"
              >
                Multi-Agent Consensus Active
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              MerchantPilot AI Copilot
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deep natural language reasoning, empirical explainability, and executable tool
              calling.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsVoiceOpen(true)}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Voice Copilot (Shift+V)</span>
          </Button>
        </div>

        {/* Quick Action Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_PROMPTS.map((preset, i) => (
            <button
              key={i}
              onClick={() => {
                void handleSend(preset.query);
              }}
              className="p-3 text-left rounded-xl border border-border/70 bg-card hover:bg-muted/50 transition-all shadow-xs group hover:shadow-md hover:border-indigo-500/30"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{preset.icon}</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {preset.label}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground block line-clamp-1 font-mono">
                {preset.query}
              </span>
            </button>
          ))}
        </div>

        {/* Conversation Workspace */}
        <Card className="p-0 border-border/80 shadow-md overflow-hidden flex flex-col h-[600px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'COPILOT' && (
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    msg.sender === 'USER'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-xs'
                      : 'bg-muted/40 border border-border/70 text-foreground rounded-tl-xs shadow-xs'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                        {msg.sender === 'USER' ? 'Karthik' : msg.agentName || 'MerchantPilot AI'}
                      </span>
                      {msg.confidenceScore && msg.sender === 'COPILOT' && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono text-emerald-500 border-emerald-500/30"
                        >
                          {msg.confidenceScore}% Confidence ({msg.confidenceLevel || 'HIGH'})
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Memory Context */}
                  {msg.memoryContext && (
                    <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/20 text-[10px] text-purple-600 dark:text-purple-400 italic font-mono">
                      🧠 {msg.memoryContext}
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Summary Metrics */}
                  {msg.summaryMetrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-border/50">
                      {msg.summaryMetrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-background/80 border border-border/60"
                        >
                          <span className="text-[10px] text-muted-foreground block">{m.label}</span>
                          <span className="text-xs font-bold font-mono text-foreground block">
                            {m.value}
                          </span>
                          {m.trend && (
                            <span className="text-[10px] font-medium text-emerald-500">
                              {m.trend}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Embedded Charts */}
                  {msg.chartData && msg.chartType === 'AREA' && (
                    <div className="pt-2">
                      <div className="h-44 w-full p-2 rounded-xl bg-background/80 border border-border/60">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={msg.chartData}
                            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="hsl(var(--border))"
                            />
                            <XAxis
                              dataKey="week"
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={10}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '6px',
                                fontSize: '11px'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="currentMonth"
                              name="This Month"
                              stroke="#6366f1"
                              fill="#6366f1"
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                            <Area
                              type="monotone"
                              dataKey="lastMonth"
                              name="Last Month"
                              stroke="#94a3b8"
                              fill="#94a3b8"
                              fillOpacity={0.1}
                              strokeDasharray="4 4"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {msg.chartData && msg.chartType === 'BAR' && (
                    <div className="pt-2">
                      <div className="h-44 w-full p-2 rounded-xl bg-background/80 border border-border/60">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={msg.chartData}
                            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="hsl(var(--border))"
                            />
                            <XAxis
                              dataKey="category"
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={10}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '6px',
                                fontSize: '11px'
                              }}
                            />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Mutation Confirmation Card */}
                  {msg.pendingTool && msg.explainability && (
                    <MutationConfirmCard
                      tool={msg.pendingTool}
                      explainability={msg.explainability}
                      className="mt-2"
                    />
                  )}

                  {/* Deep Explainability Accordion */}
                  {msg.explainability && !msg.pendingTool && msg.sender === 'COPILOT' && (
                    <div className="pt-2 border-t border-border/50">
                      <button
                        onClick={() => toggleExplain(msg.id)}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedExplain[msg.id] ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        Why did AI decide this? (Empirical Explainability)
                      </button>

                      {expandedExplain[msg.id] && (
                        <div className="mt-2 p-3 rounded-xl bg-background/80 border border-border/60 space-y-2">
                          <div className="space-y-1">
                            <span className="font-semibold text-foreground text-[11px] block">
                              Causal Driver:
                            </span>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {msg.explainability.why}
                            </p>
                          </div>

                          {msg.explainability.reasoningChain && (
                            <div className="space-y-1 pt-1">
                              <span className="font-semibold text-foreground text-[10px] uppercase tracking-wider block">
                                Multi-Agent Reasoning Chain:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-muted-foreground">
                                {msg.explainability.reasoningChain.map((step, sIdx) => (
                                  <li key={sIdx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            <span className="text-[10px] text-muted-foreground">Data Sources:</span>
                            {msg.explainability.dataSources.map((src, idx) => (
                              <Badge key={idx} variant="outline" className="text-[9px] font-mono">
                                {src}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  {msg.actionButton && (
                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(msg.actionButton!.targetUrl)}
                        className="h-7 text-xs gap-1.5 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {msg.sender === 'USER' && (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Live Multi-Agent Reasoning Trace during streaming */}
            {isLoading && (
              <div className="space-y-2 max-w-[80%]">
                <LiveAgentReasoningTrace isStreaming={true} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Prompt Input */}
          <div className="p-4 border-t border-border/70 bg-card flex items-center gap-2">
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="p-2 text-muted-foreground hover:text-indigo-500 rounded-lg transition-colors shrink-0"
              title="Speak with Voice AI (Shift+V)"
            >
              <Mic className="h-4 w-4" />
            </button>
            <Input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything — 'Explain my business', 'Compare with last month', 'Which customer may churn?'..."
              className="flex-1 text-xs h-10 border-border/80"
              disabled={isLoading}
            />
            <Button
              size="sm"
              onClick={() => {
                void handleSend();
              }}
              disabled={isLoading}
              className="h-10 px-4 gap-1.5 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default function CopilotPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Loading Copilot...
        </div>
      }
    >
      <CopilotInner />
    </Suspense>
  );
}
