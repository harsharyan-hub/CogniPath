import React, { useState, useEffect } from 'react';
import { generateRoutine } from '../services/geminiService';
import { Routine, RoutineItem, LoadingState } from '../types';
import { Calendar, CheckSquare, Plus, Loader2, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const RoutinePlanner: React.FC = () => {
  const [preferences, setPreferences] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  useEffect(() => {
    const saved = localStorage.getItem('scholar_routines');
    if (saved) {
      const parsed = JSON.parse(saved);
      setRoutines(parsed);
      if (parsed.length > 0) setCurrentRoutine(parsed[parsed.length - 1]);
    }
  }, []);

  const saveRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    localStorage.setItem('scholar_routines', JSON.stringify(newRoutines));
  };

  const handleGenerate = async () => {
    if (!preferences) return;
    setStatus(LoadingState.LOADING);
    try {
      const items = await generateRoutine(preferences);
      const newRoutine: Routine = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(),
        items
      };
      const updatedList = [...routines, newRoutine];
      saveRoutines(updatedList);
      setCurrentRoutine(newRoutine);
      setStatus(LoadingState.SUCCESS);
      setPreferences('');
    } catch (e) {
      console.error(e);
      setStatus(LoadingState.ERROR);
    }
  };

  const toggleItem = (idx: number) => {
    if (!currentRoutine) return;
    const updatedItems = [...currentRoutine.items];
    updatedItems[idx].completed = !updatedItems[idx].completed;
    
    const updatedRoutine = { ...currentRoutine, items: updatedItems };
    setCurrentRoutine(updatedRoutine);
    
    // Update in history
    const updatedList = routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r);
    saveRoutines(updatedList);
  };

  const getStats = () => {
    if (!currentRoutine) return [];
    const counts = { academic: 0, personal: 0, health: 0 };
    currentRoutine.items.forEach(i => {
      if (counts[i.category] !== undefined) counts[i.category]++;
    });
    return [
      { name: 'Academic', value: counts.academic, color: '#6366f1' },
      { name: 'Personal', value: counts.personal, color: '#f59e0b' },
      { name: 'Health', value: counts.health, color: '#10b981' },
    ];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Input & Stats Column */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            New Routine
          </h2>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="E.g., I have school from 8-3, need to study Math for 2 hours, want to go for a run, and relax in the evening."
            className="w-full h-32 p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
          />
          <button
            onClick={handleGenerate}
            disabled={status === LoadingState.LOADING || !preferences}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {status === LoadingState.LOADING ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            Generate Plan
          </button>
        </div>

        {currentRoutine && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px]">
            <h3 className="font-bold text-slate-900 mb-4">Time Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getStats()}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getStats().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"/> Academic</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> Personal</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Health</div>
            </div>
          </div>
        )}
      </div>

      {/* Routine Checklist Column */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full max-h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-600" />
            {currentRoutine ? `Your Routine` : "No Active Routine"}
          </h2>
          {currentRoutine && <span className="text-sm text-slate-500">{currentRoutine.date}</span>}
        </div>

        {currentRoutine ? (
          <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {currentRoutine.items.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`
                  group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                  ${item.completed 
                    ? 'bg-slate-50 border-slate-200 opacity-70' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                  ${item.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 group-hover:border-indigo-400'}
                `}>
                  {item.completed && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${item.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {item.activity}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium
                       ${item.category === 'academic' ? 'bg-indigo-50 text-indigo-600' : 
                         item.category === 'health' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                    `}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Calendar className="w-12 h-12 mb-4 opacity-20" />
            <p>Create a routine to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutinePlanner;