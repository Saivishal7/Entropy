import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { motion } from 'motion/react';
import { Activity, Users, Target, Info } from 'lucide-react';
import { DashboardStats } from '../types';
import { cn } from '../utils/helpers';

interface AnalyticsGridProps {
  stats: DashboardStats;
}

export default function AnalyticsGrid({ stats }: AnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Entropy Score */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <Activity size={20} />
            <h3 className="text-lg font-semibold text-white">Coordination Entropy</h3>
          </div>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <Info size={16} />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                fill="none" stroke="currentColor" strokeWidth="8" 
                className="text-zinc-800"
              />
              <motion.circle 
                cx="64" cy="64" r="56" 
                fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="351.8"
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 * (1 - stats.entropyScore / 100) }}
                className={cn(
                  stats.entropyScore < 40 ? 'text-emerald-500' : stats.entropyScore < 70 ? 'text-amber-500' : 'text-rose-500'
                )}
              />
            </svg>
            <div className="text-3xl font-bold text-white">{stats.entropyScore}%</div>
          </div>
          <p className="mt-4 text-xs text-zinc-500 text-center max-w-[200px]">
            {stats.entropyScore < 40 
              ? "Low coordination overhead. Team is operating efficiently." 
              : stats.entropyScore < 70 
                ? "Moderate complexity. Monitor dependency density." 
                : "High entropy. Coordination overhead is slowing velocity."}
          </p>
        </div>
      </motion.div>

      {/* Workload Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <Users size={20} />
            <h3 className="text-lg font-semibold text-white">Workload Distribution</h3>
          </div>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.workloadDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#a1a1aa' }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {stats.workloadDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hours > entry.limit ? '#f43f5e' : '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <span>Underloaded</span>
          <span>Overloaded</span>
        </div>
      </motion.div>

      {/* Sprint Feasibility */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target size={20} />
            <h3 className="text-lg font-semibold text-white">Sprint Feasibility</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="64" cy="64" r="56" 
                fill="none" stroke="currentColor" strokeWidth="8" 
                className="text-zinc-800"
              />
              <motion.circle 
                cx="64" cy="64" r="56" 
                fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="351.8"
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 * (1 - stats.feasibilityScore / 100) }}
                className={cn(
                  stats.feasibilityScore > 70 ? 'text-emerald-500' : stats.feasibilityScore > 40 ? 'text-amber-500' : 'text-rose-500'
                )}
              />
            </svg>
            <div className="text-3xl font-bold text-white">{stats.feasibilityScore}%</div>
          </div>
          <p className="mt-4 text-xs text-zinc-500 text-center max-w-[200px]">
            {stats.feasibilityScore > 70 
              ? "Sprint is on track. High probability of success." 
              : stats.feasibilityScore > 40 
                ? "At risk. Consider reducing scope or rebalancing." 
                : "Critical. Sprint goals are unlikely to be met."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
