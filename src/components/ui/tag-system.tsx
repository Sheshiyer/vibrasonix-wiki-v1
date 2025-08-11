"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, 
  Plus, 
  X, 
  Hash, 
  Search, 
 
  TrendingUp, 
 
  Star,
  Edit,
  Trash2,
  MoreHorizontal,

  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface TagData {
  id: string;
  name: string;
  description?: string;
  color?: string;
  category?: string;
  usageCount: number;
  lastUsed?: Date;
  isPopular?: boolean;
  isFavorite?: boolean;
  isHidden?: boolean;
  metadata?: Record<string, any>;
}

interface TagSystemProps {
  tags: TagData[];
  selectedTags?: string[];
  onTagsChange: (tags: TagData[]) => void;
  onSelectedTagsChange?: (tagIds: string[]) => void;
  className?: string;
  allowCreation?: boolean;
  allowEditing?: boolean;
  showUsageStats?: boolean;
  maxTags?: number;
  placeholder?: string;
}

type TagSortOption = 'name' | 'usage' | 'recent' | 'popular';
type TagViewMode = 'cloud' | 'list' | 'grid';

const TAG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
  '#059669', // Emerald
];

const TAG_CATEGORIES = [
  'General',
  'Topic',
  'Difficulty',
  'Type',
  'Status',
  'Priority',
  'Custom'
];

