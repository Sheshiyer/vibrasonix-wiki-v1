"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Search } from "lucide-react";
import { smoothScrollToTop } from "@/lib/smooth-scroll";
import { SearchModal, useSearchModal } from "@/components/ui/search-wrapper";
import { ThemeToggleCompact } from "@/components/ui/theme-toggle";
import { SettingsTriggerCompact } from "@/components/ui/settings-trigger";

interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  description?: string;
}

interface MobileNavProps {
  items: NavItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { isOpen: isSearchOpen, open: openSearch, close: closeSearch } = useSearchModal();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Navigation Button */}
      <AnimatePresence key="mobile-nav-button">
        {isVisible && (
          <motion.button
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "fixed top-3 right-3 z-50 md:hidden",
              "backdrop-blur-xl bg-white/10 border border-white/20",
              "rounded-full p-2.5 shadow-2xl",
              "before:absolute before:inset-0 before:rounded-full",
              "before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20",
              "before:blur-xl before:-z-10",
              "hover:bg-white/20 transition-colors",
              className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Home and Search Buttons */}
      <AnimatePresence key="mobile-nav-home-search">
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
            className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 md:hidden flex items-center space-x-2"
          >
            {/* Home Button */}
            <Link href="/">
              <motion.div
                className={cn(
                  "backdrop-blur-xl bg-white/10 border border-white/20",
                  "rounded-full px-3 py-1.5 shadow-2xl",
                  "before:absolute before:inset-0 before:rounded-full",
                  "before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20",
                  "before:blur-xl before:-z-10",
                  "hover:bg-white/20 transition-colors",
                  pathname === '/' && "bg-white/30"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsOpen(false);
                  smoothScrollToTop(600);
                }}
              >
                <span className="text-xs font-medium text-white">🏠 Home</span>
              </motion.div>
            </Link>
            
            {/* Theme Toggle */}
            <ThemeToggleCompact className="shadow-2xl" />
            
            {/* Settings Trigger */}
            <SettingsTriggerCompact />
            
            {/* Search Button */}
            <motion.button
              className={cn(
                "backdrop-blur-xl bg-white/10 border border-white/20",
                "rounded-full p-2 shadow-2xl",
                "before:absolute before:inset-0 before:rounded-full",
                "before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20",
                "before:blur-xl before:-z-10",
                "hover:bg-white/20 transition-colors"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openSearch}
            >
              <Search className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence key="mobile-nav-overlay">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute right-0 top-0 h-full w-80 max-w-[85vw]",
                "backdrop-blur-xl bg-white/10 border-l border-white/20",
                "before:absolute before:inset-0",
                "before:bg-gradient-to-b before:from-primary/20 before:via-secondary/20 before:to-accent/20",
                "before:blur-xl before:-z-10"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/20">
                <h2 className="text-lg font-bold text-white mb-2">
                  🌊 Vibrasonix
                </h2>
                <p className="text-sm text-white/70">
                  Sound Therapy Knowledge Hub
                </p>
              </div>

              {/* Navigation Items */}
              <div className="p-3 space-y-3">
                {items.map((item, index) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  
                  return (
                    <motion.div
                      key={`mobile-nav-${index}-${item.href}`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <motion.div
                          className={cn(
                            "relative p-3 rounded-xl transition-all duration-300",
                            "hover:bg-white/20 hover:backdrop-blur-sm",
                            "border border-transparent hover:border-white/20",
                            isActive && "bg-white/30 backdrop-blur-sm border-white/30"
                          )}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => smoothScrollToTop(600)}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeMobileTab"
                              className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          
                          <div className="relative flex items-center space-x-3">
                            {item.icon && (
                              <span className="text-2xl">{item.icon}</span>
                            )}
                            <div>
                              <div className="font-medium text-white">
                                {item.title}
                              </div>
                              {item.description && (
                                <div className="text-sm text-white/70 mt-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20">
                <p className="text-xs text-white/50 text-center">
                  Interactive Sound Therapy Explorer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}