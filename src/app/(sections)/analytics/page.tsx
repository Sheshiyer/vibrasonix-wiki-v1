import React from 'react';
import { Metadata } from 'next';
import AnalyticsDashboard from '@/components/ui/analytics-dashboard';
import { AnalyticsProvider } from '@/components/providers/analytics-provider';

export const metadata: Metadata = {
  title: 'Analytics - Vibrasonix Wiki',
  description: 'Usage statistics and insights for the Vibrasonix Wiki',
};

export default function AnalyticsPage() {
  return (
    <AnalyticsProvider>
      <div className="container mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </div>
    </AnalyticsProvider>
  );
}