"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { smoothScrollToTop } from "@/lib/smooth-scroll";

interface SubsectionItem {
  title: string;
  href: string;
  icon?: ReactNode;
  description?: string;
}

interface SubsectionNavProps {
  section: string;
  items: SubsectionItem[];
  className?: string;
}

export function SubsectionNav({ section, items, className }: SubsectionNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-expand if we're on a subsection page
  useEffect(() => {
    const isOnSubsection = items.some(item => pathname.startsWith(item.href));
    if (isOnSubsection) {
      setIsExpanded(true);
    }
  }, [pathname, items]);

  return (
    <AnimatePresence key="subsection-nav-main">
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-16 sm:top-20 left-2 sm:left-1/2 sm:-translate-x-1/2 z-40",
            "backdrop-blur-xl bg-white/10 border border-white/20",
            "rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden",
            "before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl",
            "before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20",
            "before:blur-xl before:-z-10",
            "w-56 sm:min-w-64 sm:max-w-md",
            className
          )}
        >
          {/* Header */}
          <motion.button
            className="w-full p-3 sm:p-4 text-left hover:bg-white/20 transition-colors flex items-center justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="font-semibold text-xs sm:text-sm">
                {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {items.length} subsections
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </motion.button>

          {/* Subsection Pills */}
          <AnimatePresence key="subsection-nav-pills">
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/20 p-3"
              >
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item, index) => {
                    const isActive = pathname.startsWith(item.href);
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          className={cn(
                            "relative p-2 sm:p-3 rounded-xl transition-all duration-300",
                            "hover:bg-white/20 hover:backdrop-blur-sm border border-transparent",
                            "hover:border-white/30 hover:shadow-lg",
                            isActive && "bg-white/30 backdrop-blur-sm border-white/40 shadow-xl"
                          )}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            transition: { type: "spring", stiffness: 400, damping: 25 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                          onClick={() => smoothScrollToTop(500)}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeSubsection"
                              className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          
                          <div className="relative">
                            <div className="flex items-center space-x-2 mb-1">
                              {item.icon && <span className="text-sm">{item.icon}</span>}
                              <h4 className="font-medium text-sm">{item.title}</h4>
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper function to get subsection items for a given section
export function getSubsectionItems(section: string): SubsectionItem[] {
  const subsections: Record<string, SubsectionItem[]> = {
    'sonic-science': [
      {
        title: 'Frequency Fundamentals',
        href: '/sonic-science/frequency-fundamentals',
        icon: '🎵',
        description: 'Explore sound frequencies and their effects on brain and body'
      },
      {
        title: 'Technology Nexus',
        href: '/sonic-science/technology-nexus',
        icon: '⚙️',
        description: 'Discover the five core technologies powering Vibrasonix'
      },
      {
        title: 'Neuroscience Navigator',
        href: '/sonic-science/neuroscience-navigator',
        icon: '🧠',
        description: 'Understand how sound therapy affects your nervous system'
      },
      {
        title: 'Research Radar',
        href: '/sonic-science/research-radar',
        icon: '📊',
        description: 'Explore scientific evidence behind sound therapy'
      }
    ],
    'experience-library': [
      {
        title: 'Calm Compass',
        href: '/experience-library/calm-compass',
        icon: '🧘',
        description: 'Guided relaxation and stress reduction protocols'
      },
      {
        title: 'Focus Forge',
        href: '/experience-library/focus-forge',
        icon: '🎯',
        description: 'Concentration and productivity enhancement sessions'
      },
      {
        title: 'Meditation Meridian',
        href: '/experience-library/meditation-meridian',
        icon: '🕉️',
        description: 'Deep meditation and mindfulness experiences'
      },
      {
        title: 'Sleep Sanctuary',
        href: '/experience-library/sleep-sanctuary',
        icon: '😴',
        description: 'Restorative sleep and dream enhancement protocols'
      }
    ],
    'transformation-journeys': [
      {
        title: 'Journey Maps',
        href: '/transformation-journeys/journey-maps',
        icon: '🗺️',
        description: 'Personalized transformation pathways and milestones'
      },
      {
        title: 'Progress Panoramas',
        href: '/transformation-journeys/progress-panoramas',
        icon: '📈',
        description: 'Visual progress tracking and achievement visualization'
      },
      {
        title: 'Success Stories',
        href: '/transformation-journeys/success-stories',
        icon: '⭐',
        description: 'Inspiring testimonials and transformation narratives'
      }
    ],
    'research-observatory': [
      {
        title: 'Data Dashboards',
        href: '/research-observatory/data-dashboards',
        icon: '📊',
        description: 'Interactive research data visualization and analysis'
      },
      {
        title: 'Evidence Explorer',
        href: '/research-observatory/evidence-explorer',
        icon: '🔍',
        description: 'Comprehensive database of scientific studies'
      },
      {
        title: 'Frontier Findings',
        href: '/research-observatory/frontier-findings',
        icon: '🚀',
        description: 'Latest breakthroughs in sound therapy research'
      },
      {
        title: 'Science Simplified',
        href: '/research-observatory/science-simplified',
        icon: '📚',
        description: 'Complex research made accessible and understandable'
      }
    ],
    'community-cosmos': [
      {
        title: 'Collaboration Clusters',
        href: '/community-cosmos/collaboration-clusters',
        icon: '🤝',
        description: 'Connect with like-minded practitioners and researchers'
      },
      {
        title: 'Experience Exchange',
        href: '/community-cosmos/experience-exchange',
        icon: '💬',
        description: 'Share and discover personal transformation stories'
      },
      {
        title: 'Question Quasar',
        href: '/community-cosmos/question-quasar',
        icon: '❓',
        description: 'Community-driven Q&A and knowledge sharing'
      },
      {
        title: 'Success Constellation',
        href: '/community-cosmos/success-constellation',
        icon: '🌟',
        description: 'Celebrate achievements and milestone moments'
      }
    ]
  };

  return subsections[section] || [];
}