/**
 * Conversational Voice AI Engine v2
 * Integrates Web Speech API (SpeechRecognition & SpeechSynthesis)
 * with continuous hands-free turn-taking, spoken tool execution,
 * dynamic audio wave simulation, and memory reinforcement.
 */

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export type VoiceAIAvatarState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

export interface PendingVoiceAction {
  id: string;
  actionType:
    'UPDATE_PRICE' | 'RESTOCK_INVENTORY' | 'HOLD_ORDER' | 'LAUNCH_CAMPAIGN' | 'GENERATE_REPORT';
  title: string;
  description: string;
  details?: Record<string, unknown>;
  onExecute: () => Promise<string>;
}

export interface VoiceConversationContext {
  lastTopic?: string;
  lastEntity?: string;
  pendingClarification?: string;
  turns: Array<{ role: 'user' | 'agent'; text: string; timestamp: string }>;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  avatarState: VoiceAIAvatarState;
  transcript: string;
  streamingToken: string;
  lastAiResponse: string;
  supported: boolean;
  audioWaveLevels: number[];
  pendingAction: PendingVoiceAction | null;
  wakeWordDetected: boolean;
  context: VoiceConversationContext;
}

export class VoiceAIEngine {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListeningInternal = false;
  private isThinkingInternal = false;
  private isSpeakingInternal = false;
  private continuousConversation = true;
  private onStateChangeCallback: ((state: VoiceState) => void) | null = null;
  private onCommandRecognized: ((command: string) => void) | null = null;
  private lastTranscript = '';
  private lastSpokenResponse = '';
  private pendingActionInternal: PendingVoiceAction | null = null;
  private audioWaveInterval: ReturnType<typeof setInterval> | null = null;
  private currentWaveLevels = [20, 45, 80, 55, 30];

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as SpeechRecognitionWindow;
      const SpeechRecognitionImpl = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionImpl) {
        this.recognition = new SpeechRecognitionImpl();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListeningInternal = true;
          this.startAudioWaveSimulation();
          this.notifyState();
        };

        this.recognition.onend = () => {
          // Auto-restart recognition if continuous mode is active and user didn't stop listening
          if (this.isListeningInternal && !this.isSpeakingInternal && this.continuousConversation) {
            try {
              this.recognition?.start();
              return;
            } catch {
              // Ignore restart collision error
            }
          }
          this.isListeningInternal = false;
          this.stopAudioWaveSimulation();
          this.notifyState();
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const resultItem = event.results[i];
            if (resultItem?.[0]) {
              currentTranscript += resultItem[0].transcript;
            }
          }
          this.lastTranscript = currentTranscript;
          this.notifyState();

          const lastResult = event.results[event.results.length - 1];
          if (lastResult?.isFinal) {
            const finalCommand = currentTranscript.trim();
            if (this.onCommandRecognized) {
              this.onCommandRecognized(finalCommand);
            }
            void this.handleFinalCommand(finalCommand);
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          // Ignore non-fatal background speech errors like 'no-speech' or 'aborted'
          if (event?.error === 'no-speech' || event?.error === 'aborted') {
            return;
          }
          this.isListeningInternal = false;
          this.stopAudioWaveSimulation();
          this.notifyState();
        };
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public setContinuous(enabled: boolean): void {
    this.continuousConversation = enabled;
  }

  public getContinuous(): boolean {
    return this.continuousConversation;
  }

  public onStateChange(cb: (state: VoiceState) => void): void {
    this.onStateChangeCallback = cb;
    this.notifyState();
  }

  public setCommandHandler(cb: (cmd: string) => void): void {
    this.onCommandRecognized = cb;
  }

  public setPendingAction(action: PendingVoiceAction | null): void {
    this.pendingActionInternal = action;
    this.notifyState();
  }

  public getPendingAction(): PendingVoiceAction | null {
    return this.pendingActionInternal;
  }

  public startListening(): void {
    if (!this.recognition) return;
    this.stopSpeaking();
    this.isThinkingInternal = false;
    this.isListeningInternal = true;
    try {
      this.recognition.start();
    } catch {
      // safe fallback if recognition instance state is restarting
    }
  }

  public stopListening(): void {
    this.isListeningInternal = false;
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // ignored
    }
    this.stopAudioWaveSimulation();
    this.notifyState();
  }

  public setThinking(thinking: boolean): void {
    this.isThinkingInternal = thinking;
    this.notifyState();
  }

  private wakeWordDetected = false;
  private streamingToken = '';
  private context: VoiceConversationContext = { turns: [] };

  public async handleFinalCommand(command: string): Promise<void> {
    if (!command) return;
    let text = command.trim();
    const lower = text.toLowerCase();

    // 1. Instant Interruption check
    if (lower === 'stop' || lower === 'pause' || lower === 'quiet' || lower.includes('shut up')) {
      this.stopSpeaking();
      this.notifyState();
      return;
    }

    // 2. Wake Word Detection ('Hey MerchantPilot' / 'Hello Atlas' / 'Hey Atlas')
    if (lower.startsWith('hey merchantpilot') || lower.startsWith('hey merchant pilot')) {
      this.wakeWordDetected = true;
      text = text.replace(/hey merchant\s?pilot/i, '').trim();
    } else if (lower.startsWith('hello atlas') || lower.startsWith('hey atlas')) {
      this.wakeWordDetected = true;
      text = text.replace(/(hello|hey)\s?atlas/i, '').trim();
    }

    if (!text) {
      this.speak('Yes, I am listening. How can I assist your store operations?');
      return;
    }

    // Record turn in context
    this.context.turns.push({
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 3. Multi-turn follow-up clarification resolution
    if (this.context.pendingClarification === 'WHICH_PRODUCTS_PRICE') {
      delete this.context.pendingClarification;
      if (lower.includes('top') || lower.includes('seller') || lower.includes('mouse')) {
        this.speak(
          'Targeting top seller: Ergonomic Mouse. Vega recommends an 8% lift from ₹999 to ₹1,099 to expand gross margin. Shall I execute this update?'
        );
        this.setPendingAction({
          id: 'act-voice-price',
          actionType: 'UPDATE_PRICE',
          title: 'Raise Ergonomic Mouse price to ₹1,099',
          description: '+8% dynamic price adjustment',
          onExecute: () => {
            return Promise.resolve(
              'Confirmed. Updated Ergonomic Mouse to ₹1,099. Projected monthly gross profit lift is ₹42,000.'
            );
          }
        });
        return;
      }
    }

    // Check if user is asking to increase prices without specifying product
    if (
      (lower.includes('increase price') || lower.includes('raise price')) &&
      !lower.includes('mouse') &&
      !lower.includes('keyboard')
    ) {
      this.context.pendingClarification = 'WHICH_PRODUCTS_PRICE';
      this.speak('Which products would you like to adjust? Your top sellers, or low-margin items?');
      return;
    }

    // Check if user is confirming or rejecting a pending tool action
    if (this.pendingActionInternal) {
      if (
        lower.includes('yes') ||
        lower.includes('approve') ||
        lower.includes('do it') ||
        lower.includes('confirm') ||
        lower.includes('execute')
      ) {
        const action = this.pendingActionInternal;
        this.pendingActionInternal = null;
        this.setThinking(true);
        try {
          const resultMsg = await action.onExecute();
          this.setThinking(false);
          this.speak(resultMsg);
        } catch {
          this.setThinking(false);
          this.speak('There was an issue executing that command. Please review the dashboard.');
        }
        return;
      }

      if (
        lower.includes('no') ||
        lower.includes('cancel') ||
        lower.includes('reject') ||
        lower.includes('nevermind')
      ) {
        this.pendingActionInternal = null;
        this.speak('Understood. Action cancelled. What else can I assist you with?');
        return;
      }
    }

    // NOTE: Do NOT call this.onCommandRecognized(text) here.
    // The onresult handler already dispatches final commands to the command handler.
    // Calling it again here would cause double-processing and repeated responses.
  }

  public speak(text: string, onDone?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onDone) onDone();
      return;
    }

    this.stopListening();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best available modern English voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(
      (v) =>
        (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural')) &&
        v.lang.startsWith('en')
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    this.lastSpokenResponse = text;
    this.isSpeakingInternal = true;
    this.isThinkingInternal = false;
    this.startAudioWaveSimulation();
    this.notifyState();

    const finishSpeaking = () => {
      this.isSpeakingInternal = false;
      this.stopAudioWaveSimulation();
      this.notifyState();

      if (onDone) onDone();

      // Continuous conversation turn-taking: automatically resume listening after speaking
      if (this.continuousConversation) {
        setTimeout(() => {
          if (!this.isSpeakingInternal && !this.isListeningInternal) {
            this.startListening();
          }
        }, 350);
      }
    };

    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeakingInternal = false;
      this.stopAudioWaveSimulation();
      this.notifyState();
    }
  }

  private startAudioWaveSimulation(): void {
    if (this.audioWaveInterval) clearInterval(this.audioWaveInterval);
    this.audioWaveInterval = setInterval(() => {
      this.currentWaveLevels = [
        Math.floor(20 + Math.random() * 70),
        Math.floor(30 + Math.random() * 65),
        Math.floor(40 + Math.random() * 55),
        Math.floor(25 + Math.random() * 70),
        Math.floor(20 + Math.random() * 50)
      ];
      this.notifyState();
    }, 120);
  }

  private stopAudioWaveSimulation(): void {
    if (this.audioWaveInterval) {
      clearInterval(this.audioWaveInterval);
      this.audioWaveInterval = null;
    }
    this.currentWaveLevels = [15, 20, 25, 20, 15];
  }

  public getAvatarState(): VoiceAIAvatarState {
    if (this.isSpeakingInternal) return 'SPEAKING';
    if (this.isThinkingInternal) return 'THINKING';
    if (this.isListeningInternal) return 'LISTENING';
    return 'IDLE';
  }

  private notifyState(): void {
    if (!this.onStateChangeCallback) return;
    const isSpeaking =
      this.isSpeakingInternal ||
      (typeof window !== 'undefined' && !!window.speechSynthesis?.speaking);

    this.onStateChangeCallback({
      isListening: this.isListeningInternal,
      isSpeaking,
      isThinking: this.isThinkingInternal,
      avatarState: this.getAvatarState(),
      transcript: this.lastTranscript,
      streamingToken: this.streamingToken,
      lastAiResponse: this.lastSpokenResponse,
      supported: this.isSupported(),
      audioWaveLevels: this.currentWaveLevels,
      pendingAction: this.pendingActionInternal,
      wakeWordDetected: this.wakeWordDetected,
      context: this.context
    });
  }
}

export const voiceAI = new VoiceAIEngine();
