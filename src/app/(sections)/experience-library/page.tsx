import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock data removed - content will be driven by documentation

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
                {docs.map((doc) => (
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

        {/* Content will be driven by documentation files */}
      </div>
    </DashboardLayout>
  );
}