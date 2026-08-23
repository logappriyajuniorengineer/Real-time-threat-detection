import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Database, Cloud, BarChart3, LogOut, Home, Upload, AlertTriangle, TrendingUp, Lock, Eye, Zap, CheckCircle, ArrowRight, BarChart2, Brain, Radio } from 'lucide-react';
import SANavbar from './Navabar';
import { useNavigate } from 'react-router-dom';

const SADashboard = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <SANavbar />

      {/* Hero Section with Background Image */}
      <section className="relative pt-24 pb-0 overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/Img3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Multi-layer Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-slate-950/85 via-purple-950/70 to-slate-950/60"></div>
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-slate-950/95"></div>

        {/* Animated Glow Elements */}
        <div className="absolute top-32 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse z-0" style={{animationDelay: '1.5s'}}></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-purple-500/20 rounded-full border border-purple-400/60 backdrop-blur-sm">
              <Radio className="w-5 h-5 text-purple-300 animate-pulse" />
              <span className="text-purple-300 text-sm font-bold tracking-wide">🔒 INTELLIGENT THREAT ANALYSIS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl">
              Security Analyst
              <span className="text-purple-400 block">Intelligence Hub</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
              Real-time threat classification, analysis, and escalation. Identify emerging threats through advanced ML models, topic modeling, and IoC extraction. Monitor CVE mentions, analyze threat trends, and escalate critical threats to leadership.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap pt-4 mb-14">
              <button 
                onClick={() => navigate('/saCD')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 shadow-xl"
              >
                View Threat Data
              </button>
              <button 
                onClick={() => navigate('/saAI')}
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-lg font-bold border-2 border-white/50 hover:bg-white/30 transition"
              >
                Analyze Threats
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-5 hover:bg-purple-500/20 hover:border-purple-400/50 transition">
                <div className="text-3xl font-black text-purple-400">1000+</div>
                <div className="text-gray-300 font-semibold text-sm mt-2">Threats Detected</div>
                <div className="text-gray-400 text-xs mt-1">This month</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-5 hover:bg-purple-500/20 hover:border-purple-400/50 transition">
                <div className="text-3xl font-black text-purple-400">98.5%</div>
                <div className="text-gray-300 font-semibold text-sm mt-2">Detection Rate</div>
                <div className="text-gray-400 text-xs mt-1">Classification accuracy</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-5 hover:bg-purple-500/20 hover:border-purple-400/50 transition">
                <div className="text-3xl font-black text-purple-400">&lt;2s</div>
                <div className="text-gray-300 font-semibold text-sm mt-2">Analysis Time</div>
                <div className="text-gray-400 text-xs mt-1">Per threat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-28 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-purple-400 font-bold text-sm uppercase tracking-widest">CORE CAPABILITIES</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6 text-white">SA Module Features</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Advanced intelligence and decision-making for cybersecurity threats</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart2,
                title: "Real-Time Classification",
                desc: "SVM-powered ML models classify threats into predefined categories with 96.35% accuracy",
                color: "from-purple-600 to-pink-600",
                features: ["Malware detection", "Phishing alerts", "Ransomware tracking"]
              },
              {
                icon: Brain,
                title: "Topic Modeling Analysis",
                desc: "LDA and NMF techniques detect emerging threat trends and zero-day exploits",
                color: "from-pink-600 to-purple-600",
                features: ["LDA modeling", "NMF analysis", "Trend detection"]
              },
              {
                icon: AlertTriangle,
                title: "Threat Intelligence",
                desc: "Extract IoCs, correlate discussions, and track threat frequency across platforms",
                color: "from-purple-500 to-fuchsia-600",
                features: ["IoC extraction", "Cross-platform correlation", "Frequency tracking"]
              },
              {
                icon: Eye,
                title: "Visualization Tools",
                desc: "Keyword clouds, trend graphs, and CVE mention timelines for better insights",
                color: "from-fuchsia-600 to-pink-600",
                features: ["Keyword clouds", "Trend graphs", "CVE tracking"]
              },
              {
                icon: TrendingUp,
                title: "Escalation System",
                desc: "Automatic escalation of high-severity threats to CISO with detailed context",
                color: "from-pink-600 to-purple-600",
                features: ["Auto-escalation", "Severity scoring", "CISO alerts"]
              },
              {
                icon: CheckCircle,
                title: "Quality Feedback Loop",
                desc: "Manual verification and reclassification to continuously improve model accuracy",
                color: "from-purple-600 to-violet-600",
                features: ["Label correction", "Model retraining", "Accuracy improvement"]
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-8 border border-slate-700/50 hover:border-purple-500/70 transition duration-300 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition pointer-events-none" style={{background: `linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))`}}></div>

                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition relative z-10`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white relative z-10">{feature.title}</h3>
                <p className="text-gray-400 mb-5 relative z-10 text-sm leading-relaxed">{feature.desc}</p>

                {/* Features List */}
                <div className="space-y-2 relative z-10">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Arrow */}
                <div className="flex items-center text-purple-400 font-bold gap-2 mt-6 opacity-0 group-hover:opacity-100 transition relative z-10 text-sm">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Dashboard Preview */}
      <section className="py-24 px-4 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 font-bold text-sm uppercase tracking-widest">DASHBOARD METRICS</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6 text-white">Real-Time Threat Monitoring</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Alerts", value: "247", icon: "🚨" },
              { label: "Critical Threats", value: "12", icon: "⚠️" },
              { label: "IoCs Extracted", value: "5.2K", icon: "🔍" },
              { label: "Escalated Today", value: "8", icon: "📈" }
            ].map((metric, idx) => (
              <div key={idx} className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div className="text-2xl font-black text-purple-400 mb-2">{metric.value}</div>
                <p className="text-gray-400 font-semibold text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Categories */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Threat Categories Detected</h2>
            <p className="text-lg text-gray-400">Classification breakdown of identified threats</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Malware", count: 285, color: "from-purple-600 to-purple-700" },
              { name: "Phishing", count: 312, color: "from-fuchsia-600 to-fuchsia-700" },
              { name: "Ransomware", count: 156, color: "from-pink-600 to-pink-700" },
              { name: "Exploits", count: 198, color: "from-violet-600 to-violet-700" },
              { name: "Other", count: 49, color: "from-rose-600 to-rose-700" }
            ].map((threat, idx) => (
              <div
                key={idx}
                className={`group bg-gradient-to-br ${threat.color} rounded-lg p-6 cursor-pointer hover:shadow-xl transition transform hover:scale-105`}
              >
                <div className="text-3xl font-black text-white mb-2">{threat.count}</div>
                <div className="text-white/90 font-semibold">{threat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Start Analyzing Threats Today</h2>
          <p className="text-lg text-gray-300 mb-10">Access real-time threat intelligence and make informed security decisions</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button 
              onClick={() => navigate('/saCD')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
            >
              Access Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('/saAI')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-bold border border-white/30 hover:bg-white/20 transition"
            >
              View Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="font-black text-white">ThreatSense</span>
              </div>
              <p className="text-gray-400 text-sm">Security Analyst Intelligence Module</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('saDB')} className="text-gray-400 hover:text-cyan-400 transition">Dashboard</button></li>
                <li><button onClick={() => navigate('saCD')} className="text-gray-400 hover:text-cyan-400 transition">View Data</button></li>
                <li><button onClick={() => navigate('saAI')} className="text-gray-400 hover:text-cyan-400 transition">Analytics</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Threat Classification</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">IoC Extraction</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Escalation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">&copy; 2025 ThreatSense Security Analyst Module. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          animation: slideInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SADashboard;