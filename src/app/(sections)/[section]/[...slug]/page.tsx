import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { DocPageClient } from './doc-page-client';
import { AlternativeContentRenderer } from '@/lib/simple-markdown';
import { DocumentExportButton } from '@/components/ui/export-button';

interface DocPageProps {
  params: Promise<{
    section: string;
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { section, slug } = await params;
  const fullSlug = slug.join('/');
  const requestedSlug = `${section}/${fullSlug}`;
  
  try {
    const doc = await getDocBySlug(requestedSlug);
    
    if (!doc) {
      notFound();
    }

    const { content, metadata } = doc;
    
    // Extract headings for table of contents
    const headings = extractHeadings(content.toString());

    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href={`/${section}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          </div>

          {/* Document Header */}
          <GlassCard className="mb-8" gradient="primary">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {metadata.title}
                </h1>
                <DocumentExportButton
                  documentSlug={requestedSlug}
                  documentTitle={metadata.title}
                  variant="dropdown"
                  size="sm"
                />
              </div>
              
              {metadata.description && (
                <p className="text-lg text-muted-foreground">
                  {metadata.description}
                </p>
              )}
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {metadata.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {metadata.author}
                  </div>
                )}
                {metadata.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {metadata.date}
                  </div>
                )}
                {metadata.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {metadata.readTime} min read
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {metadata.tags && metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag: string, index: number) => (
                    <span 
                      key={`${requestedSlug}-tag-${index}-${tag}`}
                      className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Document Content */}
          <GlassCard className="prose prose-invert max-w-none" interactive={true}>
            <AlternativeContentRenderer content={content.toString()} />
          </GlassCard>

          {/* Client-side components */}
          <DocPageClient headings={headings} />
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Error loading document:', error);
    notFound();
  }
}

// Helper function to extract headings from MDX content
function extractHeadings(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  const usedIds = new Set<string>();
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const baseId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure unique IDs by adding a counter if needed
    let id = baseId;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(id);
    
    headings.push({
      id,
      text,
      level,
    });
  }
  
  return headings;
}

// Generate static params for all documentation pages
export async function generateStaticParams() {
  const allDocs = await getAllDocs();
  const params = [];
  
  for (const [section, docs] of Object.entries(allDocs)) {
    for (const doc of docs) {
      const slugParts = doc.slug.split('/');
      params.push({
        section,
        slug: slugParts,
      });
    }
  }
  
  return params;
}