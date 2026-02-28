import React from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  Users, 
  ShieldAlert, 
  Settings, 
  ChevronRight,
  Zap,
  MessageSquare
} from 'lucide-react';
import { cn } from '../utils/helpers';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'kanban', label: 'Kanban Board', icon: Kanban },
  { id: 'ai-sensei', label: 'AI Sensei', icon: MessageSquare },
  { id: 'team', label: 'Team Overview', icon: Users },
  { id: 'risk', label: 'Risk Monitor', icon: ShieldAlert },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#0A0A0B] border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-white fill-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Entropy</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn(isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">AI Assistant</div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            "Workload imbalance detected for Sarah. Suggest reassigning Task #12 to Alex."
          </p>
          <button className="mt-3 w-full py-1.5 bg-indigo-500 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-400 transition-colors">
            Optimize Now
          </button>
        </div>
      </div>
    </aside>
  );
}
