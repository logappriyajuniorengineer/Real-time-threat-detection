import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Database, Cloud, BarChart3, LogOut, Home, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SANavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/saDB', icon: Home },
    { label: 'View Data', path: '/saCD', icon: Cloud },
    { label: 'Analyze Data', path: '/saSD', icon: Upload },
    { label: 'Analytics', path: '/saAI', icon: BarChart3 },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/95 backdrop-blur shadow-2xl border-b border-purple-500/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/ctiDB')}>
            <div className="p-2">
              <img src='/Logo1.png' className="w-10 h-10 text-white" style={{borderRadius:"10px"}} />
            </div>
            <div>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">ThreatSense</span>
                <p className="text-xs text-purple-400 font-semibold">Security Analyst Module</p>
              </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                      : scrollY > 50
                        ? 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10'
                        : 'text-gray-200 hover:text-purple-300'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg font-semibold transition flex items-center gap-2 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-purple-500 hover:bg-purple-500/10 p-2 rounded"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-gray-900/95 rounded-lg shadow-lg border border-purple-600/20">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-purple-500/20 text-purple-400 border-l-2 border-purple-500'
                    : 'text-gray-300 hover:bg-purple-500/10 hover:text-purple-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
    </div>
  );
};

export default SANavbar;