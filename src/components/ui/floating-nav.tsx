"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScrollToTop, smoothScrollToSection } from "@/lib/smooth-scroll";
import { SearchTrigger, SearchModal, useSearchModal } from "@/components/ui/search-wrapper";

interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  description?: string;
}

interface FloatingNavProps {
  items: NavItem[];
  className?: string;
}

export function FloatingNav({ items, className }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { isOpen, open, close } = useSearchModal();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence key="floating-nav-main">
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-3 sm:top-4 inset-x-0 z-50",
            "backdrop-blur-xl bg-white/10 border border-white/20",
            "rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-2xl",
            "before:absolute before:inset-0 before:rounded-full",
            "before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20",
            "before:blur-xl before:-z-10",
            "w-fit mx-auto max-w-[95vw]",
            className
          )}
        >
          <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
            {items.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300",
                      "hover:bg-white/20 hover:backdrop-blur-sm",
                      isActive && "bg-white/30 backdrop-blur-sm"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => smoothScrollToTop(600)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className="relative flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium">
                      {item.icon && <span className="text-base sm:text-lg">{item.icon}</span>}
                      <span className="hidden sm:inline">{item.title}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
            
            {/* Search Trigger */}
            <SearchTrigger 
              onClick={open}
              className="px-2 sm:px-4 py-1.5 sm:py-2" 
            />
          </div>
        </motion.nav>
      )}
      
      {/* Search Modal */}
      <SearchModal isOpen={isOpen} onClose={close} />
    </AnimatePresence>
  );
}

// Floating Table of Contents
interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface FloatingTocProps {
  items: TocItem[];
  className?: string;
}

export function FloatingToc({ items, className }: FloatingTocProps) {
  // Debug: Check for duplicate IDs
  const ids = items.map(item => item.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    console.warn('FloatingToc: Duplicate IDs found:', duplicateIds);
  }
  
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    smoothScrollToSection(id, 100);
  };

  return (
    <motion.div
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40",
        "backdrop-blur-xl bg-white/10 border border-white/20",
        "rounded-2xl shadow-2xl overflow-hidden",
        className
      )}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        className="w-full p-3 text-sm font-medium hover:bg-white/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
      >
        📋 Contents
      </motion.button>
      
      <AnimatePresence key="floating-toc-expanded">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20"
          >
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {items.map((item, index) => (
                <motion.button
                  key={`${item.id}-${index}`}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                    "hover:bg-white/20",
                    activeId === item.id && "bg-white/30 text-primary",
                    item.level > 1 && "ml-4 text-xs"
                  )}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ x: 4 }}
                >
                  {item.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}