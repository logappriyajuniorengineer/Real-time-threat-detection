import React, { useEffect, useState } from "react";
import SANavbar from "./Navabar";
import { AlertTriangle, CheckCircle, ExternalLink, Zap, Clock, Shield, Target, TrendingUp, Activity } from 'lucide-react';

const sourceMap = {
  cso: "CSO Online",
  bleeping: "BleepingComputer",
  hackernews: "The Hacker News",
};

function SAViewDataAnalysis() {
  const analystEmail = sessionStorage.getItem("analystEmail");
  const [threatData, setThreatData] = useState([]);
  const [activeTab, setActiveTab] = useState("cso");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all threats for this analyst
  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedEmail = encodeURIComponent(analystEmail);
        const response = await fetch(
          `http://localhost:8082/api/admin/getDataForAnalyst/${encodedEmail}`
        );

        if (!response.ok) {
          const errText = await response.text();
          setError(errText || "Failed to fetch data");
          return;
        }

        const data = await response.json();
        setThreatData(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (analystEmail) fetchData();
  }, [analystEmail]);

  // Filter data by source (tab)
  const filteredData = threatData.filter(
    (item) => item.source === sourceMap[activeTab]
  );

  // Handle "Analyze Now" button
  const handleAnalyzeNow = async () => {
    setAnalyzing(true);
    try {
      const encodedEmail = encodeURIComponent(analystEmail);
      const encodedSource = encodeURIComponent(sourceMap[activeTab]);

      const response = await fetch(
        `http://localhost:8082/api/analyst/analyzeData/${encodedEmail}/${encodedSource}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        alert(`Analysis failed: ${errMsg}`);
        return;
      }

      const updatedData = await response.json();
      setThreatData((prev) => {
        // Replace updated items in local state
        const updatedIds = updatedData.map((d) => d.id);
        return prev.map((item) =>
          updatedIds.includes(item.id)
            ? updatedData.find((u) => u.id === item.id)
            : item
        );
      });

      alert("✅ Analysis completed successfully!");
    } catch (error) {
      console.error("Error analyzing:", error);
      alert("Error analyzing data.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === "High") return "from-red-600 to-rose-600";
    if (severity === "Medium") return "from-yellow-600 to-amber-600";
    if (severity === "Low") return "from-emerald-600 to-green-600";
    return "from-gray-600 to-slate-600";
  };

  const getSeverityBadge = (severity) => {
    if (severity === "High") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (severity === "Medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (severity === "Low") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getThreatIcon = (severity) => {
    if (severity === "High") return <AlertTriangle className="w-5 h-5" />;
    if (severity === "Medium") return <Shield className="w-5 h-5" />;
    if (severity === "Low") return <CheckCircle className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <SANavbar />

      <div className="pt-28 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Threat Analysis Dashboard
              </h1>
              <p className="text-gray-400 font-medium mt-1">Analyze and classify cybersecurity threats in real-time</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">Total Threats</p>
                  <p className="text-3xl font-black text-purple-400">{filteredData.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">High Severity</p>
                  <p className="text-3xl font-black text-red-400">
                    {filteredData.filter(t => t.severityLevel === "High").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">Medium Severity</p>
                  <p className="text-3xl font-black text-yellow-400">
                    {filteredData.filter(t => t.severityLevel === "Medium").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-5 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">Low Severity</p>
                  <p className="text-3xl font-black text-emerald-400">
                    {filteredData.filter(t => t.severityLevel === "Low").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Source Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-xl border border-purple-500/20">
            {Object.keys(sourceMap).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                    : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300"
                }`}
              >
                {sourceMap[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300 font-medium">Loading threat data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Threat Cards Display */}
        {!loading && !error && filteredData.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Severity Indicator Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getSeverityColor(item.severityLevel)}`}></div>

                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getSeverityColor(item.severityLevel)} flex items-center justify-center`}>
                        {getThreatIcon(item.severityLevel)}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(item.severityLevel)}`}>
                          {item.severityLevel || "Unclassified"}
                        </span>
                      </div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition group-hover:scale-110"
                    >
                      <ExternalLink className="w-5 h-5 text-purple-400" />
                    </a>
                  </div>

                  {/* Headline */}
                  <h3 className="text-lg font-bold text-white mb-4 leading-snug group-hover:text-purple-300 transition line-clamp-2">
                    {item.headline}
                  </h3>

                  {/* Threat Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Threat Nature</p>
                      <p className={`text-sm font-bold ${
                        item.threatNature === "Malicious" ? "text-red-400" : "text-emerald-400"
                      }`}>
                        {item.threatNature || "—"}
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Threat Type</p>
                      <p className="text-sm font-bold text-gray-300">
                        {item.threatType || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500 font-medium">Status:</span>
                      <span className="text-xs font-bold text-purple-400">{item.status || "Pending"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-400 font-medium">{sourceMap[activeTab]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analyze Button - Positioned Below Cards */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleAnalyzeNow}
                disabled={analyzing}
                className={`group relative px-10 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center gap-3 ${
                  analyzing
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transform hover:scale-105"
                }`}
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze {sourceMap[activeTab]} Threats
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* No Data */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-12 text-center">
            <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No threats found</h3>
            <p className="text-gray-500">No data available for {sourceMap[activeTab]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SAViewDataAnalysis;