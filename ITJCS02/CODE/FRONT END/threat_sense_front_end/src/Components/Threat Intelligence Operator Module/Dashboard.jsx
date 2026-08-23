import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Database, Cloud, BarChart3, LogOut, Home, Upload, TrendingUp, AlertCircle, Zap, Lock, Radio, CheckCircle, ArrowRight } from 'lucide-react';
import TIONavbar from './Navabar';
import { useNavigate } from 'react-router-dom';


const TIODashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <TIONavbar />
      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex-col items-start justify-start">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://img.freepik.com/premium-vector/background-technology-concept-security_49459-536.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />

        <div className="absolute inset-0 z-1 bg-gradient-to-r from-orange-900/70 via-amber-900/60 to-orange-800/70"></div>
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-orange-950/40 via-transparent to-orange-900/80"></div>

        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse z-0" style={{animationDelay: '1s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-3 bg-orange-500/30 rounded-full border border-orange-400/60 backdrop-blur-sm">
              <Radio className="w-5 h-5 text-orange-300 animate-pulse" />
              <span className="text-orange-100 text-sm font-bold tracking-wide">🔴 REAL-TIME THREAT COLLECTION</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl">
              Threat Intelligence
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">Operator Module</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-orange-50 mb-8 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
              Real-time collection and management of cyber threat intelligence from multiple sources. Monitor social media, security forums, and dark web sources. Maintain reliable data pipelines and ensure continuous threat data flow into the system.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap pt-4 mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition transform hover:scale-105 shadow-xl shadow-orange-500/40">
                Start Collecting Data
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/50 hover:bg-white/30 transition shadow-lg">
                View Analytics
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="group bg-white/10 backdrop-blur-lg border border-orange-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-300/30 transition duration-300">
                <div className="text-3xl font-black text-orange-400">50+</div>
                <div className="text-orange-100 font-semibold text-sm mt-1">Data Sources</div>
                <div className="text-orange-200/70 text-xs mt-1">Active feeds</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-lg border border-orange-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-300/30 transition duration-300">
                <div className="text-3xl font-black text-orange-400">24/7</div>
                <div className="text-orange-100 font-semibold text-sm mt-1">Live Monitoring</div>
                <div className="text-orange-200/70 text-xs mt-1">Continuous</div>
              </div>
              <div className="group bg-white/10 backdrop-blur-lg border border-orange-300/30 rounded-xl p-5 hover:bg-white/20 hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-300/30 transition duration-300">
                <div className="text-3xl font-black text-orange-400">&lt;1s</div>
                <div className="text-orange-100 font-semibold text-sm mt-1">Data Ingestion</div>
                <div className="text-orange-200/70 text-xs mt-1">Response time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white/60 to-orange-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text text-transparent">TIO Module Features</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">Comprehensive threat intelligence collection and management capabilities</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Cloud,
                title: "Multi-Source Collection",
                desc: "Real-time data aggregation from social media, forums, and dark web sources",
                color: "from-orange-500 to-amber-500",
                borderColor: "border-orange-300",
                features: ["Twitter/X scraping", "Forum monitoring", "Dark web crawling"]
              },
              {
                icon: Database,
                title: "Centralized Storage",
                desc: "Automated data storage with metadata tagging and source tracking",
                color: "from-amber-500 to-orange-500",
                borderColor: "border-amber-300",
                features: ["MongoDB integration", "Elasticsearch indexing", "Auto-tagging"]
              },
              {
                icon: Radio,
                title: "Real-Time Streaming",
                desc: "Apache Kafka-powered continuous data pipeline management",
                color: "from-orange-600 to-red-500",
                borderColor: "border-orange-400",
                features: ["Kafka streaming", "Continuous flow", "Load balancing"]
              },
              {
                icon: AlertCircle,
                title: "Health Monitoring",
                desc: "Pipeline health checks and automatic troubleshooting mechanisms",
                color: "from-yellow-500 to-orange-500",
                borderColor: "border-yellow-300",
                features: ["Status tracking", "Auto-alerts", "Recovery protocols"]
              },
              {
                icon: Zap,
                title: "Source Management",
                desc: "Add, configure, and manage data sources dynamically",
                color: "from-orange-500 to-red-500",
                borderColor: "border-orange-300",
                features: ["Dynamic sources", "API management", "Scraper control"]
              },
              {
                icon: TrendingUp,
                title: "Quality Assurance",
                desc: "Manual tagging and flagging suspicious entries for accuracy enhancement",
                color: "from-amber-600 to-orange-600",
                borderColor: "border-amber-400",
                features: ["Data validation", "Manual review", "Accuracy tracking"]
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/90 backdrop-blur-sm rounded-xl p-8 border-2 ${feature.borderColor} hover:border-orange-500 transition duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-300/30`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-100/50 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>

                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition relative z-10 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 relative z-10">{feature.title}</h3>
                <p className="text-gray-700 mb-5 relative z-10 font-medium">{feature.desc}</p>

                <div className="space-y-2 relative z-10">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-orange-600 font-bold gap-2 mt-6 opacity-0 group-hover:opacity-100 transition relative z-10">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-100/80 via-amber-100/80 to-orange-100/80 border-y border-orange-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Data Sources", value: "50+", icon: "🌐" },
              { label: "Collection Speed", value: "Real-time", icon: "⚡" },
              { label: "Uptime", value: "99.9%", icon: "✓" },
              { label: "Daily Records", value: "100K+", icon: "📊" }
            ].map((metric, idx) => (
              <div key={idx} className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-200/50 transition duration-300">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">{metric.value}</div>
                <p className="text-gray-700 font-semibold text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoNHYxaC00ek0yMCAzMGg0djFoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">Ready to Manage Threat Intelligence?</h2>
          <p className="text-lg text-white/90 mb-8 font-medium drop-shadow">Start collecting and analyzing threat data with our powerful TIO module</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition transform hover:scale-105 shadow-2xl">
              Start Now
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/60 hover:bg-white/30 hover:border-white transition shadow-xl">
              Explore Database
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 bg-white/80 backdrop-blur-md py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-gray-900 text-lg">ThreatSense</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Threat Intelligence Operator Module</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Modules</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="text-gray-700 hover:text-orange-600 transition font-medium">Collect Data</button></li>
                <li><button className="text-gray-700 hover:text-orange-600 transition font-medium">Submit Data</button></li>
                <li><button className="text-gray-700 hover:text-orange-600 transition font-medium">Analytics</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Real-Time Collection</a></li>
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Data Management</a></li>
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Health Monitoring</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Terms of Service</a></li>
                <li><a href="#" className="text-gray-700 hover:text-orange-600 transition font-medium">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-8 text-center">
            <p className="text-gray-600 text-sm font-medium">&copy; 2025 ThreatSense TIO Module. All rights reserved.</p>
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

export default TIODashboard;