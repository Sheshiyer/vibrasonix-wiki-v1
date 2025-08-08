"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, Calendar, BarChart3, BookOpen, Clock, User, Tag, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { AdvancedFilter } from "@/components/ui/advanced-filter";
import { CategoryManager } from "@/components/ui/category-manager";
import { TagSystem } from "@/components/ui/tag-system";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FilterCategory,
  FilterState,
  SortOption,
  ViewMode,
  TagHierarchy
} from "@/types/filters";

interface DocItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  section: string;
  subsection?: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'guide' | 'tutorial' | 'reference' | 'research';
}

interface DocumentationIndexClientProps {
  docs: DocItem[];
}

const DIFFICULTY_COLORS = {
  'Beginner': 'bg-green-100 text-green-800 border-green-200',
  'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Advanced': 'bg-red-100 text-red-800 border-red-200',
};

const TYPE_COLORS = {
  'guide': 'bg-blue-100 text-blue-800 border-blue-200',
  'tutorial': 'bg-purple-100 text-purple-800 border-purple-200',
  'reference': 'bg-gray-100 text-gray-800 border-gray-200',
  'research': 'bg-orange-100 text-orange-800 border-orange-200',
};

export function DocumentationIndexClient({ docs }: DocumentationIndexClientProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedSort, setSelectedSort] = useState<SortOption>({ value: 'relevance', label: 'Relevance', direction: 'desc' });
  const [selectedViewMode, setSelectedViewMode] = useState<ViewMode>({ value: 'grid', label: 'Grid', icon: 'Grid' });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showTagSystem, setShowTagSystem] = useState(false);

  // Create filter categories based on available data
  const filterCategories: FilterCategory[] = useMemo(() => {
    const sections = Array.from(new Set(docs.map(doc => doc.section)));
    const authors = Array.from(new Set(docs.map(doc => doc.author)));
    const allTags = Array.from(new Set(docs.flatMap(doc => doc.tags)));
    
    return [
      {
        id: 'section',
        label: 'Section',
        type: 'select',
        options: sections.map(section => ({
          value: section,
          label: section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count: docs.filter(doc => doc.section === section).length
        }))
      },
      {
        id: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { value: 'Beginner', label: 'Beginner', count: docs.filter(doc => doc.difficulty === 'Beginner').length },
          { value: 'Intermediate', label: 'Intermediate', count: docs.filter(doc => doc.difficulty === 'Intermediate').length },
          { value: 'Advanced', label: 'Advanced', count: docs.filter(doc => doc.difficulty === 'Advanced').length }
        ]
      },
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'guide', label: 'Guide', count: docs.filter(doc => doc.type === 'guide').length },
          { value: 'tutorial', label: 'Tutorial', count: docs.filter(doc => doc.type === 'tutorial').length },
          { value: 'reference', label: 'Reference', count: docs.filter(doc => doc.type === 'reference').length },
          { value: 'research', label: 'Research', count: docs.filter(doc => doc.type === 'research').length }
        ]
      },
      {
        id: 'author',
        label: 'Author',
        type: 'select',
        options: authors.map(author => ({
          value: author,
          label: author,
          count: docs.filter(doc => doc.author === author).length
        }))
      },
      {
        id: 'readTime',
        label: 'Read Time (minutes)',
        type: 'range',
        min: 1,
        max: Math.max(...docs.map(doc => parseInt(doc.readTime) || 0)),
        step: 1,
        defaultValue: 15
      },
      {
        id: 'tags',
        label: 'Tags',
        type: 'multiselect',
        options: allTags.slice(0, 20).map(tag => ({
          value: tag,
          label: tag,
          count: docs.filter(doc => doc.tags.includes(tag)).length
        }))
      }
    ];
  }, [docs]);

  // Create tag data for tag system
  const tagData = useMemo(() => {
    const allTags = Array.from(new Set(docs.flatMap(doc => doc.tags)));
    return allTags.map(tag => ({
      id: `tag-${tag}`,
      name: tag,
      usageCount: docs.filter(doc => doc.tags.includes(tag)).length,
      lastUsed: new Date(),
      category: 'Topic',
      color: '#3B82F6'
    }));
  }, [docs]);

  const filteredAndSortedDocs = useMemo(() => {
    let filtered = docs.filter(doc => {
      // Apply filters
      if (filters.section && doc.section !== filters.section) return false;
      if (filters.difficulty && doc.difficulty !== filters.difficulty) return false;
      if (filters.type && doc.type !== filters.type) return false;
      if (filters.author && doc.author !== filters.author) return false;
      if (filters.readTime && parseInt(doc.readTime) > filters.readTime) return false;
      
      // Apply tag filters
      if (filters.tags && Array.isArray(filters.tags)) {
        const hasAllTags = filters.tags.every(tag => doc.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      
      // Apply selected tags from tag system
      if (selectedTags.length > 0) {
        const selectedTagNames = selectedTags.map(tagId => {
          const tag = tagData.find(t => t.id === tagId);
          return tag?.name;
        }).filter(Boolean);
        const hasSelectedTags = selectedTagNames.some(tagName => doc.tags.includes(tagName!));
        if (!hasSelectedTags) return false;
      }
      
      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (selectedSort.value) {
        case 'title':
          return selectedSort.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'date':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return selectedSort.direction === 'asc' ? dateA - dateB : dateB - dateA;
        case 'readTime':
          const timeA = parseInt(a.readTime) || 0;
          const timeB = parseInt(b.readTime) || 0;
          return selectedSort.direction === 'asc' ? timeA - timeB : timeB - timeA;
        default: // relevance
          return 0;
      }
    });

    return filtered;
  }, [docs, filters, selectedSort, selectedTags, tagData]);

  const renderDocCard = (doc: DocItem) => {
    const baseCard = (
      <GlassCard key={doc.id} className="h-full">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2">
              <Badge className={cn("text-xs", DIFFICULTY_COLORS[doc.difficulty])}>
                {doc.difficulty}
              </Badge>
              <Badge className={cn("text-xs", TYPE_COLORS[doc.type])}>
                {doc.type}
              </Badge>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{doc.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
            {doc.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {doc.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {doc.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{doc.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {doc.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {doc.readTime}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(doc.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    );

    return (
      <Link key={doc.id} href={`/docs/${doc.slug}`} className="block h-full">
        {baseCard}
      </Link>
    );
  };

  const renderListItem = (doc: DocItem) => (
    <Link key={doc.id} href={`/docs/${doc.slug}`} className="block">
      <GlassCard className="mb-4">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{doc.title}</h3>
                <Badge className={cn("text-xs", DIFFICULTY_COLORS[doc.difficulty])}>
                  {doc.difficulty}
                </Badge>
                <Badge className={cn("text-xs", TYPE_COLORS[doc.type])}>
                  {doc.type}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {doc.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {doc.tags.slice(0, 5).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground ml-4">
              <div className="flex items-center gap-1 mb-1">
                <User className="h-3 w-3" />
                {doc.author}
              </div>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                {doc.readTime}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(doc.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Advanced Filter System */}
      <AdvancedFilter
        categories={filterCategories}
        onFiltersChange={setFilters}
        onSortChange={setSelectedSort}
        onViewModeChange={setSelectedViewMode}
        initialFilters={filters}
        showPresets={true}
        showAnalytics={false}
      />

      {/* Additional Tools */}
      <div className="flex gap-2">
        <Button
          variant={showTagSystem ? "default" : "outline"}
          size="sm"
          onClick={() => setShowTagSystem(!showTagSystem)}
        >
          <Tag className="h-4 w-4 mr-2" />
          Tag System
        </Button>
        <Button
          variant={showCategoryManager ? "default" : "outline"}
          size="sm"
          onClick={() => setShowCategoryManager(!showCategoryManager)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Categories
        </Button>
      </div>

      {/* Tag System */}
      {showTagSystem && (
        <TagSystem
          tags={tagData}
          selectedTags={selectedTags}
          onTagsChange={() => {}} // Read-only for now
          onSelectedTagsChange={setSelectedTags}
          allowCreation={false}
          allowEditing={false}
          showUsageStats={true}
          maxTags={5}
        />
      )}

      {/* Category Manager */}
      {showCategoryManager && (
        <CategoryManager
          categories={[]}
          onCategoriesChange={() => {}} // Read-only for now
          showDocumentCounts={true}
          allowNesting={true}
          maxDepth={3}
        />
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedDocs.length} document{filteredAndSortedDocs.length !== 1 ? 's' : ''} found
          </span>
          {Object.keys(filters).length > 0 && (
            <Badge variant="secondary">
              {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} active
            </Badge>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredAndSortedDocs.length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={selectedViewMode.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedViewMode.value === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDocs.map(renderDocCard)}
              </div>
            )}
            
            {selectedViewMode.value === 'list' && (
              <div className="space-y-4">
                {filteredAndSortedDocs.map(renderListItem)}
              </div>
            )}
            
            {selectedViewMode.value === 'compact' && (
              <div className="space-y-2">
                {filteredAndSortedDocs.map((doc) => (
                  <Link key={doc.id} href={`/docs/${doc.slug}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <Badge className={cn("text-xs", DIFFICULTY_COLORS[doc.difficulty])}>
                            {doc.difficulty[0]}
                          </Badge>
                          <Badge className={cn("text-xs", TYPE_COLORS[doc.type])}>
                            {doc.type[0].toUpperCase()}
                          </Badge>
                        </div>
                        <span className="font-medium">{doc.title}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{doc.readTime}</span>
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {selectedViewMode.value === 'timeline' && (
              <div className="space-y-6">
                {filteredAndSortedDocs.map((doc, index) => (
                  <div key={doc.id} className="relative">
                    {index !== filteredAndSortedDocs.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Link href={`/docs/${doc.slug}`} className="block">
                          <GlassCard>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold">{doc.title}</h3>
                                <div className="flex gap-1">
                                  <Badge className={cn("text-xs", DIFFICULTY_COLORS[doc.difficulty])}>
                                    {doc.difficulty}
                                  </Badge>
                                  <Badge className={cn("text-xs", TYPE_COLORS[doc.type])}>
                                    {doc.type}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">
                                {doc.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span>{doc.author}</span>
                                  <span>{doc.readTime}</span>
                                </div>
                                <span>{new Date(doc.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </GlassCard>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}