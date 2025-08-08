"use client";

// Smooth scroll utility functions
export function smoothScrollTo(element: HTMLElement | string, options?: ScrollIntoViewOptions) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  
  if (!target) {
    console.warn('Smooth scroll target not found:', element);
    return;
  }

  const defaultOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };

  target.scrollIntoView(defaultOptions);
}

export function smoothScrollToTop(duration: number = 800) {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();

  function animation(currentTime: number) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function (ease-out-cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startPosition * (1 - easeOutCubic));
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

export function smoothScrollToSection(sectionId: string, offset: number = 100) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Hook for smooth scroll behavior
export function useSmoothScroll() {
  const scrollToElement = (elementId: string, offset?: number) => {
    smoothScrollToSection(elementId, offset);
  };
  
  const scrollToTop = (duration?: number) => {
    smoothScrollToTop(duration);
  };
  
  return {
    scrollToElement,
    scrollToTop,
    smoothScrollTo
  };
}

// Enhanced scroll detection hook
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = React.useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = React.useState(0);
  
  React.useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      
      setScrollY(scrollY);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDirection]);
  
  return { scrollDirection, scrollY };
}

// Import React for the hook
import React from 'react';