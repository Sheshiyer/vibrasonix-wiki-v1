import { getDocBySlug, getAllDocs, DocContent } from './docs';
import {
  ExportOptions,
  ExportResult,
  ExportMetadata,
  BulkExportOptions,
  ExportTemplate,
  ExportHistory,
  ExportStats,
  ExportService as IExportService
} from '@/types/export';

class ExportService implements IExportService {
  private exportHistory: ExportHistory[] = [];
  private exportTemplates: ExportTemplate[] = [
    {
      id: 'default-pdf',
      name: 'Default PDF',
      description: 'Standard PDF export with table of contents',
      options: {
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
      isDefault: true
    },
    {
      id: 'default-markdown',
      name: 'Default Markdown',
      description: 'Clean markdown export with metadata',
      options: {
        format: 'markdown',
        includeMetadata: true,
        includeTableOfContents: false,
        includeCoverPage: false,
        theme: 'auto',
        includeImages: true,
        includeCodeBlocks: true
      },
      isDefault: true
    }
  ];

  async exportDocument(slug: string, options: ExportOptions): Promise<ExportResult> {
    try {
      const doc = await getDocBySlug(slug);
      if (!doc) {
        return {
          success: false,
          filename: '',
          error: 'Document not found'
        };
      }

      const filename = this.generateFilename(doc.metadata.title, options.format);
      
      switch (options.format) {
        case 'pdf':
          return await this.exportToPDF(doc, options, filename);
        case 'markdown':
          return await this.exportToMarkdown(doc, options, filename);
        case 'html':
          return await this.exportToHTML(doc, options, filename);
        default:
          return {
            success: false,
            filename,
            error: 'Unsupported export format'
          };
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  async exportBulk(options: BulkExportOptions): Promise<ExportResult> {
    try {
      const allDocs = await getAllDocs();
      const docsToExport: DocContent[] = [];

      // Filter documents based on sections
      if (options.sections && options.sections.length > 0) {
        for (const section of options.sections) {
          if (allDocs[section]) {
            docsToExport.push(...allDocs[section]);
          }
        }
      } else {
        // Export all documents
        Object.values(allDocs).forEach(sectionDocs => {
          docsToExport.push(...sectionDocs);
        });
      }

      if (options.combineIntoSingle) {
        return await this.exportCombined(docsToExport, options);
      } else {
        return await this.exportSeparate(docsToExport, options);
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Bulk export failed'
      };
    }
  }

  private async exportToPDF(doc: DocContent, options: ExportOptions, filename: string): Promise<ExportResult> {
    // For now, we'll create a simple HTML-to-PDF conversion
    // In a real implementation, you'd use libraries like puppeteer, jsPDF, or similar
    
    const htmlContent = await this.convertToHTML(doc, options);
    
    // Simulate PDF generation
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const result: ExportResult = {
      success: true,
      downloadUrl,
      filename: filename.replace('.pdf', '.html'), // Temporary: serving HTML instead of PDF
      size: blob.size
    };

    this.addToHistory(result, options.format);
    return result;
  }

  private async exportToMarkdown(doc: DocContent, options: ExportOptions, filename: string): Promise<ExportResult> {
    let content = '';
    
    // Add metadata header if requested
    if (options.includeMetadata) {
      content += this.generateMarkdownMetadata(doc.metadata);
      content += '\n\n';
    }

    // Add cover page if requested
    if (options.includeCoverPage) {
      content += this.generateMarkdownCoverPage(doc.metadata);
      content += '\n\n';
    }

    // Add table of contents if requested
    if (options.includeTableOfContents) {
      content += this.generateMarkdownTOC(doc);
      content += '\n\n';
    }

    // Add main content
    content += this.extractMarkdownContent(doc, options);

    const blob = new Blob([content], { type: 'text/markdown' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const result: ExportResult = {
      success: true,
      downloadUrl,
      filename,
      size: blob.size
    };

    this.addToHistory(result, options.format);
    return result;
  }

  private async exportToHTML(doc: DocContent, options: ExportOptions, filename: string): Promise<ExportResult> {
    const htmlContent = await this.convertToHTML(doc, options);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const result: ExportResult = {
      success: true,
      downloadUrl,
      filename,
      size: blob.size
    };

    this.addToHistory(result, options.format);
    return result;
  }

  private async convertToHTML(doc: DocContent, options: ExportOptions): Promise<string> {
    const styles = this.generateCSS(options);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.metadata.title}</title>
    <style>${styles}</style>
</head>
<body>
    ${options.includeCoverPage ? this.generateHTMLCoverPage(doc.metadata) : ''}
    ${options.includeTableOfContents ? this.generateHTMLTOC(doc) : ''}
    <main class="content">
        <h1>${doc.metadata.title}</h1>
        ${doc.metadata.description ? `<p class="description">${doc.metadata.description}</p>` : ''}
        <div class="document-content">
            ${this.extractHTMLContent(doc, options)}
        </div>
    </main>
    ${options.watermark ? `<div class="watermark">${options.watermark}</div>` : ''}
</body>
</html>`;
  }

  private generateCSS(options: ExportOptions): string {
    const theme = options.theme === 'dark' ? 'dark' : 'light';
    const fontSize = options.fontSize === 'small' ? '14px' : options.fontSize === 'large' ? '18px' : '16px';
    
    return `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${fontSize};
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
            color: ${theme === 'dark' ? '#e5e5e5' : '#333333'};
        }
        .content {
            max-width: 800px;
            margin: 0 auto;
        }
        h1, h2, h3, h4, h5, h6 {
            color: ${theme === 'dark' ? '#ffffff' : '#000000'};
            margin-top: 2em;
            margin-bottom: 1em;
        }
        h1 { font-size: 2.5em; }
        h2 { font-size: 2em; }
        h3 { font-size: 1.5em; }
        code {
            background: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
        }
        pre {
            background: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.3;
            font-size: 12px;
        }
        .cover-page {
            page-break-after: always;
            text-align: center;
            padding: 100px 0;
        }
        .toc {
            page-break-after: always;
            margin-bottom: 50px;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            margin: 10px 0;
            padding-left: 20px;
        }
        @media print {
            body { margin: 0; }
            .watermark { display: none; }
        }
    `;
  }

  private generateMarkdownMetadata(metadata: any): string {
    return `---
title: "${metadata.title}"
${metadata.description ? `description: "${metadata.description}"\n` : ''}${metadata.author ? `author: "${metadata.author}"\n` : ''}${metadata.date ? `date: "${metadata.date}"\n` : ''}${metadata.tags ? `tags: [${metadata.tags.map((tag: string) => `"${tag}"`).join(', ')}]\n` : ''}---`;
  }

  private generateMarkdownCoverPage(metadata: any): string {
    return `# ${metadata.title}\n\n${metadata.description ? `${metadata.description}\n\n` : ''}${metadata.author ? `**Author:** ${metadata.author}\n\n` : ''}${metadata.date ? `**Date:** ${metadata.date}\n\n` : ''}---`;
  }

  private generateMarkdownTOC(doc: DocContent): string {
    // Extract headings from content and generate TOC
    const content = doc.content.toString();
    const headings = content.match(/#{1,6}\s+.+/g) || [];
    
    let toc = '## Table of Contents\n\n';
    headings.forEach(heading => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const indent = '  '.repeat(level - 1);
      const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc += `${indent}- [${text}](#${anchor})\n`;
    });
    
    return toc;
  }

  private generateHTMLCoverPage(metadata: any): string {
    return `
    <div class="cover-page">
        <h1>${metadata.title}</h1>
        ${metadata.description ? `<p>${metadata.description}</p>` : ''}
        ${metadata.author ? `<p><strong>Author:</strong> ${metadata.author}</p>` : ''}
        ${metadata.date ? `<p><strong>Date:</strong> ${metadata.date}</p>` : ''}
    </div>
    `;
  }

  private generateHTMLTOC(doc: DocContent): string {
    const content = doc.content.toString();
    const headings = content.match(/#{1,6}\s+.+/g) || [];
    
    let toc = '<div class="toc"><h2>Table of Contents</h2><ul>';
    headings.forEach(heading => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc += `<li style="margin-left: ${(level - 1) * 20}px"><a href="#${anchor}">${text}</a></li>`;
    });
    toc += '</ul></div>';
    
    return toc;
  }

  private extractMarkdownContent(doc: DocContent, options: ExportOptions): string {
    // Convert React element to markdown string
    // This is a simplified implementation - in practice you'd need a proper React-to-markdown converter
    return doc.content.toString();
  }

  private extractHTMLContent(doc: DocContent, options: ExportOptions): string {
    // Convert React element to HTML string
    // This is a simplified implementation - in practice you'd use ReactDOMServer.renderToString
    return doc.content.toString();
  }

  private async exportCombined(docs: DocContent[], options: BulkExportOptions): Promise<ExportResult> {
    // Combine all documents into a single export
    const filename = `vibrasonix-wiki-combined.${options.format}`;
    
    // For now, just export the first document as a placeholder
    if (docs.length > 0) {
      return await this.exportDocument(docs[0].slug, options);
    }
    
    return {
      success: false,
      filename,
      error: 'No documents to export'
    };
  }

  private async exportSeparate(docs: DocContent[], options: BulkExportOptions): Promise<ExportResult> {
    // Export each document separately and create a zip
    const filename = `vibrasonix-wiki-bulk.zip`;
    
    // This would create a zip file with all exported documents
    // For now, return a placeholder result
    return {
      success: true,
      filename,
      downloadUrl: '#', // Placeholder
      size: 1024 * 1024 // 1MB placeholder
    };
  }

  private generateFilename(title: string, format: string): string {
    const sanitized = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const timestamp = new Date().toISOString().split('T')[0];
    return `${sanitized}-${timestamp}.${format}`;
  }

  private addToHistory(result: ExportResult, format: ExportOptions['format']): void {
    if (result.success) {
      this.exportHistory.unshift({
        id: Date.now().toString(),
        filename: result.filename,
        format,
        exportedAt: new Date(),
        size: result.size || 0,
        downloadUrl: result.downloadUrl
      });
      
      // Keep only last 50 exports
      this.exportHistory = this.exportHistory.slice(0, 50);
    }
  }

  async getExportHistory(): Promise<ExportHistory[]> {
    return this.exportHistory;
  }

  async getExportStats(): Promise<ExportStats> {
    const totalExports = this.exportHistory.length;
    const exportsByFormat = this.exportHistory.reduce((acc, item) => {
      acc[item.format] = (acc[item.format] || 0) + 1;
      return acc;
    }, {} as Record<ExportOptions['format'], number>);
    
    const averageFileSize = totalExports > 0 
      ? this.exportHistory.reduce((sum, item) => sum + item.size, 0) / totalExports
      : 0;
    
    const lastExportDate = this.exportHistory.length > 0 
      ? this.exportHistory[0].exportedAt
      : undefined;

    return {
      totalExports,
      exportsByFormat,
      popularSections: [], // Would be calculated from actual data
      averageFileSize,
      lastExportDate
    };
  }

  async deleteExport(id: string): Promise<boolean> {
    const index = this.exportHistory.findIndex(item => item.id === id);
    if (index !== -1) {
      this.exportHistory.splice(index, 1);
      return true;
    }
    return false;
  }

  async getExportTemplates(): Promise<ExportTemplate[]> {
    return this.exportTemplates;
  }

  async saveExportTemplate(template: Omit<ExportTemplate, 'id'>): Promise<ExportTemplate> {
    const newTemplate: ExportTemplate = {
      ...template,
      id: Date.now().toString(),
      isCustom: true
    };
    
    this.exportTemplates.push(newTemplate);
    return newTemplate;
  }

  async deleteExportTemplate(id: string): Promise<boolean> {
    const index = this.exportTemplates.findIndex(template => template.id === id);
    if (index !== -1 && this.exportTemplates[index].isCustom) {
      this.exportTemplates.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;