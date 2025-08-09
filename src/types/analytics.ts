// Analytics and Usage Tracking Types

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    pathname: string;
    search?: string;
  };
}

export type AnalyticsEventType =
  | 'page_view'
  | 'document_view'
  | 'search_query'
  | 'filter_applied'
  | 'export_initiated'
  | 'export_completed'
  | 'theme_changed'
  | 'navigation_click'
  | 'section_scroll'
  | 'time_spent'
  | 'interaction_click'
  | 'error_occurred'
  | 'feature_used';

export interface PageViewEvent {
  type: 'page_view';
  data: {
    path: string;
    title: string;
    section?: string;
    subsection?: string;
    referrer?: string;
    loadTime?: number;
  };
}

export interface DocumentViewEvent {
  type: 'document_view';
  data: {
    documentSlug: string;
    documentTitle: string;
    section: string;
    readTime?: number;
    scrollDepth?: number;
    timeSpent?: number;
  };
}

export interface SearchQueryEvent {
  type: 'search_query';
  data: {
    query: string;
    resultsCount: number;
    selectedResult?: string;
    filters?: Record<string, any>;
  };
}

export interface FilterAppliedEvent {
  type: 'filter_applied';
  data: {
    filterType: string;
    filterValue: any;
    resultsCount: number;
    context: 'documentation' | 'search' | 'category';
  };
}

export interface ExportEvent {
  type: 'export_initiated' | 'export_completed';
  data: {
    format: 'pdf' | 'markdown' | 'html';
    documentSlug?: string;
    documentTitle?: string;
    bulkExport?: boolean;
    sectionsCount?: number;
    success?: boolean;
    error?: string;
  };
}

export interface InteractionEvent {
  type: 'interaction_click' | 'navigation_click';
  data: {
    element: string;
    elementType: 'button' | 'link' | 'tab' | 'menu' | 'card';
    context: string;
    value?: string;
  };
}

export interface TimeSpentEvent {
  type: 'time_spent';
  data: {
    duration: number; // in seconds
    path: string;
    documentSlug?: string;
    scrollDepth: number; // percentage
    interactions: number;
  };
}

export interface FeatureUsageEvent {
  type: 'feature_used';
  data: {
    feature: string;
    action: string;
    context?: string;
    value?: any;
  };
}

// Analytics Aggregation Types
export interface AnalyticsMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalSessions: number;
  averageSessionDuration: number;
  topPages: PageMetric[];
  topDocuments: DocumentMetric[];
  topSearchQueries: SearchMetric[];
  popularFilters: FilterMetric[];
  exportStats: ExportStats;
  userEngagement: EngagementMetrics;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface PageMetric {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
  averageTimeSpent: number;
  bounceRate: number;
}

export interface DocumentMetric {
  slug: string;
  title: string;
  section: string;
  views: number;
  averageReadTime: number;
  averageScrollDepth: number;
  exports: number;
}

export interface SearchMetric {
  query: string;
  count: number;
  averageResultsCount: number;
  clickThroughRate: number;
}

export interface FilterMetric {
  filterType: string;
  filterValue: string;
  usageCount: number;
  context: string;
}

export interface ExportStats {
  totalExports: number;
  exportsByFormat: Record<'pdf' | 'markdown' | 'html', number>;
  bulkExports: number;
  singleExports: number;
  successRate: number;
  popularDocuments: Array<{
    slug: string;
    title: string;
    exports: number;
  }>;
}

export interface EngagementMetrics {
  averageScrollDepth: number;
  averageTimePerPage: number;
  interactionsPerSession: number;
  returnVisitorRate: number;
  featureUsage: Record<string, number>;
}

// Analytics Dashboard Types
export interface AnalyticsDashboardData {
  overview: AnalyticsMetrics;
  realTimeStats: RealTimeStats;
  trends: TrendData[];
  heatmaps: HeatmapData[];
}

export interface RealTimeStats {
  activeUsers: number;
  currentPageViews: PageViewStat[];
  recentEvents: AnalyticsEvent[];
  topActivePages: string[];
}

export interface PageViewStat {
  path: string;
  activeUsers: number;
  timestamp: Date;
}

export interface TrendData {
  metric: string;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

export interface HeatmapData {
  page: string;
  interactions: Array<{
    element: string;
    x: number;
    y: number;
    clicks: number;
  }>;
}

// Analytics Service Interface
export interface AnalyticsService {
  // Event tracking
  track(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): Promise<void>;
  trackPageView(data: PageViewEvent['data']): Promise<void>;
  trackDocumentView(data: DocumentViewEvent['data']): Promise<void>;
  trackSearch(data: SearchQueryEvent['data']): Promise<void>;
  trackFilter(data: FilterAppliedEvent['data']): Promise<void>;
  trackExport(data: ExportEvent['data']): Promise<void>;
  trackInteraction(data: InteractionEvent['data']): Promise<void>;
  trackTimeSpent(data: TimeSpentEvent['data']): Promise<void>;
  trackFeatureUsage(data: FeatureUsageEvent['data']): Promise<void>;
  
  // Data retrieval
  getMetrics(timeRange: { start: Date; end: Date }): Promise<AnalyticsMetrics>;
  getDashboardData(timeRange: { start: Date; end: Date }): Promise<AnalyticsDashboardData>;
  getRealTimeStats(): Promise<RealTimeStats>;
  
  // Session management
  startSession(): string;
  endSession(sessionId: string): Promise<void>;
  
  // User identification
  identifyUser(userId: string): void;
  setUserProperties(properties: Record<string, any>): void;
}

// Analytics Configuration
export interface AnalyticsConfig {
  enabled: boolean;
  trackPageViews: boolean;
  trackInteractions: boolean;
  trackScrollDepth: boolean;
  trackTimeSpent: boolean;
  sessionTimeout: number; // in minutes
  batchSize: number;
  flushInterval: number; // in milliseconds
  storage: 'localStorage' | 'sessionStorage' | 'memory';
  endpoint?: string;
  apiKey?: string;
}

// Analytics Context
export interface AnalyticsContextValue {
  service: AnalyticsService;
  config: AnalyticsConfig;
  sessionId: string;
  userId?: string;
  isEnabled: boolean;
  track: AnalyticsService['track'];
  trackPageView: AnalyticsService['trackPageView'];
  trackDocumentView: AnalyticsService['trackDocumentView'];
  trackSearch: AnalyticsService['trackSearch'];
  trackFilter: AnalyticsService['trackFilter'];
  trackExport: AnalyticsService['trackExport'];
  trackInteraction: AnalyticsService['trackInteraction'];
  trackTimeSpent: AnalyticsService['trackTimeSpent'];
  trackFeatureUsage: AnalyticsService['trackFeatureUsage'];
}