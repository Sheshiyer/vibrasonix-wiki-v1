"use client";

import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  {
    title: '🧠 Sonic Science',
    description: 'Interactive exploration of the science behind sound therapy',
    href: '/sonic-science'
  },
  {
    title: '🛠️ Experience Library',
    description: 'Curated collection of experiences with interactive previews',
    href: '/experience-library'
  },
  {
    title: '🔮 Transformation Journeys',
    description: 'Narrative-driven paths with progress visualization',
    href: '/transformation-journeys'
  },
  {
    title: '🔬 Research Observatory',
    description: 'Living library of evidence with interactive exploration',
    href: '/research-observatory'
  },
  {
    title: '💫 Community Cosmos',
    description: 'Interactive social knowledge sharing space',
    href: '/community-cosmos'
  },
  {
    title: '🧪 Sonic Lab',
    description: 'Experimental zone for personalized exploration',
    href: '/sonic-lab'
  }
];

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section, index) => (
        <motion.div
          key={`section-${index}-${section.title}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={section.href}>
            <GlassCard 
              className="h-full" 
              interactive={true}
              gradient={index % 2 === 0 ? 'primary' : 'secondary'}
            >
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}