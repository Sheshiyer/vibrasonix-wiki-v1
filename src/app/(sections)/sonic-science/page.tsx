import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

const technologies = [
  {
    title: 'Binaural Beats',
    description: 'Audio frequency entrainment technology',
    href: '/sonic-science/technology-nexus/binaural-beats',
    icon: '🎵'
  },
  {
    title: 'Cymatics',
    description: 'Visual sound patterns and their effects',
    href: '/sonic-science/technology-nexus/cymatics',
    icon: '🌊'
  },
  {
    title: 'Haptic Feedback',
    description: 'Tactile vibration technology',
    href: '/sonic-science/technology-nexus/haptic-feedback',
    icon: '📳'
  },
  {
    title: 'PEMF Technology',
    description: 'Pulsed Electromagnetic Field technology',
    href: '/sonic-science/technology-nexus/pemf-technology',
    icon: '⚡'
  },
  {
    title: 'Vibroacoustic Therapy',
    description: 'Combined vibration and acoustic therapy',
    href: '/sonic-science/technology-nexus/vibroacoustic-therapy',
    icon: '🎶'
  }
];

const researchAreas = [
  {
    title: 'Frequency Fundamentals',
    description: 'Core frequency concepts and principles',
    href: '/sonic-science/frequency-fundamentals',
    studies: '15+ Studies'
  },
  {
    title: 'Neuroscience Navigator',
    description: 'Brain science and neural mechanisms',
    href: '/sonic-science/neuroscience-navigator',
    studies: '20+ Studies'
  },
  {
    title: 'Research Radar',
    description: 'Research tracking and methodology',
    href: '/sonic-science/research-radar',
    studies: '25+ Studies'
  }
];

export default async function SonicSciencePage() {
  const docs = await getSectionDocs('sonic-science');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <GlassCard gradient="primary">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🧠 Sonic Science Hub
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore the scientific foundations of sound therapy, frequency research, and neuroscience applications.
            </p>
          </GlassCard>
        </div>

        {/* Documentation Section */}
        {docs.length > 0 && (
          <div>
            <GlassCard className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Documentation & Research
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                  <div key={doc.slug}>
                    <Link href={`/sonic-science/${doc.slug}`}>
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
          <div>
            <GlassCard interactive={true} gradient="secondary">
              <h2 className="text-2xl font-semibold mb-4">🛠️ Technology Nexus</h2>
              <div className="space-y-4">
                {technologies.map((tech) => (
                  <div key={tech.href}>
                    <Link href={tech.href}>
                      <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <span className="text-2xl">{tech.icon}</span>
                            {tech.title}
                          </CardTitle>
                          <CardDescription>{tech.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <span className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                            Explore Technology <ExternalLink className="w-3 h-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard interactive={true} gradient="primary">
              <h2 className="text-2xl font-semibold mb-4">🔬 Research Areas</h2>
              <div className="space-y-4">
                {researchAreas.map((area) => (
                  <div key={area.href}>
                    <Link href={area.href}>
                      <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg">{area.title}</CardTitle>
                          <CardDescription>{area.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Studies: {area.studies}
                            </p>
                            <span className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                              View Research <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}