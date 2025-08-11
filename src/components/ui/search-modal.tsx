"use client";

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { SearchComponent } from './search';
import { SearchableDoc } from '@/types/search';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  
  const handleResultSelect = (result: SearchableDoc) => {
    router.push(`/${result.slug}`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-3xl p-0 gap-0 overflow-hidden",
          "backdrop-blur-xl bg-black/20 border-white/20",
          "shadow-2xl"
        )}
        showCloseButton={false}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Documentation
            </h2>
            <p className="text-sm text-white/60">
              Find protocols, research, guides, and more across the entire knowledge base
            </p>
          </div>
          
          <SearchComponent
            placeholder="Search across all sections..."
            onResultSelect={handleResultSelect}
            autoFocus
            className="w-full"
          />
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Enter</kbd>
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Search trigger button component
interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
  variant?: 'button' | 'input';
}

export function SearchTrigger({ onClick, className, variant = 'button' }: SearchTriggerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);
  
  if (variant === 'input') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full h-10 px-3 text-left rounded-md border",
          "backdrop-blur-xl bg-white/10 border-white/20",
          "hover:bg-white/20 hover:border-white/30",
          "text-white/60 text-sm",
          "flex items-center justify-between",
          "transition-all duration-200",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Search documentation...</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">
            {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">K</kbd>
        </div>
      </button>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "hover:bg-white/20 text-white/60 hover:text-white",
        className
      )}
      title="Search (⌘K)"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}

// Hook for managing search modal state
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  return {
    isOpen,
    open,
    close,
    toggle,
  };
}