'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
