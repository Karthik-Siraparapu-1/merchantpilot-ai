'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { FloatingAIOrb } from '@/components/ai/floating-ai-orb';
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal';
import { VoiceAIModal } from '@/components/ai/voice-ai-modal';
import { AIStatusBar } from '@/components/ai/ai-status-bar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Global keyboard shortcuts
  const handleGlobalKeys = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // ⌘J → Open AI Copilot
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        router.push('/copilot');
        return;
      }

      // ⌘. → Open Voice AI
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        setVoiceOpen(true);
        return;
      }

      // ? → Show keyboard shortcuts (only when not in an input)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [handleGlobalKeys]);

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      {/* Desktop Persistent Sidebar */}
      <Sidebar className="hidden md:flex sticky top-0" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Floating AI Orb & Status Bar */}
      <FloatingAIOrb />
      <AIStatusBar />

      {/* Global Modals */}
      <KeyboardShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <VoiceAIModal open={voiceOpen} onOpenChange={setVoiceOpen} />
    </div>
  );
}
