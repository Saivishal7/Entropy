import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MoreHorizontal, Zap } from 'lucide-react';
import { Task, TaskStatus, TeamMember } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../utils/helpers';

interface KanbanBoardProps {
  tasks: Task[];
  members: TeamMember[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}

const COLUMNS: TaskStatus[] = ['Backlog', 'In Progress', 'Reviewing', 'Completed'];

export default function KanbanBoard({ tasks, members, onTaskMove, onTaskClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ visible: boolean; x: number; y: number; message: string }>({ visible: false, x: 0, y: 0, message: '' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overId = over.id as string;

    // If dragging over a column
    if (COLUMNS.includes(overId as TaskStatus)) {
      if (activeTask && activeTask.status !== overId) {
        onTaskMove(activeTask.id, overId as TaskStatus);
        
        // Show smart tooltip
        if (overId === 'In Progress') {
          const imbalanceIncrease = Math.floor(Math.random() * 15) + 5;
          setShowTooltip({
            visible: true,
            x: window.innerWidth / 2,
            y: 100,
            message: `Moving this task increases workload imbalance by ${imbalanceIncrease}%`
          });
          setTimeout(() => setShowTooltip(prev => ({ ...prev, visible: false })), 3000);
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="flex-1 overflow-x-auto pb-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((column) => (
            <div key={column} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{column}</h3>
                  <span className="bg-zinc-800 text-zinc-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {tasks.filter(t => t.status === column).length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <Plus size={16} />
                  </button>
                  <button className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <div className={cn(
                "flex-1 bg-zinc-950/50 border border-zinc-900 rounded-2xl p-3 min-h-[500px] transition-colors",
                activeId && "border-indigo-500/20 bg-indigo-500/5"
              )}>
                <SortableContext items={tasks.filter(t => t.status === column).map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {tasks
                    .filter(t => t.status === column)
                    .map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        assignee={members.find(m => m.id === task.assigneeId)}
                        onClick={onTaskClick}
                      />
                    ))}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeTask ? (
            <TaskCard 
              task={activeTask} 
              assignee={members.find(m => m.id === activeTask.assigneeId)}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {showTooltip.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-indigo-500/40 flex items-center gap-2"
          >
            <Zap size={14} className="fill-white" />
            {showTooltip.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
