import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PYQAnalyzer from './pages/PYQAnalyzer';
import AIChat from './pages/AIChat';
import RoutinePlanner from './pages/RoutinePlanner';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const savedUser = localStorage.getItem('scholar_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('scholar_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scholar_user');
  };

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        
        <Route 
          path="/*" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pyq-analyzer" element={<PYQAnalyzer />} />
                  <Route path="/tutor" element={<AIChat mode="tutor" />} />
                  <Route path="/counsellor" element={<AIChat mode="counsellor" />} />
                  <Route path="/routine" element={<RoutinePlanner />} />
                  <Route path="/reviews" element={<Reviews currentUser={user} />} />
                  <Route path="/profile" element={<Profile user={user} onUpdateUser={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;