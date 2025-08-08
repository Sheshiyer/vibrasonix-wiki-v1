"use client";

import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  {
    title: '🧠 Sonic Science',
    description: 'Interactive exploration of the science behind sound therapy',
    href: '/sonic-science',
    metrics: ['5 Technologies', '20+ Studies'],
    color: 'from-primary/20 to-secondary/20'
  },
  {
    title: '🛠️ Experience Library',
    description: 'Curated collection of experiences with interactive previews',
    href: '/experience-library',
    metrics: ['4 Categories', '30+ Protocols'],
    color: 'from-secondary/20 to-accent/20'
  },
  {
    title: '🔮 Transformation Journeys',
    description: 'Narrative-driven paths with progress visualization',
    href: '/transformation-journeys',
    metrics: ['4 Journeys', '12+ Milestones'],
    color: 'from-accent/20 to-primary/20'
  },
  {
    title: '🔬 Research Observatory',
    description: 'Living library of evidence with interactive exploration',
    href: '/research-observatory',
    metrics: ['15+ Studies', '5 Data Dashboards'],
    color: 'from-primary/20 to-accent/20'
  },
  {
    title: '💫 Community Cosmos',
    description: 'Interactive social knowledge sharing space',
    href: '/community-cosmos',
    metrics: ['1000+ Members', '500+ Experiences'],
    color: 'from-secondary/20 to-primary/20'
  },
  {
    title: '🧪 Sonic Lab',
    description: 'Experimental zone for personalized exploration',
    href: '/sonic-lab',
    metrics: ['Custom Protocols', 'Personal Experiments'],
    color: 'from-accent/20 to-secondary/20'
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
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <div className="flex gap-2 flex-wrap">
                {section.metrics.map((metric, metricIndex) => (
                  <span key={`${section.title}-metric-${metricIndex}-${metric}`} className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                    {metric}
                  </span>
                ))}
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}