"use client";

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CodeExampleShowcase } from '@/components/interactive/code-example';
import { FrequencyExplorer } from '@/components/interactive/frequency-explorer';
import { GlassCard } from '@/components/ui/glass-card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

// Sample interactive component for preview
function SampleFrequencyComponent() {
  const [frequency, setFrequency] = useState([10]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>1 Hz</span>
        <span>100 Hz</span>
      </div>
      <Slider
        value={frequency}
        onValueChange={setFrequency}
        max={100}
        min={1}
        step={1}
        className="w-full"
      />
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-400">{frequency[0]} Hz</p>
        <p className="text-sm text-muted-foreground">
          {frequency[0] < 4 ? 'Delta waves' : 
           frequency[0] < 8 ? 'Theta waves' : 
           frequency[0] < 13 ? 'Alpha waves' : 
           frequency[0] < 30 ? 'Beta waves' : 'Gamma waves'}
        </p>
      </div>
    </div>
  );
}

const codeExamples = [
  {
    title: 'Interactive Frequency Explorer',
    description: 'A React component that allows users to explore different brainwave frequencies with real-time feedback.',
    language: 'typescript',
    category: 'React Components',
    difficulty: 'Intermediate' as const,
    tags: ['React', 'TypeScript', 'Interactive', 'Audio'],
    downloadable: true,
    runnable: true,
    preview: <SampleFrequencyComponent />,
    code: `"use client";

import { Slider } from '@/components/ui/slider';
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
    <div className="space-y-6">
      <div className="flex justify-between text-sm">
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
        <p className={\`text-3xl font-bold \${getFrequencyColor(frequency[0])}\`}>
          {frequency[0]} Hz
        </p>
        <p className="text-sm text-muted-foreground">
          {getFrequencyState(frequency[0])}
        </p>
      </div>
    </div>
  );
}`
  },
  {
    title: 'Binaural Beat Generator',
    description: 'Python script to generate binaural beats for therapeutic applications.',
    language: 'python',
    category: 'Audio Processing',
    difficulty: 'Advanced' as const,
    tags: ['Python', 'Audio', 'NumPy', 'Signal Processing'],
    downloadable: true,
    code: `import numpy as np
import soundfile as sf
from scipy import signal

class BinauralBeatGenerator:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
    
    def generate_binaural_beat(self, base_freq, beat_freq, duration, amplitude=0.5):
        """
        Generate binaural beats with specified parameters.
        
        Args:
            base_freq (float): Base frequency in Hz
            beat_freq (float): Beat frequency in Hz
            duration (float): Duration in seconds
            amplitude (float): Amplitude (0.0 to 1.0)
        
        Returns:
            tuple: (left_channel, right_channel) audio arrays
        """
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        
        # Left ear: base frequency
        left_freq = base_freq
        # Right ear: base frequency + beat frequency
        right_freq = base_freq + beat_freq
        
        # Generate sine waves
        left_channel = amplitude * np.sin(2 * np.pi * left_freq * t)
        right_channel = amplitude * np.sin(2 * np.pi * right_freq * t)
        
        # Apply fade in/out to prevent clicks
        fade_samples = int(0.1 * self.sample_rate)  # 0.1 second fade
        fade_in = np.linspace(0, 1, fade_samples)
        fade_out = np.linspace(1, 0, fade_samples)
        
        left_channel[:fade_samples] *= fade_in
        left_channel[-fade_samples:] *= fade_out
        right_channel[:fade_samples] *= fade_in
        right_channel[-fade_samples:] *= fade_out
        
        return left_channel, right_channel
    
    def save_binaural_beat(self, filename, base_freq, beat_freq, duration):
        """
        Generate and save binaural beat to file.
        """
        left, right = self.generate_binaural_beat(base_freq, beat_freq, duration)
        stereo_audio = np.column_stack((left, right))
        sf.write(filename, stereo_audio, self.sample_rate)
        print(f"Binaural beat saved to {filename}")

# Example usage
if __name__ == "__main__":
    generator = BinauralBeatGenerator()
    
    # Generate 10Hz alpha wave binaural beat
    generator.save_binaural_beat(
        "alpha_10hz.wav",
        base_freq=200,  # 200Hz base tone
        beat_freq=10,   # 10Hz binaural beat
        duration=300    # 5 minutes
    )`
  },
  {
    title: 'PEMF Signal Visualization',
    description: 'JavaScript code to visualize Pulsed Electromagnetic Field (PEMF) signals using Canvas API.',
    language: 'javascript',
    category: 'Visualization',
    difficulty: 'Intermediate' as const,
    tags: ['JavaScript', 'Canvas', 'Visualization', 'PEMF'],
    downloadable: true,
    code: `class PEMFVisualizer {
  constructor(canvasId, width = 800, height = 400) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    
    this.isAnimating = false;
    this.animationId = null;
    this.time = 0;
  }
  
  drawPEMFWaveform(frequency, intensity, pulseWidth) {
    const centerY = this.height / 2;
    const amplitude = (intensity / 100) * (this.height / 3);
    const period = this.width / (frequency * 2); // 2 cycles visible
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw grid
    this.drawGrid();
    
    // Draw PEMF waveform
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00ff88';
    this.ctx.lineWidth = 2;
    
    for (let x = 0; x < this.width; x++) {
      const t = (x / this.width) * (2 * Math.PI * frequency) + this.time;
      
      // PEMF pulse pattern (square wave with duty cycle)
      const dutyCycle = pulseWidth / 100;
      const phaseInCycle = (t % (2 * Math.PI)) / (2 * Math.PI);
      const isOn = phaseInCycle < dutyCycle;
      
      const y = centerY - (isOn ? amplitude : 0);
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    
    // Draw labels
    this.drawLabels(frequency, intensity, pulseWidth);
  }
  
  drawGrid() {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y <= this.height; y += this.height / 8) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= this.width; x += this.width / 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
  }
  
  drawLabels(frequency, intensity, pulseWidth) {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px Arial';
    
    this.ctx.fillText(\`Frequency: \${frequency} Hz\`, 10, 25);
    this.ctx.fillText(\`Intensity: \${intensity}%\`, 10, 45);
    this.ctx.fillText(\`Pulse Width: \${pulseWidth}%\`, 10, 65);
  }
  
  startAnimation(frequency, intensity, pulseWidth) {
    this.isAnimating = true;
    
    const animate = () => {
      if (!this.isAnimating) return;
      
      this.time += 0.1;
      this.drawPEMFWaveform(frequency, intensity, pulseWidth);
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Usage example
const visualizer = new PEMFVisualizer('pemf-canvas');

// Control panel event listeners
document.getElementById('frequency-slider').addEventListener('input', updateVisualization);
document.getElementById('intensity-slider').addEventListener('input', updateVisualization);
document.getElementById('pulse-width-slider').addEventListener('input', updateVisualization);

function updateVisualization() {
  const frequency = document.getElementById('frequency-slider').value;
  const intensity = document.getElementById('intensity-slider').value;
  const pulseWidth = document.getElementById('pulse-width-slider').value;
  
  visualizer.drawPEMFWaveform(frequency, intensity, pulseWidth);
}

// Start with default values
updateVisualization();`
  },
  {
    title: 'Frequency Analysis with FFT',
    description: 'MATLAB/Octave code for analyzing audio frequency content using Fast Fourier Transform.',
    language: 'matlab',
    category: 'Signal Processing',
    difficulty: 'Advanced' as const,
    tags: ['MATLAB', 'FFT', 'Signal Processing', 'Audio Analysis'],
    downloadable: true,
    code: `function [frequencies, magnitudes] = analyze_audio_frequency(filename)
% ANALYZE_AUDIO_FREQUENCY - Perform FFT analysis on audio file
%
% Inputs:
%   filename - Path to audio file
%
% Outputs:
%   frequencies - Frequency bins (Hz)
%   magnitudes - Magnitude spectrum (dB)

% Read audio file
[audio_data, sample_rate] = audioread(filename);

% Convert to mono if stereo
if size(audio_data, 2) > 1
    audio_data = mean(audio_data, 2);
end

% Parameters
window_size = 2048;
overlap = window_size / 2;
window = hann(window_size);

% Perform Short-Time Fourier Transform
[S, F, T] = spectrogram(audio_data, window, overlap, window_size, sample_rate);

% Calculate average magnitude spectrum
avg_magnitude = mean(abs(S), 2);
magnitudes = 20 * log10(avg_magnitude + eps); % Convert to dB
frequencies = F;

% Plot results
figure('Name', 'Frequency Analysis', 'NumberTitle', 'off');

% Subplot 1: Time domain signal
subplot(3, 1, 1);
time_vector = (0:length(audio_data)-1) / sample_rate;
plot(time_vector, audio_data);
title('Time Domain Signal');
xlabel('Time (s)');
ylabel('Amplitude');
grid on;

% Subplot 2: Frequency spectrum
subplot(3, 1, 2);
semilogx(frequencies, magnitudes);
title('Average Frequency Spectrum');
xlabel('Frequency (Hz)');
ylabel('Magnitude (dB)');
grid on;
xlim([20, sample_rate/2]); % Human hearing range

% Subplot 3: Spectrogram
subplot(3, 1, 3);
imagesc(T, F, 20*log10(abs(S) + eps));
axis xy;
title('Spectrogram');
xlabel('Time (s)');
ylabel('Frequency (Hz)');
colorbar;
colormap(jet);

% Find dominant frequencies
[peaks, peak_indices] = findpeaks(magnitudes, 'MinPeakHeight', max(magnitudes) - 20);
dominant_freqs = frequencies(peak_indices);

fprintf('\nDominant frequencies found:\n');
for i = 1:min(5, length(dominant_freqs))
    fprintf('%.2f Hz (%.1f dB)\n', dominant_freqs(i), peaks(i));
end

% Analyze frequency bands
analyze_frequency_bands(frequencies, magnitudes);

end

function analyze_frequency_bands(frequencies, magnitudes)
% Analyze specific frequency bands relevant to brainwave entrainment

% Define frequency bands
bands = struct(...
    'delta', [0.5, 4], ...
    'theta', [4, 8], ...
    'alpha', [8, 13], ...
    'beta', [13, 30], ...
    'gamma', [30, 100] ...
);

band_names = fieldnames(bands);
fprintf('\nFrequency Band Analysis:\n');
fprintf('========================\n');

for i = 1:length(band_names)
    band_name = band_names{i};
    band_range = bands.(band_name);
    
    % Find indices within band
    band_indices = frequencies >= band_range(1) & frequencies <= band_range(2);
    
    if any(band_indices)
        band_magnitudes = magnitudes(band_indices);
        avg_power = mean(band_magnitudes);
        max_power = max(band_magnitudes);
        
        fprintf('%s (%.1f-%.1f Hz): Avg=%.1f dB, Max=%.1f dB\n', ...
                upper(band_name), band_range(1), band_range(2), avg_power, max_power);
    end
end

end`
  },
  {
    title: 'CSS Glassmorphism Effects',
    description: 'Modern CSS techniques for creating glassmorphism UI effects used in the Vibrasonix interface.',
    language: 'css',
    category: 'Styling',
    difficulty: 'Beginner' as const,
    tags: ['CSS', 'Glassmorphism', 'UI Design', 'Modern Web'],
    downloadable: true,
    code: `/* Glassmorphism Base Styles */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

/* Interactive Hover Effects */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Gradient Variants */
.glass-card--primary {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(168, 85, 247, 0.1) 100%
  );
  border-color: rgba(99, 102, 241, 0.2);
}

.glass-card--secondary {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1) 0%,
    rgba(239, 68, 68, 0.1) 100%
  );
  border-color: rgba(236, 72, 153, 0.2);
}

.glass-card--accent {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.1) 0%,
    rgba(59, 130, 246, 0.1) 100%
  );
  border-color: rgba(34, 197, 94, 0.2);
}

/* Liquid Background Animation */
.liquid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.liquid-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.liquid-blob:nth-child(1) {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.liquid-blob:nth-child(2) {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ec4899, #ef4444);
  top: 60%;
  right: 10%;
  animation-delay: -5s;
}

.liquid-blob:nth-child(3) {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #22c55e, #3b82f6);
  bottom: 20%;
  left: 50%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  25% {
    transform: translate(30px, -50px) rotate(90deg) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg) scale(0.9);
  }
  75% {
    transform: translate(50px, 30px) rotate(270deg) scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 12px;
  }
  
  .liquid-blob {
    filter: blur(30px);
  }
  
  .liquid-blob:nth-child(1) {
    width: 200px;
    height: 200px;
  }
  
  .liquid-blob:nth-child(2) {
    width: 150px;
    height: 150px;
  }
  
  .liquid-blob:nth-child(3) {
    width: 180px;
    height: 180px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .glass-card:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
}`
  }
];

export default function CodeExamplesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassCard>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              💻 Interactive Code Examples
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Explore interactive code examples with syntax highlighting, live previews, and downloadable snippets. 
              Learn how to build audio processing applications, visualizations, and interactive components.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Syntax Highlighting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Live Previews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Downloadable Code</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <CodeExampleShowcase
          title="Featured Code Examples"
          description="A curated collection of code examples for audio processing, visualization, and interactive components."
          examples={codeExamples}
        />
        
        {/* Live Interactive Demo */}
        <GlassCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">🎛️ Live Interactive Demo</h2>
            <p className="text-muted-foreground mb-6">
              Try out the Frequency Explorer component in action:
            </p>
            <FrequencyExplorer />
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}