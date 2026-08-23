import React, { useState } from 'react';
import { Shield, UserCog, Network, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [activeTab, setActiveTab] = useState('ciso');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const tabs = [
    { 
      id: 'ciso', 
      label: 'CISO', 
      icon: Shield, 
      color: 'from-purple-600 to-blue-600', 
      accent: 'bg-purple-500',
      bgImage: 'https://t4.ftcdn.net/jpg/04/60/71/01/360_F_460710131_YkD6NsivdyYsHupNvO3Y8MPEwxTAhORh.jpg'
    },
    { 
      id: 'analyst', 
      label: 'Security Analyst', 
      icon: UserCog, 
      color: 'from-cyan-600 to-teal-600', 
      accent: 'bg-cyan-500',
      bgImage: 'https://media.istockphoto.com/id/1271787791/photo/login-and-password-cyber-security-concept-data-protection-and-secured-internet-access.webp?a=1&b=1&s=612x612&w=0&k=20&c=7IHvw-AWNsOqgVeGgJudXcCWh6wIeUZymN03HeStF4s='
    },
    { 
      id: 'tio', 
      label: 'TIO', 
      icon: Network, 
      color: 'from-orange-600 to-red-600', 
      accent: 'bg-orange-500',
      bgImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (activeTab === 'ciso') {
        
        if (formData.email === 'cisoof@gmail.com' && formData.password === '123') {
          setSuccess('CISO Login Successful!');
          setTimeout(() => {
            navigate('/cisoDB');
          }, 1000);
        } else {
          setError('Invalid CISO credentials. Please try again.');
        }
      } else if (activeTab === 'analyst') {
        
        const params = new URLSearchParams({
          email: formData.email,
          password: formData.password
        });

        const response = await fetch(`http://localhost:8082/api/admin/login?${params}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          if (data.role === 'SECURITY_ANALYST') {
           
            sessionStorage.setItem('analystEmail', formData.email);
            sessionStorage.setItem('userRole', 'SECURITY_ANALYST');
            
            setSuccess('Security Analyst Login Successful!');
            console.log('Login response:', data);
            
            setTimeout(() => {
              navigate('/saDB');
            }, 1000);
          } else {
            setError('Access denied. This login is for Security Analysts only.');
          }
        } else {
          setError(data.message || 'Invalid credentials. Please check your email and password.');
        }
      } else if (activeTab === 'tio') {
        // TIO API call
        const params = new URLSearchParams({
          email: formData.email,
          password: formData.password
        });

        const response = await fetch(`http://localhost:8082/api/admin/login?${params}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          if (data.role === 'THREAT_INTELLIGENCE_OPERATOR') {
            sessionStorage.setItem('tioEmail', formData.email);
            sessionStorage.setItem('userRole', 'THREAT_INTELLIGENCE_OPERATOR');
            
            setSuccess('TIO Login Successful!');
            console.log('Login response:', data);
            
            setTimeout(() => {
              navigate('/tioDB');
            }, 1000);
          } else {
            setError('Access denied. This login is for TIO only.');
          }
        } else {
          setError(data.message || 'Invalid credentials. Please check your email and password.');
        }
      }
    } catch (err) {
      setError('Connection failed. Please check if the server is running on port 8082.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-5xl">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative p-12 flex flex-col justify-center items-center text-white overflow-hidden min-h-[600px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeTabData.bgImage})` }}
              ></div>
              <div className="absolute inset-0 bg-black/40"></div>
              
              <div className="relative z-10 text-center">
                {React.createElement(activeTabData.icon, { 
                  className: "w-24 h-24 mb-6 animate-float drop-shadow-2xl",
                  strokeWidth: 1.5 
                })}
                <h2 className="text-4xl font-bold mb-4 drop-shadow-2xl">{activeTabData.label}</h2>
                <p className="text-lg mb-8 drop-shadow-lg">
                  {activeTab === 'ciso' && 'Chief Information Security Officer Portal'}
                  {activeTab === 'analyst' && 'Security Operations Dashboard'}
                  {activeTab === 'tio' && 'Technology Infrastructure Oversight'}
                </p>
                <div className="flex flex-col gap-4 text-sm bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-white rounded-full shadow-lg`}></div>
                    <span className="drop-shadow-lg">Secure Authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-white rounded-full shadow-lg`}></div>
                    <span className="drop-shadow-lg">Real-time Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-white rounded-full shadow-lg`}></div>
                    <span className="drop-shadow-lg">Advanced Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-slate-800/50">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-400">Select your role and sign in to continue</p>
              </div>

              <div className="flex gap-2 mb-8 p-1 bg-slate-900/50 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                      setSuccess('');
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {React.createElement(tab.icon, { className: "w-4 h-4" })}
                      <span className="hidden sm:inline text-xs">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold text-sm mb-1">Login Failed</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-start gap-3 animate-slide-down">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold text-sm mb-1">Success!</p>
                    <p className="text-green-300 text-sm">{success}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

               

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 px-6 bg-gradient-to-r ${activeTabData.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In as {activeTabData.label}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                  Need access? <button type="button" className="text-white hover:underline">Contact Administrator</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;