import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { FrequencyExplorer } from '@/components/interactive/frequency-explorer';
import { GlassCard } from '@/components/ui/glass-card';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Interactive Components - Above the fold */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FrequencyExplorer />
          
          <GlassCard>
            <h3 className="text-xl font-semibold mb-4">Knowledge Pulse</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Sleep Enhancement</span>
                <span className="text-2xl font-bold text-green-400">43%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Focus Improvement</span>
                <span className="text-2xl font-bold text-blue-400">47%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stress Reduction</span>
                <span className="text-2xl font-bold text-purple-400">62%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Meditation Depth</span>
                <span className="text-2xl font-bold text-cyan-400">49%</span>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Section Navigation - Below interactive components */}
        <DashboardGrid />
      </div>
    </DashboardLayout>
  );
}
