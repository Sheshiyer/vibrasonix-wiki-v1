"use client";

import { useState, useEffect } from 'react';

// Tailwind CSS breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to detect current screen size and breakpoint
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateBreakpoint = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);

      if (currentWidth >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (currentWidth >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (currentWidth >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (currentWidth >= breakpoints.md) {
        setBreakpoint('md');
      } else if (currentWidth >= breakpoints.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('sm'); // Default to sm for very small screens
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Listen for window resize
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return { breakpoint, width };
}

/**
 * Hook to check if screen is at or above a certain breakpoint
 */
export function useMediaQuery(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    updateMatches();

    // Listen for changes
    mediaQuery.addEventListener('change', updateMatches);
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to check if device is mobile (below md breakpoint)
 */
export function useIsMobile() {
  return !useMediaQuery('md');
}

/**
 * Hook to check if device is tablet (md to lg)
 */
export function useIsTablet() {
  const isMd = useMediaQuery('md');
  const isLg = useMediaQuery('lg');
  return isMd && !isLg;
}

/**
 * Hook to check if device is desktop (lg and above)
 */
export function useIsDesktop() {
  return useMediaQuery('lg');
}

/**
 * Utility function to get responsive values based on breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint | 'base', T>>,
  currentBreakpoint: Breakpoint
): T | undefined {
  // Order breakpoints from largest to smallest
  const orderedBreakpoints: (Breakpoint | 'base')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'base'];
  
  // Find the first matching value for current breakpoint or smaller
  for (const bp of orderedBreakpoints) {
    if (bp === 'base' || (bp === currentBreakpoint || breakpoints[bp] <= breakpoints[currentBreakpoint])) {
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }
  }
  
  return undefined;
}

/**
 * Hook to get responsive values
 */
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint | 'base', T>>
): T | undefined {
  const { breakpoint } = useBreakpoint();
  return getResponsiveValue(values, breakpoint);
}

/**
 * Utility to generate responsive class names
 */
export function responsiveClass(
  classes: Partial<Record<Breakpoint | 'base', string>>
): string {
  const classArray: string[] = [];
  
  if (classes.base) {
    classArray.push(classes.base);
  }
  
  Object.entries(classes).forEach(([bp, className]) => {
    if (bp !== 'base' && className) {
      classArray.push(`${bp}:${className}`);
    }
  });
  
  return classArray.join(' ');
}

/**
 * Responsive spacing utilities
 */
export const spacing = {
  xs: 'p-2 sm:p-3 md:p-4',
  sm: 'p-3 sm:p-4 md:p-6',
  md: 'p-4 sm:p-6 md:p-8',
  lg: 'p-6 sm:p-8 md:p-12',
  xl: 'p-8 sm:p-12 md:p-16',
} as const;

/**
 * Responsive text sizes
 */
export const textSizes = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-sm sm:text-base md:text-lg',
  lg: 'text-base sm:text-lg md:text-xl',
  xl: 'text-lg sm:text-xl md:text-2xl',
  '2xl': 'text-xl sm:text-2xl md:text-3xl',
  '3xl': 'text-2xl sm:text-3xl md:text-4xl',
  '4xl': 'text-3xl sm:text-4xl md:text-5xl',
} as const;

/**
 * Responsive margin utilities
 */
export const margins = {
  xs: 'm-2 sm:m-3 md:m-4',
  sm: 'm-3 sm:m-4 md:m-6',
  md: 'm-4 sm:m-6 md:m-8',
  lg: 'm-6 sm:m-8 md:m-12',
  xl: 'm-8 sm:m-12 md:m-16',
} as const;