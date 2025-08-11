'use server';

import { getDocBySlug, getAllDocs, DocContent, DocMetadata } from '@/lib/docs';
import {
  ExportOptions,
  ExportResult,
  BulkExportOptions
} from '@/types/export';





// Server action for exporting a single document
export async function exportDocument(slug: string, options: ExportOptions): Promise<ExportResult> {
  try {
    const doc = await getDocBySlug(slug);
    if (!doc) {
      throw new Error(`Document with slug "${slug}" not found`);
    }

    const filename = generateFilename(doc.metadata.title, options.format);
    
    switch (options.format) {
      case 'pdf':
        return await exportToPDF(doc, options, filename);
      case 'markdown':
        return await exportToMarkdown(doc, options, filename);
      case 'html':
        return await exportToHTML(doc, options, filename);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Server action for bulk export
export async function exportBulk(options: BulkExportOptions): Promise<ExportResult> {
  try {
    const allDocs = await getAllDocs();
    const docs: DocContent[] = [];
    
    if (options.sections) {
      for (const section of options.sections) {
        if (allDocs[section]) {
          docs.push(...allDocs[section]);
        }
      }
    }

    if (docs.length === 0) {
      throw new Error('No documents found for the specified sections');
    }

    if (options.combineIntoSingle) {
      return await exportCombined(docs, options);
    } else {
      return await exportSeparate(docs, options);
    }
  } catch (error) {
    console.error('Bulk export error:', error);
    throw new Error(`Bulk export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper functions
async function exportToPDF(_doc: DocContent, _options: ExportOptions, filename: string): Promise<ExportResult> {
  // For now, return a mock result since PDF generation requires browser APIs
  // In a real implementation, you'd use a server-side PDF library like Puppeteer
  return {
    success: true,
    filename,
    size: 0,
    downloadUrl: '#'
  };
}

async function exportToMarkdown(doc: DocContent, options: ExportOptions, filename: string): Promise<ExportResult> {
  let content = '';
  
  if (options.includeMetadata) {
    content += generateMarkdownMetadata(doc.metadata);
  }
  
  if (options.includeCoverPage) {
    content += generateMarkdownCoverPage(doc.metadata);
  }
  
  if (options.includeTableOfContents) {
    content += generateMarkdownTOC(doc);
  }
  
  content += extractMarkdownContent(doc, options);
  
  return {
    success: true,
    filename,
    size: content.length,
    downloadUrl: `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`
  };
}

async function exportToHTML(doc: DocContent, options: ExportOptions, filename: string): Promise<ExportResult> {
  const htmlContent = await convertToHTML(doc, options);
  
  return {
    success: true,
    filename,
    size: htmlContent.length,
    downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  };
}

async function convertToHTML(doc: DocContent, options: ExportOptions): Promise<string> {
  const css = generateCSS(options);
  let content = '';
  
  if (options.includeCoverPage) {
    content += generateHTMLCoverPage(doc.metadata);
  }
  
  if (options.includeTableOfContents) {
    content += generateHTMLTOC(doc);
  }
  
  content += extractHTMLContent(doc, options);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${doc.metadata.title}</title>
      <style>${css}</style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
}

function generateCSS(options: ExportOptions): string {
  const theme = options.theme || 'light';
  const fontSize = options.fontSize || 'medium';
  
  return `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
      background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-size: ${fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px'};
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${theme === 'dark' ? '#f9fafb' : '#111827'};
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    pre {
      background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    code {
      background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'Fira Code', monospace;
    }
  `;
}

function generateMarkdownMetadata(metadata: DocMetadata): string {
  return `---
title: ${metadata.title}
author: ${metadata.author || 'Unknown'}
date: ${metadata.date || new Date().toISOString().split('T')[0]}
---

`;
}

function generateMarkdownCoverPage(metadata: DocMetadata): string {
  return `# ${metadata.title}

**Author:** ${metadata.author || 'Unknown'}  
**Date:** ${metadata.date || new Date().toISOString().split('T')[0]}

---

`;
}

function generateMarkdownTOC(_doc: DocContent): string {
  // Simple TOC generation - in a real implementation, you'd parse the content
  return `## Table of Contents

1. [Introduction](#introduction)
2. [Content](#content)

---

`;
}

function generateHTMLCoverPage(metadata: DocMetadata): string {
  return `
    <div class="cover-page">
      <h1>${metadata.title}</h1>
      <p><strong>Author:</strong> ${metadata.author || "Unknown"}</p>
       <p><strong>Date:</strong> ${metadata.date || new Date().toISOString().split("T")[0]}</p>
    </div>
    <hr>
  `;
}

function generateHTMLTOC(_doc: DocContent): string {
  return `
    <div class="table-of-contents">
      <h2>Table of Contents</h2>
      <ol>
        <li><a href="#introduction">Introduction</a></li>
        <li><a href="#content">Content</a></li>
      </ol>
    </div>
    <hr>
  `;
}

function extractMarkdownContent(doc: DocContent, _options: ExportOptions): string {
  // In a real implementation, you'd convert the React element back to markdown
  // For now, return a placeholder
  return `# ${doc.metadata.title}

${doc.metadata.description || 'Content goes here...'}`;
}

function extractHTMLContent(doc: DocContent, _options: ExportOptions): string {
  // In a real implementation, you'd render the React element to HTML
  // For now, return a placeholder
  return `<h1>${doc.metadata.title}</h1><p>${doc.metadata.description || "Content goes here..."}</p>`;
}

async function exportCombined(_docs: DocContent[], _options: BulkExportOptions): Promise<ExportResult> {
  const filename = `combined-export.${_options.format}`;
  
  // Combine all documents into a single export
  // Implementation would depend on the format
  
  return {
    success: true,
    filename,
    size: 0,
    downloadUrl: '#'
  };
}

async function exportSeparate(_docs: DocContent[], _options: BulkExportOptions): Promise<ExportResult> {
  const filename = `bulk-export-${Date.now()}.zip`;
  
  // Create separate files for each document and zip them
  // Implementation would create a zip file
  
  return {
    success: true,
    filename,
    size: 0,
    downloadUrl: '#'
  };
}

function generateFilename(title: string, format: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitized}-${timestamp}.${format}`;
}