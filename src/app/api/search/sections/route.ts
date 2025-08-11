import { NextRequest, NextResponse } from 'next/server';
import { getAllDocs } from '@/lib/docs';

export async function GET(_request: Request) {
  try {
    const allDocsRecord = await getAllDocs();
    const allDocs = Object.values(allDocsRecord).flat();
    
    const sections = [...new Set(
      allDocs.map(doc => doc.slug.split('/')[0] || 'general')
    )].sort();
    
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Failed to get sections:', error);
    return NextResponse.json({ error: 'Failed to get sections' }, { status: 500 });
  }
}