import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

const journeys = [
  {
    title: 'Sleep Restoration Odyssey',
    description: 'Transform your sleep from restless to restorative',
    href: '/transformation-journeys/sleep-restoration-odyssey',
    icon: '🌙',
    duration: '30 days',
    milestones: 12,
    difficulty: 'Beginner',
    progress: 0,
    benefits: ['Faster sleep onset', 'Deeper sleep cycles', 'Reduced insomnia']
  },
  {
    title: 'Focus Mastery Expedition',
    description: 'Develop laser-sharp concentration and productivity',
    href: '/transformation-journeys/focus-mastery-expedition',
    icon: '🎯',
    duration: '21 days',
    milestones: 8,
    difficulty: 'Intermediate',
    progress: 0,
    benefits: ['Enhanced concentration', 'Improved productivity', 'Mental clarity']
  },
  {
    title: 'Stress Liberation Path',
    description: 'Break free from stress and anxiety patterns',
    href: '/transformation-journeys/stress-liberation-path',
    icon: '🧘',
    duration: '14 days',
    milestones: 6,
    difficulty: 'Beginner',
    progress: 0,
    benefits: ['Reduced anxiety', 'Emotional balance', 'Inner peace']
  },
  {
    title: 'Meditation Depth Dive',
    description: 'Achieve profound meditation states and spiritual growth',
    href: '/transformation-journeys/meditation-depth-dive',
    icon: '🌟',
    duration: '60 days',
    milestones: 15,
    difficulty: 'Advanced',
    progress: 0,
    benefits: ['Deep meditation', 'Spiritual connection', 'Mindfulness mastery']
  }
];

const successStories = [
  {
    name: 'Sarah M.',
    journey: 'Sleep Restoration',
    testimonial: 'From chronic insomnia to restful sleep in just 2 weeks!',
    improvement: '85%'
  },
  {
    name: 'David K.',
    journey: 'Focus Mastery',
    testimonial: 'My productivity has increased dramatically. I can focus for hours now.',
    improvement: '73%'
  },
  {
    name: 'Emma L.',
    journey: 'Stress Liberation',
    testimonial: 'I feel calmer and more centered than ever before.',
    improvement: '91%'
  }
];

export default async function TransformationJourneysPage() {
  const docs = await getSectionDocs('transformation-journeys');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <h1 className="text-3xl font-bold gradient-text mb-4">🔮 Transformation Journeys</h1>
          <p className="text-muted-foreground">
            Narrative-driven paths with progress visualization. Each journey is designed to guide you 
            through a complete transformation using sound therapy and mindfulness practices.
          </p>
        </GlassCard>

        {/* Documentation Section */}
        {docs.length > 0 && (
          <div>
            <GlassCard className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Journey Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc, index) => (
                  <div key={doc.slug}>
                    <Link href={`/transformation-journeys/${doc.slug}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journeys.map((journey) => (
            <Link key={journey.href} href={journey.href}>
              <Card className="hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{journey.icon}</span>
                    <div>
                      <div>{journey.title}</div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{journey.duration}</Badge>
                        <Badge variant="outline">{journey.milestones} milestones</Badge>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>{journey.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant={journey.difficulty === 'Beginner' ? 'default' : journey.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                      {journey.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{journey.progress}% complete</span>
                  </div>
                  <Progress value={journey.progress} className="w-full" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Benefits:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {journey.benefits.map((benefit, index) => (
                        <li key={`${journey.title}-benefit-${index}-${benefit}`}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <Card key={story.name} className="hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-lg">{story.name}</CardTitle>
                  <CardDescription>{story.journey} Journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 italic">&ldquo;{story.testimonial}&rdquo;</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="default">{story.improvement} improvement</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}