export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'toggle' | 'date';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

export interface ActiveFilter {
  category: string;
  value: any;
  label: string;
}

export interface FilterState {
  [key: string]: any;
}

export interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface ViewMode {
  value: 'grid' | 'list' | 'compact' | 'timeline';
  label: string;
  icon: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: FilterState;
  isDefault?: boolean;
  isCustom?: boolean;
}

export interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export interface TagHierarchy {
  parent: string;
  children: string[];
  level: number;
}

export interface FilterAnalytics {
  mostUsedFilters: string[];
  popularCombinations: FilterState[];
  searchPatterns: string[];
  userPreferences: FilterState;
}