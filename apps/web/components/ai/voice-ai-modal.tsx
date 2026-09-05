'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Sparkles, Zap, CheckCircle2, Brain } from 'lucide-react';
import { voiceAI, type VoiceState, type PendingVoiceAction } from '@/lib/ai/voice-ai';
import { copilotEngine } from '@/lib/ai/copilot-engine';
import { memoryEngine } from '@/lib/ai/memory-engine';
import { toast } from 'sonner';

interface VoiceAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string | undefined;
}

export function VoiceAIModal({ open, onOpenChange }: VoiceAIModalProps) {
  const router = useRouter();
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isThinking: false,
    avatarState: 'IDLE',
    transcript: '',
    lastAiResponse: '',
    supported: true,
    audioWaveLevels: [20, 30, 20, 30, 20],
    pendingAction: null,
    streamingToken: '',
    wakeWordDetected: false,
    context: { turns: [] }
  });

  const [continuousLoop, setContinuousLoop] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ speaker: 'USER' | 'AI'; message: string; timestamp: string }>
  >([
    {
      speaker: 'AI',
      message:
        'Good afternoon, Karthik. Voice Copilot is listening hands-free. You can ask about revenue, inventory, or say "Increase price of Wireless Mouse".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSpokenCommand = useCallback(
    (text: string) => {
      if (!text) return;
      const lower = text.toLowerCase();
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 1. Voice Tool Call: Increase Mouse Price
      if (
        lower.includes('price') ||
        lower.includes('increase mouse') ||
        lower.includes('raise price')
      ) {
        const pending: PendingVoiceAction = {
          id: `act-price-${Date.now()}`,
          actionType: 'UPDATE_PRICE',
          title: 'Apply +8% Price Lift on Ergonomic Wireless Mouse',
          description: 'Increase price from ₹2,499 to ₹2,699 based on competitor stockout.',
          onExecute: () => {
            memoryEngine.recordFeedback('Voice price increase on Ergonomic Mouse', true);
            memoryEngine.logAction({
              action: 'Increased Wireless Mouse price to ₹2,699',
              agentName: 'Dynamic Pricing Agent',
              status: 'APPROVED',
              impact: '+₹42,000/month margin lift',
              details: 'Voice commanded by merchant',
              confidence: 94
            });
            return Promise.resolve(
              'Done. Increased the price of Ergonomic Pro Wireless Mouse to ₹2,699. Projected margin lift is ₹42,000 per month.'
            );
          }
        };

        voiceAI.setPendingAction(pending);
        setConversationHistory((prev) => [
          ...prev,
          { speaker: 'USER', message: text, timestamp: time },
          {
            speaker: 'AI',
            message:
              'Competitor stockout detected. Would you like me to increase the price of Wireless Mouse by 8% to ₹2,699? Say "Yes" to execute.',
            timestamp: time
          }
        ]);
        voiceAI.speak(
          'Competitor stockout detected. Would you like me to increase the price of Wireless Mouse by 8% to ₹2,699? Say Yes to execute.'
        );
        return;
      }

      // 2. Voice Tool Call: Restock Inventory
      if (lower.includes('restock') || lower.includes('stock') || lower.includes('inventory')) {
        const pending: PendingVoiceAction = {
          id: `act-restock-${Date.now()}`,
          actionType: 'RESTOCK_INVENTORY',
          title: 'Draft Restock PO (120 units) to Apex Logistics',
          description: 'Depletion runway under 48 hours. Supplier lead time 4 days.',
          onExecute: () => {
            memoryEngine.recordFeedback('Voice restock PO generation', true);
            memoryEngine.logAction({
              action: 'Drafted restock PO for 120 units of Ergonomic Mouse',
              agentName: 'Inventory & Supply Agent',
              status: 'APPROVED',
              impact: 'Prevented stockout',
              details: 'Voice commanded by merchant',
              confidence: 96
            });
            return Promise.resolve(
              'Purchase order for 120 units drafted to Apex Logistics and notified your warehouse manager.'
            );
          }
        };

        voiceAI.setPendingAction(pending);
        setConversationHistory((prev) => [
          ...prev,
          { speaker: 'USER', message: text, timestamp: time },
          {
            speaker: 'AI',
            message:
              'Warehouse telemetry indicates 2 SKUs at risk of stockout within 48 hours. Shall I generate a restock purchase order for 120 units?',
            timestamp: time
          }
        ]);
        voiceAI.speak(
          'Warehouse telemetry indicates 2 SKUs at risk of stockout within 48 hours. Shall I generate a restock purchase order for 120 units?'
        );
        return;
      }

      // 3. Voice Navigation Commands
      if (lower.includes('open order') || lower.includes('show order')) {
        voiceAI.speak('Opening your live orders dashboard.');
        onOpenChange(false);
        router.push('/orders');
        return;
      }

      if (lower.includes('open product') || lower.includes('catalog')) {
        voiceAI.speak('Navigating to your product catalog.');
        onOpenChange(false);
        router.push('/products');
        return;
      }

      if (lower.includes('open analytics') || lower.includes('chart')) {
        voiceAI.speak('Opening executive analytics dashboard.');
        onOpenChange(false);
        router.push('/analytics');
        return;
      }

      // 4. General Business Copilot query with memory awareness
      const memContext = memoryEngine.getFormattedContextForPrompt();
      const response = copilotEngine.processQuery(text);
      const spokenText = `${memContext ? memContext + '. ' : ''}${response.text}`;

      setConversationHistory((prev) => [
        ...prev,
        { speaker: 'USER', message: text, timestamp: time },
        { speaker: 'AI', message: spokenText, timestamp: time }
      ]);
      voiceAI.speak(spokenText);
    },
    [onOpenChange, router]
  );

  useEffect(() => {
    voiceAI.onStateChange((state) => {
      setVoiceState(state);
    });

    voiceAI.setCommandHandler((cmd) => {
      handleSpokenCommand(cmd);
    });

    if (open) {
      voiceAI.startListening();
    }
  }, [open, handleSpokenCommand]);

  const toggleMic = () => {
    if (voiceState.isListening) {
      voiceAI.stopListening();
    } else {
      voiceAI.startListening();
    }
  };

  const toggleContinuous = () => {
    const next = !continuousLoop;
    setContinuousLoop(next);
    voiceAI.setContinuous(next);
    toast.info(
      next ? 'Continuous hands-free conversation enabled.' : 'Continuous conversation paused.'
    );
  };

  const handleExecutePending = async () => {
    if (!voiceState.pendingAction) return;
    const action = voiceState.pendingAction;
    voiceAI.setPendingAction(null);
    try {
      const res = await action.onExecute();
      voiceAI.speak(res);
      toast.success(res);
    } catch {
      toast.error('Action failed.');
    }
  };

  const handleCancelPending = () => {
    voiceAI.setPendingAction(null);
    voiceAI.speak('Action cancelled. How else can I assist?');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-border/80 shadow-2xl p-0 overflow-hidden">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 border-b border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Conversational Voice Operating System
            </Badge>

            <button
              onClick={toggleContinuous}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                continuousLoop
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              Hands-Free: {continuousLoop ? 'ON' : 'OFF'}
            </button>
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            MerchantPilot Voice Assistant
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Natural continuous dialogue with spoken tool calling, memory learning, and real-time
            execution.
          </DialogDescription>
        </div>

        {/* Central Animated Voice Avatar Orb */}
        <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border-b border-border/60 space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing acoustic aura rings */}
            {voiceState.avatarState === 'LISTENING' && (
              <>
                <span className="absolute h-32 w-32 rounded-full bg-indigo-500/20 animate-ping" />
                <span className="absolute h-24 w-24 rounded-full bg-indigo-500/30 animate-pulse" />
              </>
            )}

            {voiceState.avatarState === 'THINKING' && (
              <span className="absolute h-28 w-28 rounded-full border-2 border-dashed border-indigo-500 animate-spin" />
            )}

            {voiceState.avatarState === 'SPEAKING' && (
              <span className="absolute h-28 w-28 rounded-full bg-emerald-500/20 animate-pulse" />
            )}

            {/* Core Interactive Orb */}
            <button
              onClick={toggleMic}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
                voiceState.avatarState === 'LISTENING'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/50'
                  : voiceState.avatarState === 'SPEAKING'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/50'
                    : voiceState.avatarState === 'THINKING'
                      ? 'bg-purple-600 text-white shadow-purple-500/50'
                      : 'bg-primary text-primary-foreground'
              }`}
            >
              {voiceState.avatarState === 'SPEAKING' ? (
                <Volume2 className="h-8 w-8 animate-pulse" />
              ) : voiceState.avatarState === 'THINKING' ? (
                <Brain className="h-8 w-8 animate-spin-slow" />
              ) : voiceState.isListening ? (
                <Mic className="h-8 w-8" />
              ) : (
                <MicOff className="h-8 w-8 opacity-75" />
              )}
            </button>
          </div>

          {/* Dynamic Audio Equalizer Bars */}
          <div className="flex items-center gap-1 h-8">
            {voiceState.audioWaveLevels.map((level, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  voiceState.avatarState === 'SPEAKING'
                    ? 'bg-emerald-500'
                    : voiceState.avatarState === 'LISTENING'
                      ? 'bg-indigo-500'
                      : 'bg-muted-foreground/30'
                }`}
                style={{ height: `${Math.max(12, level)}%` }}
              />
            ))}
          </div>

          {/* Avatar State Label */}
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              {voiceState.avatarState === 'LISTENING'
                ? 'Listening to your voice...'
                : voiceState.avatarState === 'THINKING'
                  ? 'Multi-agent consensus calculating...'
                  : voiceState.avatarState === 'SPEAKING'
                    ? 'Speaking response aloud...'
                    : 'Click orb to speak (or talk hands-free)'}
            </span>
            {voiceState.transcript && (
              <p className="text-xs text-foreground font-medium italic">
                "{voiceState.transcript}"
              </p>
            )}
          </div>
        </div>

        {/* Pending Tool Execution Card (Voice Confirmation) */}
        {voiceState.pendingAction && (
          <div className="p-4 bg-indigo-500/10 border-b border-indigo-500/30 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px] font-mono gap-1 text-indigo-500">
                <Zap className="h-3 w-3 text-indigo-500" />
                Spoken Confirmation Required
              </Badge>
              <span className="text-[10px] text-muted-foreground font-mono">
                Say "Yes" or "Cancel"
              </span>
            </div>

            <p className="text-xs font-bold text-foreground">{voiceState.pendingAction.title}</p>
            <p className="text-[11px] text-muted-foreground">
              {voiceState.pendingAction.description}
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelPending}
                className="h-7 text-xs text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  void handleExecutePending();
                }}
                className="h-7 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve (or say "Yes")
              </Button>
            </div>
          </div>
        )}

        {/* Conversational Transcript History */}
        <div className="p-4 space-y-2.5 max-h-48 overflow-y-auto bg-background/50">
          {conversationHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                item.speaker === 'USER'
                  ? 'bg-primary/10 border border-primary/20 ml-8 text-foreground'
                  : 'bg-muted/40 border border-border/60 mr-8 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="font-bold uppercase">
                  {item.speaker === 'USER' ? 'You' : 'MerchantPilot AI'}
                </span>
                <span>{item.timestamp}</span>
              </div>
              <p className="leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>

        {/* Quick Verbal Preset Chips */}
        <div className="p-3 bg-muted/30 border-t border-border/60 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground mr-1">Voice Prompts:</span>
          {[
            'Increase price of Wireless Mouse',
            'Why did sales drop?',
            'Which products should I restock?',
            'Open Orders'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSpokenCommand(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-full border border-border/70 bg-card hover:bg-muted text-foreground transition-colors font-medium"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
