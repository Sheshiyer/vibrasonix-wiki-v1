"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { smoothScrollToSection } from "@/lib/smooth-scroll";

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
                  key={`toc-${item.id || index}-${index}`}
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