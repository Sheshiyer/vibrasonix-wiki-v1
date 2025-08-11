import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MarkdownIt from 'markdown-it';
import { DocContent } from './docs';

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'html';
  includeImages?: boolean;
  includeStyles?: boolean;
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  blob?: Blob;
  error?: string;
}

// Initialize markdown parser
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Export single document to PDF
export async function exportDocToPDF(
  doc: DocContent,
  options: ExportOptions = { format: 'pdf' }
): Promise<ExportResult> {
  try {
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.pageSize || 'a4',
    });

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.6';
    container.style.color = '#000';
    container.style.backgroundColor = '#fff';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';

    // Add document content
    const title = document.createElement('h1');
    title.textContent = doc.metadata.title;
    title.style.fontSize = '24px';
    title.style.marginBottom = '20px';
    title.style.borderBottom = '2px solid #333';
    title.style.paddingBottom = '10px';
    container.appendChild(title);

    // Add metadata
    if (doc.metadata.description) {
      const description = document.createElement('p');
      description.textContent = doc.metadata.description;
      description.style.fontSize = '14px';
      description.style.fontStyle = 'italic';
      description.style.marginBottom = '20px';
      container.appendChild(description);
    }

    // Add document content (convert markdown to HTML)
    const contentDiv = document.createElement('div');
    const sanitizedContent = sanitizeMarkdown(doc.content);
    contentDiv.innerHTML = md.render(sanitizedContent);
    container.appendChild(contentDiv);

    document.body.appendChild(container);

    // Convert to canvas and then to PDF
    const canvas = await html2canvas(container, {
      scale: options.quality || 2,
      useCORS: true,
      allowTaint: true,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `${doc.metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    const blob = pdf.output('blob');

    return {
      success: true,
      filename,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export document to markdown
export async function exportDocToMarkdown(
  doc: DocContent,
  options: ExportOptions = { format: 'markdown' }
): Promise<ExportResult> {
  try {
    let markdown = '';

    // Add title
    markdown += `# ${doc.metadata.title}\n\n`;

    // Add metadata
    if (doc.metadata.description) {
      markdown += `${doc.metadata.description}\n\n`;
    }

    if (doc.metadata.author) {
      markdown += `**Author:** ${doc.metadata.author}\n\n`;
    }

    if (doc.metadata.date) {
      markdown += `**Date:** ${doc.metadata.date}\n\n`;
    }

    if (doc.metadata.tags && doc.metadata.tags.length > 0) {
      markdown += `**Tags:** ${doc.metadata.tags.join(', ')}\n\n`;
    }

    markdown += '---\n\n';

    // Add the markdown content directly
    markdown += doc.content;

    const filename = `${doc.metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    const blob = new Blob([markdown], { type: 'text/markdown' });

    return {
      success: true,
      filename,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export multiple documents
export async function exportMultipleDocs(
  docs: DocContent[],
  options: ExportOptions
): Promise<ExportResult> {
  try {
    if (options.format === 'pdf') {
      return await exportMultipleDocsToPDF(docs, options);
    } else if (options.format === 'markdown') {
      return await exportMultipleDocsToMarkdown(docs, options);
    }
    
    throw new Error('Unsupported format for multiple document export');
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Export multiple documents to PDF
async function exportMultipleDocsToPDF(
  docs: DocContent[],
  options: ExportOptions
): Promise<ExportResult> {
  const pdf = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: options.pageSize || 'a4',
  });

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    
    if (i > 0) {
      pdf.addPage();
    }

    // Add document title
    pdf.setFontSize(20);
    pdf.text(doc.metadata.title, 20, 30);
    
    // Add description if available
    if (doc.metadata.description) {
      pdf.setFontSize(12);
      pdf.text(doc.metadata.description, 20, 45);
    }

    // Add content (simplified for multiple docs)
    const sanitizedContent = sanitizeMarkdown(doc.content);
    const htmlContent = md.render(sanitizedContent);
    const textContent = htmlToText(htmlContent);
    
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(textContent, 170);
    pdf.text(lines, 20, 60);
  }

  const filename = `vibrasonix_docs_${new Date().toISOString().split('T')[0]}.pdf`;
  const blob = pdf.output('blob');

  return {
    success: true,
    filename,
    blob,
  };
}

// Export multiple documents to markdown
async function exportMultipleDocsToMarkdown(
  docs: DocContent[],
  options: ExportOptions
): Promise<ExportResult> {
  let markdown = '# Vibrasonix Documentation Export\n\n';
  markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  markdown += '---\n\n';

  for (const doc of docs) {
    markdown += `## ${doc.metadata.title}\n\n`;
    
    if (doc.metadata.description) {
      markdown += `${doc.metadata.description}\n\n`;
    }

    // Add the markdown content directly
    markdown += doc.content;
    markdown += '\n\n---\n\n';
  }

  const filename = `vibrasonix_docs_${new Date().toISOString().split('T')[0]}.md`;
  const blob = new Blob([markdown], { type: 'text/markdown' });

  return {
    success: true,
    filename,
    blob,
  };
}

// Helper function to sanitize markdown content for HTML rendering
function sanitizeMarkdown(content: string): string {
  // Basic sanitization - remove any potentially harmful content
  return content.replace(/<script[^>]*>.*?<\/script>/gi, '')
               .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
               .replace(/javascript:/gi, '');
}

// Helper function to convert HTML to markdown
function htmlToMarkdown(html: string): string {
  // Basic HTML to markdown conversion
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<a[^>]*href=&quot;([^&quot;]*)&quot;[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src=&quot;([^&quot;]*)&quot;[^>]*alt=&quot;([^&quot;]*)"/gi, '![$2]($1)')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up multiple newlines
    .trim();
}

// Helper function to convert HTML to plain text
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Download blob as file
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}