export function TagSystem({
  tags,
  selectedTags = [],
  onTagsChange,
  onSelectedTagsChange,
  className,
  allowCreation = true,
  allowEditing = true,
  showUsageStats = true,
  maxTags,
  placeholder = "Search or create tags..."
}: TagSystemProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [sortBy, setSortBy] = useState<TagSortOption>('usage');
  const [viewMode, setViewMode] = useState<TagViewMode>('cloud');
  const [showHidden, setShowHidden] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [newTag, setNewTag] = useState<Partial<TagData>>({});

  const filteredAndSortedTags = useMemo(() => {
    const filtered = tags.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
      const matchesVisibility = showHidden || !tag.isHidden;
      return matchesSearch && matchesCategory && matchesVisibility;
    });

    // Sort tags
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'recent':
          if (!a.lastUsed && !b.lastUsed) return 0;
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
        case 'popular':
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [tags, searchTerm, sortBy, selectedCategory, showHidden]);

  const categories = useMemo(() => {
    const cats = new Set(tags.map(tag => tag.category).filter(Boolean));
    return Array.from(cats);
  }, [tags]);

  const handleTagSelect = (tagId: string) => {
    if (!onSelectedTagsChange) return;
    
    const isSelected = selectedTags.includes(tagId);
    let newSelection: string[];
    
    if (isSelected) {
      newSelection = selectedTags.filter(id => id !== tagId);
    } else {
      if (maxTags && selectedTags.length >= maxTags) {
        return; // Don't add if max tags reached
      }
      newSelection = [...selectedTags, tagId];
    }
    
    onSelectedTagsChange(newSelection);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    const existingTag = tags.find(tag => tag.name.toLowerCase() === newTagName.toLowerCase());
    if (existingTag) {
      handleTagSelect(existingTag.id);
      setNewTagName('');
      return;
    }

    const tag: TagData = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      description: newTag.description,
      color: newTag.color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      category: newTag.category || 'General',
      usageCount: 0,
      lastUsed: new Date(),
      metadata: {}
    };

    onTagsChange([...tags, tag]);
    if (onSelectedTagsChange) {
      onSelectedTagsChange([...selectedTags, tag.id]);
    }
    
    setNewTagName('');
    setNewTag({});
    setIsCreateDialogOpen(false);
  };

  const handleEditTag = () => {
    if (!editingTag) return;
    
    const updatedTags = tags.map(tag =>
      tag.id === editingTag.id ? editingTag : tag
    );
    
    onTagsChange(updatedTags);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      const updatedTags = tags.filter(tag => tag.id !== tagId);
      onTagsChange(updatedTags);
      
      if (onSelectedTagsChange) {
        onSelectedTagsChange(selectedTags.filter(id => id !== tagId));
      }
    }
  };

  const handleToggleFavorite = (tagId: string) => {
    const updatedTags = tags.map(tag =>
      tag.id === tagId ? { ...tag, isFavorite: !tag.isFavorite } : tag
    );
    onTagsChange(updatedTags);
  };

  const handleToggleHidden = (tagId: string) => {
    const updatedTags = tags.map(tag =>
      tag.id === tagId ? { ...tag, isHidden: !tag.isHidden } : tag
    );
    onTagsChange(updatedTags);
  };

  const getTagSize = (tag: TagData) => {
    if (viewMode !== 'cloud') return 'default';
    
    const maxUsage = Math.max(...tags.map(t => t.usageCount));
    const minUsage = Math.min(...tags.map(t => t.usageCount));
    const ratio = maxUsage > minUsage ? (tag.usageCount - minUsage) / (maxUsage - minUsage) : 0.5;
    
    if (ratio > 0.8) return 'large';
    if (ratio > 0.5) return 'medium';
    return 'small';
  };

  const renderTag = (tag: TagData) => {
    const isSelected = selectedTags.includes(tag.id);
    const size = getTagSize(tag);
    
    const sizeClasses = {
      small: 'text-xs px-2 py-1',
      medium: 'text-sm px-3 py-1',
      large: 'text-base px-4 py-2',
      default: 'text-sm px-3 py-1'
    };

    return (
      <motion.div
        key={tag.id}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border cursor-pointer transition-all",
          "hover:shadow-md",
          sizeClasses[size],
          isSelected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background border-border hover:bg-accent",
          tag.isHidden && "opacity-50"
        )}
        style={{
          backgroundColor: isSelected ? tag.color : undefined,
          borderColor: tag.color
        }}
        onClick={() => handleTagSelect(tag.id)}
      >
        <Hash className="h-3 w-3" />
        <span>{tag.name}</span>
        
        {tag.isFavorite && <Star className="h-3 w-3 fill-current" />}
        {tag.isPopular && <TrendingUp className="h-3 w-3" />}
        
        {showUsageStats && (
          <Badge variant="secondary" className="text-xs ml-1">
            {tag.usageCount}
          </Badge>
        )}
        
        {allowEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTag(tag);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(tag.id);
                }}
              >
                <Star className="h-4 w-4 mr-2" />
                {tag.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleHidden(tag.id);
                }}
              >
                {tag.isHidden ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {tag.isHidden ? 'Show' : 'Hide'}
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTag(tag.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          <span className="font-medium">Tags</span>
          {selectedTags.length > 0 && (
            <Badge variant="secondary">
              {selectedTags.length}{maxTags && `/${maxTags}`}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <Select value={viewMode} onValueChange={(value: TagViewMode) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloud">Cloud</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: TagSortOption) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usage">Usage</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Create */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {allowCreation && searchTerm && !tags.some(tag => tag.name.toLowerCase() === searchTerm.toLowerCase()) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewTagName(searchTerm);
              setIsCreateDialogOpen(true);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create tag &quot;{searchTerm}&quot;
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category || 'unknown'} value={category || 'General'}>
                {category || 'General'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show-hidden"
            checked={showHidden}
            onCheckedChange={setShowHidden}
          />
          <Label htmlFor="show-hidden" className="text-sm">
            Show hidden
          </Label>
        </div>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Tags:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <Badge key={tagId} variant="default" className="flex items-center gap-1">
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleTagSelect(tagId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags Display */}
      <GlassCard>
        <div className="p-4">
          {filteredAndSortedTags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tags found</p>
              {allowCreation && (
                <p className="text-sm">Start typing to create a new tag</p>
              )}
            </div>
          ) : (
            <div className={cn(
              "gap-2",
              viewMode === 'cloud' && "flex flex-wrap",
              viewMode === 'list' && "space-y-2",
              viewMode === 'grid' && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}>
              <AnimatePresence>
                {filteredAndSortedTags.map(tag => renderTag(tag))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-description">Description</Label>
              <Input
                id="tag-description"
                value={newTag.description || ''}
                onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tag description (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag-category">Category</Label>
                <Select
                  value={newTag.category || 'General'}
                  onValueChange={(value) => setNewTag(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-color">Color</Label>
                <div className="flex gap-1 flex-wrap">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "h-6 w-6 rounded border-2",
                        newTag.color === color ? "border-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTag(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                Create Tag
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tag-name">Name</Label>
                <Input
                  id="edit-tag-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Tag name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tag-description">Description</Label>
                <Input
                  id="edit-tag-description"
                  value={editingTag.description || ''}
                  onChange={(e) => setEditingTag(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Tag description (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tag-category">Category</Label>
                  <Select
                    value={editingTag.category || 'General'}
                    onValueChange={(value) => setEditingTag(prev => prev ? { ...prev, category: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tag-color">Color</Label>
                  <div className="flex gap-1 flex-wrap">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "h-6 w-6 rounded border-2",
                          editingTag.color === color ? "border-primary" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingTag(prev => prev ? { ...prev, color } : null)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTag(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditTag} disabled={!editingTag.name.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}