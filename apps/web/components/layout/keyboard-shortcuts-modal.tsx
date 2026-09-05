'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open Command Palette' },
      { keys: ['⌘', 'J'], description: 'Open AI Copilot' },
      { keys: ['⌘', '.'], description: 'Open Voice AI' },
      { keys: ['?'], description: 'Show Keyboard Shortcuts' }
    ]
  },
  {
    title: 'AI Intelligence',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Then type "copilot" → Jump to AI Copilot' },
      { keys: ['⌘', 'K'], description: 'Then type "fraud" → Jump to Fraud Scanner' },
      { keys: ['⌘', 'K'], description: 'Then type "restock" → Jump to Restock Recommendations' }
    ]
  },
  {
    title: 'Quick Actions',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Then type ">create" → Create Product / Order' },
      { keys: ['Esc'], description: 'Close current modal or dialog' }
    ]
  }
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Keyboard className="h-4 w-4 text-indigo-500" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
                {group.title}
              </p>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs text-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, kidx) => (
                        <React.Fragment key={kidx}>
                          {kidx > 0 && <span className="text-[10px] text-muted-foreground">+</span>}
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono px-1.5 py-0 h-5 min-w-[22px] text-center"
                          >
                            {key}
                          </Badge>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
