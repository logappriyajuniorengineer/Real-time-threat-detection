
import TIONavbar from './Navabar';
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
} from "recharts"
import { Shield, AlertTriangle, TrendingUp, Zap, Clock, AlertCircle, Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react"

function TIOAnalytics() {
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
    "CSO Online": "#f97316",
    BleepingComputer: "#fb923c",
    "The Hacker News": "#fdba74",
    Critical: "#dc2626",
    High: "#f97316",
    Medium: "#fbbf24",
    Low: "#22c55e",
    Unknown: "#9ca3af",
    Benign: "#10b981",
  }

  const sourceChartData = Object.entries(stats.bySource).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] || "#f97316",
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

  const threatNatureRadar = Object.entries(stats.byThreatNature).map(([subject, value]) => ({
    subject,
    value,
    fullMark: Math.max(...Object.values(stats.byThreatNature)) + 5,
  }))

  const parseThreats = (resultText) => {
    const lines = resultText.split("\n").filter((line) => line.trim())
    return lines
      .map((line, idx) => {
        const match = line.match(/Topic \d+: (.+?) \$\$(.+?)\$\$/)
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <TIONavbar />

      <div className="pt-32 px-4 pb-12 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-4xl font-black mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-orange-600" />
            Security Intelligence Dashboard
          </h1>
          <p className="text-gray-700 font-medium text-lg">Real-time cybersecurity threat monitoring and analysis</p>
        </div>

        {apiError && (
          <div className="mb-6 p-5 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-bold text-lg">Connection Error</p>
              <p className="text-red-700 text-sm mt-1 font-medium">{apiError}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/90 backdrop-blur-lg rounded-full p-1.5 shadow-xl border-2 border-orange-200">
            <button
              onClick={() => setActiveTab("Analytics")}
              className={`px-8 py-3 font-bold transition-all duration-300 rounded-full flex items-center gap-2 ${
                activeTab === "Analytics"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("Alerts")}
              className={`px-8 py-3 font-bold transition-all duration-300 rounded-full flex items-center gap-2 ${
                activeTab === "Alerts"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              Alerts
            </button>
          </div>
        </div>

        {loading && activeTab === "Analytics" ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {activeTab === "Analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Verified</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mt-2">{stats.total}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-6 hover:shadow-2xl hover:shadow-amber-300/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Sources</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-2">{Object.keys(stats.bySource).length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 rounded-2xl p-6 hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Analysts</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mt-2">{Object.keys(stats.byAnalyst).length}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-red-300 rounded-2xl p-6 hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Critical Threats</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">{stats.bySeverity["Critical"] || 0}</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Source Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={sourceChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                        <XAxis type="number" stroke="#92400e" />
                        <YAxis dataKey="name" type="category" stroke="#92400e" width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #fed7aa",
                            borderRadius: "12px",
                            fontWeight: "600",
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

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-300/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <PieChartIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Severity Levels</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={severityChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #fcd34d",
                            borderRadius: "12px",
                            fontWeight: "600",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Threat Type Trends</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={threatTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                        <XAxis dataKey="name" stroke="#92400e" />
                        <YAxis stroke="#92400e" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #fed7aa",
                            borderRadius: "12px",
                            fontWeight: "600",
                          }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-300/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Threat Nature Analysis</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={threatNatureRadar}>
                        <PolarGrid stroke="#fed7aa" />
                        <PolarAngleAxis dataKey="subject" stroke="#92400e" />
                        <PolarRadiusAxis stroke="#92400e" />
                        <Radar name="Threats" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "2px solid #fcd34d",
                            borderRadius: "12px",
                            fontWeight: "600",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-orange-300/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">Analyst Activity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stats.byAnalyst).length > 0 ? (
                      Object.entries(stats.byAnalyst).map(([email, count]) => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border-2 border-orange-200"
                        >
                          <span className="text-gray-800 font-semibold text-sm">{email}</span>
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                            {count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 col-span-3 font-medium">No analyst data available</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Alerts" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => fetchEmergingThreats()}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 transform"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Load Emerging Threats
                  </button>
                </div>

                {threatsLoading ? (
                  <div className="text-center py-12 bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
                    <p className="mt-4 text-gray-700 font-medium">Loading emerging threats...</p>
                  </div>
                ) : emergingThreats.length > 0 ? (
                  <div className="space-y-6">
                    {emergingThreats.map((threat, idx) => {
                      const threats = parseThreats(threat.result)
                      return (
                        <div
                          key={idx}
                          className="bg-white/90 backdrop-blur-sm border-2 border-red-300 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                            <div>
                              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                Threat Analysis Report
                              </h3>
                              <p className="text-gray-600 text-sm mt-2 flex items-center gap-2 font-medium">
                                <Clock className="w-4 h-4" />
                                {new Date(threat.analysisDate).toLocaleString()}
                              </p>
                            </div>
                            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold border-2 border-red-300">
                              ID: {threat.id}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {threats.map((t) => (
                              <div
                                key={t.id}
                                className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 hover:border-red-400 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <div className="flex-1">
                                    <p className="text-gray-900 font-bold text-sm">{t.title}</p>
                                    <p className="text-red-600 text-xs mt-1 font-semibold">{t.type}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <p className="text-gray-800 text-sm whitespace-pre-wrap font-mono font-medium">{threat.result}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl">
                    <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-gray-700 text-xl font-bold">No emerging threats loaded yet</p>
                    <p className="text-gray-600 text-sm mt-2 font-medium">
                      Click "Load Emerging Threats" to fetch the latest data
                    </p>
                  </div>
                )}

                {showPopup && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border-2 border-orange-200">
                      <h2 className="text-2xl font-black mb-6 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        <Clock className="w-6 h-6 text-orange-600" />
                        Generate Threat Report
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">Start Date</label>
                          <input
                            type="date"
                            className="w-full bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-orange-500 transition-colors font-medium"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">End Date</label>
                          <input
                            type="date"
                            className="w-full bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-orange-500 transition-colors font-medium"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-300 text-sm">{error}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => {
                            setShowPopup(false)
                            setError("")
                          }}
                          className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFetchReport}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
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

export default TIOAnalytics;
