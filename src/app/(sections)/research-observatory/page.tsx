import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

const researchCategories = [
  {
    title: 'Data Dashboards',
    description: 'Interactive data visualizations and analytics',
    href: '/research-observatory/data-dashboards',
    icon: '📊',
    studies: 15
  },
  {
    title: 'Evidence Explorer',
    description: 'Research evidence database and search tools',
    href: '/research-observatory/evidence-explorer',
    icon: '🔍',
    studies: 25
  },
  {
    title: 'Frontier Findings',
    description: 'Latest research discoveries and breakthroughs',
    href: '/research-observatory/frontier-findings',
    icon: '🚀',
    studies: 8
  },
  {
    title: 'Science Simplified',
    description: 'Research findings explained in accessible language',
    href: '/research-observatory/science-simplified',
    icon: '📚',
    studies: 20
  }
];

const recentStudies = [
  {
    title: 'Long-term Effects of Binaural Beats on Sleep Architecture',
    authors: 'Dr. Sarah Chen et al.',
    journal: 'Sleep Research Quarterly',
    year: 2024,
    impact: 'High',
    findings: 'Sustained improvements in deep sleep phases after 30 days of regular use'
  },
  {
    title: 'PEMF Technology and Cognitive Enhancement',
    authors: 'Prof. Michael Rodriguez',
    journal: 'Neuroscience Today',
    year: 2024,
    impact: 'Medium',
    findings: 'Significant improvement in memory retention and processing speed'
  },
  {
    title: 'Vibroacoustic Therapy for Stress Reduction',
    authors: 'Dr. Emily Watson',
    journal: 'Mind-Body Medicine',
    year: 2024,
    impact: 'High',
    findings: '62% reduction in cortisol levels compared to control group'
  }
];

const metrics = [
  { label: 'Total Studies', value: '68', change: '+12%', period: 'This year' },
  { label: 'Peer Reviewed', value: '45', change: '+8%', period: 'This year' },
  { label: 'Clinical Trials', value: '23', change: '+15%', period: 'This year' },
  { label: 'Meta Analyses', value: '7', change: '+3', period: 'This year' }
];

export default async function ResearchObservatoryPage() {
  const docs = await getSectionDocs('research-observatory');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <h1 className="text-3xl font-bold gradient-text mb-4">🔬 Research Observatory</h1>
          <p className="text-muted-foreground">
            Living library of evidence with interactive exploration. Access the latest research, 
            data visualizations, and scientific insights into sound therapy and frequency medicine.
          </p>
        </GlassCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-green-500 mt-1">{metric.change} {metric.period}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documentation Section */}
        {docs.length > 0 && (
          <div>
            <GlassCard className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Research Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc, index) => (
                  <div key={doc.slug}>
                    <Link href={`/research-observatory/${doc.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/5 border-white/20 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4" />
                            {doc.metadata.title}
                          </CardTitle>
                          {doc.metadata.description && (
                            <CardDescription className="text-xs">
                              {doc.metadata.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {doc.metadata.readTime ? `${doc.metadata.readTime} min read` : 'Quick read'}
                            </span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Research Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Studies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchCategories.map((category) => (
                <Link key={category.href} href={category.href}>
                  <Card className="hover:scale-105 transition-transform cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <div>{category.title}</div>
                          <Badge variant="secondary" className="mt-1">{category.studies} studies</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-4">
              {recentStudies.map((study) => (
                <Card key={study.title} className="hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <CardDescription>
                      {study.authors} • {study.journal} • {study.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant={study.impact === 'High' ? 'default' : 'secondary'}>
                        {study.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{study.findings}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">Research Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Sleep Enhancement</h3>
              <p className="text-muted-foreground">43% faster sleep onset compared to single-modality solutions</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Focus Improvement</h3>
              <p className="text-muted-foreground">47% longer sustained attention compared to audio-only solutions</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Stress Reduction</h3>
              <p className="text-muted-foreground">62% faster stress response reduction than single-modality approaches</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}