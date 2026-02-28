import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Clock, User, Link2 } from 'lucide-react';
import { Task, TeamMember, TaskStatus } from '../types';
import { cn } from '../utils/helpers';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
  members: TeamMember[];
}

export default function TaskFormModal({ isOpen, onClose, onAdd, members }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id || '');
  const [estimatedHours, setEstimatedHours] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title,
      description,
      status: 'Backlog',
      assigneeId,
      estimatedHours,
      dependencies: [],
      riskScore: Math.floor(Math.random() * 40) + 10,
      coordinationImpact: Math.floor(Math.random() * 50) + 20,
      progress: 0,
      deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
    onAdd(newTask);
    onClose();
    // Reset
    setTitle('');
    setDescription('');
    setEstimatedHours(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={20} className="text-indigo-400" /> Create New Task
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Task Title</label>
                <input 
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. Implement OAuth Flow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  placeholder="What needs to be done?"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Assignee</label>
                  <select 
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Effort (Hours)</label>
                  <input 
                    required
                    type="number" 
                    min={1}
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Add Task to Backlog
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
