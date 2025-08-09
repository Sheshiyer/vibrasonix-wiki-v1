"use client";

import {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsService,
  AnalyticsConfig,
  AnalyticsMetrics,
  AnalyticsDashboardData,
  RealTimeStats,
  PageViewEvent,
  DocumentViewEvent,
  SearchQueryEvent,
  FilterAppliedEvent,
  ExportEvent,
  InteractionEvent,
  TimeSpentEvent,
  FeatureUsageEvent,
} from '@/types/analytics';

class LocalAnalyticsService implements AnalyticsService {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionStartTime: Date;
  private currentPath: string = '';
  private pageStartTime: Date = new Date();
  private scrollDepth: number = 0;
  private interactions: number = 0;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.startFlushTimer();
      this.loadStoredEvents();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    if (this.config.trackScrollDepth) {
      let ticking = false;
      const updateScrollDepth = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollDepth = Math.max(this.scrollDepth, Math.round((scrollTop / docHeight) * 100));
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollDepth);
          ticking = true;
        }
      });
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackTimeSpentOnCurrentPage();
      } else {
        this.pageStartTime = new Date();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeSpentOnCurrentPage();
      this.flush();
    });

    // Track clicks for interaction counting
    if (this.config.trackInteractions) {
      document.addEventListener('click', () => {
        this.interactions++;
      });
    }
  }

  private trackTimeSpentOnCurrentPage(): void {
    if (!this.currentPath || !this.config.trackTimeSpent) return;

    const timeSpent = Math.round((Date.now() - this.pageStartTime.getTime()) / 1000);
    if (timeSpent > 1) { // Only track if spent more than 1 second
      this.trackTimeSpent({
        duration: timeSpent,
        path: this.currentPath,
        scrollDepth: this.scrollDepth,
        interactions: this.interactions,
      });
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private loadStoredEvents(): void {
    if (typeof window === 'undefined') return;

    try {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      const stored = storage.getItem('analytics_events');
      if (stored) {
        const events = JSON.parse(stored);
        this.eventQueue.push(...events);
        storage.removeItem('analytics_events');
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
    }
  }

  private storeEvents(): void {
    if (typeof window === 'undefined' || this.eventQueue.length === 0) return;

    try {
      const storage = this.config.storage === 'localStorage' ? localStorage : sessionStorage;
      storage.setItem('analytics_events', JSON.stringify(this.eventQueue));
    } catch (error) {
      console.warn('Failed to store analytics events:', error);
    }
  }

  private flush(): void {
    if (this.eventQueue.length === 0) return;

    // In a real implementation, this would send events to a server
    // For now, we'll store them locally and process them for metrics
    this.processEvents([...this.eventQueue]);
    this.eventQueue = [];
  }

  private processEvents(events: AnalyticsEvent[]): void {
    if (typeof window === 'undefined') return;

    try {
      const storage = localStorage;
      const existingEvents = storage.getItem('analytics_processed_events');
      const allEvents = existingEvents ? JSON.parse(existingEvents) : [];
      
      // Add new events
      allEvents.push(...events);
      
      // Keep only last 10000 events to prevent storage overflow
      const recentEvents = allEvents.slice(-10000);
      
      storage.setItem('analytics_processed_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to process analytics events:', error);
    }
  }

  private getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem('analytics_processed_events');
      if (stored) {
        const events = JSON.parse(stored);
        return events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Failed to retrieve stored analytics events:', error);
    }
    return [];
  }

  async track(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): Promise<void> {
    if (!this.config.enabled) return;

    const fullEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      ...event,
    };

    this.eventQueue.push(fullEvent);

    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  async trackPageView(data: PageViewEvent['data']): Promise<void> {
    // Track time spent on previous page
    if (this.currentPath && this.currentPath !== data.path) {
      this.trackTimeSpentOnCurrentPage();
    }

    // Reset tracking for new page
    this.currentPath = data.path;
    this.pageStartTime = new Date();
    this.scrollDepth = 0;
    this.interactions = 0;

    await this.track({
      type: 'page_view',
      data,
      metadata: {
        pathname: data.path,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      },
    });
  }

  async trackDocumentView(data: DocumentViewEvent['data']): Promise<void> {
    await this.track({
      type: 'document_view',
      data,
      metadata: {
        pathname: `/docs/${data.documentSlug}`,
      },
    });
  }

  async trackSearch(data: SearchQueryEvent['data']): Promise<void> {
    await this.track({
      type: 'search_query',
      data,
      metadata: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  }

  async trackFilter(data: FilterAppliedEvent['data']): Promise<void> {
    await this.track({
      type: 'filter_applied',
      data,
      metadata: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  }

  async trackExport(data: ExportEvent['data']): Promise<void> {
    await this.track({
      type: data.success === false ? 'export_initiated' : 'export_completed',
      data,
      metadata: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  }

  async trackInteraction(data: InteractionEvent['data']): Promise<void> {
    await this.track({
      type: 'interaction_click',
      data,
      metadata: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  }

  async trackTimeSpent(data: TimeSpentEvent['data']): Promise<void> {
    await this.track({
      type: 'time_spent',
      data,
      metadata: {
        pathname: data.path,
      },
    });
  }

  async trackFeatureUsage(data: FeatureUsageEvent['data']): Promise<void> {
    await this.track({
      type: 'feature_used',
      data,
      metadata: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  }

  async getMetrics(timeRange: { start: Date; end: Date }): Promise<AnalyticsMetrics> {
    const events = this.getStoredEvents().filter(
      (event) => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
    );

    const pageViews = events.filter((e) => e.type === 'page_view');
    const documentViews = events.filter((e) => e.type === 'document_view');
    const searches = events.filter((e) => e.type === 'search_query');
    const filters = events.filter((e) => e.type === 'filter_applied');
    const exports = events.filter((e) => e.type === 'export_completed');
    const timeSpentEvents = events.filter((e) => e.type === 'time_spent');

    const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;
    const uniqueUsers = new Set(events.filter((e) => e.userId).map((e) => e.userId)).size;

    // Calculate session durations
    const sessionDurations = new Map<string, number>();
    events.forEach((event) => {
      const sessionEvents = events.filter((e) => e.sessionId === event.sessionId);
      if (sessionEvents.length > 1) {
        const start = Math.min(...sessionEvents.map((e) => e.timestamp.getTime()));
        const end = Math.max(...sessionEvents.map((e) => e.timestamp.getTime()));
        sessionDurations.set(event.sessionId, (end - start) / 1000);
      }
    });

    const averageSessionDuration = sessionDurations.size > 0 
      ? Array.from(sessionDurations.values()).reduce((a, b) => a + b, 0) / sessionDurations.size
      : 0;

    // Top pages
    const pageViewCounts = new Map<string, number>();
    pageViews.forEach((event) => {
      const path = event.data.path;
      pageViewCounts.set(path, (pageViewCounts.get(path) || 0) + 1);
    });

    const topPages = Array.from(pageViewCounts.entries())
      .map(([path, views]) => {
        const pathEvents = timeSpentEvents.filter((e) => e.data.path === path);
        const averageTimeSpent = pathEvents.length > 0
          ? pathEvents.reduce((sum, e) => sum + e.data.duration, 0) / pathEvents.length
          : 0;
        
        return {
          path,
          title: path,
          views,
          uniqueViews: new Set(pageViews.filter((e) => e.data.path === path).map((e) => e.sessionId)).size,
          averageTimeSpent,
          bounceRate: 0, // Would need more complex calculation
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top documents
    const documentViewCounts = new Map<string, any>();
    documentViews.forEach((event) => {
      const slug = event.data.documentSlug;
      if (!documentViewCounts.has(slug)) {
        documentViewCounts.set(slug, {
          slug,
          title: event.data.documentTitle,
          section: event.data.section,
          views: 0,
          totalReadTime: 0,
          totalScrollDepth: 0,
          exports: 0,
        });
      }
      const doc = documentViewCounts.get(slug);
      doc.views++;
      if (event.data.readTime) doc.totalReadTime += event.data.readTime;
      if (event.data.scrollDepth) doc.totalScrollDepth += event.data.scrollDepth;
    });

    const topDocuments = Array.from(documentViewCounts.values())
      .map((doc) => ({
        ...doc,
        averageReadTime: doc.views > 0 ? doc.totalReadTime / doc.views : 0,
        averageScrollDepth: doc.views > 0 ? doc.totalScrollDepth / doc.views : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top search queries
    const searchCounts = new Map<string, number>();
    searches.forEach((event) => {
      const query = event.data.query.toLowerCase();
      searchCounts.set(query, (searchCounts.get(query) || 0) + 1);
    });

    const topSearchQueries = Array.from(searchCounts.entries())
      .map(([query, count]) => ({
        query,
        count,
        averageResultsCount: searches
          .filter((e) => e.data.query.toLowerCase() === query)
          .reduce((sum, e) => sum + e.data.resultsCount, 0) / count,
        clickThroughRate: 0, // Would need click tracking
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Popular filters
    const filterCounts = new Map<string, any>();
    filters.forEach((event) => {
      const key = `${event.data.filterType}:${event.data.filterValue}`;
      if (!filterCounts.has(key)) {
        filterCounts.set(key, {
          filterType: event.data.filterType,
          filterValue: event.data.filterValue,
          usageCount: 0,
          context: event.data.context,
        });
      }
      filterCounts.get(key).usageCount++;
    });

    const popularFilters = Array.from(filterCounts.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // Export stats
    const exportsByFormat = exports.reduce((acc, event) => {
      const format = event.data.format as 'pdf' | 'markdown' | 'html';
      acc[format] = (acc[format] || 0) + 1;
      return acc;
    }, {} as Record<'pdf' | 'markdown' | 'html', number>);

    const exportStats = {
      totalExports: exports.length,
      exportsByFormat,
      bulkExports: exports.filter((e) => e.data.bulkExport).length,
      singleExports: exports.filter((e) => !e.data.bulkExport).length,
      successRate: exports.filter((e) => e.data.success !== false).length / Math.max(exports.length, 1),
      popularDocuments: [], // Would need more complex calculation
    };

    // Engagement metrics
    const totalScrollDepth = timeSpentEvents.reduce((sum, e) => sum + (e.data.scrollDepth || 0), 0);
    const totalInteractions = timeSpentEvents.reduce((sum, e) => sum + (e.data.interactions || 0), 0);
    const totalTimeSpent = timeSpentEvents.reduce((sum, e) => sum + e.data.duration, 0);

    const engagementMetrics = {
      averageScrollDepth: timeSpentEvents.length > 0 ? totalScrollDepth / timeSpentEvents.length : 0,
      averageTimePerPage: timeSpentEvents.length > 0 ? totalTimeSpent / timeSpentEvents.length : 0,
      interactionsPerSession: uniqueSessions > 0 ? totalInteractions / uniqueSessions : 0,
      returnVisitorRate: 0, // Would need user tracking
      featureUsage: {}, // Would need feature tracking
    };

    return {
      totalPageViews: pageViews.length,
      uniqueVisitors: uniqueUsers || uniqueSessions,
      totalSessions: uniqueSessions,
      averageSessionDuration,
      topPages,
      topDocuments,
      topSearchQueries,
      popularFilters,
      exportStats,
      userEngagement: engagementMetrics,
      timeRange,
    };
  }

  async getDashboardData(timeRange: { start: Date; end: Date }): Promise<AnalyticsDashboardData> {
    const overview = await this.getMetrics(timeRange);
    const realTimeStats = await this.getRealTimeStats();

    return {
      overview,
      realTimeStats,
      trends: [], // Would need time-series data
      heatmaps: [], // Would need interaction tracking
    };
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    const recentEvents = this.getStoredEvents()
      .filter((event) => Date.now() - event.timestamp.getTime() < 5 * 60 * 1000) // Last 5 minutes
      .slice(-50);

    const activeUsers = new Set(recentEvents.map((e) => e.sessionId)).size;
    
    const currentPageViews = recentEvents
      .filter((e) => e.type === 'page_view')
      .map((e) => ({
        path: e.data.path,
        activeUsers: 1,
        timestamp: e.timestamp,
      }));

    const topActivePages = Array.from(
      new Set(currentPageViews.map((pv) => pv.path))
    ).slice(0, 5);

    return {
      activeUsers,
      currentPageViews,
      recentEvents: recentEvents.slice(-10),
      topActivePages,
    };
  }

  startSession(): string {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    return this.sessionId;
  }

  async endSession(sessionId: string): Promise<void> {
    if (this.sessionId === sessionId) {
      this.trackTimeSpentOnCurrentPage();
      this.flush();
    }
  }

  identifyUser(userId: string): void {
    this.userId = userId;
  }

  setUserProperties(properties: Record<string, any>): void {
    // Store user properties for future events
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('analytics_user_properties', JSON.stringify(properties));
      } catch (error) {
        console.warn('Failed to store user properties:', error);
      }
    }
  }
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  trackPageViews: true,
  trackInteractions: true,
  trackScrollDepth: true,
  trackTimeSpent: true,
  sessionTimeout: 30, // 30 minutes
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  storage: 'localStorage',
};

// Create and export the analytics service instance
export const analyticsService = new LocalAnalyticsService(defaultConfig);

// Export the class for custom configurations
export { LocalAnalyticsService };
export type { AnalyticsConfig };