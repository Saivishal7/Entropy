import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  ArrowRightLeft,
  Zap,
  X,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { HackathonData, TeamMember, Task } from '../types';
import { cn } from '../utils/helpers';
import { differenceInSeconds, formatDistanceToNow } from 'date-fns';

interface TeamOverviewProps {
  data: HackathonData;
  onUpdateData: (data: HackathonData) => void;
}

export default function TeamOverview({ data, onUpdateData }: TeamOverviewProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember = useMemo(() => 
    data.members.find(m => m.id === selectedMemberId), 
    [data.members, selectedMemberId]
  );

  const stats = useMemo(() => {
    const totalMembers = data.members.length;
    const activeTasksCount = data.tasks.filter(t => t.status !== 'Completed').length;
    const avgBurnout = Math.round(data.members.reduce((acc, m) => acc + m.burnoutIndex, 0) / totalMembers);
    const mostOverloaded = [...data.members].sort((a, b) => b.burnoutIndex - a.burnoutIndex)[0];
    
    // Mock feasibility logic
    const totalEffort = data.tasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const completedEffort = data.tasks.filter(t => t.status === 'Completed').reduce((acc, t) => acc + t.estimatedHours, 0);
    const completionProb = Math.round((completedEffort / totalEffort) * 100) || 45;

    return {
      totalMembers,
      activeTasksCount,
      avgBurnout,
      mostOverloaded,
      completionProb
    };
  }, [data]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Team Intelligence</h1>
        <p className="text-zinc-500">Monitor individual burnout, workload distribution, and deadline pressure.</p>
      </div>

      {/* Team Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SummaryCard 
          label="Team Members" 
          value={stats.totalMembers} 
          icon={<Users size={18} />} 
          color="text-indigo-400"
        />
        <SummaryCard 
          label="Active Tasks" 
          value={stats.activeTasksCount} 
          icon={<CheckCircle2 size={18} />} 
          color="text-emerald-400"
        />
        <SummaryCard 
          label="Avg Burnout" 
          value={`${stats.avgBurnout}%`} 
          icon={<Flame size={18} />} 
          color={stats.avgBurnout > 70 ? "text-rose-400" : stats.avgBurnout > 40 ? "text-amber-400" : "text-emerald-400"}
        />
        <SummaryCard 
          label="Most Overloaded" 
          value={stats.mostOverloaded?.name.split(' ')[0] || 'None'} 
          icon={<TrendingUp size={18} />} 
          color="text-rose-400"
        />
        <SummaryCard 
          label="Completion Prob." 
          value={`${stats.completionProb}%`} 
          icon={<Zap size={18} />} 
          color="text-purple-400"
        />
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.members.map(member => (
          <MemberCard 
            key={member.id} 
            member={member} 
            tasks={data.tasks.filter(t => t.assigneeId === member.id)}
            onViewDetails={() => setSelectedMemberId(member.id)}
          />
        ))}
      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailModal 
            member={selectedMember} 
            tasks={data.tasks.filter(t => t.assigneeId === selectedMember.id)}
            onClose={() => setSelectedMemberId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-zinc-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={cn("text-xl font-bold", color)}>{value}</div>
    </div>
  );
}

function MemberCard({ member, tasks, onViewDetails, key }: { member: TeamMember, tasks: Task[], onViewDetails: () => void, key?: string }) {
  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const nearestDeadlineTask = useMemo(() => {
    return activeTasks
      .filter(t => t.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0];
  }, [activeTasks]);

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [deadlineColor, setDeadlineColor] = useState<string>('text-emerald-400');

  useEffect(() => {
    if (!nearestDeadlineTask?.deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(nearestDeadlineTask.deadline!);
      const diff = differenceInSeconds(deadline, now);

      if (diff <= 0) {
        setTimeLeft('Overdue');
        setDeadlineColor('text-rose-500');
        return;
      }

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      setTimeLeft(`${h}h ${m}m left`);

      // Mock thresholds: 12h total duration assumed for task
      const totalDuration = 12 * 3600; 
      const ratio = diff / totalDuration;

      if (ratio < 0.2) setDeadlineColor('text-rose-400');
      else if (ratio < 0.4) setDeadlineColor('text-amber-400');
      else setDeadlineColor('text-emerald-400');
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [nearestDeadlineTask]);

  const burnoutColor = member.burnoutIndex > 70 ? 'bg-rose-500' : member.burnoutIndex > 40 ? 'bg-amber-500' : 'bg-emerald-500';
  const burnoutText = member.burnoutIndex > 70 ? 'High Risk' : member.burnoutIndex > 40 ? 'Moderate Risk' : 'Low Risk';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-indigo-500/20">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{member.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                {member.role}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">{member.skillLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deadline Countdown */}
      <div className="mb-6 p-3 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-500">
          <Clock size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Nearest Deadline</span>
        </div>
        <div className={cn("text-xs font-bold font-mono", deadlineColor)}>
          {timeLeft || 'No active deadlines'}
        </div>
      </div>

      {/* Current Tasks */}
      <div className="space-y-4 mb-6">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
          <span>Active Tasks</span>
          <span>{activeTasks.length} Total</span>
        </div>
        <div className="space-y-3">
          {activeTasks.slice(0, 3).map(task => (
            <div key={task.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium truncate max-w-[180px]">{task.title}</span>
                <span className="text-zinc-500 font-mono">{task.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          ))}
          {activeTasks.length > 3 && (
            <div className="text-[10px] text-zinc-500 font-medium text-center pt-1">
              + {activeTasks.length - 3} more tasks
            </div>
          )}
        </div>
      </div>

      {/* Burnout Health Indicator */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Burnout Risk</span>
          <span className={cn("text-[10px] font-bold uppercase", member.burnoutIndex > 70 ? 'text-rose-400' : member.burnoutIndex > 40 ? 'text-amber-400' : 'text-emerald-400')}>
            {burnoutText}
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${member.burnoutIndex}%` }}
            className={cn("h-full", burnoutColor)}
          />
        </div>
      </div>

      {/* Workload Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Assigned</div>
          <div className="text-sm font-bold text-white">{member.workloadHours}h</div>
        </div>
        <div className="text-center p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Done</div>
          <div className="text-sm font-bold text-emerald-400">{member.completedHours}h</div>
        </div>
        <div className="text-center p-2 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Imbalance</div>
          <div className="text-sm font-bold text-amber-400">
            {Math.round((member.workloadHours / 20) * 100)}%
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={onViewDetails}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
        >
          <ExternalLink size={14} />
          <span className="text-[8px] font-bold uppercase">Details</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all">
          <ArrowRightLeft size={14} />
          <span className="text-[8px] font-bold uppercase">Reassign</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 transition-all border border-indigo-500/20">
          <Zap size={14} />
          <span className="text-[8px] font-bold uppercase">Optimize</span>
        </button>
      </div>
    </motion.div>
  );
}

function MemberDetailModal({ member, tasks, onClose }: { member: TeamMember, tasks: Task[], onClose: () => void }) {
  const chartData = [
    { name: '0h', value: 20 },
    { name: '4h', value: 45 },
    { name: '8h', value: 30 },
    { name: '12h', value: 65 },
    { name: '16h', value: 85 },
    { name: '20h', value: 70 },
    { name: '24h', value: 90 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold text-white">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{member.name}</h2>
              <p className="text-sm text-zinc-500">{member.role} • {member.skillLevel}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Burnout */}
            <div className="space-y-8">
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Flame size={14} className="text-rose-400" /> Burnout Breakdown
                </h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Parallel Tasks</span>
                    <span className="text-sm font-bold text-white">{tasks.filter(t => t.status === 'In Progress').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Deadline Pressure</span>
                    <span className="text-sm font-bold text-amber-400">High</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Context Switching</span>
                    <span className="text-sm font-bold text-rose-400">Extreme</span>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">AI Recommendation</div>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                      "Member is showing signs of cognitive overload. Suggest offloading non-critical tasks to Alex."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BarChart3 size={14} className="text-indigo-400" /> Productivity Pulse
                </h4>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#6366f1' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column: Task List & Dependencies */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Full Task List
                </h4>
                <div className="space-y-4">
                  {tasks.map(task => (
                    <div key={task.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.status === 'Completed' ? 'bg-emerald-500' : task.status === 'In Progress' ? 'bg-indigo-500' : 'bg-zinc-700'
                        )} />
                        <div>
                          <div className="text-sm font-bold text-white">{task.title}</div>
                          <div className="text-[10px] text-zinc-500">{task.status} • {task.estimatedHours}h estimated</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-zinc-400">{task.progress}%</div>
                        {task.dependencies.length > 0 && (
                          <div className="flex items-center gap-1 text-rose-400">
                            <AlertTriangle size={12} />
                            <span className="text-[10px] font-bold">{task.dependencies.length} Deps</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={14} className="text-purple-400" /> Dependency Graph Snippet
                </h4>
                <div className="flex items-center justify-center h-32 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-xs italic">
                  Interactive dependency visualization loading...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all"
          >
            Close
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
            Optimize Resource Load
          </button>
        </div>
      </motion.div>
    </div>
  );
}
