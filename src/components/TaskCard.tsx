import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { Clock, Link2, AlertCircle, User } from 'lucide-react';
import { Task, TeamMember } from '../types';
import { cn } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  assignee?: TeamMember;
  onClick: (task: Task) => void;
  key?: string;
}

export default function TaskCard({ task, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const riskColor = task.riskScore < 30 ? 'bg-emerald-500' : task.riskScore < 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 transition-all group",
        isDragging && "z-50 shadow-2xl shadow-indigo-500/20"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
          {task.title}
        </h4>
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", riskColor)} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
          <Clock size={10} /> {task.estimatedHours}h
        </div>
        {task.dependencies.length > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            <Link2 size={10} /> {task.dependencies.length}
          </div>
        )}
        {task.coordinationImpact > 70 && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
            <AlertCircle size={10} /> High Impact
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {assignee?.avatar ? (
            <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full border border-zinc-700" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <User size={10} className="text-zinc-500" />
            </div>
          )}
          <span className="text-[10px] font-medium text-zinc-400">{assignee?.name || 'Unassigned'}</span>
        </div>
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
          AI Score: {task.coordinationImpact}
        </div>
      </div>
    </div>
  );
}
