import {  BarChart3, Shield, Bell, TrendingUp, Lock, Eye, Send, CheckCircle, ArrowRight, Zap, Activity, Target } from 'lucide-react';
import CISONavbar from './Navabar';

const CISODashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <CISONavbar />
      
      <section className="relative pt-24 pb-0 overflow-hidden min-h-screen flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://media.istockphoto.com/id/1419462882/video/lock-sign.jpg?s=640x640&k=20&c=94tsmRFY6tERWr7fsw3c3U13JpeUjUBOMC3zND8eZaE=" 
            alt="Cybersecurity Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-teal-900/90 to-emerald-900/85"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1 max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-emerald-400/20 backdrop-blur-md rounded-full border-2 border-emerald-300/50">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                <span className="text-emerald-100 text-sm font-bold tracking-wide">🔔 EXECUTIVE THREAT OVERSIGHT</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl">
                CISO
                <span className="text-emerald-300 block">Command Center</span>
              </h1>

              <p className="text-lg md:text-xl text-emerald-50 mb-8 leading-relaxed font-medium drop-shadow-lg">
                Executive-level threat intelligence and strategic decision-making. Receive real-time escalations, automated threat digests, and critical alerts. Configure thresholds, approve mitigation actions, and coordinate with operations teams.
              </p>

              <div className="flex gap-4 flex-wrap pt-4 mb-12">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-400 text-gray-900 rounded-xl font-black hover:from-emerald-300 hover:to-teal-300 transition transform hover:scale-105 shadow-2xl">
                  View Critical Alerts
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/50 hover:bg-white/20 transition shadow-xl">
                  Configure Settings
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-lg border-2 border-emerald-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-emerald-300/60 transition shadow-xl">
                  <div className="text-3xl font-black text-emerald-300">47</div>
                  <div className="text-white font-semibold text-sm mt-2">Critical Alerts</div>
                  <div className="text-emerald-200 text-xs mt-1">This week</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border-2 border-teal-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-teal-300/60 transition shadow-xl">
                  <div className="text-3xl font-black text-teal-300">12</div>
                  <div className="text-white font-semibold text-sm mt-2">Zero-Day Threats</div>
                  <div className="text-teal-200 text-xs mt-1">Escalated</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border-2 border-green-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-green-300/60 transition shadow-xl">
                  <div className="text-3xl font-black text-green-300">94%</div>
                  <div className="text-white font-semibold text-sm mt-2">Mitigation Rate</div>
                  <div className="text-green-200 text-xs mt-1">This month</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <img src='Logo1.png' className="w-6 h-6 text-emerald-300" />
                      <span className="text-white font-bold">Live Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-300 text-sm font-semibold">Active</span>
                    </div>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80" 
                    alt="Security Dashboard"
                    className="w-full h-72 object-cover rounded-xl mb-4 shadow-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-3 border border-emerald-400/30">
                      <Activity className="w-5 h-5 text-emerald-300 mb-2" />
                      <div className="text-emerald-100 text-xs font-semibold">System Status</div>
                      <div className="text-white font-bold">Operational</div>
                    </div>
                    <div className="bg-teal-500/20 backdrop-blur-sm rounded-lg p-3 border border-teal-400/30">
                      <Target className="w-5 h-5 text-teal-300 mb-2" />
                      <div className="text-teal-100 text-xs font-semibold">Threats Blocked</div>
                      <div className="text-white font-bold">1,247</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">CAPABILITIES</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">CISO Module Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Strategic oversight and decision-making capabilities for executive leadership</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Bell, 
                title: "Real-Time Escalations", 
                desc: "Immediate alerts for high-confidence, high-severity threats from Security Analysts", 
                color: "emerald",
                features: ["Confidence thresholds", "Severity filtering", "Custom keywords"]
              },
              { 
                icon: BarChart3, 
                title: "Automated Digests", 
                desc: "6-hourly threat summaries with top threats, trends, and zero-day discussions", 
                color: "teal",
                features: ["Threat aggregation", "Trend analysis", "Zero-day detection"]
              },
              { 
                icon: TrendingUp, 
                title: "Strategic Analytics", 
                desc: "Heatmaps, trend lines, and source analytics for informed decision-making", 
                color: "green",
                features: ["Heatmap visualization", "Trend forecasting", "Source tracking"]
              },
              { 
                icon: Lock, 
                title: "Mitigation Approval", 
                desc: "Review and approve automated actions on firewalls, gateways, and endpoints", 
                color: "emerald",
                features: ["IP blocking", "URL filtering", "Hash management"]
              },
              { 
                icon: Eye, 
                title: "SIEM Integration", 
                desc: "Seamless connection with Splunk, ELK, and other enterprise platforms", 
                color: "teal",
                features: ["Splunk sync", "ELK integration", "Real-time correlation"]
              },
              { 
                icon: Send, 
                title: "Alert Delivery", 
                desc: "Multi-channel notifications via email, dashboard, and external systems", 
                color: "green",
                features: ["Email alerts", "SMS notifications", "API webhooks"]
              }
            ].map((feature, idx) => (
              <div key={idx} className={`group relative bg-gradient-to-br from-${feature.color}-50 to-white border-2 border-${feature.color}-200 rounded-2xl p-8 hover:border-${feature.color}-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}>
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{feature.desc}</p>
                <div className="space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 text-${feature.color}-500 flex-shrink-0`} />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center text-${feature.color}-600 font-bold gap-2 mt-6 opacity-0 group-hover:opacity-100 transition`}>
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section with Images */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">EXECUTIVE DASHBOARD</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Strategic Threat Overview</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-200 hover:border-emerald-400 transition group">
              <img 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop&q=80" 
                alt="Security Analytics"
                className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Threat Intelligence Platform</h3>
                <p className="text-gray-600">Real-time monitoring and analysis of global threat patterns</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-teal-200 hover:border-teal-400 transition group">
              <img 
                src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop&q=80" 
                alt="Security Operations"
                className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Security Operations Center</h3>
                <p className="text-gray-600">24/7 monitoring and incident response capabilities</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Critical Threats", value: "47", icon: "🚨", gradient: "from-red-500 to-orange-500" },
              { label: "Escalated Today", value: "23", icon: "📈", gradient: "from-amber-500 to-yellow-500" },
              { label: "Mitigated Actions", value: "156", icon: "✅", gradient: "from-green-500 to-emerald-500" },
              { label: "Pending Review", value: "8", icon: "⏳", gradient: "from-teal-500 to-cyan-500" }
            ].map((metric, idx) => (
              <div key={idx} className={`p-8 bg-gradient-to-br ${metric.gradient} rounded-2xl hover:shadow-2xl transition transform hover:scale-105 hover:rotate-1`}>
                <div className="text-5xl mb-4">{metric.icon}</div>
                <div className="text-4xl font-black text-white mb-2">{metric.value}</div>
                <p className="text-white/90 font-bold">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600"></div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=600&fit=crop&q=80" 
            alt="Technology"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Zap className="w-20 h-20 text-emerald-300 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white drop-shadow-2xl">Take Control of Your Threat Landscape</h2>
          <p className="text-xl text-emerald-50 mb-10 drop-shadow-lg">Executive oversight, strategic decisions, and coordinated response to critical threats</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition transform hover:scale-105 shadow-2xl">
              Access Dashboard
            </button>
            <button className="px-10 py-5 bg-emerald-700/50 backdrop-blur-md text-white rounded-2xl font-bold text-lg border-2 border-white/50 hover:bg-emerald-700/70 transition shadow-xl">
              Configure Alerts
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-emerald-200 bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-gray-900 text-xl">ThreatSense</span>
              </div>
              <p className="text-gray-600 text-sm">CISO Executive Intelligence Module</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Dashboard</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Alerts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Real-Time Alerts</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">SIEM Integration</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Threat Intelligence</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-emerald-600 transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-500 text-sm">&copy; 2025 ThreatSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CISODashboard;