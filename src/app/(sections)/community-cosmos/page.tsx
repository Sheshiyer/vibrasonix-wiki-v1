import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock data removed - content will be driven by documentation

export default async function CommunityCosmosPage() {
  const docs = await getSectionDocs('community-cosmos');
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <h1 className="text-3xl font-bold gradient-text mb-4">💫 Community Cosmos</h1>
          <p className="text-muted-foreground">
            Interactive social knowledge sharing space. Connect with fellow practitioners, 
            share experiences, and learn from the collective wisdom of our community.
          </p>
        </GlassCard>

        {/* Community stats will be driven by real data */}

        {/* Documentation Section */}
        {docs.length > 0 && (
          <div>
            <GlassCard className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Community Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc) => (
                  <div key={doc.slug}>
                    <Link href={`/community-cosmos/${doc.slug}`}>
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

        {/* Community features and discussions will be driven by documentation files */}

        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Be Respectful</h3>
              <p className="text-muted-foreground">Treat all members with kindness and respect, regardless of experience level</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Share Experiences</h3>
              <p className="text-muted-foreground">Contribute your personal experiences and insights to help others</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Ask Questions</h3>
              <p className="text-muted-foreground">Don&apos;t hesitate to ask questions - our community is here to help</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Stay Scientific</h3>
              <p className="text-muted-foreground">Base discussions on evidence and research when possible</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}