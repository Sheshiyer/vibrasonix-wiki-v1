import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSectionDocs } from '@/lib/docs';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';

const communityFeatures = [
  {
    title: 'Collaboration Clusters',
    description: 'Community collaboration tools and spaces',
    href: '/community-cosmos/collaboration-clusters',
    icon: '🤝',
    members: 450,
    active: 'High'
  },
  {
    title: 'Experience Exchange',
    description: 'User experience sharing and discussion',
    href: '/community-cosmos/experience-exchange',
    icon: '💬',
    members: 1200,
    active: 'Very High'
  },
  {
    title: 'Question Quasar',
    description: 'Q&A and community support',
    href: '/community-cosmos/question-quasar',
    icon: '❓',
    members: 800,
    active: 'High'
  },
  {
    title: 'Success Constellation',
    description: 'Success stories and community achievements',
    href: '/community-cosmos/success-constellation',
    icon: '⭐',
    members: 650,
    active: 'Medium'
  }
];

const recentDiscussions = [
  {
    title: 'Best frequency for deep work sessions?',
    author: 'Alex Chen',
    avatar: '/avatars/alex.jpg',
    replies: 23,
    views: 156,
    category: 'Experience Exchange',
    timeAgo: '2 hours ago'
  },
  {
    title: 'My 30-day sleep transformation journey',
    author: 'Maria Rodriguez',
    avatar: '/avatars/maria.jpg',
    replies: 45,
    views: 289,
    category: 'Success Constellation',
    timeAgo: '1 day ago'
  },
  {
    title: 'PEMF vs Binaural Beats for focus',
    author: 'David Kim',
    avatar: '/avatars/david.jpg',
    replies: 18,
    views: 203,
    category: 'Question Quasar',
    timeAgo: '3 days ago'
  }
];

const communityStats = [
  { label: 'Total Members', value: '1,247', change: '+12%', period: 'This month' },
  { label: 'Active Discussions', value: '89', change: '+8%', period: 'This week' },
  { label: 'Success Stories', value: '156', change: '+15%', period: 'This month' },
  { label: 'Knowledge Articles', value: '234', change: '+5%', period: 'This month' }
];

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {communityStats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-green-500 mt-1">{stat.change} {stat.period}</div>
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
                Community Documentation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {docs.map((doc, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityFeatures.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="hover:scale-105 transition-transform cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <div>{feature.title}</div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{feature.members} members</Badge>
                        <Badge variant={feature.active === 'Very High' ? 'default' : feature.active === 'High' ? 'secondary' : 'outline'}>
                          {feature.active} activity
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Recent Discussions</h2>
          <div className="space-y-4">
            {recentDiscussions.map((discussion) => (
              <Card key={discussion.title} className="hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>{discussion.author.split(' ').map((n, i) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{discussion.title}</CardTitle>
                        <CardDescription>
                          by {discussion.author} • {discussion.timeAgo}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{discussion.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.views} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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