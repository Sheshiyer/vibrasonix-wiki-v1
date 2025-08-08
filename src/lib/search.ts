import { SearchableDoc, SearchResult, SearchStats } from '@/types/search';

export type { SearchableDoc, SearchResult, SearchStats };

// Search documents using API
export async function searchDocs(query: string, options: {
  limit?: number;
  section?: string;
  minScore?: number;
} = {}): Promise<SearchResult[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      limit: (options.limit || 10).toString()
    });
    
    if (options.section) {
      params.append('section', options.section);
    }
    
    if (options.minScore !== undefined) {
      params.append('minScore', options.minScore.toString());
    }
    
    const response = await fetch(`/api/search?${params}`);
    
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// Get search suggestions based on partial input
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (query.length < 2) {
    return [];
  }
  
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      suggestions: 'true'
    });
    
    const response = await fetch(`/api/search?${params}`);
    
    if (!response.ok) {
      throw new Error('Suggestions request failed');
    }
    
    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Failed to get suggestions:', error);
    return [];
  }
}

// Search within a specific section
export async function searchSection(section: string, query: string, limit: number = 5): Promise<SearchResult[]> {
  return searchDocs(query, { section, limit });
}

// Get popular/recent searches (placeholder for future implementation)
export function getPopularSearches(): string[] {
  return [
    'binaural beats',
    'meditation protocols',
    'sleep enhancement',
    'focus improvement',
    'stress reduction',
    'frequency therapy',
    'neuroscience',
    'research studies',
  ];
}

// Get all available sections for filtering
export async function getSearchableSections(): Promise<string[]> {
  try {
    const response = await fetch('/api/search/sections');
    
    if (!response.ok) {
      throw new Error('Failed to get sections');
    }
    
    const data = await response.json();
    return data.sections || [];
  } catch (error) {
    console.error('Failed to get searchable sections:', error);
    return [];
  }
}

// Get content statistics
export async function getSearchStats(): Promise<SearchStats | null> {
  try {
    const response = await fetch('/api/search/stats');
    
    if (!response.ok) {
      throw new Error('Failed to get search stats');
    }
    
    const data = await response.json();
    return data.stats || null;
  } catch (error) {
    console.error('Failed to get search stats:', error);
    return null;
  }
}