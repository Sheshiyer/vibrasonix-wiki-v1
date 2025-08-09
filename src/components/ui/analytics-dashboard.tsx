"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  Search,
  Download,
  Filter,
  TrendingUp,
  Activity,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/ui/glass-card';
import { useAnalytics } from '@/components/providers/analytics-provider';
import {
  AnalyticsMetrics,
  AnalyticsDashboardData,
  RealTimeStats,
} from '@/types/analytics';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  className?: string;
  showRealTime?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'year';
}

export function AnalyticsDashboard({ 
  className, 
  showRealTime = true,
  timeRange: initialTimeRange = 'week'
}: AnalyticsDashboardProps) {
  const { service, isEnabled } = useAnalytics();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeRangeDate = (range: string): { start: Date; end: Date } => {
    const end = new Date();
    const start = new Date();
    
    switch (range) {
      case 'day':
        start.setDate(end.getDate() - 1);
        break;
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    return { start, end };
  };

  const loadMetrics = async () => {
    if (!isEnabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const dateRange = getTimeRangeDate(timeRange);
      const [metricsData, realTimeData] = await Promise.all([
        service.getMetrics(dateRange),
        showRealTime ? service.getRealTimeStats() : Promise.resolve(null),
      ]);
      
      setMetrics(metricsData);
      setRealTimeStats(realTimeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [timeRange, isEnabled]);

  // Auto-refresh real-time stats
  useEffect(() => {
    if (!showRealTime || !isEnabled) return;
    
    const interval = setInterval(async () => {
      try {
        const realTimeData = await service.getRealTimeStats();
        setRealTimeStats(realTimeData);
      } catch (err) {
        console.warn('Failed to refresh real-time stats:', err);
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [service, showRealTime, isEnabled]);

  if (!isEnabled) {
    return (
      <GlassCard className={cn('p-6', className)}>
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Analytics Disabled</h3>
          <p>Analytics tracking is currently disabled. Enable it in your preferences to view usage statistics.</p>
        </div>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard className={cn('p-6', className)}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Loading analytics data...</p>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className={cn('p-6', className)}>
        <div className="text-center text-red-600">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Analytics</h3>
          <p className="mb-4">{error}</p>
          <Button onClick={loadMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </GlassCard>
    );
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Usage statistics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'day' | 'week' | 'month' | 'year')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      {showRealTime && realTimeStats && (
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Activity
            </CardTitle>
            <CardDescription>Current user activity (last 5 minutes)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{realTimeStats.activeUsers}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{realTimeStats.currentPageViews.length}</div>
                <div className="text-sm text-muted-foreground">Page Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{realTimeStats.recentEvents.length}</div>
                <div className="text-sm text-muted-foreground">Recent Events</div>
              </div>
            </div>
            {realTimeStats.topActivePages.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Most Active Pages</h4>
                <div className="flex flex-wrap gap-2">
                  {realTimeStats.topActivePages.map((page, index) => (
                    <Badge key={index} variant="secondary">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </GlassCard>
      )}

      {/* Overview Stats */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.totalPageViews)}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.uniqueVisitors)}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                  <p className="text-2xl font-bold">{formatDuration(metrics.averageSessionDuration)}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.totalSessions)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* Detailed Stats */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.title || page.path}</p>
                      <p className="text-sm text-muted-foreground truncate">{page.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{page.views}</p>
                      <p className="text-sm text-muted-foreground">{formatDuration(page.averageTimeSpent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Top Documents */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Top Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topDocuments.slice(0, 5).map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">{doc.section}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{doc.views}</p>
                      <p className="text-sm text-muted-foreground">{Math.round(doc.averageScrollDepth)}% read</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Top Search Queries */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Top Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.topSearchQueries.slice(0, 5).map((search, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">"{search.query}"</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(search.averageResultsCount)} avg results
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{search.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Export Stats */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{metrics.exportStats.totalExports}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Math.round(metrics.exportStats.successRate * 100)}%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics.exportStats.bulkExports}</p>
                    <p className="text-sm text-muted-foreground">Bulk Exports</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">By Format</h4>
                  {Object.entries(metrics.exportStats.exportsByFormat).map(([format, count]) => (
                    <div key={format} className="flex justify-between">
                      <span className="capitalize">{format}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* Engagement Metrics */}
      {metrics && (
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(metrics.userEngagement.averageScrollDepth)}%
                </p>
                <p className="text-sm text-muted-foreground">Average Scroll Depth</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formatDuration(metrics.userEngagement.averageTimePerPage)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Time per Page</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(metrics.userEngagement.interactionsPerSession)}
                </p>
                <p className="text-sm text-muted-foreground">Interactions per Session</p>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}

export default AnalyticsDashboard;