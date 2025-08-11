"use client";

import React from 'react';
import { usePreferences } from '@/contexts/preferences-context';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Volume2, 
  Bell, 
  Shield, 
  User, 
  RotateCcw,
  Save,
  Eye,
  Bookmark,
  Heart
} from 'lucide-react';

export function SettingsPanel() {
  const { preferences, updatePreferences, resetPreferences } = usePreferences();

  const handleSave = () => {
    // Preferences are automatically saved via context
    // This could trigger additional actions like syncing to server
    console.log('Settings saved:', preferences);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Settings & Preferences</h1>
        </div>
        
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="sonic" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Sonic Lab
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Display Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={preferences.fontSize}
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updatePreferences({ fontSize: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reducedMotion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    id="reducedMotion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(checked: boolean) => updatePreferences({ reducedMotion: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(checked: boolean) => updatePreferences({ highContrast: checked })}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Content Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="defaultSection">Default Section</Label>
                  <Select
                    value={preferences.defaultSection}
                    onValueChange={(value: string) => updatePreferences({ defaultSection: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="knowledge-hub">Knowledge Hub</SelectItem>
                      <SelectItem value="sonic-lab">Sonic Lab</SelectItem>
                      <SelectItem value="experience-library">Experience Library</SelectItem>
                      <SelectItem value="research-center">Research Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Favorite Topics</Label>
                  <p className="text-sm text-muted-foreground mb-2">Topics you&apos;re most interested in</p>
                  <div className="flex flex-wrap gap-2">
                    {['Binaural Beats', 'PEMF', 'Meditation', 'Sleep', 'Focus', 'Stress Relief'].map((topic) => (
                      <Badge
                        key={topic}
                        variant={preferences.favoriteTopics.includes(topic) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTopics = preferences.favoriteTopics.includes(topic)
                            ? preferences.favoriteTopics.filter(t => t !== topic)
                            : [...preferences.favoriteTopics, topic];
                          updatePreferences({ favoriteTopics: newTopics });
                        }}
                      >
                        <Heart className={`h-3 w-3 mr-1 ${preferences.favoriteTopics.includes(topic) ? 'fill-current' : ''}`} />
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Sonic Lab Settings */}
          <TabsContent value="sonic" className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Sonic Lab Defaults
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label>Default Frequency: {preferences.defaultFrequency} Hz</Label>
                  <p className="text-sm text-muted-foreground mb-2">Your preferred starting frequency</p>
                  <Slider
                    value={[preferences.defaultFrequency]}
                    onValueChange={([value]) => updatePreferences({ defaultFrequency: value })}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 Hz</span>
                    <span>100 Hz</span>
                  </div>
                </div>

                <div>
                  <Label>Default Intensity: {preferences.defaultIntensity}%</Label>
                  <p className="text-sm text-muted-foreground mb-2">Your preferred intensity level</p>
                  <Slider
                    value={[preferences.defaultIntensity]}
                    onValueChange={([value]) => updatePreferences({ defaultIntensity: value })}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Default Duration: {preferences.defaultDuration} minutes</Label>
                  <p className="text-sm text-muted-foreground mb-2">Your preferred session length</p>
                  <Slider
                    value={[preferences.defaultDuration]}
                    onValueChange={([value]) => updatePreferences({ defaultDuration: value })}
                    max={120}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="soundscape">Preferred Soundscape</Label>
                  <Select
                    value={preferences.preferredSoundscape}
                    onValueChange={(value: string) => updatePreferences({ preferredSoundscape: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ocean-waves">Ocean Waves</SelectItem>
                      <SelectItem value="white-noise">White Noise</SelectItem>
                      <SelectItem value="pink-noise">Pink Noise</SelectItem>
                      <SelectItem value="brown-noise">Brown Noise</SelectItem>
                      <SelectItem value="rainfall">Rainfall</SelectItem>
                      <SelectItem value="forest-sounds">Forest Sounds</SelectItem>
                      <SelectItem value="none">None (Pure Tones)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={preferences.enableNotifications}
                    onCheckedChange={(checked: boolean) => updatePreferences({ enableNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailUpdates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={preferences.emailUpdates}
                    onCheckedChange={(checked: boolean) => updatePreferences({ emailUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="experimentReminders">Experiment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for scheduled experiments</p>
                  </div>
                  <Switch
                    id="experimentReminders"
                    checked={preferences.experimentReminders}
                    onCheckedChange={(checked: boolean) => updatePreferences({ experimentReminders: checked })}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataCollection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow collection of usage data for improvements</p>
                  </div>
                  <Switch
                    id="dataCollection"
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked: boolean) => updatePreferences({ dataCollection: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help us understand how you use the app</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={preferences.analytics}
                    onCheckedChange={(checked: boolean) => updatePreferences({ analytics: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shareUsageData">Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">Share anonymized data with research partners</p>
                  </div>
                  <Switch
                    id="shareUsageData"
                    checked={preferences.shareUsageData}
                    onCheckedChange={(checked: boolean) => updatePreferences({ shareUsageData: checked })}
                  />
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={resetPreferences}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}