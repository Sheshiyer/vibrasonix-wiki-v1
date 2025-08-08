"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const experimentTemplates = [
  {
    title: 'Frequency Response Test',
    description: 'Test your brain\'s response to different frequencies',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Neuroscience'
  },
  {
    title: 'Binaural Beat Sensitivity',
    description: 'Discover your optimal binaural beat frequencies',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'Audio'
  },
  {
    title: 'PEMF Intensity Mapping',
    description: 'Map your body\'s response to different PEMF intensities',
    duration: '30 min',
    difficulty: 'Advanced',
    category: 'Technology'
  },
  {
    title: 'Combined Modality Test',
    description: 'Test combinations of different sound therapy modalities',
    duration: '45 min',
    difficulty: 'Advanced',
    category: 'Integration'
  }
];

const personalExperiments = [
  {
    title: 'My Sleep Frequency Journey',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-03-15',
    category: 'Sleep'
  },
  {
    title: 'Focus Enhancement Protocol',
    status: 'Completed',
    progress: 100,
    startDate: '2024-02-20',
    category: 'Focus'
  },
  {
    title: 'Stress Reduction Experiment',
    status: 'Planning',
    progress: 0,
    startDate: '2024-04-01',
    category: 'Stress'
  }
];

export default function SonicLabPage() {
  const [frequency, setFrequency] = useState([10]);
  const [intensity, setIntensity] = useState([50]);
  const [duration, setDuration] = useState([30]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <h1 className="text-3xl font-bold gradient-text mb-4">🧪 Sonic Lab</h1>
          <p className="text-muted-foreground">
            Experimental zone for personalized exploration. Create custom protocols, 
            test new combinations, and discover what works best for your unique needs.
          </p>
        </GlassCard>

        <Tabs defaultValue="experiments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="experiments">Experiment Templates</TabsTrigger>
            <TabsTrigger value="personal">My Experiments</TabsTrigger>
            <TabsTrigger value="custom">Custom Protocol</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experiments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experimentTemplates.map((template) => (
                <Card key={template.title} className="hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{template.title}</span>
                      <Badge variant={template.difficulty === 'Beginner' ? 'default' : template.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {template.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{template.duration}</Badge>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <Button className="w-full mt-4">Start Experiment</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="personal" className="space-y-4">
            <div className="space-y-4">
              {personalExperiments.map((experiment) => (
                <Card key={experiment.title} className="hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{experiment.title}</span>
                      <Badge variant={experiment.status === 'Completed' ? 'default' : experiment.status === 'In Progress' ? 'secondary' : 'outline'}>
                        {experiment.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Started: {experiment.startDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm">{experiment.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${experiment.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">{experiment.category}</Badge>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4">Create Custom Protocol</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Protocol Name</label>
                  <Input placeholder="Enter protocol name" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea placeholder="Describe your custom protocol" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Frequency (Hz)</label>
                    <div className="space-y-2">
                      <Slider
                        value={frequency}
                        onValueChange={setFrequency}
                        max={100}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-center text-sm">{frequency[0]} Hz</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Intensity (%)</label>
                    <div className="space-y-2">
                      <Slider
                        value={intensity}
                        onValueChange={setIntensity}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-center text-sm">{intensity[0]}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration (min)</label>
                    <div className="space-y-2">
                      <Slider
                        value={duration}
                        onValueChange={setDuration}
                        max={120}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="text-center text-sm">{duration[0]} min</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Create Protocol</Button>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        <GlassCard>
          <h2 className="text-xl font-semibold mb-4">Lab Safety Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Start Slow</h3>
              <p className="text-muted-foreground">Begin with lower intensities and shorter durations</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Listen to Your Body</h3>
              <p className="text-muted-foreground">Stop immediately if you experience discomfort</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Document Everything</h3>
              <p className="text-muted-foreground">Keep detailed records of your experiments</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Consult Professionals</h3>
              <p className="text-muted-foreground">Seek medical advice for any health concerns</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
} 