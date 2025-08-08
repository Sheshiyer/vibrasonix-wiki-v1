"use client";

import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { Button } from './button';

// Dynamically import search components to avoid SSR issues
const SearchModal = dynamic(() => import('./search-modal').then(mod => ({ default: mod.SearchModal })), {
  ssr: false,
  loading: () => null
});

const SearchTrigger = dynamic(() => import('./search-modal').then(mod => ({ default: mod.SearchTrigger })), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="sm" className="gap-2">
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline">Search</span>
    </Button>
  )
});

export { SearchModal, SearchTrigger };
export { useSearchModal } from './search-modal';