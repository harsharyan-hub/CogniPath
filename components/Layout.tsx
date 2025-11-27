import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  HeartHandshake, 
  CalendarClock, 
  Star, 
  LogOut,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/pyq-analyzer', label: 'Exam Predictor', icon: <GraduationCap className="w-5 h-5" /> },
    { path: '/tutor', label: 'AI Tutor', icon: <BookOpen className="w-5 h-5" /> }, // Reusing icon for simplicity
    { path: '/counsellor', label: 'Counsellor', icon: <HeartHandshake className="w-5 h-5" /> },
    { path: '/routine', label: 'Routine Planner', icon: <CalendarClock className="w-5 h-5" /> },
    { path: '/reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
    { path: '/profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-40 w-64 h-full bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              CogniPath
            </h1>
            <p className="text-xs text-slate-500 mt-1">AI Academic Companion</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive(item.path) 
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <Link to="/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-slate-50 rounded-lg p-2 transition-colors">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;