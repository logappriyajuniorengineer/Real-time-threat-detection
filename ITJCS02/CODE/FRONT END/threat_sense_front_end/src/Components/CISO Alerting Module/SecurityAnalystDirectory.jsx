import React, { useState, useEffect } from 'react';
import { UserPlus, Eye, Mail, Lock, User, Search, RefreshCw, CheckCircle, XCircle, Loader, Shield, TrendingUp, Activity, AlertCircle, Users, Award, Target, BarChart2, Zap, Clock, CheckSquare } from 'lucide-react';
import CISONavbar from './Navabar';

function SecurityAnalystDirectory() {
  const [analysts, setAnalysts] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'SECURITY_ANALYST',
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalysts();
  }, []);

  const fetchAnalysts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/admin/analysts');
      const data = await response.json();
      setAnalysts(data.securityAnalysts || []);
      setStatus('Security analysts loaded successfully');
      setStatusType('success');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Failed to fetch security analysts: ' + error.message);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:8082/api/admin/register/analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus('Registered successfully: ' + result.message);
        setStatusType('success');
        setFormData({ username: '', email: '', password: '', role: 'SECURITY_ANALYST' });
        await fetchAnalysts();
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('Registration failed: ' + result.message);
        setStatusType('error');
      }
    } catch (error) {
      setStatus('Registration failed: ' + error.message);
      setStatusType('error');
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredAnalysts = analysts.filter(analyst => {
    return analyst.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           analyst.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <CISONavbar />
      <div className="pt-24"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-4xl font-black mb-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
            Security Analyst Directory
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">Manage and monitor security analyst accounts</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 rounded-lg">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Total Analysts</p>
                <p className="text-2xl font-black text-teal-600">{analysts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-emerald-500 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Active Now</p>
                <p className="text-2xl font-black text-emerald-600">{analysts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Analyzed</p>
                <p className="text-2xl font-black text-green-600">847</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-cyan-500 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-100 rounded-lg">
                <Award className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Accuracy</p>
                <p className="text-2xl font-black text-cyan-600">96%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Registration Form - Card Style */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-xl hover:border-teal-400 transition-all sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Register Analyst</h2>
                  <p className="text-xs text-gray-600 font-medium">Add new account</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-teal-50 border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="analyst@company.com"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-teal-50 border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-teal-50 border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-sm rounded-lg shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isRegistering ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Register Analyst
                    </>
                  )}
                </button>
              </div>

              {status && (
                <div className={`mt-5 p-4 rounded-lg flex items-start gap-3 animate-slide-in border-2 ${
                  statusType === 'success' 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-red-50 border-red-400'
                }`}>
                  {statusType === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className={`font-bold mb-1 text-sm ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {statusType === 'success' ? 'Success!' : 'Error'}
                    </p>
                    <p className="text-xs text-gray-700 font-medium">{status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analysts List - Table Style Design */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-teal-200 rounded-2xl p-6 shadow-xl hover:border-teal-400 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Registered Analysts</h2>
                    <p className="text-xs text-gray-600 font-medium">View and manage accounts</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAnalysts}
                  className="p-2.5 bg-teal-100 hover:bg-teal-200 rounded-lg transition-all transform hover:rotate-180 duration-500"
                >
                  <RefreshCw className="w-5 h-5 text-teal-600" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-lg bg-teal-50 border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Analysts Table */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader className="w-12 h-12 animate-spin text-teal-500 mb-4" />
                  <p className="text-gray-600 text-base font-semibold">Loading analysts...</p>
                </div>
              ) : filteredAnalysts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center p-6 bg-teal-50 rounded-2xl mb-4 border-2 border-teal-200">
                    <AlertCircle className="w-16 h-16 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-black text-gray-700 mb-2">No analysts found</h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {searchTerm ? 'Try adjusting your search terms' : 'Register your first analyst to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredAnalysts.map((analyst) => (
                    <div
                      key={analyst.id}
                      className="group bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border-2 border-teal-200 hover:border-teal-400 rounded-xl p-4 transition-all transform hover:scale-[1.01] hover:shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-base font-black text-gray-900 truncate">{analyst.username}</h3>
                            <span className="px-2.5 py-0.5 bg-teal-500 rounded-lg text-xs font-black text-white shadow-sm flex-shrink-0">
                              ANALYST
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium truncate">
                              <Mail className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                              <span className="truncate">{analyst.email}</span>
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                              <Shield className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                              ID: {analyst.id}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block flex-shrink-0">
                          <div className="px-3 py-2 bg-green-100 border-2 border-green-400 rounded-lg">
                            <span className="text-xs font-black text-green-700 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards - Different from TIO */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border-2 border-teal-200 hover:border-teal-400 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-teal-600" />
              <h3 className="text-sm font-black text-gray-900">Secure Access</h3>
            </div>
            <p className="text-xs text-gray-700 font-medium">Encrypted authentication system</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-black text-gray-900">24/7 Monitoring</h3>
            </div>
            <p className="text-xs text-gray-700 font-medium">Continuous threat surveillance</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-green-200 hover:border-green-400 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="w-6 h-6 text-green-600" />
              <h3 className="text-sm font-black text-gray-900">Verified Teams</h3>
            </div>
            <p className="text-xs text-gray-700 font-medium">Certified security professionals</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-cyan-200 hover:border-cyan-400 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-cyan-600" />
              <h3 className="text-sm font-black text-gray-900">Rapid Response</h3>
            </div>
            <p className="text-xs text-gray-700 font-medium">Instant threat mitigation</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(204, 251, 241, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #14b8a6, #10b981);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0d9488, #059669);
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SecurityAnalystDirectory;