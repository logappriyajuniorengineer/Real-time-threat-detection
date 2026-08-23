import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Activity, Shield, Users, AlertTriangle, BarChart3, Target, Clock, CheckCircle, Calendar } from 'lucide-react';
import CISONavbar from "./Navabar";

function AnalyticsAndAlerts() {
  const [activeTab, setActiveTab] = useState("Analytics");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    bySource: {},
    bySeverity: {},
    byThreatType: {},
    byThreatNature: {},
    byAnalyst: {},
    recentActivity: [],
  });

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNewsData = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/data/all");
      const data = await response.json();
      const verifiedData = data.filter((item) => item.status === "Verification Completed");
      setNewsData(verifiedData);
      calculateStats(verifiedData);
    } catch (error) {
      console.error("Error fetching news data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const bySource = {};
    const bySeverity = {};
    const byThreatType = {};
    const byThreatNature = {};
    const byAnalyst = {};

    data.forEach((item) => {
      bySource[item.source] = (bySource[item.source] || 0) + 1;
      const severity = item.severityLevel || "Unknown";
      bySeverity[severity] = (bySeverity[severity] || 0) + 1;
      const threatType = item.threatType || "Unknown";
      byThreatType[threatType] = (byThreatType[threatType] || 0) + 1;
      const threatNature = item.threatNature || "Unknown";
      byThreatNature[threatNature] = (byThreatNature[threatNature] || 0) + 1;
      if (item.securityAnalystEmail) {
        byAnalyst[item.securityAnalystEmail] = (byAnalyst[item.securityAnalystEmail] || 0) + 1;
      }
    });

    const recentActivity = data.sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt)).slice(0, 10);

    setStats({
      total: data.length,
      bySource,
      bySeverity,
      byThreatType,
      byThreatNature,
      byAnalyst,
      recentActivity,
    });
  };

  const COLORS = {
    "CSO Online": "#14b8a6",
    BleepingComputer: "#10b981",
    "The Hacker News": "#059669",
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
    Unknown: "#94a3b8",
    Benign: "#10b981",
  };

  const sourceChartData = Object.entries(stats.bySource).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] || "#14b8a6",
  }));

  const severityChartData = Object.entries(stats.bySeverity).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] || "#94a3b8",
  }));

  const threatTypeData = Object.entries(stats.byThreatType).map(([name, count]) => ({
    name,
    count,
  }));

  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleFetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (startDate === endDate) {
      setError("Start date and end date must be different.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `http://localhost:8082/api/emergta/predict?startDate=${startDate}&endDate=${endDate}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to fetch report");

      const data = await response.json();
      console.log("Emerging Threat Report:", data);
      alert("Report generated successfully!");
      setShowPopup(false);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err);
      setError("Error fetching report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <CISONavbar />
      <div className="pt-24"></div>

      <div className="px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-3xl font-black text-gray-900">Security Analytics & Alerts</h1>
              <p className="text-sm text-gray-600 font-medium">Real-time cybersecurity intelligence and threat monitoring</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit shadow-md border-2 border-teal-200">
          <button
            onClick={() => setActiveTab("Analytics")}
            className={`px-6 py-2.5 font-bold text-sm transition-all duration-300 rounded-lg ${activeTab === "Analytics"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab("Alerts")}
            className={`px-6 py-2.5 font-bold text-sm transition-all duration-300 rounded-lg ${activeTab === "Alerts"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            🔔 Alerts
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-semibold">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {activeTab === "Analytics" && (
              <div className="space-y-6">
                {/* Stats Cards - Redesigned */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-teal-100 rounded-lg group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-teal-600" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-teal-500" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Total Verified</p>
                    <p className="text-3xl font-black text-teal-600">{stats.total}</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-emerald-600" />
                      </div>
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Sources</p>
                    <p className="text-3xl font-black text-emerald-600">{Object.keys(stats.bySource).length}</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Analysts</p>
                    <p className="text-3xl font-black text-green-600">{Object.keys(stats.byAnalyst).length}</p>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-red-100 rounded-lg group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <Clock className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Critical Threats</p>
                    <p className="text-3xl font-black text-red-600">{stats.bySeverity["Critical"] || 0}</p>
                  </div>
                </div>

                {/* Charts Section - Redesigned Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Severity Distribution */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-teal-200 hover:border-teal-400 transition-all">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">Severity Levels</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={severityChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #14b8a6",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {severityChartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                          <span className="text-xs font-semibold text-gray-700 truncate">{item.name}</span>
                          <span className="text-xs font-bold text-gray-900 ml-auto">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Source Distribution */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">Source Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={sourceChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis stroke="#6b7280" tick={{ fontSize: 11, fontWeight: 600 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #10b981",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {sourceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Threat Type Analysis - Full Width */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Threat Type Analysis</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={threatTypeData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                      <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fontWeight: 600 }} />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 11, fontWeight: 600 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "2px solid #14b8a6",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#14b8a6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Analyst Activity */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-teal-200 hover:border-teal-400 transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Analyst Activity</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(stats.byAnalyst).map(([email, count]) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-md transition-all group"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-xs font-bold text-gray-700 truncate">{email}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-xs font-black whitespace-nowrap group-hover:scale-105 transition-transform">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Alerts" && (
              <div className="bg-white rounded-xl p-12 shadow-lg border-2 border-teal-200 text-center">
                <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl mb-6">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Emerging Threats Report</h2>
                <p className="text-gray-600 mb-6 font-medium">Generate comprehensive threat intelligence reports</p>
                <button
                  onClick={() => setShowPopup(true)}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-black shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Generate Report
                </button>

                {showPopup && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-2 border-teal-200">
                      <h2 className="text-2xl font-black mb-6 text-gray-900">Select Date Range</h2>

                      <div className="mb-5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          className="w-full border-2 border-teal-200 rounded-lg px-4 py-3 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          className="w-full border-2 border-teal-200 rounded-lg px-4 py-3 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>

                      {error && (
                        <p className="text-red-600 text-sm mb-4 font-semibold bg-red-50 border-2 border-red-200 rounded-lg p-3">
                          {error}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowPopup(false)}
                          className="flex-1 px-5 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFetchReport}
                          className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-black hover:from-teal-600 hover:to-emerald-600 shadow-lg transition-all"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsAndAlerts;