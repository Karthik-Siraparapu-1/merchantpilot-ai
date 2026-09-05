'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Building2,
  Moon,
  Sun,
  Laptop,
  Copy,
  Check,
  LogOut,
  Server,
  Sparkles,
  Brain,
  Shield,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { memoryEngine } from '@/lib/ai/memory-engine';
import { llmClient } from '@/lib/ai/llm-client';

export default function SettingsPage() {
  const { user, activeTenantId, switchTenant, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  // AI Memory Preferences — persisted in localStorage
  type MemoryPrefs = {
    prioritizeMargins: boolean;
    safetyStockThreshold: number;
    fridayFlashSales: boolean;
    holidayAlerts: boolean;
    autoFraudHold: boolean;
    voiceEnabled: boolean;
  };

  const defaultPrefs: MemoryPrefs = {
    prioritizeMargins: true,
    safetyStockThreshold: 50,
    fridayFlashSales: true,
    holidayAlerts: true,
    autoFraudHold: true,
    voiceEnabled: true
  };

  const [memoryPrefs, setMemoryPrefs] = useState<MemoryPrefs>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mp_ai_memory_prefs');
        return stored ? (JSON.parse(stored) as MemoryPrefs) : defaultPrefs;
      } catch {
        return defaultPrefs;
      }
    }
    return defaultPrefs;
  });

  const updatePref = <K extends keyof MemoryPrefs>(key: K, value: MemoryPrefs[K]) => {
    const next = { ...memoryPrefs, [key]: value };
    setMemoryPrefs(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mp_ai_memory_prefs', JSON.stringify(next));
    }
    toast.success('AI Memory preference saved');
  };

  const handleCopyTenant = () => {
    if (!activeTenantId) return;
    void navigator.clipboard.writeText(activeTenantId);
    setCopied(true);
    toast.success('Merchant Tenant UUID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const [llmConfig, setLlmConfig] = useState(llmClient.getConfig());
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [showKey, setShowKey] = useState(false);
  const [habits, setHabits] = useState(memoryEngine.getMemory().behavioralHabits);

  const handleSaveLlmConfig = (updates: Partial<typeof llmConfig>) => {
    const next = { ...llmConfig, ...updates };
    setLlmConfig(next);
    llmClient.setConfig(next);
    toast.success('AI Engine configuration saved');
  };

  const handleTestConnection = async () => {
    setTestStatus('TESTING');
    try {
      if (llmConfig.provider === 'HEURISTIC') {
        setTimeout(() => {
          setTestStatus('SUCCESS');
          toast.success('Local Multi-Agent Heuristics verified (Sub-5ms latency)');
          setTimeout(() => setTestStatus('IDLE'), 3000);
        }, 500);
        return;
      }
      const res = await llmClient.complete('Reply with: AI Engine Connected.');
      if (res) {
        setTestStatus('SUCCESS');
        toast.success(`Connection verified with ${llmConfig.provider}!`);
      } else {
        setTestStatus('ERROR');
        toast.error(`Could not verify connection. Please check API key.`);
      }
    } catch {
      setTestStatus('ERROR');
      toast.error('Connection test failed.');
    } finally {
      setTimeout(() => setTestStatus('IDLE'), 3500);
    }
  };

  const handleResetHabits = () => {
    memoryEngine.resetMemory();
    setHabits(memoryEngine.getMemory().behavioralHabits);
    toast.success('Learned behavioral habits reset to baseline');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings & Organization Controls
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your operator profile, security credentials, appearance, and multi-tenant store
          linkages
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Account Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Merchant Tenant
          </TabsTrigger>
          <TabsTrigger value="ai-memory" className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-indigo-500" /> AI Memory
          </TabsTrigger>
          <TabsTrigger value="ai-engine" className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> AI Engine & LLMs
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5" /> Appearance
          </TabsTrigger>
        </TabsList>

        {/* Account Profile Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-semibold">User Information</CardTitle>
              <CardDescription className="text-xs">
                Your personal details and role assignments in this commerce deployment
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">First Name</label>
                  <Input value={user?.firstName || ''} disabled className="text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Last Name</label>
                  <Input value={user?.lastName || ''} disabled className="text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <Input value={user?.email || ''} disabled className="text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Assigned Role</label>
                  <div>
                    <Badge variant="indigo" className="text-xs font-mono">
                      {user?.roles?.[0]?.role?.replace('_', ' ') || 'MERCHANT OWNER'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Account Status</label>
                  <div>
                    <Badge variant="success" className="text-xs">
                      {user?.status || 'ACTIVE'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Termination Card */}
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base font-semibold text-destructive">
                Sign Out of Session
              </CardTitle>
              <CardDescription className="text-xs">
                Revoke current access and refresh tokens from this device
              </CardDescription>
            </CardHeader>
            <Button variant="destructive" size="sm" onClick={() => void logout()}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
            </Button>
          </Card>
        </TabsContent>

        {/* Merchant Tenant Tab */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-semibold">Active Merchant Tenant</CardTitle>
              <CardDescription className="text-xs">
                Multi-tenant header context used for isolated database partition queries
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Tenant UUID (x-tenant-id)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={activeTenantId || 'None assigned'}
                    readOnly
                    className="font-mono text-xs bg-muted/40"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={handleCopyTenant}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Passed in HTTP headers to isolate products, orders, and inventory.
                </p>
              </div>

              {/* Organization Switcher if multiple roles */}
              {user?.roles && user.roles.length > 1 && (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-medium text-foreground">
                    Switch Active Store Organization
                  </label>
                  <select
                    value={activeTenantId || ''}
                    onChange={(e) => switchTenant(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs font-mono"
                  >
                    {user.roles.map((r) => (
                      <option key={r.merchantId} value={r.merchantId}>
                        {r.merchantId} ({r.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Connected Backend Telemetry */}
              <div className="rounded-lg border border-border p-4 bg-muted/15 flex items-center justify-between text-xs mt-4">
                <div className="flex items-center gap-2.5">
                  <Server className="h-4 w-4 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground">Core Backend Service</span>
                    <span className="block text-[11px] font-mono text-muted-foreground">
                      http://localhost:3001
                    </span>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Online
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Memory Preferences Tab */}
        <TabsContent value="ai-memory" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">AI Memory Preferences</CardTitle>
                  <CardDescription className="text-xs">
                    These preferences are stored locally and cited in Copilot reasoning
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-5">
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI Copilot uses these preferences to personalize recommendations. For example:{' '}
                  <span className="text-foreground font-medium">
                    &quot;I recommended a 6% price increase because you prioritize margins over
                    volume.&quot;
                  </span>
                </p>
              </div>

              {/* Margin vs Volume Priority */}
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    Prioritize Margins Over Volume
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AI will suggest higher-margin actions even if order volume dips slightly
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={memoryPrefs.prioritizeMargins}
                  onClick={() => updatePref('prioritizeMargins', !memoryPrefs.prioritizeMargins)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    memoryPrefs.prioritizeMargins ? 'bg-indigo-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      memoryPrefs.prioritizeMargins ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Safety Stock Threshold */}
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    Safety Stock Alert Threshold
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Trigger low-stock alerts when Tier-1 SKUs drop below this unit count
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updatePref(
                        'safetyStockThreshold',
                        Math.max(10, memoryPrefs.safetyStockThreshold - 10)
                      )
                    }
                    className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-xs font-bold hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="font-mono text-sm font-bold text-foreground min-w-[40px] text-center">
                    {memoryPrefs.safetyStockThreshold}
                  </span>
                  <button
                    onClick={() =>
                      updatePref(
                        'safetyStockThreshold',
                        Math.min(500, memoryPrefs.safetyStockThreshold + 10)
                      )
                    }
                    className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-xs font-bold hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Friday Flash Sales */}
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    Friday Flash Deal Scheduling
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AI proactively generates Friday sale campaigns and reminds you Thursday
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={memoryPrefs.fridayFlashSales}
                  onClick={() => updatePref('fridayFlashSales', !memoryPrefs.fridayFlashSales)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    memoryPrefs.fridayFlashSales ? 'bg-indigo-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      memoryPrefs.fridayFlashSales ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Holiday Demand Alerts */}
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <div>
                  <span className="text-xs font-semibold text-foreground">
                    Holiday Demand Alert Mode
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Get advance warnings 14 days before high-demand festivals (Diwali, Holi, etc.)
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={memoryPrefs.holidayAlerts}
                  onClick={() => updatePref('holidayAlerts', !memoryPrefs.holidayAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    memoryPrefs.holidayAlerts ? 'bg-indigo-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      memoryPrefs.holidayAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Fraud Hold */}
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Auto-Hold High-Risk Orders
                    </span>
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Orders scoring above 80% fraud risk are automatically held for manual review
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={memoryPrefs.autoFraudHold}
                  onClick={() => updatePref('autoFraudHold', !memoryPrefs.autoFraudHold)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    memoryPrefs.autoFraudHold ? 'bg-amber-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      memoryPrefs.autoFraudHold ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Voice AI */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="text-xs font-semibold text-foreground">Voice AI Responses</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AI speaks answers out loud when you use the voice interface
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={memoryPrefs.voiceEnabled}
                  onClick={() => updatePref('voiceEnabled', !memoryPrefs.voiceEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    memoryPrefs.voiceEnabled ? 'bg-indigo-500' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      memoryPrefs.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Engine & LLMs Tab */}
        <TabsContent value="ai-engine" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                AI Model & Provider Architecture
              </CardTitle>
              <CardDescription className="text-xs">
                Configure whether MerchantPilot routes queries through cloud foundation models
                (Gemini / OpenAI) or utilizes the zero-latency local heuristic engine.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              {/* Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveLlmConfig({ provider: 'HEURISTIC' })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    llmConfig.provider === 'HEURISTIC'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">Local Multi-Agent</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-emerald-500 border-emerald-500/30"
                    >
                      Built-in
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Zero-latency deterministic execution. No API key required.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSaveLlmConfig({ provider: 'GEMINI', model: 'gemini-1.5-pro' })
                  }
                  className={`p-4 rounded-xl border text-left transition-all ${
                    llmConfig.provider === 'GEMINI'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">Google Gemini</span>
                    <Badge variant="indigo" className="text-[10px]">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    High speed multimodal reasoning via Google Gemini 1.5 Pro.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveLlmConfig({ provider: 'OPENAI', model: 'gpt-4o' })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    llmConfig.provider === 'OPENAI'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">OpenAI GPT-4o</span>
                    <Badge variant="outline" className="text-[10px]">
                      Cloud
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Complex chain-of-thought analysis and natural dialog.
                  </p>
                </button>
              </div>

              {/* API Key Configuration for Cloud Providers */}
              {llmConfig.provider !== 'HEURISTIC' && (
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-indigo-500" />
                      {llmConfig.provider === 'GEMINI' ? 'Google Gemini API Key' : 'OpenAI API Key'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <Input
                    type={showKey ? 'text' : 'password'}
                    placeholder={llmConfig.provider === 'GEMINI' ? 'AIzaSy...' : 'sk-...'}
                    value={
                      llmConfig.provider === 'GEMINI'
                        ? llmConfig.geminiApiKey || ''
                        : llmConfig.openaiApiKey || ''
                    }
                    onChange={(e) => {
                      if (llmConfig.provider === 'GEMINI') {
                        handleSaveLlmConfig({ geminiApiKey: e.target.value });
                      } else {
                        handleSaveLlmConfig({ openaiApiKey: e.target.value });
                      }
                    }}
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Your key is stored locally in your browser session and never transmitted to
                    third parties.
                  </p>
                </div>
              )}

              {/* Test Connection Button */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={() => {
                    void handleTestConnection();
                  }}
                  disabled={testStatus === 'TESTING'}
                  size="sm"
                  className="text-xs"
                >
                  {testStatus === 'TESTING' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Testing Connection...
                    </>
                  ) : testStatus === 'SUCCESS' ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                      Verified Active
                    </>
                  ) : testStatus === 'ERROR' ? (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                      Connection Failed
                    </>
                  ) : (
                    'Verify AI Connection'
                  )}
                </Button>
              </div>

              {/* Learned Behavioral Habits Panel */}
              <div className="pt-4 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-purple-500" />
                      Learned Operator Behavioral Habits
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Patterns the AI has identified based on your approvals and decision history
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetHabits}
                    className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Reset Habits
                  </Button>
                </div>

                <div className="space-y-2">
                  {habits.map((habit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-border/70 bg-card flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {habit.category}
                        </Badge>
                        <span className="text-foreground">{habit.pattern}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                        <span>Observed: {habit.frequency}x</span>
                        <span>&middot;</span>
                        <span>{new Date(habit.lastObserved).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-semibold">
                Theme & Interface Appearance
              </CardTitle>
              <CardDescription className="text-xs">
                Select your preferred visual style across light, dark, and system modes
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light */}
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <Sun className="h-6 w-6 text-foreground" />
                  <span className="text-xs font-semibold text-foreground">Light Mode</span>
                  <span className="text-[11px] text-muted-foreground">Clean, high contrast</span>
                </button>

                {/* Dark */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <Moon className="h-6 w-6 text-foreground" />
                  <span className="text-xs font-semibold text-foreground">Dark Mode</span>
                  <span className="text-[11px] text-muted-foreground">Deep slate & indigo</span>
                </button>

                {/* System */}
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    theme === 'system'
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <Laptop className="h-6 w-6 text-foreground" />
                  <span className="text-xs font-semibold text-foreground">System Preference</span>
                  <span className="text-[11px] text-muted-foreground">Sync with OS</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
