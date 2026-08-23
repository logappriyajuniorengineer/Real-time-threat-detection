import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, Lock, User, Search, RefreshCw, CheckCircle, XCircle, Loader, Database, TrendingUp, Activity, Users, Award, Target } from 'lucide-react';
import CISONavbar from './Navabar';

function TIODirectory() {
  const [operator, setOperator] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOperator({ ...operator, [name]: value });
  };

  const registerOperator = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setStatusMessage('');

    try {
      const response = await fetch('http://localhost:8082/api/admin/register/operator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operator)
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage(result.message || 'Threat Intelligence Operator registered successfully!');
        setStatusType('success');
        setOperator({ username: '', email: '', password: '' });
        await fetchAllUsers();
        
        setTimeout(() => {
          setStatusMessage('');
        }, 5000);
      } else {
        setStatusMessage(result.message || 'Registration failed.');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('Error connecting to server.');
      setStatusType('error');
    } finally {
      setIsRegistering(false);
    }
  };

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/admin/users');
      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      } else {
        setStatusMessage('Failed to load users');
        setStatusType('error');
      }
    } catch (error) {
      setStatusMessage('Error fetching users.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const tioOperators = users.threatOperators || [];
  
  const filteredOperators = tioOperators.filter(user => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <CISONavbar />
      <div className="pt-24"></div>
      
      <div className="container mx-auto px-6 py-12">
        
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-4xl font-black mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Threat Intelligence Operator Directory
          </h1>
          <p className="text-gray-600 text-xl font-medium">Manage and monitor TIO operator accounts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-emerald-200 hover:border-emerald-400 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Operators</p>
                <p className="text-4xl font-black text-emerald-600">{tioOperators.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-teal-200 hover:border-teal-400 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Active Today</p>
                <p className="text-4xl font-black text-teal-600">{tioOperators.length}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Success Rate</p>
                <p className="text-4xl font-black text-green-600">98%</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl sticky top-24 hover:border-emerald-400 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Register New TIO</h2>
                  <p className="text-gray-600 font-medium">Add threat intelligence operator</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={operator.username}
                    onChange={handleChange}
                    placeholder="Enter operator username"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={operator.email}
                    onChange={handleChange}
                    placeholder="operator@company.com"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={operator.password}
                    onChange={handleChange}
                    placeholder="Create secure password"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all font-medium"
                  />
                </div>

                <button
                  onClick={registerOperator}
                  disabled={isRegistering}
                  className="w-full py-5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isRegistering ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Registering Operator...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      Register TIO Operator
                    </>
                  )}
                </button>
              </div>

              {statusMessage && (
                <div className={`mt-6 p-5 rounded-xl flex items-start gap-4 animate-slide-in border-2 ${
                  statusType === 'success' 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-red-50 border-red-400'
                }`}>
                  {statusType === 'success' ? (
                    <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
                  )}
                  <div>
                    <p className={`font-bold mb-1 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {statusType === 'success' ? 'Success!' : 'Error'}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">{statusMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="lg:col-span-3">
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Registered TIO Operators</h2>
                    <p className="text-gray-600 font-medium">View and manage operator accounts</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAllUsers}
                  className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all transform hover:rotate-180 duration-500"
                >
                  <RefreshCw className="w-6 h-6 text-emerald-600" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search operators by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-gray-900 placeholder-gray-500 outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              {/* Operators List */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader className="w-16 h-16 animate-spin text-emerald-500 mb-6" />
                  <p className="text-gray-600 text-xl font-semibold">Loading operators...</p>
                </div>
              ) : filteredOperators.length === 0 ? (
                <div className="text-center py-32">
                  <div className="inline-flex items-center justify-center p-8 bg-emerald-50 rounded-3xl mb-6 border-2 border-emerald-200">
                    <Shield className="w-20 h-20 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-700 mb-3">No operators found</h3>
                  <p className="text-gray-500 text-lg font-medium">
                    {searchTerm ? 'Try adjusting your search terms' : 'Register your first TIO operator to get started'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredOperators.map((operator, index) => (
                    <div
                      key={`tio-${index}`}
                      className="group bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-gray-900">{operator.username}</h3>
                            <span className="px-4 py-1.5 bg-emerald-500 border border-emerald-600 rounded-xl text-xs font-black text-white shadow-lg">
                              TIO
                            </span>
                          </div>
                          <p className="text-gray-600 flex items-center gap-2 font-medium">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            {operator.email}
                          </p>
                        </div>
                        <div className="hidden md:block">
                          <div className="px-5 py-3 bg-green-100 border-2 border-green-400 rounded-xl">
                            <span className="text-sm font-black text-green-700 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(236, 253, 245, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10b981, #14b8a6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #059669, #0d9488);
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

export default TIODirectory;