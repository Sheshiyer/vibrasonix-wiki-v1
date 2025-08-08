import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    title: 'Sleep Sanctuary',
    description: 'Enhance sleep quality and reduce time to fall asleep',
    href: '/experience-library/sleep-sanctuary',
    icon: '💤',
    protocols: 8,
    duration: '15-45 min',
    difficulty: 'Beginner'
  },
  {
    title: 'Focus Forge',
    description: 'Boost concentration, productivity, and mental clarity',
    href: '/experience-library/focus-forge',
    icon: '🎯',
    protocols: 6,
    duration: '20-60 min',
    difficulty: 'Intermediate'
  },
  {
    title: 'Calm Compass',
    description: 'Lower anxiety and create a sense of calm',
    href: '/experience-library/calm-compass',
    icon: '🧘',
    protocols: 7,
    duration: '10-30 min',
    difficulty: 'Beginner'
  },
  {
    title: 'Meditation Meridian',
    description: 'Enhance meditation practice and mindfulness',
    href: '/experience-library/meditation-meridian',
    icon: '🌟',
    protocols: 9,
    duration: '15-90 min',
    difficulty: 'Advanced'
  }
];

const featuredProtocols = [
  {
    title: 'Delta Wave Sleep Induction',
    category: 'Sleep Sanctuary',
    description: 'Deep sleep protocol using delta wave frequencies',
    duration: '30 min',
    rating: 4.8
  },
  {
    title: 'Theta-Alpha Focus Transition',
    category: 'Focus Forge',
    description: 'Transition from creative ideation to focused execution',
    duration: '45 min',
    rating: 4.6
  },
  {
    title: 'Gamma Wave Meditation',
    category: 'Meditation Meridian',
    description: 'High-frequency meditation for spiritual connection',
    duration: '60 min',
    rating: 4.9
  }
];

export default async function ExperienceLibraryPage() {
  const docs = await getSectionDocs('experience-library');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <h1 className="text-3xl font-bold gradient-text mb-4">🛠️ Experience Library</h1>
          <p className="text-muted-foreground">
            Curated collection of sound therapy protocols designed for specific goals and outcomes. 
            Each protocol combines multiple technologies for optimal results.
          </p>
        </GlassCard>

        {/* Documentation Section */}
        {docs.length > 0 && (
          <div>
            <GlassCard className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Experience Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc, index) => (
                  <div key={doc.slug}>
                    <Link href={`/experience-library/${doc.slug}`}>
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
          {categories.map((category) => (
            <Link key={category.href} href={category.href}>
              <Card className="hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <div>{category.title}</div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{category.protocols} protocols</Badge>
                        <Badge variant="outline">{category.duration}</Badge>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant={category.difficulty === 'Beginner' ? 'default' : category.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {category.difficulty}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Featured Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProtocols.map((protocol) => (
              <Card key={protocol.title} className="hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-lg">{protocol.title}</CardTitle>
                  <CardDescription>{protocol.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{protocol.duration}</Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm">{protocol.rating}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2">{protocol.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}