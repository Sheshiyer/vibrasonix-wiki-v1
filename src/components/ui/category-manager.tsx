"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderPlus, 
  Tag, 
  Hash, 
  ChevronRight, 
  ChevronDown,
  Folder,
  FileText,
  Settings,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { CategoryGroup, TagHierarchy } from "@/types/filters";

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  documentCount?: number;
  isExpanded?: boolean;
  metadata?: Record<string, any>;
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  onCategorySelect?: (category: Category) => void;
  selectedCategoryId?: string;
  className?: string;
  showDocumentCounts?: boolean;
  allowNesting?: boolean;
  maxDepth?: number;
}

const CATEGORY_COLORS = [
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
];

const CATEGORY_ICONS = [
  'Folder',
  'FileText',
  'Tag',
  'Hash',
  'Settings',
  'Filter',
];

export function CategoryManager({
  categories,
  onCategoriesChange,
  onCategorySelect,
  selectedCategoryId,
  className,
  showDocumentCounts = true,
  allowNesting = true,
  maxDepth = 3
}: CategoryManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryDepth = (categoryId: string, categories: Category[], depth = 0): number => {
    const category = categories.find(c => c.id === categoryId);
    if (!category?.parentId) return depth;
    return getCategoryDepth(category.parentId, categories, depth + 1);
  };

  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // Create a map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  };

  const handleCreateCategory = () => {
    if (!newCategory.name) return;

    const category: Category = {
      id: `category-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color || CATEGORY_COLORS[0],
      icon: newCategory.icon || 'Folder',
      parentId: newCategory.parentId,
      documentCount: 0,
      metadata: {}
    };

    onCategoriesChange([...categories, category]);
    setNewCategory({});
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editingCategory.name) return;

    const updatedCategories = categories.map(category =>
      category.id === editingCategory.id ? editingCategory : category
    );

    onCategoriesChange(updatedCategories);
    setEditingCategory(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      const updatedCategories = categories.filter(category => {
        // Remove the category and any children
        if (category.id === categoryId) return false;
        if (category.parentId === categoryId) {
          // Move children to root level or delete them
          category.parentId = undefined;
        }
        return true;
      });
      onCategoriesChange(updatedCategories);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Folder': return <Folder className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'Tag': return <Tag className="h-4 w-4" />;
      case 'Hash': return <Hash className="h-4 w-4" />;
      case 'Settings': return <Settings className="h-4 w-4" />;
      case 'Filter': return <Filter className="h-4 w-4" />;
      default: return <Folder className="h-4 w-4" />;
    }
  };

  const renderCategory = (category: Category, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategoryId === category.id;

    return (
      <div key={category.id} className="space-y-1">
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
            "hover:bg-accent",
            isSelected && "bg-accent border border-primary/20",
            depth > 0 && "ml-6"
          )}
          onClick={() => onCategorySelect?.(category)}
        >
          {/* Expand/Collapse Button */}
          {allowNesting && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) {
                  toggleCategoryExpansion(category.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )
              ) : (
                <div className="h-3 w-3" />
              )}
            </Button>
          )}

          {/* Category Icon */}
          <div 
            className="flex items-center justify-center h-6 w-6 rounded text-white text-xs"
            style={{ backgroundColor: category.color }}
          >
            {renderCategoryIcon(category.icon || 'Folder')}
          </div>

          {/* Category Name */}
          <span className="flex-1 text-sm font-medium">{category.name}</span>

          {/* Document Count */}
          {showDocumentCounts && category.documentCount !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {category.documentCount}
            </Badge>
          )}

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCategory(category);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {allowNesting && getCategoryDepth(category.id, categories) < maxDepth && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewCategory({ parentId: category.id });
                    setIsCreateDialogOpen(true);
                  }}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Subcategory
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category.id);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Children */}
        {allowNesting && hasChildren && isExpanded && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {category.children?.map(child => renderCategory(child, depth + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  const categoryTree = allowNesting ? buildCategoryTree(filteredCategories) : filteredCategories;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description || ''}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description"
                />
              </div>
              {allowNesting && (
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select
                    value={newCategory.parentId || ''}
                    onValueChange={(value) => setNewCategory(prev => ({ ...prev, parentId: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No parent (root level)</SelectItem>
                      {categories
                        .filter(c => getCategoryDepth(c.id, categories) < maxDepth - 1)
                        .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "h-8 w-8 rounded border-2",
                          newCategory.color === color ? "border-primary" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={newCategory.icon || 'Folder'}
                    onValueChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {renderCategoryIcon(icon)}
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
                  Create Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories List */}
      <GlassCard>
        <div className="p-4">
          {categoryTree.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No categories found</p>
              <p className="text-sm">Create your first category to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {categoryTree.map(category => renderCategory(category))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Category description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          "h-8 w-8 rounded border-2",
                          editingCategory.color === color ? "border-primary" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditingCategory(prev => prev ? { ...prev, color } : null)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Select
                    value={editingCategory.icon || 'Folder'}
                    onValueChange={(value) => setEditingCategory(prev => prev ? { ...prev, icon: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {renderCategoryIcon(icon)}
                            {icon}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCategory} disabled={!editingCategory.name}>
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