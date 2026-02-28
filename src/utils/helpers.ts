import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateEntropy(tasks: any[], members: any[]) {
  // Mock logic for coordination entropy
  // Higher if: many dependencies, many in-progress tasks, workload imbalance
  const dependencyCount = tasks.reduce((acc, t) => acc + t.dependencies.length, 0);
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  
  const workload = members.map(m => {
    return tasks
      .filter(t => t.assigneeId === m.id)
      .reduce((acc, t) => acc + t.estimatedHours, 0);
  });
  
  const maxWorkload = Math.max(...workload, 1);
  const minWorkload = Math.min(...workload);
  const imbalance = (maxWorkload - minWorkload) / maxWorkload;

  const score = (dependencyCount * 5) + (inProgressCount * 10) + (imbalance * 30);
  return Math.min(Math.max(Math.round(score), 10), 95);
}

export function calculateFeasibility(tasks: any[], remainingHours: number) {
  const totalEffort = tasks
    .filter(t => t.status !== 'Completed')
    .reduce((acc, t) => acc + t.estimatedHours, 0);
  
  if (remainingHours <= 0) return 0;
  
  const ratio = totalEffort / (remainingHours * 4); // Assuming 4 parallel workers
  const score = 100 - (ratio * 50);
  return Math.min(Math.max(Math.round(score), 5), 98);
}
