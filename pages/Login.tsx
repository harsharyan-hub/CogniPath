import React, { useState } from 'react';
import { User } from '../types';
import { Loader2, X } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  const handleGoogleBtnClick = () => {
    setShowGoogleModal(true);
  };

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.email || !formData.name) return;

    setIsLoading(true);

    // Simulate API delay for authentication
    setTimeout(() => {
        const newUser: User = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            // Use a deterministic avatar service based on the name
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(formData.name)}`,
            grade: 'Student',
            bio: 'Ready to achieve academic excellence.'
        };
        onLogin(newUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 p-4 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
       </div>

      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 border border-white/50 transition-all duration-300">
        
        {!showGoogleModal ? (
            <>
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to CogniPath</h1>
                <p className="text-slate-600 mb-8">Your intelligent partner for academic excellence and personal growth.</p>

                <button
                onClick={handleGoogleBtnClick}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md group"
                >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Continue with Google
                </button>
                
                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
                    <span>•</span>
                    <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
                </div>
            </>
        ) : (
            <div className="animate-in fade-in zoom-in duration-300">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Sign in with Google</h2>
                    <button onClick={() => setShowGoogleModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                 </div>

                 {isLoading ? (
                     <div className="py-12 flex flex-col items-center justify-center">
                         <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                         <p className="text-slate-600 font-medium">Authenticating...</p>
                     </div>
                 ) : (
                    <form onSubmit={handleSimulatedLogin} className="space-y-4 text-left">
                        <div className="p-4 bg-blue-50 text-blue-800 text-xs rounded-lg mb-4 leading-relaxed">
                            <strong>Note:</strong> In this demo environment, we simulate the Google Login. Please enter your details below to create your account profile.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="name@gmail.com"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Your Name"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors mt-2"
                        >
                            Continue
                        </button>
                    </form>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Login;