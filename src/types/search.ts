export interface SearchableDoc {
  title: string;
  description: string;
  content: string;
  section: string;
  subsection?: string;
  slug: string;
  tags?: string[];
}

export interface SearchResult {
  item: SearchableDoc;
  score?: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  field: string;
  value: string;
  indices: [number, number][];
}

export interface SearchStats {
  totalDocs: number;
  indexedSections: string[];
  lastUpdated: Date;
}