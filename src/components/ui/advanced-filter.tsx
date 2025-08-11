"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Search, Grid, List, Calendar, BarChart3, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import {
  FilterCategory,
  FilterState,
  ActiveFilter,
  SortOption,
  ViewMode,
  FilterPreset,

} from "@/types/filters";

interface AdvancedFilterProps {
  categories: FilterCategory[];
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  initialFilters?: FilterState;
  className?: string;
  showPresets?: boolean;
  showAnalytics?: boolean;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevance', direction: 'desc' },
  { value: 'title', label: 'Title A-Z', direction: 'asc' },
  { value: 'title-desc', label: 'Title Z-A', direction: 'desc' },
  { value: 'date', label: 'Newest First', direction: 'desc' },
  { value: 'date-asc', label: 'Oldest First', direction: 'asc' },
  { value: 'readTime', label: 'Quick Read', direction: 'asc' },
  { value: 'readTime-desc', label: 'Long Read', direction: 'desc' },
];

const VIEW_MODES: ViewMode[] = [
  { value: 'grid', label: 'Grid', icon: 'Grid' },
  { value: 'list', label: 'List', icon: 'List' },
  { value: 'compact', label: 'Compact', icon: 'BarChart3' },
  { value: 'timeline', label: 'Timeline', icon: 'Calendar' },
];

const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: 'all',
    name: 'All Content',
    description: 'Show all available content',
    filters: {},
    isDefault: true
  },
  {
    id: 'beginner',
    name: 'Beginner Friendly',
    description: 'Content suitable for beginners',
    filters: { difficulty: 'Beginner', type: 'guide' }
  },
  {
    id: 'research',
    name: 'Research & Science',
    description: 'Scientific studies and research',
    filters: { type: 'research', section: 'sonic-science' }
  },
  {
    id: 'practical',
    name: 'Practical Guides',
    description: 'Hands-on tutorials and protocols',
    filters: { type: 'tutorial', section: 'experience-library' }
  },
  {
    id: 'recent',
    name: 'Recently Updated',
    description: 'Content updated in the last 30 days',
    filters: { dateRange: 'last30days' }
  }
];

export function AdvancedFilter({
  categories,
  onFiltersChange,
  onSortChange,
  onViewModeChange,
  initialFilters = {},
  className,
  showPresets = true,
  showAnalytics = false
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode>(VIEW_MODES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customPresets, setCustomPresets] = useState<FilterPreset[]>([]);

  const activeFilters = useMemo(() => {
    const active: ActiveFilter[] = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        const category = categories.find(c => c.id === key);
        if (category) {
          let label = String(value);
          if (category.options) {
            const option = category.options.find(o => o.value === value);
            label = option?.label || label;
          }
          active.push({ category: key, value, label: `${category.label}: ${label}` });
        }
      }
    });
    return active;
  }, [filters, categories]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (categoryId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleRemoveFilter = (categoryId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[categoryId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setFilters({});
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    setFilters(preset.filters);
  };

  const handleSavePreset = () => {
    const name = prompt('Enter preset name:');
    if (name) {
      const newPreset: FilterPreset = {
        id: `custom-${Date.now()}`,
        name,
        description: `Custom preset with ${activeFilters.length} filters`,
        filters: { ...filters },
        isCustom: true
      };
      setCustomPresets(prev => [...prev, newPreset]);
    }
  };

  const renderFilterControl = (category: FilterCategory) => {
    const value = filters[category.id];

    switch (category.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handleFilterChange(category.id, newValue)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${category.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {category.label}</SelectItem>
              {category.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <span>{option.label}</span>
                    {option.count && (
                      <Badge variant="secondary" className="ml-auto">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {category.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Switch
                  id={`${category.id}-${option.value}`}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onCheckedChange={(checked: boolean) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    const newValue = checked
                      ? [...currentArray, option.value]
                      : currentArray.filter(v => v !== option.value);
                    handleFilterChange(category.id, newValue.length > 0 ? newValue : undefined);
                  }}
                />
                <Label htmlFor={`${category.id}-${option.value}`} className="flex items-center gap-2">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                  {option.count && (
                    <Badge variant="outline" className="ml-auto">
                      {option.count}
                    </Badge>
                  )}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{category.min}</span>
              <span>{value || category.defaultValue || category.min}</span>
              <span>{category.max}</span>
            </div>
            <Slider
              value={[value || category.defaultValue || category.min]}
              onValueChange={([newValue]) => handleFilterChange(category.id, newValue)}
              min={category.min}
              max={category.max}
              step={category.step || 1}
              className="w-full"
            />
          </div>
        );

      case 'toggle':
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked: boolean) => handleFilterChange(category.id, checked || undefined)}
          />
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleFilterChange(category.id, e.target.value || undefined)}
            placeholder={`Enter ${category.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary">{activeFilters.length}</Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </Button>

        {/* Sort */}
        <Select
          value={selectedSort.value}
          onValueChange={(value) => {
            const sort = SORT_OPTIONS.find(s => s.value === value) || SORT_OPTIONS[0];
            setSelectedSort(sort);
            onSortChange(sort);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Mode */}
        <div className="flex items-center border rounded-md">
          {VIEW_MODES.map((mode) => {
            const IconComponent = mode.icon === 'Grid' ? Grid : 
                               mode.icon === 'List' ? List :
                               mode.icon === 'BarChart3' ? BarChart3 : Calendar;
            return (
              <Button
                key={mode.value}
                variant={selectedViewMode.value === mode.value ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setSelectedViewMode(mode);
                  onViewModeChange(mode);
                }}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={`${filter.category}-${filter.value}`} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard>
              <div className="p-6">
                <Tabs defaultValue="filters" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                    {showPresets && <TabsTrigger value="presets">Presets</TabsTrigger>}
                    {showAnalytics && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="filters" className="space-y-6 mt-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Filter Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categories.map((category) => (
                        <div key={category.id} className="space-y-3">
                          <Label className="text-sm font-medium">{category.label}</Label>
                          {renderFilterControl(category)}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {showPresets && (
                    <TabsContent value="presets" className="space-y-4 mt-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Filter Presets</h3>
                        <Button size="sm" onClick={handleSavePreset} disabled={activeFilters.length === 0}>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Current
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...DEFAULT_PRESETS, ...customPresets].map((preset) => (
                          <div
                            key={preset.id}
                            className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => handlePresetSelect(preset)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{preset.name}</h4>
                              {preset.isDefault && <Badge variant="outline">Default</Badge>}
                              {preset.isCustom && <Badge variant="secondary">Custom</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{preset.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {showAnalytics && (
                    <TabsContent value="analytics" className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Filter Analytics</h3>
                      <p className="text-muted-foreground">Analytics features coming soon...</p>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}