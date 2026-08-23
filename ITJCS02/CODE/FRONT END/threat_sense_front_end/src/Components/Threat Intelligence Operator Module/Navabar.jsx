import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Database, Cloud, BarChart3, LogOut, Home, Upload } from 'lucide-react';


const TIONavbar = () => {
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
    { label: 'Home', path: '/tioDB', icon: Home },
    { label: 'Collect Data', path: '/tioCD', icon: Cloud },
    { label: 'Submit Data', path: '/tioSD', icon: Upload },
    { label: 'Analytics', path: '/tioAI', icon: BarChart3 },
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
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-orange-200' 
          : 'bg-gradient-to-r from-orange-50/90 via-amber-50/90 to-orange-50/90 backdrop-blur-md'
      }`}
      style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105" 
            onClick={() => handleNavigation('/tioDB')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400/30 blur-xl rounded-full group-hover:bg-orange-500/40 transition-all duration-300"></div>
              <div className="w-11 h-11 relative z-10 rounded-xl shadow-lg flex items-center justify-center">
                <img src='Logo1.png' className="w-10 h-10 text-white" style={{borderRadius:"10px"}} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                ThreatSense
              </span>
              <p className="text-xs text-orange-600 font-semibold tracking-wide">TIO Operator Module</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 group ${
                    isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30'
                      : scrollY > 50
                        ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-white/60'
                  }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-xl blur-sm"></div>
                  )}
                  <Icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive(item.path) ? 'text-white' : 'group-hover:scale-110'}`} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  )}
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="ml-3 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2.5 rounded-lg transition-all duration-300 ${
              menuOpen 
                ? 'bg-orange-500/20 text-orange-600' 
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
            }`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 mt-2 space-y-2 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200 p-4 animate-slideDown">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3 shadow-lg mt-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default TIONavbar;