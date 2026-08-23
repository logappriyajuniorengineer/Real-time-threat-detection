import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Cloud, Upload, BarChart3, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CISONavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/cisoDB', icon: Home },
    { label: 'TIODirectory', path: '/cisodct', icon: Cloud },
    { label: 'SecurityAnalystDirectory', path: '/cisosadct', icon: Upload },
    { label: 'Analytics&Alerts', path: '/ctisAI', icon: BarChart3 },
  ];
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    setMenuOpen(false);
  };
  const location = useLocation();
  const isActive = (path) => location.pathname === path; 

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrollY > 50 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-200' 
            : 'bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-emerald-50/90 backdrop-blur-md'
        }`}
        style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div 
              className="flex items-center gap-3 group cursor-pointer transform transition-all duration-300 hover:scale-105" 
              onClick={() => handleNavigation('/cisoDB')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-300"></div>
                <img 
                  src='Logo1.png' 
                  className="w-11 h-11 relative z-10 rounded-xl shadow-lg ring-2 ring-emerald-400/40 group-hover:ring-emerald-500/60 transition-all duration-300 object-cover" 
                  alt="ThreatSense Logo"
                />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent tracking-tight">
                  ThreatSense
                </span>
                <p className="text-xs text-emerald-600 font-semibold tracking-wide">CISO Command Center</p>
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
                        ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                        : scrollY > 50
                          ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-white/60'
                    }`}
                  >
                    {isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur-sm"></div>
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
                className="ml-3 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-105"
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
                  ? 'bg-emerald-500/20 text-emerald-600' 
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 mt-2 space-y-2 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200 p-4 animate-slideDown">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3 shadow-lg mt-3"
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
    </>
  );
};

export default CISONavbar;