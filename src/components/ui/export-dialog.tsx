"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  File,
  Globe,
  Settings,
  Layout,
  History,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ExportOptions,
  ExportResult,
  ExportProgress,
  ExportTemplate,
  ExportHistory,
  BulkExportOptions
} from "@/types/export";
import { exportService } from "@/lib/export-service";
// Note: Toast notifications would need to be implemented with available toast library

interface ExportDialogProps {
  documentSlug?: string;
  documentTitle?: string;
  trigger?: React.ReactNode;
  mode?: 'single' | 'bulk';
  availableSections?: string[];
}

const FORMAT_ICONS = {
  pdf: FileText,
  markdown: File,
  html: Globe
};

const FORMAT_DESCRIPTIONS = {
  pdf: 'Formatted document with styling and layout',
  markdown: 'Plain text with markdown formatting',
  html: 'Web page with embedded styles'
};

export function ExportDialog({
  documentSlug,
  documentTitle,
  trigger,
  mode = 'single',
  availableSections = []
}: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('export');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  // Export options state
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeMetadata: true,
    includeTableOfContents: true,
    includeCoverPage: true,
    pageSize: 'A4',
    orientation: 'portrait',
    theme: 'light',
    fontSize: 'medium',
    includeImages: true,
    includeCodeBlocks: true
  });

  // Bulk export options
  const [bulkOptions, setBulkOptions] = useState<BulkExportOptions>({
    ...options,
    sections: [],
    includeSubsections: true,
    combineIntoSingle: false,
    zipOutput: true
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      loadHistory();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const templates = await exportService.getExportTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await exportService.getExportHistory();
      setExportHistory(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleExport = async () => {
    if (!documentSlug && mode === 'single') {
      console.error('No document selected for export');
      return;
    }

    setIsExporting(true);
    setExportProgress({
      stage: 'preparing',
      progress: 0,
      message: 'Preparing export...'
    });

    try {
      let result: ExportResult;
      
      if (mode === 'bulk') {
        setExportProgress({
          stage: 'processing',
          progress: 25,
          message: 'Processing documents...'
        });
        result = await exportService.exportBulk(bulkOptions);
      } else {
        setExportProgress({
          stage: 'processing',
          progress: 25,
          message: 'Processing document...'
        });
        result = await exportService.exportDocument(documentSlug!, options);
      }

      setExportProgress({
        stage: 'generating',
        progress: 75,
        message: 'Generating file...'
      });

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setExportProgress({
        stage: 'complete',
        progress: 100,
        message: 'Export complete!'
      });

      setExportResult(result);
      
      if (result.success) {
        console.log('Export completed successfully!');
        loadHistory(); // Refresh history
      } else {
        console.error(result.error || 'Export failed');
      }
    } catch (error) {
      setExportProgress({
        stage: 'error',
        progress: 0,
        message: 'Export failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setOptions(template.options);
      if (mode === 'bulk') {
        setBulkOptions({ ...bulkOptions, ...template.options });
      }
      setSelectedTemplate(templateId);
    }
  };

  const handleSaveTemplate = async () => {
    if (!customTemplateName.trim()) {
      console.error('Please enter a template name');
      return;
    }

    try {
      const template = await exportService.saveExportTemplate({
        name: customTemplateName,
        description: `Custom template for ${options.format} export`,
        options: mode === 'bulk' ? bulkOptions : options
      });
      
      setTemplates([...templates, template]);
      setCustomTemplateName('');
      setShowSaveTemplate(false);
      console.log('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await exportService.deleteExportTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      console.log('Template deleted');
    } catch (error) {
      console.error('Failed to delete template');
    }
  };

  const resetExport = () => {
    setExportProgress(null);
    setExportResult(null);
    setIsExporting(false);
  };

  const currentOptions = mode === 'bulk' ? bulkOptions : options;
  const setCurrentOptions = mode === 'bulk' ? setBulkOptions : setOptions;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export {mode === 'bulk' ? 'Documents' : 'Document'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'bulk' 
              ? 'Export multiple documents with customizable options'
              : `Export "${documentTitle}" in your preferred format`
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            {/* Export Progress */}
            <AnimatePresence>
              {(isExporting || exportProgress) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {exportProgress?.message || 'Processing...'}
                      </span>
                      {exportProgress?.stage === 'complete' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {exportProgress?.stage === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {isExporting && exportProgress?.stage !== 'complete' && exportProgress?.stage !== 'error' && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      )}
                    </div>
                    <Progress value={exportProgress?.progress || 0} className="w-full" />
                    {exportProgress?.error && (
                      <p className="text-sm text-red-500 mt-2">{exportProgress.error}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export Result */}
            <AnimatePresence>
              {exportResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className={cn(
                    "p-4 border rounded-lg",
                    exportResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exportResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {exportResult.success ? 'Export Successful' : 'Export Failed'}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetExport}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {exportResult.success ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          File: {exportResult.filename}
                          {exportResult.size && ` (${(exportResult.size / 1024).toFixed(1)} KB)`}
                        </p>
                        {exportResult.downloadUrl && (
                          <Button asChild size="sm">
                            <a href={exportResult.downloadUrl} download={exportResult.filename}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-600 mt-2">{exportResult.error}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Template Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Export Template</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveTemplate(!showSaveTemplate)}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template or configure manually" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        {template.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showSaveTemplate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Template name"
                    value={customTemplateName}
                    onChange={(e) => setCustomTemplateName(e.target.value)}
                  />
                  <Button onClick={handleSaveTemplate} size="sm">
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSaveTemplate(false)}
                  >
                    Cancel
                  </Button>
                </motion.div>
              )}
            </div>

            <Separator />

            {/* Format Selection */}
            <div className="space-y-4">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(FORMAT_ICONS).map(([format, Icon]) => (
                  <div
                    key={format}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      currentOptions.format === format
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setCurrentOptions({ ...currentOptions, format: format as any })}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Icon className="w-8 h-8" />
                      <span className="font-medium capitalize">{format}</span>
                      <span className="text-xs text-muted-foreground">
                        {FORMAT_DESCRIPTIONS[format as keyof typeof FORMAT_DESCRIPTIONS]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk Export Options */}
            {mode === 'bulk' && (
              <div className="space-y-4">
                <Label>Bulk Export Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Sections to Export</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableSections.map((section) => (
                        <div key={section} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={section}
                            checked={bulkOptions.sections?.includes(section)}
                            onChange={(e) => {
                              const sections = bulkOptions.sections || [];
                              if (e.target.checked) {
                                setBulkOptions({
                                  ...bulkOptions,
                                  sections: [...sections, section]
                                });
                              } else {
                                setBulkOptions({
                                  ...bulkOptions,
                                  sections: sections.filter(s => s !== section)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={section} className="text-sm capitalize">
                            {section.replace('-', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="combine-single"
                        checked={bulkOptions.combineIntoSingle}
                        onCheckedChange={(checked) =>
                          setBulkOptions({ ...bulkOptions, combineIntoSingle: checked })
                        }
                      />
                      <Label htmlFor="combine-single" className="text-sm">
                        Combine into single file
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="zip-output"
                        checked={bulkOptions.zipOutput}
                        onCheckedChange={(checked) =>
                          setBulkOptions({ ...bulkOptions, zipOutput: checked })
                        }
                      />
                      <Label htmlFor="zip-output" className="text-sm">
                        Create ZIP archive
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="space-y-4">
              <Label>Export Options</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-metadata"
                      checked={currentOptions.includeMetadata}
                      onCheckedChange={(checked) =>
                        setCurrentOptions({ ...currentOptions, includeMetadata: checked })
                      }
                    />
                    <Label htmlFor="include-metadata" className="text-sm">
                      Include metadata
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-toc"
                      checked={currentOptions.includeTableOfContents}
                      onCheckedChange={(checked) =>
                        setCurrentOptions({ ...currentOptions, includeTableOfContents: checked })
                      }
                    />
                    <Label htmlFor="include-toc" className="text-sm">
                      Include table of contents
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-cover"
                      checked={currentOptions.includeCoverPage}
                      onCheckedChange={(checked) =>
                        setCurrentOptions({ ...currentOptions, includeCoverPage: checked })
                      }
                    />
                    <Label htmlFor="include-cover" className="text-sm">
                      Include cover page
                    </Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-images"
                      checked={currentOptions.includeImages}
                      onCheckedChange={(checked) =>
                        setCurrentOptions({ ...currentOptions, includeImages: checked })
                      }
                    />
                    <Label htmlFor="include-images" className="text-sm">
                      Include images
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-code"
                      checked={currentOptions.includeCodeBlocks}
                      onCheckedChange={(checked) =>
                        setCurrentOptions({ ...currentOptions, includeCodeBlocks: checked })
                      }
                    />
                    <Label htmlFor="include-code" className="text-sm">
                      Include code blocks
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF-specific options */}
            {currentOptions.format === 'pdf' && (
              <div className="space-y-4">
                <Label>PDF Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Page Size</Label>
                    <Select
                      value={currentOptions.pageSize}
                      onValueChange={(value) =>
                        setCurrentOptions({ ...currentOptions, pageSize: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Orientation</Label>
                    <Select
                      value={currentOptions.orientation}
                      onValueChange={(value) =>
                        setCurrentOptions({ ...currentOptions, orientation: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Theme and Font Options */}
            <div className="space-y-4">
              <Label>Appearance</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Theme</Label>
                  <Select
                    value={currentOptions.theme}
                    onValueChange={(value) =>
                      setCurrentOptions({ ...currentOptions, theme: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Font Size</Label>
                  <Select
                    value={currentOptions.fontSize}
                    onValueChange={(value) =>
                      setCurrentOptions({ ...currentOptions, fontSize: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="space-y-2">
              <Label htmlFor="watermark">Watermark (optional)</Label>
              <Input
                id="watermark"
                placeholder="Enter watermark text"
                value={currentOptions.watermark || ''}
                onChange={(e) =>
                  setCurrentOptions({ ...currentOptions, watermark: e.target.value })
                }
              />
            </div>

            {/* Export Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || (mode === 'bulk' && (!bulkOptions.sections || bulkOptions.sections.length === 0))}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export {mode === 'bulk' ? 'Documents' : 'Document'}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Export Templates</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveTemplate(true)}
                >
                  <Layout className="w-4 h-4 mr-2" />
                  New Template
                </Button>
              </div>
              
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Format: {template.options.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>Theme: {template.options.theme}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Use Template
                        </Button>
                        {template.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Export History</h3>
              
              <div className="space-y-2">
                {exportHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No exports yet. Start by exporting a document!
                  </p>
                ) : (
                  exportHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{item.filename}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.format.toUpperCase()}</span>
                          <span>•</span>
                          <span>{(item.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{item.exportedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      {item.downloadUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.downloadUrl} download={item.filename}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}