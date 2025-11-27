import React, { useState } from 'react';
import { User } from '../types';
import { Save, User as UserIcon, Book, Target, Mail } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 mt-2">Manage your personal information and academic goals.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header/Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative -top-12 mb-[-3rem] flex justify-between items-end">
             <div className="relative">
               <img 
                 src={formData.avatar} 
                 alt={formData.name} 
                 className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover"
               />
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Managed by Google Login</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Book className="w-4 h-4 text-slate-400" /> Grade / Year
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade || ''}
                  onChange={handleChange}
                  placeholder="e.g. 12th Grade, Sophomore"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" /> Academic Goal
                </label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal || ''}
                  onChange={handleChange}
                  placeholder="e.g. Score 95% in Finals"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself..."
                className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                {isSaved && (
                  <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 animate-fade-in">
                    Saved successfully!
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;