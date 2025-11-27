import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, HeartHandshake, CalendarClock, ArrowRight } from 'lucide-react';
import { Routine, RoutineItem } from '../types';

const Dashboard: React.FC = () => {
  // Mock recent data retrieval
  const [todayRoutine, setTodayRoutine] = React.useState<RoutineItem[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('scholar_routines');
    if (saved) {
      const routines: Routine[] = JSON.parse(saved);
      if (routines.length > 0) {
        setTodayRoutine(routines[routines.length - 1].items.slice(0, 3));
      }
    }
  }, []);

  const features = [
    {
      title: "Exam Predictor",
      desc: "Upload PYQs to find high-yield questions.",
      path: "/pyq-analyzer",
      color: "bg-blue-100 text-blue-700",
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      title: "AI Tutor",
      desc: "Learn new topics from scratch.",
      path: "/tutor",
      color: "bg-emerald-100 text-emerald-700",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Counsellor",
      desc: "Share your feelings safely.",
      path: "/counsellor",
      color: "bg-rose-100 text-rose-700",
      icon: <HeartHandshake className="w-6 h-6" />
    },
    {
      title: "Routine Planner",
      desc: "Organize your life and study.",
      path: "/routine",
      color: "bg-amber-100 text-amber-700",
      icon: <CalendarClock className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back! Ready to achieve your goals today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Link 
            key={f.title} 
            to={f.path}
            className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
              {f.icon}
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{f.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Routine View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Today's Focus</h2>
            <Link to="/routine" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Full Routine</Link>
          </div>
          
          {todayRoutine.length > 0 ? (
            <div className="space-y-4">
              {todayRoutine.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-2 h-12 rounded-full ${
                    item.category === 'academic' ? 'bg-indigo-500' : 
                    item.category === 'health' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{item.activity}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-3">No routine set for today.</p>
              <Link to="/routine" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Create Routine</Link>
            </div>
          )}
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
          <div>
            <HeartHandshake className="w-10 h-10 mb-4 text-white/80" />
            <h2 className="text-xl font-bold mb-2">Need to talk?</h2>
            <p className="text-indigo-100 text-sm">
              Academic stress is real. Our AI Counsellor is here to listen to you, 24/7. No judgment, just support.
            </p>
          </div>
          <Link 
            to="/counsellor"
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-center text-sm font-semibold transition-colors"
          >
            Chat with Counsellor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;