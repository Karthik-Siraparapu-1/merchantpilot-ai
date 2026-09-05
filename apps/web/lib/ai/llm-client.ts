/**
 * Optional Multi-Provider LLM Client
 * Connects to OpenAI, Google Gemini, or falls back to MerchantPilot's
 * zero-latency deterministic multi-agent heuristic engine.
 */

export type LLMProvider = 'GEMINI' | 'OPENAI' | 'HEURISTIC';

export interface LLMConfig {
  provider: LLMProvider;
  geminiApiKey?: string | undefined;
  openaiApiKey?: string | undefined;
  model?: string | undefined;
}

const STORAGE_KEY = 'merchantpilot_llm_config';

class LLMClient {
  private config: LLMConfig = {
    provider: 'HEURISTIC'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.config = JSON.parse(saved) as LLMConfig;
        } else {
          // Check environment variables as defaults
          const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
          if (geminiKey) {
            this.config = { provider: 'GEMINI', geminiApiKey: geminiKey, model: 'gemini-1.5-pro' };
          } else if (openaiKey) {
            this.config = { provider: 'OPENAI', openaiApiKey: openaiKey, model: 'gpt-4o' };
          }
        }
      } catch {
        // Fallback to heuristic
      }
    }
  }

  getConfig(): LLMConfig {
    return { ...this.config };
  }

  setConfig(newConfig: Partial<LLMConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch {
        // LocalStorage write failed
      }
    }
  }

  isConfigured(): boolean {
    if (this.config.provider === 'GEMINI') return Boolean(this.config.geminiApiKey);
    if (this.config.provider === 'OPENAI') return Boolean(this.config.openaiApiKey);
    return true; // HEURISTIC is always configured
  }

  /**
   * Complete a prompt using configured LLM provider or fallback
   */
  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    if (this.config.provider === 'GEMINI' && this.config.geminiApiKey) {
      try {
        const model = this.config.model || 'gemini-1.5-pro';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.geminiApiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...(systemPrompt
                ? [{ role: 'user', parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }] }]
                : []),
              { role: 'user', parts: [{ text: prompt }] }
            ]
          })
        });

        if (response.ok) {
          const data = (await response.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) return candidate.trim();
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to heuristic:', err);
      }
    }

    if (this.config.provider === 'OPENAI' && this.config.openaiApiKey) {
      try {
        const model = this.config.model || 'gpt-4o';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.openaiApiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const candidate = data.choices?.[0]?.message?.content;
          if (candidate) return candidate.trim();
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to heuristic:', err);
      }
    }

    // Default: Return empty string to let deterministic agent engine formulate response
    return '';
  }
}

export const llmClient = new LLMClient();
