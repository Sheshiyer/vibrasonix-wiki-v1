import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const docsDirectory = path.join(process.cwd(), 'docs');

export interface DocMetadata {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  readTime?: number;
  tags?: string[];
  section: string;
  subsection?: string;
  order?: number;
}

export interface DocContent {
  content: React.ReactElement;
  metadata: DocMetadata;
  slug: string;
}

// Get all markdown files in a directory recursively
export function getDocFiles(dir: string = docsDirectory): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') && !['IMPLEMENTATION.md', 'CHANGELOG.md', 'CODEBASE_INDEX.md'].includes(item)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Convert file path to URL slug
export function filePathToSlug(filePath: string): string {
  const relativePath = path.relative(docsDirectory, filePath);
  return relativePath
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/\\+/g, '/')
    .split('/')
    .filter(Boolean)
    .join('/');
}

// Extract metadata from markdown frontmatter or content
function extractMetadata(content: string, filePath: string): DocMetadata {
  const relativePath = path.relative(docsDirectory, filePath);
  const pathParts = relativePath.split(path.sep);
  
  // Extract title from first h1 in content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/[🧠🔊⚙️📊🌊🎵📳⚡🎶]/g, '').trim() : pathParts[pathParts.length - 1].replace('.md', '');
  
  // Extract description from first paragraph
  const descMatch = content.match(/^(?!#)(.+)$/m);
  const description = descMatch ? descMatch[1].trim() : undefined;
  
  return {
    title,
    description,
    section: pathParts[0] || 'general',
    subsection: pathParts.length > 2 ? pathParts[1] : undefined,
  };
}

// Read and compile a single markdown file
export async function getDocContent(filePath: string): Promise<DocContent> {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const metadata = extractMetadata(fileContent, filePath);
  const slug = filePathToSlug(filePath);
  
  const { content } = await compileMDX({
    source: fileContent,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [remarkGfm],
      },
    },
  });
  
  return {
    content,
    metadata,
    slug,
  };
}

// Get all docs organized by section
export async function getAllDocs(): Promise<Record<string, DocContent[]>> {
  const files = getDocFiles();
  const docs: Record<string, DocContent[]> = {};
  
  for (const file of files) {
    const doc = await getDocContent(file);
    const section = doc.metadata.section;
    
    if (!docs[section]) {
      docs[section] = [];
    }
    
    docs[section].push(doc);
  }
  
  // Sort docs within each section
  Object.keys(docs).forEach(section => {
    docs[section].sort((a, b) => {
      if (a.metadata.order && b.metadata.order) {
        return a.metadata.order - b.metadata.order;
      }
      return a.metadata.title.localeCompare(b.metadata.title);
    });
  });
  
  return docs;
}

// Get docs for a specific section
export async function getSectionDocs(section: string): Promise<DocContent[]> {
  const sectionDir = path.join(docsDirectory, section);
  
  if (!fs.existsSync(sectionDir)) {
    return [];
  }
  
  const files = getDocFiles(sectionDir);
  const docs: DocContent[] = [];
  
  for (const file of files) {
    const doc = await getDocContent(file);
    docs.push(doc);
  }
  
  return docs.sort((a, b) => {
    if (a.metadata.order && b.metadata.order) {
      return a.metadata.order - b.metadata.order;
    }
    return a.metadata.title.localeCompare(b.metadata.title);
  });
}

// Get a specific doc by slug
export async function getDocBySlug(slug: string): Promise<DocContent | null> {
  const files = getDocFiles();
  
  for (const file of files) {
    const docSlug = filePathToSlug(file);
    if (docSlug === slug) {
      return await getDocContent(file);
    }
  }
  
  return null;
}