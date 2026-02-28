import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/helpers';
import { Clock, Activity, Target, AlertTriangle } from 'lucide-react';
import { differenceInSeconds } from 'date-fns';

interface TopBarProps {
  startTime: string;
  durationHours: number;
  entropyScore: number;
  feasibilityScore: number;
}

export default function TopBar({ startTime, durationHours, entropyScore, feasibilityScore }: TopBarProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const totalSeconds = durationHours * 3600;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationHours * 3600 * 1000);
      const diff = differenceInSeconds(end, now);
      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, durationHours]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / totalSeconds) * 100;
  const colorClass = progress > 60 ? 'text-emerald-400' : progress > 30 ? 'text-amber-400' : 'text-rose-400';

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="24" cy="24" r="20" 
                fill="none" stroke="currentColor" strokeWidth="3" 
                className="text-zinc-800"
              />
              <motion.circle 
                cx="24" cy="24" r="20" 
                fill="none" stroke="currentColor" strokeWidth="3" 
                strokeDasharray="125.6"
                animate={{ strokeDashoffset: 125.6 * (1 - progress / 100) }}
                className={colorClass}
              />
            </svg>
            <Clock size={16} className={colorClass} />
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Time Remaining</div>
            <div className={cn("text-xl font-mono font-bold", colorClass)}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-800" />

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Activity size={10} /> Coordination Entropy
            </span>
            <span className={cn(
              "text-sm font-bold",
              entropyScore < 40 ? 'text-emerald-400' : entropyScore < 70 ? 'text-amber-400' : 'text-rose-400'
            )}>
              {entropyScore}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Target size={10} /> Sprint Feasibility
            </span>
            <span className={cn(
              "text-sm font-bold",
              feasibilityScore > 70 ? 'text-emerald-400' : feasibilityScore > 40 ? 'text-amber-400' : 'text-rose-400'
            )}>
              {feasibilityScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-medium">
          <AlertTriangle size={14} />
          Risk Detected: Resource Imbalance
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
          ES
        </div>
      </div>
    </header>
  );
}
