import SANavbar from './Navabar';
import { useState, useEffect } from "react"
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import { Menu, X, Shield, AlertTriangle, TrendingUp, Zap, Clock, AlertCircle, BarChart3, Activity, Eye } from "lucide-react"



function SAAnalytics() {
  const [activeTab, setActiveTab] = useState("Analytics")
  const [newsData, setNewsData] = useState([])
  const [emergingThreats, setEmergingThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [threatsLoading, setThreatsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    bySource: {},
    bySeverity: {},
    byThreatType: {},
    byThreatNature: {},
    byAnalyst: {},
    recentActivity: [],
  })
  const [showPopup, setShowPopup] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNewsData()
    const interval = setInterval(fetchNewsData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNewsData = async () => {
    try {
      setApiError("")
      const response = await fetch("http://localhost:8082/api/data/all")
      if (!response.ok) throw new Error(`API returned ${response.status}`)
      const data = await response.json()
      const verifiedData = data.filter((item) => item.status === "Verification Completed")
      setNewsData(verifiedData)
      calculateStats(verifiedData)
    } catch (error) {
      console.error("Error fetching news data:", error)
      setApiError("Unable to connect to backend API. Please ensure the server is running on http://localhost:8082")
      setStats({
        total: 0,
        bySource: {},
        bySeverity: {},
        byThreatType: {},
        byThreatNature: {},
        byAnalyst: {},
        recentActivity: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEmergingThreats = async () => {
    setThreatsLoading(true)
    setApiError("")
    try {
      const response = await fetch("http://localhost:8082/api/emergta/getall")
      if (!response.ok) throw new Error(`API returned ${response.status}`)
      const data = await response.json()
      setEmergingThreats(data)
    } catch (error) {
      console.error("Error fetching emerging threats:", error)
      setApiError("Failed to fetch emerging threats. Please ensure the backend API is running.")
    } finally {
      setThreatsLoading(false)
    }
  }

  const handleFetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.")
      return
    }

    if (startDate === endDate) {
      setError("Start date and end date must be different.")
      return
    }

    setError("")

    try {
      const response = await fetch(
        `http://localhost:8082/api/emergta/predict?startDate=${startDate}&endDate=${endDate}`,
        { method: "POST" },
      )

      if (!response.ok) throw new Error("Failed to fetch report")

      const data = await response.json()
      console.log("Emerging Threat Report:", data)
      alert("Report generated successfully!")
      setShowPopup(false)
      setStartDate("")
      setEndDate("")
    } catch (err) {
      console.error(err)
      setError("Error fetching report. Please try again.")
    }
  }

  const calculateStats = (data) => {
    const bySource = {}
    const bySeverity = {}
    const byThreatType = {}
    const byThreatNature = {}
    const byAnalyst = {}

    data.forEach((item) => {
      bySource[item.source] = (bySource[item.source] || 0) + 1
      const severity = item.severityLevel || "Unknown"
      bySeverity[severity] = (bySeverity[severity] || 0) + 1
      const threatType = item.threatType || "Unknown"
      byThreatType[threatType] = (byThreatType[threatType] || 0) + 1
      const threatNature = item.threatNature || "Unknown"
      byThreatNature[threatNature] = (byThreatNature[threatNature] || 0) + 1
      if (item.securityAnalystEmail) {
        byAnalyst[item.securityAnalystEmail] = (byAnalyst[item.securityAnalystEmail] || 0) + 1
      }
    })

    const recentActivity = data.sort((a, b) => new Date(b.collectedAt) - new Date(a.collectedAt)).slice(0, 10)

    setStats({
      total: data.length,
      bySource,
      bySeverity,
      byThreatType,
      byThreatNature,
      byAnalyst,
      recentActivity,
    })
  }

  const COLORS = {
    "CSO Online": "#a855f7",
    BleepingComputer: "#ec4899",
    "The Hacker News": "#d946ef",
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
    Unknown: "#9ca3af",
    Benign: "#10b981",
  }

  const sourceChartData = Object.entries(stats.bySource).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] || "#a855f7",
  }))

  const severityChartData = Object.entries(stats.bySeverity).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] || "#9ca3af",
  }))

  const threatTypeData = Object.entries(stats.byThreatType).map(([name, count]) => ({
    name,
    count,
  }))

  const threatNatureData = Object.entries(stats.byThreatNature).map(([subject, value]) => ({
    subject,
    value,
    fullMark: Math.max(...Object.values(stats.byThreatNature)) * 1.2,
  }))

  const parseThreats = (resultText) => {
    const lines = resultText.split("\n").filter((line) => line.trim())
    return lines
      .map((line, idx) => {
        const match = line.match(/Topic \d+: (.+?) $$(.+?)$$/)
        if (match) {
          return {
            id: idx,
            title: match[1],
            type: match[2],
          }
        }
        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SANavbar />

      <div className="pt-28 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Security Intelligence Dashboard
              </h1>
              <p className="text-gray-400 font-medium mt-1">Real-time cybersecurity threat monitoring and analytics</p>
            </div>
          </div>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-6 p-5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-bold text-lg">Connection Error</p>
              <p className="text-red-200 text-sm mt-1">{apiError}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-xl border border-purple-500/20 w-fit">
            <button
              onClick={() => setActiveTab("Analytics")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "Analytics"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("Alerts")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "Alerts"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              Emerging Threats
            </button>
          </div>
        </div>

        {loading && activeTab === "Analytics" ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300 font-medium">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === "Analytics" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Total Verified</p>
                        <p className="text-4xl font-black text-purple-400">{stats.total}</p>
                      </div>
                      <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                        <Shield className="w-7 h-7 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-pink-500/30 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Data Sources</p>
                        <p className="text-4xl font-black text-pink-400">{Object.keys(stats.bySource).length}</p>
                      </div>
                      <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-all">
                        <Activity className="w-7 h-7 text-pink-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-fuchsia-500/30 rounded-xl p-6 hover:border-fuchsia-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Active Analysts</p>
                        <p className="text-4xl font-black text-fuchsia-400">{Object.keys(stats.byAnalyst).length}</p>
                      </div>
                      <div className="w-14 h-14 bg-fuchsia-500/20 rounded-xl flex items-center justify-center group-hover:bg-fuchsia-500/30 transition-all">
                        <Eye className="w-7 h-7 text-fuchsia-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-semibold mb-1">Critical Threats</p>
                        <p className="text-4xl font-black text-red-400">{stats.bySeverity["Critical"] || 0}</p>
                      </div>
                      <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-all">
                        <AlertTriangle className="w-7 h-7 text-red-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Severity Distribution - Donut Chart */}
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Severity Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={severityChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #a855f7",
                            borderRadius: "12px",
                            color: "#fff",
                            padding: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "600" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Threat Nature Radar */}
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-pink-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Threat Nature Analysis</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={threatNatureData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="subject" stroke="#e5e7eb" style={{ fontSize: "12px", fontWeight: "600" }} />
                        <PolarRadiusAxis stroke="#475569" />
                        <Radar
                          name="Threats"
                          dataKey="value"
                          stroke="#ec4899"
                          fill="#ec4899"
                          fillOpacity={0.5}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #ec4899",
                            borderRadius: "12px",
                            color: "#fff",
                            padding: "12px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Source Distribution - Gradient Bar Chart */}
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-fuchsia-500/20 rounded-xl p-6 hover:border-fuchsia-500/40 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Source Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sourceChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: "600" }} />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={150} style={{ fontSize: "12px", fontWeight: "600" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #d946ef",
                            borderRadius: "12px",
                            color: "#fff",
                            padding: "12px",
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                          {sourceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Threat Type Trend - Line Chart */}
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/40 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-violet-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Threat Type Trends</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={threatTypeData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: "600" }} angle={-15} textAnchor="end" height={80} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: "600" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #8b5cf6",
                            borderRadius: "12px",
                            color: "#fff",
                            padding: "12px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#a855f7"
                          strokeWidth={3}
                          dot={{ fill: "#ec4899", strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: "#d946ef" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Analyst Activity Section */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Analyst Activity Overview</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stats.byAnalyst).length > 0 ? (
                      Object.entries(stats.byAnalyst).map(([email, count]) => (
                        <div
                          key={email}
                          className="group relative bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 pr-3">
                              <p className="text-gray-300 font-semibold text-sm truncate">{email}</p>
                              <p className="text-gray-500 text-xs mt-1">Security Analyst</p>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                {count}
                              </span>
                              <span className="text-xs text-gray-500 font-semibold">items</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No analyst activity data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === "Alerts" && (
              <div className="space-y-6">
                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      fetchEmergingThreats()
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-bold shadow-2xl transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
                  >
                    <AlertTriangle className="w-6 h-6" />
                    Load Emerging Threats
                  </button>
                </div>

                {/* Emerging Threats Display */}
                {threatsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-xl">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 font-medium">Loading emerging threats...</p>
                  </div>
                ) : emergingThreats.length > 0 ? (
                  <div className="space-y-6">
                    {emergingThreats.map((threat, idx) => {
                      const threats = parseThreats(threat.result)
                      return (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                  <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                Emerging Threat Analysis
                              </h3>
                              <p className="text-gray-400 font-medium flex items-center gap-2 ml-13">
                                <Clock className="w-4 h-4" />
                                {new Date(threat.analysisDate).toLocaleString()}
                              </p>
                            </div>
                            <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm font-bold border border-red-500/40">
                              ID: {threat.id}
                            </span>
                          </div>

                          {/* Threats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {threats.map((t) => (
                              <div
                                key={t.id}
                                className="group bg-slate-900/50 border border-red-500/30 rounded-xl p-4 hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse"></div>
                                  <div className="flex-1">
                                    <p className="text-white font-bold text-sm mb-2 group-hover:text-red-300 transition">{t.title}</p>
                                    <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold border border-red-500/30">
                                      {t.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Raw Result */}
                          <div className="bg-slate-900/70 rounded-xl p-5 border border-slate-700/50">
                            <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              Full Analysis Report
                            </h4>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">{threat.result}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-xl">
                    <AlertTriangle className="w-16 h-16 text-gray-500 mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Emerging Threats Loaded</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Click the "Load Emerging Threats" button above to fetch the latest threat intelligence data
                    </p>
                  </div>
                )}

                {/* Report Generation Popup */}
                {showPopup && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30">
                      <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-400" />
                        </div>
                        Generate Report
                      </h2>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">Start Date</label>
                          <input
                            type="date"
                            className="w-full bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-2">End Date</label>
                          <input
                            type="date"
                            className="w-full bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>

                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-300 text-sm font-semibold">{error}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button
                          onClick={() => {
                            setShowPopup(false)
                            setError("")
                          }}
                          className="flex-1 px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFetchReport}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all font-bold shadow-lg"
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
  )
}

export default SAAnalytics;