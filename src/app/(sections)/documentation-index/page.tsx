import { getAllDocs, DocContent } from '@/lib/docs';
import { DocumentationIndexClient } from './documentation-index-client';

export interface DocItem {
  id: string;
  title: string;
  description: string;
  section: string;
  subsection?: string;
  slug: string;
  tags: string[];
  readTime: number;
  lastUpdated: string;
  author?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'guide' | 'reference' | 'tutorial' | 'research';
}

function transformDocsToItems(allDocs: Record<string, DocContent[]>): DocItem[] {
  const items: DocItem[] = [];
  
  Object.entries(allDocs).forEach(([section, docs]) => {
    docs.forEach((doc: DocContent) => {
      items.push({
        id: `${section}-${doc.slug}`,
        title: doc.metadata.title,
        description: doc.metadata.description || 'No description available',
        section: section,
        subsection: doc.metadata.subsection,
        slug: `${section}/${doc.slug}`,
        tags: doc.metadata.tags || [],
        readTime: doc.metadata.readTime || 5,
        lastUpdated: doc.metadata.date || new Date().toISOString().split('T')[0],
        author: doc.metadata.author,
        difficulty: (doc.metadata.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        type: (doc.metadata.type as 'guide' | 'reference' | 'tutorial' | 'research') || 'guide'
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