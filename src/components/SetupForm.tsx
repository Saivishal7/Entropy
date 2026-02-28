import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Rocket, Users, Clock, Target } from 'lucide-react';
import { TeamMember, Role, SkillLevel, HackathonData } from '../types';
import { cn } from '../utils/helpers';

interface SetupFormProps {
  onComplete: (data: HackathonData) => void;
}

const ROLES: Role[] = ['Frontend', 'Backend', 'AI', 'Design', 'Full Stack'];
const SKILLS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export default function SetupForm({ onComplete }: SetupFormProps) {
  const [teamName, setTeamName] = useState('');
  const [hackathonName, setHackathonName] = useState('');
  const [duration, setDuration] = useState(24);
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [members, setMembers] = useState<Partial<TeamMember>[]>([
    { id: '1', name: '', role: 'Full Stack', skillLevel: 'Intermediate' }
  ]);
  const [featureDescription, setFeatureDescription] = useState('');

  const addMember = () => {
    setMembers([...members, { id: Math.random().toString(36).substr(2, 9), name: '', role: 'Full Stack', skillLevel: 'Intermediate' }]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      teamName,
      hackathonName,
      durationHours: duration,
      startTime: new Date(startTime).toISOString(),
      members: members as TeamMember[],
      tasks: [], // Will be generated or empty
      featureDescription,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Initialize Your Sprint
          </h1>
          <p className="text-zinc-400 text-lg">
            Set up your team and hackathon parameters to reduce coordination entropy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <Target size={20} />
              <h2 className="text-xl font-semibold text-white">Hackathon Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Team Name</label>
                <input 
                  required
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. Entropy Solvers"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Hackathon Name</label>
                <input 
                  required
                  type="text" 
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. AI Global Hack"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Duration (Hours)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    required
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Start Time</label>
                <input 
                  required
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Team Members */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-indigo-400">
                <Users size={20} />
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
              </div>
              <button 
                type="button"
                onClick={addMember}
                className="flex items-center gap-2 text-sm font-medium bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all"
              >
                <Plus size={16} /> Add Member
              </button>
            </div>
            
            <div className="space-y-4">
              {members.map((member, index) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50"
                >
                  <div className="md:col-span-5 space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</label>
                    <input 
                      required
                      type="text" 
                      value={member.name}
                      onChange={(e) => updateMember(member.id!, 'name', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Member Name"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</label>
                    <select 
                      value={member.role}
                      onChange={(e) => updateMember(member.id!, 'role', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Skill</label>
                    <select 
                      value={member.skillLevel}
                      onChange={(e) => updateMember(member.id!, 'skillLevel', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => removeMember(member.id!)}
                      disabled={members.length === 1}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Feature Input */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <Rocket size={20} />
              <h2 className="text-xl font-semibold text-white">Feature Concept</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Describe the feature or product idea</label>
              <textarea 
                required
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                placeholder="What are you building? Our AI will generate a structured sprint plan based on this description."
              />
            </div>
          </section>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 text-lg group"
          >
            🚀 Generate Sprint Plan
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Rocket size={20} className="group-hover:rotate-12 transition-transform" />
            </motion.span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
