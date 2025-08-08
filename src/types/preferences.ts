export interface UserPreferences {
  // Theme preferences
  theme: 'light' | 'dark' | 'system';
  
  // Display preferences
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Content preferences
  defaultSection: string;
  favoriteTopics: string[];
  bookmarkedPages: string[];
  
  // Sonic Lab preferences
  defaultFrequency: number;
  defaultIntensity: number;
  defaultDuration: number;
  preferredSoundscape: string;
  
  // Notification preferences
  enableNotifications: boolean;
  emailUpdates: boolean;
  experimentReminders: boolean;
  
  // Privacy preferences
  dataCollection: boolean;
  analytics: boolean;
  shareUsageData: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  preferences: UserPreferences;
}

export interface ExperimentHistory {
  id: string;
  name: string;
  type: string;
  date: string;
  duration: number;
  frequency: number;
  intensity: number;
  results?: {
    effectiveness: number;
    notes: string;
  };
}

export interface UserData {
  profile: UserProfile;
  experiments: ExperimentHistory[];
  achievements: string[];
  streaks: {
    current: number;
    longest: number;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  defaultSection: 'knowledge-hub',
  favoriteTopics: [],
  bookmarkedPages: [],
  defaultFrequency: 10,
  defaultIntensity: 50,
  defaultDuration: 30,
  preferredSoundscape: 'ocean-waves',
  enableNotifications: true,
  emailUpdates: false,
  experimentReminders: true,
  dataCollection: true,
  analytics: true,
  shareUsageData: false,
};