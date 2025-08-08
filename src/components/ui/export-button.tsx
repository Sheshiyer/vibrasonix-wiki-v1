"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Download, FileText, File, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { exportService } from "@/lib/export-service";
import { ExportOptions } from "@/types/export";

interface ExportButtonProps {
  documentSlug?: string;
  documentTitle?: string;
  mode?: 'single' | 'bulk';
  availableSections?: string[];
  variant?: 'button' | 'dropdown' | 'icon';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const FORMAT_ICONS = {
  pdf: FileText,
  markdown: File,
  html: Globe
};

const QUICK_EXPORT_OPTIONS: Record<string, ExportOptions> = {
  pdf: {
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
  },
  markdown: {
    format: 'markdown',
    includeMetadata: true,
    includeTableOfContents: false,
    includeCoverPage: false,
    theme: 'light',
    fontSize: 'medium',
    includeImages: true,
    includeCodeBlocks: true
  },
  html: {
    format: 'html',
    includeMetadata: true,
    includeTableOfContents: true,
    includeCoverPage: false,
    theme: 'light',
    fontSize: 'medium',
    includeImages: true,
    includeCodeBlocks: true
  }
};

export function ExportButton({
  documentSlug,
  documentTitle,
  mode = 'single',
  availableSections = [],
  variant = 'button',
  size = 'default',
  className
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async (format: keyof typeof QUICK_EXPORT_OPTIONS) => {
    if (!documentSlug && mode === 'single') {
      console.error('No document selected for export');
      return;
    }

    setIsExporting(true);
    try {
      const options = QUICK_EXPORT_OPTIONS[format];
      const result = await exportService.exportDocument(documentSlug!, options);
      
      if (result.success) {
        console.log(`${format.toUpperCase()} export completed successfully!`);
        // Trigger download if URL is available
        if (result.downloadUrl) {
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = result.filename || `document.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        console.error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (variant === 'icon') {
    return (
      <ExportDialog
        documentSlug={documentSlug}
        documentTitle={documentTitle}
        mode={mode}
        availableSections={availableSections}
        trigger={
          <Button variant="ghost" size={size} className={className}>
            <Download className="w-4 h-4" />
          </Button>
        }
      />
    );
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={size} className={className} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Export
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Quick Export
          </div>
          {Object.entries(FORMAT_ICONS).map(([format, Icon]) => (
            <DropdownMenuItem
              key={format}
              onClick={() => handleQuickExport(format as keyof typeof QUICK_EXPORT_OPTIONS)}
              disabled={isExporting}
            >
              <Icon className="w-4 h-4 mr-2" />
              Export as {format.toUpperCase()}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <ExportDialog
            documentSlug={documentSlug}
            documentTitle={documentTitle}
            mode={mode}
            availableSections={availableSections}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Download className="w-4 h-4 mr-2" />
                Advanced Export...
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default button variant
  return (
    <ExportDialog
      documentSlug={documentSlug}
      documentTitle={documentTitle}
      mode={mode}
      availableSections={availableSections}
      trigger={
        <Button variant="outline" size={size} className={className}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      }
    />
  );
}

// Convenience components for specific use cases
export function DocumentExportButton({
  documentSlug,
  documentTitle,
  ...props
}: Omit<ExportButtonProps, 'mode'>) {
  return (
    <ExportButton
      {...props}
      documentSlug={documentSlug}
      documentTitle={documentTitle}
      mode="single"
    />
  );
}

export function BulkExportButton({
  availableSections,
  ...props
}: Omit<ExportButtonProps, 'mode' | 'documentSlug' | 'documentTitle'>) {
  return (
    <ExportButton
      {...props}
      availableSections={availableSections}
      mode="bulk"
    />
  );
}

export function QuickExportButtons({
  documentSlug,
  documentTitle,
  className
}: {
  documentSlug: string;
  documentTitle?: string;
  className?: string;
}) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleQuickExport = async (format: keyof typeof QUICK_EXPORT_OPTIONS) => {
    setIsExporting(format);
    try {
      const options = QUICK_EXPORT_OPTIONS[format];
      const result = await exportService.exportDocument(documentSlug, options);
      
      if (result.success) {
        console.log(`${format.toUpperCase()} export completed successfully!`);
        if (result.downloadUrl) {
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = result.filename || `document.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        console.error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Object.entries(FORMAT_ICONS).map(([format, Icon]) => (
        <Button
          key={format}
          variant="outline"
          size="sm"
          onClick={() => handleQuickExport(format as keyof typeof QUICK_EXPORT_OPTIONS)}
          disabled={isExporting !== null}
          className="flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {format.toUpperCase()}
          {isExporting === format && (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
        </Button>
      ))}
    </div>
  );
}