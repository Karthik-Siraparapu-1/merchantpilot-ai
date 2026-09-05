'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CommandPalette } from './command-palette';
import { Sidebar } from './sidebar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { QuickActionsMenu } from './quick-actions-menu';
import { AISystemTelemetryPill } from './ai-system-telemetry-pill';
import { AutoPilotToggle } from '@/components/ai/auto-pilot-toggle';
import { AIAlertsDropdown } from './ai-alerts-dropdown';
import { VoiceAIModal } from '@/components/ai/voice-ai-modal';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Global Keyboard Shortcuts (Shift+V for Voice AI, Shift+A for Copilot Assistant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        e.preventDefault();
        setVoiceOpen((prev) => !prev);
      } else if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        router.push('/copilot');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Generate breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const title = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { title, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <>
      <VoiceAIModal open={voiceOpen} onOpenChange={setVoiceOpen} />

      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-3 md:px-6 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Navigate application pages</SheetDescription>
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb Navigation */}
          <nav className="hidden sm:flex items-center space-x-1.5 text-xs text-muted-foreground font-medium">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              MerchantPilot
            </Link>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                {crumb.isLast ? (
                  <span className="text-foreground font-semibold">{crumb.title}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center Search / Command Palette */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
          <CommandPalette />
        </div>

        {/* Right Action Icons: Live Telemetry, Autopilot, AI Alerts, Quick Actions & Theme */}
        <div className="flex items-center gap-2">
          {/* Live System Telemetry Status (Backend, LLM, AI, Memory) */}
          <AISystemTelemetryPill />

          {/* AI Autopilot Mode Selector (OFF / SUGGEST / AUTO) */}
          <AutoPilotToggle />

          {/* Quick Actions */}
          <QuickActionsMenu />

          {/* AI Intelligence & Grouped Alerts Center */}
          <AIAlertsDropdown />

          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
