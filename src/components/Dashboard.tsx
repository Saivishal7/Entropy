import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Plus, Zap, CheckCircle2 } from 'lucide-react';
import { HackathonData, Task, TaskStatus, DashboardStats } from '../types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AnalyticsGrid from './AnalyticsGrid';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import TaskFormModal from './TaskFormModal';
import AISensei from './AISensei';
import TeamOverview from './TeamOverview';
import { calculateEntropy, calculateFeasibility } from '../utils/helpers';
import { differenceInSeconds } from 'date-fns';

interface DashboardProps {
  data: HackathonData;
  onUpdateData: (data: HackathonData) => void;
}

export default function Dashboard({ data, onUpdateData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const stats = useMemo((): DashboardStats => {
    const now = new Date();
    const start = new Date(data.startTime);
    const end = new Date(start.getTime() + data.durationHours * 3600 * 1000);
    const timeRemaining = Math.max(0, differenceInSeconds(end, now));
    const remainingHours = timeRemaining / 3600;

    const workloadDistribution = data.members.map(m => {
      const hours = data.tasks
        .filter(t => t.assigneeId === m.id && t.status !== 'Completed')
        .reduce((acc, t) => acc + t.estimatedHours, 0);
      return {
        name: m.name.split(' ')[0],
        hours,
        limit: 12, // Mock limit
      };
    });

    return {
      entropyScore: calculateEntropy(data.tasks, data.members),
      feasibilityScore: calculateFeasibility(data.tasks, remainingHours),
      workloadDistribution,
      timeRemaining,
    };
  }, [data]);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = data.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    onUpdateData({ ...data, tasks: updatedTasks });
  };

  const handleAddTask = (newTask: Task) => {
    onUpdateData({ ...data, tasks: [...data.tasks, newTask] });
  };

  const handleShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          startTime={data.startTime} 
          durationHours={data.durationHours} 
          entropyScore={stats.entropyScore}
          feasibilityScore={stats.feasibilityScore}
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">{data.hackathonName}</h1>
                  <p className="text-zinc-500 mt-1">Real-time coordination analytics for {data.teamName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleShareLink}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-all"
                  >
                    <Share2 size={16} /> Share Team Link
                  </button>
                  <button 
                    onClick={() => setIsAddTaskOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              </div>

              <AnalyticsGrid stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Active Sprint Board</h2>
                    <button 
                      onClick={() => setActiveTab('kanban')}
                      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Full Board →
                    </button>
                  </div>
                  <KanbanBoard 
                    tasks={data.tasks} 
                    members={data.members} 
                    onTaskMove={handleTaskMove}
                    onTaskClick={setSelectedTask}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'kanban' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">Kanban Board</h1>
                  <p className="text-zinc-500 mt-1">Manage tasks and resolve coordination bottlenecks.</p>
                </div>
                <button 
                  onClick={() => setIsAddTaskOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus size={16} /> Add Task
                </button>
              </div>
              <KanbanBoard 
                tasks={data.tasks} 
                members={data.members} 
                onTaskMove={handleTaskMove}
                onTaskClick={setSelectedTask}
              />
            </motion.div>
          )}

          {activeTab === 'ai-sensei' && (
            <AISensei />
          )}

          {activeTab === 'team' && (
            <TeamOverview data={data} onUpdateData={onUpdateData} />
          )}
          
          {activeTab === 'risk' && (
            <div className="flex items-center justify-center h-full text-zinc-500">
              Risk Monitor component coming soon...
            </div>
          )}
        </main>
      </div>

      <TaskModal 
        task={selectedTask} 
        members={data.members} 
        onClose={() => setSelectedTask(null)} 
      />

      <TaskFormModal 
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAdd={handleAddTask}
        members={data.members}
      />

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[110] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm font-bold">Team link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
