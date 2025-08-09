"use client";

import { FloatingToc } from '@/components/ui/floating-toc';
import { motion } from 'framer-motion';

interface DocPageClientProps {
  headings: {
    id: string;
    text: string;
    level: number;
  }[];
}

export function DocPageClient({ headings }: DocPageClientProps) {
  return (
    <>
      {/* Floating Table of Contents */}
      {headings.length > 0 && (
        <FloatingToc items={headings.map(h => ({ id: h.id, title: h.text, level: h.level }))} />
      )}
    </>
  );
}