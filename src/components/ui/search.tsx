"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchDocs, getSearchSuggestions } from '@/lib/search';
import { SearchableDoc, SearchResult } from '@/types/search';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchComponentProps {
  placeholder?: string;
  onResultSelect?: (result: SearchableDoc) => void;
  autoFocus?: boolean;
  className?: string;
  section?: string;
}

export function SearchComponent({
  placeholder = "Search...",
  onResultSelect,
  autoFocus = false,
  className,
  section
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchDocs(query, { section, limit: 8 });
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, section]);

  useEffect(() => {
    const getSuggestions = async () => {
      if (query.trim().length >= 1 && query.trim().length < 2) {
        try {
          const suggestionResults = await getSearchSuggestions(query);
          setSuggestions(suggestionResults);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    getSuggestions();
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result.item);
    }
    setShowResults(false);
    setQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for result clicks
    setTimeout(() => {
      setShowResults(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-lg",
            "bg-white/10 border border-white/20",
            "text-white placeholder:text-white/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition-all duration-200"
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {showResults && (results.length > 0 || suggestions.length > 0) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "bg-white/10 backdrop-blur-xl border border-white/20",
              "rounded-lg shadow-2xl overflow-hidden",
              "max-h-96 overflow-y-auto"
            )}
          >
            {suggestions.length > 0 && query.length < 2 && (
              <div className="p-2">
                <div className="text-xs text-white/60 px-3 py-2 font-medium">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {query.length >= 2 && (
                  <div className="text-xs text-white/60 px-3 py-2 font-medium">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                )}
                {results.map((result, index) => (
                  <motion.button
                    key={`${result.item.slug}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "hover:bg-white/10 border border-transparent",
                      selectedIndex === index && "bg-white/20 border-white/30"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">
                          {result.item.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {result.item.description || result.item.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded">
                            {result.item.section}
                          </span>
                          {result.item.subsection && (
                            <span className="text-xs text-white/40">
                              {result.item.subsection}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-white/40 font-mono">
                        {result.score ? Math.round(result.score * 100) : 0}%
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && !isLoading && (
              <div className="p-6 text-center text-white/60">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for &quot;{query}&quot;</p>
                <p className="text-xs mt-1 opacity-75">
                  Try different keywords or check spelling
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}