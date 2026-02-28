import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Clock, 
  Link2, 
  AlertTriangle, 
  Zap, 
  ArrowRightLeft, 
  FastForward 
} from 'lucide-react';
import { Task, TeamMember } from '../types';
import { cn } from '../utils/helpers';

interface TaskModalProps {
  task: Task | null;
  members: TeamMember[];
  onClose: () => void;
}

export default function TaskModal({ task, members, onClose }: TaskModalProps) {
  if (!task) return null;

  const assignee = members.find(m => m.id === task.assigneeId);
  const riskColor = task.riskScore < 30 ? 'text-emerald-400' : task.riskScore < 60 ? 'text-amber-400' : 'text-rose-400';

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-3 h-3 rounded-full", task.riskScore < 30 ? 'bg-emerald-500' : task.riskScore < 60 ? 'bg-amber-500' : 'bg-rose-500')} />
              <h2 className="text-xl font-bold text-white">Task Details</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Title & Description */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">{task.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{task.description}</p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assignee</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <User size={12} className="text-zinc-500" />
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{assignee?.name || 'Unassigned'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Effort</div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <Clock size={14} className="text-zinc-500" />
                  <span className="text-sm font-medium">{task.estimatedHours} Hours</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Risk Level</div>
                <div className={cn("text-sm font-bold", riskColor)}>
                  {task.riskScore}% {task.riskScore > 60 ? 'Critical' : task.riskScore > 30 ? 'Moderate' : 'Low'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Coordination</div>
                <div className="text-sm font-bold text-indigo-400">
                  {task.coordinationImpact}% Impact
                </div>
              </div>
            </div>

            {/* AI Assessment */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Zap size={18} className="fill-indigo-400" />
                <h4 className="text-sm font-bold uppercase tracking-widest">AI Risk Assessment</h4>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                This task has {task.dependencies.length} dependencies. Delaying this will impact 3 downstream features. 
                Workload for {assignee?.name} is currently at 85% capacity.
              </p>
              {task.dependencies.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blocking Dependencies</div>
                  <div className="flex flex-wrap gap-2">
                    {task.dependencies.map(depId => (
                      <div key={depId} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] text-zinc-400">
                        <Link2 size={10} /> {depId}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-3 rounded-xl transition-all">
                <ArrowRightLeft size={16} /> Rebalance Task
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-3 rounded-xl transition-all">
                <Link2 size={16} /> Resolve Dependency
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                <FastForward size={16} /> Fast-track
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
