import { getAllDocs, DocContent } from '@/lib/docs';
import { DocumentationIndexClient } from './documentation-index-client';

export interface DocItem {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  section: string;
  subsection?: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'guide' | 'tutorial' | 'reference' | 'research';
}

function transformDocsToItems(allDocs: Record<string, DocContent[]>): DocItem[] {
  const items: DocItem[] = [];
  
  Object.entries(allDocs).forEach(([section, docs]) => {
    docs.forEach((doc: DocContent) => {
      items.push({
        id: doc.slug,
        title: doc.metadata.title,
        description: doc.metadata.description || 'No description available',
        section: section,
        subsection: doc.metadata.subsection,
        slug: doc.slug,
        tags: doc.metadata.tags || [],
        readTime: (doc.metadata.readTime || 5).toString() + ' min',
        date: doc.metadata.date || new Date().toISOString().split('T')[0],
        author: doc.metadata.author || 'Unknown',
        difficulty: 'Beginner' as const,
        type: 'guide' as const
      });
    });
  });
  
  return items;
}

export default async function DocumentationIndexPage() {
  const allDocs = await getAllDocs();
  const docItems = transformDocsToItems(allDocs);

  return (
    <DocumentationIndexClient docs={docItems} />
  );
}