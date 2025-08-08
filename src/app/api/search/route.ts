import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import { getAllDocs } from '@/lib/docs';

interface SearchableDoc {
  title: string;
  content: string;
  slug: string;
  section: string;
  description?: string;
  tags?: string[];
}

let searchIndex: Fuse<SearchableDoc> | null = null;
let searchableDocs: SearchableDoc[] = [];
let lastIndexUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function buildSearchIndex() {
  const now = Date.now();
  if (searchIndex && (now - lastIndexUpdate) < CACHE_DURATION) {
    return searchIndex;
  }

  try {
    const allDocsRecord = await getAllDocs();
    const allDocs = Object.values(allDocsRecord).flat();
    
    searchableDocs = allDocs
      .filter(doc => typeof doc.content === 'string')
      .map((doc: any) => ({
        title: doc.metadata.title || 'Untitled',
        content: doc.content,
        slug: doc.slug,
        section: doc.slug.split('/')[0] || 'general',
        description: doc.metadata.description,
        tags: doc.metadata.tags || []
      }));
    
    const fuseOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true
    };
    
    searchIndex = new Fuse(searchableDocs, fuseOptions);
    lastIndexUpdate = now;
    
    return searchIndex;
  } catch (error) {
    console.error('Failed to build search index:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const section = searchParams.get('section');
    const suggestions = searchParams.get('suggestions') === 'true';
    const minScore = parseFloat(searchParams.get('minScore') || '0');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    const index = await buildSearchIndex();
    
    if (suggestions) {
      // Return suggestions based on titles
      const results = index.search(query, { limit: limit * 2 });
      const suggestions = results
        .map(result => result.item.title)
        .filter(title => title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit);
      
      return NextResponse.json({ suggestions });
    }
    
    let results = index.search(query, { limit: limit * 2 });
    
    // Filter by section if specified
    if (section) {
      results = results.filter(result => result.item.section === section);
    }
    
    // Filter by minimum score if specified
    if (minScore > 0) {
      results = results.filter(result => (result.score || 1) <= (1 - minScore));
    }
    
    const finalResults = results.slice(0, limit);
    
    return NextResponse.json({
      results: finalResults.map(result => ({
        title: result.item.title,
        slug: result.item.slug,
        section: result.item.section,
        description: result.item.description,
        score: result.score,
        matches: result.matches
      })),
      total: finalResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { queries } = await request.json();
    
    if (!Array.isArray(queries)) {
      return NextResponse.json({ error: 'Queries must be an array' }, { status: 400 });
    }
    
    const index = await buildSearchIndex();
    const results = queries.map(query => ({
      query,
      results: index.search(query, { limit: 10 }).map(result => ({
        title: result.item.title,
        slug: result.item.slug,
        section: result.item.section,
        description: result.item.description,
        score: result.score,
        matches: result.matches
      }))
    }));
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Batch search error:', error);
    return NextResponse.json({ error: 'Batch search failed' }, { status: 500 });
  }
}