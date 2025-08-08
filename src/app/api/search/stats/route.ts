import { NextRequest, NextResponse } from 'next/server';
import { getAllDocs } from '@/lib/docs';

export async function GET(request: NextRequest) {
  try {
    const allDocsRecord = await getAllDocs();
    const allDocs = Object.values(allDocsRecord).flat();
    
    const sections = [...new Set(
      allDocs.map(doc => doc.slug.split('/')[0] || 'general')
    )];
    
    const stats = {
      totalDocs: allDocs.length,
      indexedSections: sections.sort(),
      lastUpdated: new Date()
    };
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Failed to get search stats:', error);
    return NextResponse.json({ error: 'Failed to get search stats' }, { status: 500 });
  }
}