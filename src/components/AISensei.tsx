import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../utils/helpers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AISensei() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Greetings, hackathon warrior. I am your AI Sensei. How can I help you navigate the chaos of your sprint today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMessage].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are 'AI Sensei', a wise, slightly witty, and highly technical hackathon mentor. Your goal is to help users with coding problems, architecture decisions, and managing hackathon stress. Keep responses concise and actionable.",
        }
      });

      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.text || "I apologize, my circuits are momentarily tangled. Could you repeat that?" 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Sensei Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "The digital ether is unstable. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full max-w-4xl mx-auto bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Sensei</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              <Sparkles size={10} /> Online & Ready
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                m.role === 'user' ? "bg-zinc-800" : "bg-indigo-600"
              )}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-zinc-800 text-zinc-200 rounded-tr-none" 
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-zinc-900/80 border-t border-zinc-800">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your Sensei anything..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-6 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-zinc-500 text-center">
          AI Sensei can make mistakes. Verify critical architecture decisions.
        </p>
      </div>
    </motion.div>
  );
}
