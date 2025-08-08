export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'html';
  includeMetadata?: boolean;
  includeTableOfContents?: boolean;
  includeCoverPage?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  theme?: 'light' | 'dark' | 'auto';
  fontSize?: 'small' | 'medium' | 'large';
  includeImages?: boolean;
  includeCodeBlocks?: boolean;
  watermark?: string;
}

export interface ExportMetadata {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator: string;
  producer: string;
  creationDate: Date;
  modificationDate: Date;
}

export interface ExportProgress {
  stage: 'preparing' | 'processing' | 'generating' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  error?: string;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  filename: string;
  size?: number;
  error?: string;
}

export interface BulkExportOptions extends ExportOptions {
  sections?: string[];
  includeSubsections?: boolean;
  combineIntoSingle?: boolean;
  zipOutput?: boolean;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  options: ExportOptions;
  isDefault?: boolean;
  isCustom?: boolean;
}

export interface ExportHistory {
  id: string;
  filename: string;
  format: ExportOptions['format'];
  exportedAt: Date;
  size: number;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface ExportStats {
  totalExports: number;
  exportsByFormat: Record<ExportOptions['format'], number>;
  popularSections: Array<{
    section: string;
    count: number;
  }>;
  averageFileSize: number;
  lastExportDate?: Date;
}

// Export service interface
export interface ExportService {
  exportDocument(slug: string, options: ExportOptions): Promise<ExportResult>;
  exportBulk(options: BulkExportOptions): Promise<ExportResult>;
  getExportHistory(): Promise<ExportHistory[]>;
  getExportStats(): Promise<ExportStats>;
  deleteExport(id: string): Promise<boolean>;
  getExportTemplates(): Promise<ExportTemplate[]>;
  saveExportTemplate(template: Omit<ExportTemplate, 'id'>): Promise<ExportTemplate>;
  deleteExportTemplate(id: string): Promise<boolean>;
}