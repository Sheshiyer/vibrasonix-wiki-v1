"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SettingsPanel } from '@/components/ui/settings-panel';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsPanel />
    </DashboardLayout>
  );
}