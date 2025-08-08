"use client";

import { Slider } from '@/components/ui/slider';
import { GlassCard } from '@/components/ui/glass-card';
import { useState } from 'react';

export function FrequencyExplorer() {
  const [frequency, setFrequency] = useState([10]);

  const getFrequencyState = (freq: number) => {
    if (freq < 4) return 'Delta waves - Deep sleep';
    if (freq < 8) return 'Theta waves - Meditation';
    if (freq < 13) return 'Alpha waves - Relaxed alertness';
    if (freq < 30) return 'Beta waves - Active thinking';
    return 'Gamma waves - High-level processing';
  };

  const getFrequencyColor = (freq: number) => {
    if (freq < 4) return 'text-blue-400';
    if (freq < 8) return 'text-purple-400';
    if (freq < 13) return 'text-green-400';
    if (freq < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <GlassCard>
      <h3 className="text-xl font-semibold mb-4">Interactive Frequency Map</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Explore how different sound frequencies affect your mental and physical state
      </p>
      <div className="space-y-6">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0.5 Hz</span>
          <span>100 Hz</span>
        </div>
        <Slider
          value={frequency}
          onValueChange={setFrequency}
          max={100}
          min={0.5}
          step={0.5}
          className="w-full"
        />
        <div className="text-center space-y-2">
          <p className={`text-3xl font-bold ${getFrequencyColor(frequency[0])}`}>
            {frequency[0]} Hz
          </p>
          <p className="text-sm text-muted-foreground">
            {getFrequencyState(frequency[0])}
          </p>
        </div>
      </div>
    </GlassCard>
  );
} 