"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, BookOpen, Clock, User, Tag, ArrowRight, FileText, Folder } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DocItem } from './page';

const sectionInfo = {
  'sonic-science': {
    name: 'Sonic Science',
    icon: '🧠',
    color: 'from-blue-500 to-purple-500',
    description: 'Scientific foundations and research'
  },
  'experience-library': {
    name: 'Experience Library',
    icon: '🛠️',
    color: 'from-green-500 to-blue-500',
    description: 'Practical protocols and guides'
  },
  'transformation-journeys': {
    name: 'Transformation Journeys',
    icon: '🔮',
    color: 'from-purple-500 to-pink-500',
    description: 'Structured transformation programs'
  },
  'research-observatory': {
    name: 'Research Observatory',
    icon: '🔬',
    color: 'from-orange-500 to-red-500',
    description: 'Evidence and clinical research'
  },
  'community-cosmos': {
    name: 'Community Cosmos',
    icon: '🌌',
    color: 'from-pink-500 to-purple-500',
    description: 'Community insights and stories'
  },
  'sonic-lab': {
    name: 'Sonic Lab',
    icon: '🧪',
    color: 'from-cyan-500 to-blue-500',
    description: 'Interactive tools and experiments'
  }
};

const difficultyColors = {
  'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30'
};

const typeIcons = {
  'guide': BookOpen,
  'reference': FileText,
  'tutorial': ArrowRight,
  'research': Search
};

interface DocumentationIndexClientProps {
  docs: DocItem[];
}

export function DocumentationIndexClient({ docs }: DocumentationIndexClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>(docs);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = docs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Section filter
    if (selectedSection) {
      filtered = filtered.filter(doc => doc.section === selectedSection);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(doc => doc.difficulty === selectedDifficulty);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    setFilteredDocs(filtered);
  }, [searchTerm, selectedSection, selectedDifficulty, selectedType, docs]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSection('');
    setSelectedDifficulty('');
    setSelectedType('');
  };

  const activeFiltersCount = [selectedSection, selectedDifficulty, selectedType].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <GlassCard>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📚 Documentation Index
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Comprehensive index of all documentation, guides, research, and resources in the Vibrasonix Knowledge Hub.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{docs.length} Total Documents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>6 Main Sections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Multiple Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Regular Updates</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Search and Filters */}
        <GlassCard>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-white/20"
                />
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Section Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Section</label>
                        <select
                          value={selectedSection}
                          onChange={(e) => setSelectedSection(e.target.value)}
                          className="w-full p-2 rounded-lg bg-background/50 border border-white/20 text-sm"
                        >
                          <option value="">All Sections</option>
                          {Object.entries(sectionInfo).map(([key, info]) => (
                            <option key={key} value={key}>
                              {info.icon} {info.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Difficulty Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Difficulty</label>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) => setSelectedDifficulty(e.target.value)}
                          className="w-full p-2 rounded-lg bg-background/50 border border-white/20 text-sm"
                        >
                          <option value="">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Type Filter */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Type</label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full p-2 rounded-lg bg-background/50 border border-white/20 text-sm"
                        >
                          <option value="">All Types</option>
                          <option value="guide">Guide</option>
                          <option value="reference">Reference</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="research">Research</option>
                        </select>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <div className="mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredDocs.length} Document{filteredDocs.length !== 1 ? 's' : ''} Found
            </h2>
            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {filteredDocs.map((doc, index) => {
                const TypeIcon = typeIcons[doc.type];
                const sectionData = sectionInfo[doc.section as keyof typeof sectionInfo];
                
                return (
                  <motion.div
                    key={`doc-${doc.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="hover:bg-white/15 transition-all duration-300">
                      <Link href={`/${doc.slug}`} className="block p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${sectionData?.color || 'from-gray-500 to-gray-600'} bg-opacity-20`}>
                            <TypeIcon className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                  {doc.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                  {doc.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={`tag-${tagIndex}`} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {doc.tags.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{doc.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={`text-xs ${difficultyColors[doc.difficulty]}`}>
                                  {doc.difficulty}
                                </Badge>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {doc.readTime} min read
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Folder className="w-3 h-3" />
                                  {sectionData?.name || doc.section}
                                </span>
                                {doc.author && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {doc.author}
                                  </span>
                                )}
                              </div>
                              <span>Updated {doc.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredDocs.length === 0 && (
            <GlassCard>
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}