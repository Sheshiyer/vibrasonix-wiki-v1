"use client";

import { GlassCard } from '@/components/ui/glass-card';
import { LiquidBackground } from '@/components/ui/liquid-background';
import { FloatingNav } from '@/components/ui/floating-nav';
import { MobileNav } from '@/components/ui/mobile-nav';
import { SubsectionNav, getSubsectionItems } from '@/components/ui/subsection-nav';
import { PageTransition } from '@/components/ui/page-transition';
import { Breadcrumb, generateBreadcrumbs } from '@/components/ui/breadcrumb';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const sections = [
  {
    title: 'Sonic Science',
    href: '/sonic-science',
    description: 'Scientific foundation behind sound therapy'
  },
  {
    title: 'Experience Library',
    href: '/experience-library',
    description: 'Curated collection of sound therapy protocols'
  },
  {
    title: 'Transformation Journeys',
    href: '/transformation-journeys',
    description: 'Narrative-driven paths with progress visualization'
  },
  {
    title: 'Research Observatory',
    href: '/research-observatory',
    description: 'Living library of evidence with interactive exploration'
  },
  {
    title: 'Community Cosmos',
    href: '/community-cosmos',
    description: 'Interactive social knowledge sharing space'
  },
  {
    title: 'Sonic Lab',
    href: '/sonic-lab',
    description: 'Experimental zone for personalized exploration'
  }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const isHomePage = pathname === '/';

  const navItems = sections.map(section => ({
    title: section.title.replace(/[🧠🛠️🔮🔬💫🧪]/g, '').trim(),
    href: section.href,
    icon: section.title.match(/[🧠🛠️🔮🔬💫🧪]/)?.[0],
    description: section.description,
  }));

  // Determine current section for subsection navigation
  const currentSection = pathname.split('/')[1];
  const subsectionItems = getSubsectionItems(currentSection);
  const showSubsectionNav = !isHomePage && subsectionItems.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <LiquidBackground />
      
      {/* Desktop Floating Navigation */}
      <div className="hidden md:block">
        <FloatingNav items={navItems} />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav items={navItems} />
      </div>
      
      {/* Subsection Navigation */}
      {showSubsectionNav && (
        <div className="hidden md:block">
          <SubsectionNav 
            section={currentSection} 
            items={subsectionItems}
          />
        </div>
      )}
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
          <PageTransition>
            {/* Header - only show on home page */}
            {isHomePage && (
              <GlassCard className="mb-6 sm:mb-8" gradient="rainbow">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center px-2">
                  🌊 Vibrasonix Knowledge Hub 🌊
                </h1>
                <p className="text-center text-muted-foreground mt-2 text-sm sm:text-base px-4">
                  Interactive exploration of sound therapy for sleep, focus, stress reduction, and meditation
                </p>
              </GlassCard>
            )}
            
            {/* Breadcrumb Navigation - show on non-home pages */}
            {!isHomePage && breadcrumbs.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}
            
            {children}
          </PageTransition>
        </div>
    </div>
  );
}