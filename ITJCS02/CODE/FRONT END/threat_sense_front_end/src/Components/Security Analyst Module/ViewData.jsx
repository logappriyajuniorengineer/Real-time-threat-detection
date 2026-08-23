import React, { useEffect, useState } from "react";
import SANavbar from "./Navabar";
import { Search, ExternalLink, AlertCircle, CheckCircle, Clock, TrendingUp, Filter, Newspaper, Globe, Shield } from 'lucide-react';

const sourceMap = {
  'CSO Online': { 
    color: 'from-purple-600 to-purple-700', 
    icon: Shield, 
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40' 
  },
  'BleepingComputer': { 
    color: 'from-pink-600 to-pink-700', 
    icon: Newspaper, 
    badge: 'bg-pink-500/20 text-pink-400 border-pink-500/40' 
  },
  'The Hacker News': { 
    color: 'from-fuchsia-600 to-fuchsia-700', 
    icon: Globe, 
    badge: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40' 
  }
};

function SAViewData() {
  const analystEmail = sessionStorage.getItem("analystEmail");
  const [threatData, setThreatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  useEffect(() => {
    const fetchThreatData = async () => {
      try {
        const encodedEmail = encodeURIComponent(analystEmail);
        const response = await fetch(
          `http://localhost:8082/api/admin/getDataForAnalyst/${encodedEmail}`
        );

        if (!response.ok) {
          const errText = await response.text();
          setError(errText || "Failed to fetch data.");
          setThreatData([]);
          return;
        }

        const data = await response.json();
        setThreatData(data);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (analystEmail) {
      fetchThreatData();
    } else {
      setError("No analyst email found in session.");
      setLoading(false);
    }
  }, [analystEmail]);

  // Filter by search and source
  const filteredData = threatData.filter((item) => {
    const matchesSearch = item.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tioSenderEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = selectedSource === "all" || item.source === selectedSource;
    
    return matchesSearch && matchesSource;
  });

  // Group data by source
  const groupedData = filteredData.reduce((acc, item) => {
    const source = item.source || 'Unknown';
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(item);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'pending') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    if (statusLower === 'completed') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (statusLower === 'in progress') return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  };

  const sourceStats = Object.keys(sourceMap).map(source => ({
    name: source,
    count: threatData.filter(item => item.source === source).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <SANavbar />

      <div className="pt-28 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Threat Intelligence Feed
              </h1>
              <p className="text-gray-400 font-medium mt-1">Real-time threat monitoring across multiple sources</p>
            </div>
          </div>

          {/* Source Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">Total Threats</p>
                  <p className="text-3xl font-black text-purple-400">{threatData.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
            
            {sourceStats.map((stat, idx) => {
              const sourceConfig = sourceMap[stat.name];
              const Icon = sourceConfig?.icon || Globe;
              return (
                <div key={idx} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-semibold mb-1 truncate">{stat.name}</p>
                      <p className="text-3xl font-black text-pink-400">{stat.count}</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-pink-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter Bar */}
        {!loading && !error && threatData.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search threats by headline, source, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/60 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition font-medium"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="pl-12 pr-8 py-4 bg-slate-800/60 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition font-medium appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">All Sources</option>
                {Object.keys(sourceMap).map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300 font-medium">Loading threat intelligence...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Timeline View - Grouped by Source */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedData).map(([source, threats]) => {
              const sourceConfig = sourceMap[source] || { 
                color: 'from-gray-600 to-gray-700', 
                icon: Globe, 
                badge: 'bg-gray-500/20 text-gray-400 border-gray-500/40' 
              };
              const Icon = sourceConfig.icon;

              return (
                <div key={source} className="relative">
                  {/* Source Header */}
                  <div className="sticky top-24 z-10 mb-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${sourceConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white">{source}</h2>
                          <p className="text-gray-400 text-sm font-semibold">{threats.length} threat{threats.length !== 1 ? 's' : ''} detected</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${sourceConfig.badge}`}>
                        Active Feed
                      </span>
                    </div>
                  </div>

                  {/* Timeline Items */}
                  <div className="relative ml-8 space-y-6">
                    {/* Vertical Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${sourceConfig.color} opacity-30`}></div>

                    {threats.map((threat, idx) => (
                      <div key={threat.id || idx} className="relative group">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[19px] top-6 w-10 h-10 bg-gradient-to-br ${sourceConfig.color} rounded-full flex items-center justify-center shadow-lg border-4 border-slate-950 group-hover:scale-110 transition-transform duration-300`}>
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>

                        {/* Threat Content */}
                        <div className="ml-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group-hover:translate-x-2">
                          {/* Threat Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 pr-4">
                              <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-purple-300 transition">
                                {threat.headline}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(threat.status)}`}>
                                  {threat.status}
                                </span>
                                <span className="text-gray-500 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Assigned to: <span className="text-gray-400 font-semibold">{threat.tioSenderEmail}</span>
                                </span>
                              </div>
                            </div>
                            <a
                              href={threat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${sourceConfig.color} hover:opacity-90 text-white rounded-lg font-bold transition transform hover:scale-105 shadow-lg text-sm whitespace-nowrap`}
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Threat
                            </a>
                          </div>

                          {/* Threat Metadata */}
                          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-gray-500 font-semibold">Source:</span>
                              <span className="text-xs font-bold text-gray-300">{threat.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-pink-400" />
                              <span className="text-xs text-gray-500 font-semibold">ID:</span>
                              <span className="text-xs font-bold text-gray-300">#{threat.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State - No Search Results */}
        {!loading && !error && filteredData.length === 0 && threatData.length > 0 && (
          <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No matching threats found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Empty State - No Data */}
        {!loading && !error && threatData.length === 0 && (
          <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-12 text-center">
            <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No threat data assigned yet</h3>
            <p className="text-gray-500">Check back later for new threat assignments</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SAViewData;