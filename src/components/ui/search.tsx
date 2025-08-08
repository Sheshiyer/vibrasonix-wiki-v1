"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SearchResult, SearchableDoc } from '@/types/search';
import { searchDocs, getSearchSuggestions } from '@/lib/search-client';

interface SearchProps {
  className?: string;
  placeholder?: string;
  section?: string;
  onResultSelect?: (result: SearchableDoc) => void;
  autoFocus?: boolean;
}

export function SearchComponent({ 
  className, 
  placeholder = "Search documentation...", 
  section,
  onResultSelect,
  autoFocus = false 
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isIndexReady, setIsIndexReady] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Initialize search index on mount
  useEffect(() => {
    setIsIndexReady(true);
  }, []);
  
  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vibrasonix-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);
  
  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Debounced search
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim() || !isIndexReady) {
        setResults([]);
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
          const searchResults = await searchDocs(searchQuery, { section, limit: 8 });
          const searchSuggestions = await getSearchSuggestions(searchQuery, 5);
          
          setResults(searchResults);
          setSuggestions(searchSuggestions);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [section, isIndexReady]
  );
  
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);
  };
  
  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('vibrasonix-recent-searches', JSON.stringify(updated));
    
    setQuery(searchQuery);
    setIsOpen(false);
  };
  
  // Handle result selection
  const handleResultSelect = (result: SearchableDoc) => {
    handleSearch(result.title);
    onResultSelect?.(result);
    setIsOpen(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    const totalItems = results.length + suggestions.length + (recentSearches.length > 0 ? recentSearches.length : 0);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < results.length) {
            handleResultSelect(results[selectedIndex].item);
          } else if (selectedIndex < results.length + suggestions.length) {
            const suggestionIndex = selectedIndex - results.length;
            handleSearch(suggestions[suggestionIndex]);
          } else {
            const recentIndex = selectedIndex - results.length - suggestions.length;
            handleSearch(recentSearches[recentIndex]);
          }
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  const popularSearches = ['binaural beats', 'meditation', 'sleep therapy', 'focus enhancement', 'anxiety relief'];
  const showPopular = !query && recentSearches.length === 0;
  const showRecent = !query && recentSearches.length > 0;
  
  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 pr-10 h-12 text-base",
            "backdrop-blur-xl bg-white/10 border-white/20",
            "focus:bg-white/20 focus:border-white/30",
            "placeholder:text-white/60"
          )}
          disabled={!isIndexReady}
        />
        
        {/* Loading/Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
          ) : query ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="w-6 h-6 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </div>
      
      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (isLoading || results.length > 0 || suggestions.length > 0 || showPopular || showRecent) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "backdrop-blur-xl bg-white/10 border border-white/20",
              "rounded-xl shadow-2xl overflow-hidden",
              "max-h-96 overflow-y-auto"
            )}
            ref={resultsRef}
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-white/60 px-3 py-2 flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Results ({results.length})
                </div>
                {results.map((result, index) => (
                  <Link
                    key={result.item.slug}
                    href={`/${result.item.slug}`}
                    onClick={() => handleResultSelect(result.item)}
                    className={cn(
                      "block p-3 rounded-lg transition-colors",
                      "hover:bg-white/20",
                      selectedIndex === index && "bg-white/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-white truncate">
                          {result.item.title}
                        </h4>
                        {result.item.description && (
                          <p className="text-xs text-white/70 mt-1 line-clamp-2">
                            {result.item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                            {result.item.section.replace('-', ' ')}
                          </span>
                          {result.score && (
                            <span className="text-xs text-white/50">
                              {Math.round((1 - result.score) * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-t border-white/10">
                <div className="text-xs font-medium text-white/60 px-3 py-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => {
                  const suggestionIndex = results.length + index;
                  return (
                    <button
                      key={`suggestion-${index}-${suggestion}`}
                      onClick={() => handleSearch(suggestion)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors",
                        "hover:bg-white/20 flex items-center gap-3",
                        selectedIndex === suggestionIndex && "bg-white/20"
                      )}
                    >
                      <Search className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{suggestion}</span>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Recent Searches */}
            {showRecent && (
              <div className="p-2 border-t border-white/10">
                <div className="text-xs font-medium text-white/60 px-3 py-2 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recent
                </div>
                {recentSearches.map((recent, index) => {
                  const recentIndex = results.length + suggestions.length + index;
                  return (
                    <button
                      key={`recent-${index}-${recent}`}
                      onClick={() => handleSearch(recent)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors",
                        "hover:bg-white/20 flex items-center gap-3",
                        selectedIndex === recentIndex && "bg-white/20"
                      )}
                    >
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{recent}</span>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Popular Searches */}
            {showPopular && (
              <div className="p-2">
                <div className="text-xs font-medium text-white/60 px-3 py-2 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </div>
                {popularSearches.map((popular, index) => (
                  <button
                    key={`popular-${index}-${popular}`}
                    onClick={() => handleSearch(popular)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      "hover:bg-white/20 flex items-center gap-3"
                    )}
                  >
                    <TrendingUp className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white">{popular}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {query && !isLoading && results.length === 0 && suggestions.length === 0 && (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-sm text-white/60">No results found for "{query}"</p>
                <p className="text-xs text-white/40 mt-1">Try different keywords or check spelling</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Export search hook for programmatic use
export function useSearch() {
  const [isIndexReady, setIsIndexReady] = useState(true);
  
  const search = useCallback(async (query: string, options?: any) => {
      if (!isIndexReady) return [];
      return await searchDocs(query, options);
    }, [isIndexReady]);
  
  return { search, isIndexReady };
}