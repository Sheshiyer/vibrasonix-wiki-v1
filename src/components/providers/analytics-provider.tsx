"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  AnalyticsContextValue,
  AnalyticsConfig,
  AnalyticsService,
} from '@/types/analytics';
import { analyticsService } from '@/lib/analytics-service';

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  config?: Partial<AnalyticsConfig>;
  service?: AnalyticsService;
}

export function AnalyticsProvider({ 
  children, 
  config = {}, 
  service = analyticsService 
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>();
  const [isEnabled, setIsEnabled] = useState(true);

  // Initialize session
  useEffect(() => {
    const newSessionId = service.startSession();
    setSessionId(newSessionId);

    // Check if analytics is enabled (could be from user preferences)
    const checkAnalyticsEnabled = () => {
      if (typeof window !== 'undefined') {
        try {
          const userPrefs = localStorage.getItem('user_preferences');
          if (userPrefs) {
            const prefs = JSON.parse(userPrefs);
            setIsEnabled(prefs.analytics?.enabled !== false);
          }
        } catch (error) {
          console.warn('Failed to check analytics preferences:', error);
        }
      }
    };

    checkAnalyticsEnabled();

    // Listen for preference changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_preferences') {
        checkAnalyticsEnabled();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      service.endSession(newSessionId);
    };
  }, [service]);

  // Track page views automatically
  useEffect(() => {
    if (!isEnabled || !pathname) return;

    const trackPageView = async () => {
      try {
        // Extract page information
        const pathSegments = pathname.split('/').filter(Boolean);
        const section = pathSegments[0];
        const subsection = pathSegments[1];
        
        // Get page title
        const title = typeof document !== 'undefined' 
          ? document.title 
          : pathname;

        await service.trackPageView({
          path: pathname,
          title,
          section,
          subsection,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
          loadTime: typeof performance !== 'undefined' 
            ? Math.round(performance.now()) 
            : undefined,
        });
      } catch (error) {
        console.warn('Failed to track page view:', error);
      }
    };

    // Small delay to ensure page is loaded
    const timer = setTimeout(trackPageView, 100);
    return () => clearTimeout(timer);
  }, [pathname, service, isEnabled]);

  // Create context value with wrapped methods that check if analytics is enabled
  const contextValue: AnalyticsContextValue = {
    service,
    config: {
      enabled: isEnabled,
      trackPageViews: true,
      trackInteractions: true,
      trackScrollDepth: true,
      trackTimeSpent: true,
      sessionTimeout: 30,
      batchSize: 10,
      flushInterval: 30000,
      storage: 'localStorage',
      ...config,
    },
    sessionId,
    userId,
    isEnabled,
    track: async (event) => {
      if (isEnabled) {
        await service.track(event);
      }
    },
    trackPageView: async (data) => {
      if (isEnabled) {
        await service.trackPageView(data);
      }
    },
    trackDocumentView: async (data) => {
      if (isEnabled) {
        await service.trackDocumentView(data);
      }
    },
    trackSearch: async (data) => {
      if (isEnabled) {
        await service.trackSearch(data);
      }
    },
    trackFilter: async (data) => {
      if (isEnabled) {
        await service.trackFilter(data);
      }
    },
    trackExport: async (data) => {
      if (isEnabled) {
        await service.trackExport(data);
      }
    },
    trackInteraction: async (data) => {
      if (isEnabled) {
        await service.trackInteraction(data);
      }
    },
    trackTimeSpent: async (data) => {
      if (isEnabled) {
        await service.trackTimeSpent(data);
      }
    },
    trackFeatureUsage: async (data) => {
      if (isEnabled) {
        await service.trackFeatureUsage(data);
      }
    },
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Hook for tracking interactions with automatic element detection
export function useTrackInteraction() {
  const { trackInteraction, isEnabled } = useAnalytics();

  return (element: string, elementType: 'button' | 'link' | 'tab' | 'menu' | 'card', context?: string, value?: string) => {
    if (isEnabled) {
      trackInteraction({
        element,
        elementType,
        context: context || 'unknown',
        value,
      });
    }
  };
}

// Hook for tracking feature usage
export function useTrackFeature() {
  const { trackFeatureUsage, isEnabled } = useAnalytics();

  return (feature: string, action: string, context?: string, value?: any) => {
    if (isEnabled) {
      trackFeatureUsage({
        feature,
        action,
        context,
        value,
      });
    }
  };
}

// Hook for tracking document views
export function useTrackDocument() {
  const { trackDocumentView, isEnabled } = useAnalytics();

  return (documentSlug: string, documentTitle: string, section: string, additionalData?: any) => {
    if (isEnabled) {
      trackDocumentView({
        documentSlug,
        documentTitle,
        section,
        ...additionalData,
      });
    }
  };
}

// Hook for tracking search queries
export function useTrackSearch() {
  const { trackSearch, isEnabled } = useAnalytics();

  return (query: string, resultsCount: number, selectedResult?: string, filters?: Record<string, any>) => {
    if (isEnabled) {
      trackSearch({
        query,
        resultsCount,
        selectedResult,
        filters,
      });
    }
  };
}

// Hook for tracking filter usage
export function useTrackFilter() {
  const { trackFilter, isEnabled } = useAnalytics();

  return (filterType: string, filterValue: any, resultsCount: number, context: 'documentation' | 'search' | 'category') => {
    if (isEnabled) {
      trackFilter({
        filterType,
        filterValue,
        resultsCount,
        context,
      });
    }
  };
}

// Hook for tracking exports
export function useTrackExport() {
  const { trackExport, isEnabled } = useAnalytics();

  return (format: 'pdf' | 'markdown' | 'html', documentSlug?: string, documentTitle?: string, additionalData?: any) => {
    if (isEnabled) {
      trackExport({
        format,
        documentSlug,
        documentTitle,
        ...additionalData,
      });
    }
  };
}