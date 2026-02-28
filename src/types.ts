export type Role = 'Frontend' | 'Backend' | 'AI' | 'Design' | 'Full Stack';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  skillLevel: SkillLevel;
  avatar?: string;
  burnoutIndex: number; // 0-100
  workloadHours: number;
  completedHours: number;
}

export type TaskStatus = 'Backlog' | 'In Progress' | 'Reviewing' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  estimatedHours: number;
  dependencies: string[]; // IDs of other tasks
  riskScore: number; // 0-100
  coordinationImpact: number; // 0-100
  progress: number; // 0-100
  deadline?: string; // ISO string
}

export interface HackathonData {
  teamName: string;
  hackathonName: string;
  durationHours: number;
  startTime: string; // ISO string
  members: TeamMember[];
  tasks: Task[];
  featureDescription: string;
}

export interface DashboardStats {
  entropyScore: number;
  feasibilityScore: number;
  workloadDistribution: { name: string; hours: number; limit: number }[];
  timeRemaining: number; // seconds
}
