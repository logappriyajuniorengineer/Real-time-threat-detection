import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, TrendingUp, AlertCircle, BarChart3, Zap, Lock, Eye, ArrowRight, CheckCircle, Brain, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ThreatSense = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveNav(id);
    setMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Features', id: 'features' },
    { label: 'About Us', id: 'about' },
    { label: 'Getting Started', id: 'getting-started' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 bg-gradient-to-br">
                <img src='Logo1.png' className="w-10 h-10 text-white" style={{ borderRadius: "15px" }} />
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
                  ThreatSense
                </span>
                <p className="text-xs text-neutral-300 font-semibold">
                  Threat Intelligence
                </p>

              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold
      ${activeNav === item.id
                      ? 'text-red-600 border-b-2 border-red-600'
                      : scrollY > 50
                        ? 'text-[#000B58] hover:text-[#ff6347]'
                        : 'text-white hover:text-white'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-red-600 hover:bg-red-50 p-2 rounded"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2 bg-white rounded-lg shadow-lg">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold ${activeNav === item.id
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Cyber Security Awareness Background */}
      <section id="home" className="relative pt-24 pb-20 overflow-hidden min-h-screen flex items-center">
        {/* Background Image Container */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://verpex.com/assets/uploads/images/blog/Cyber-Security-Awareness.webp?v=1705576696)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Strong Dark Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-black/70"></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-3 bg-tomato-600 rounded-full">
              <Radio className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white text-sm font-bold tracking-wide">🔴 LIVE THREAT DETECTION</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-white">
              Detect Threats
              <span className="text-red-500 block">Before They Strike</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed font-medium max-w-2xl">
              Real-time cyber threat intelligence powered by AI. Monitor surface, deep, and dark web sources instantly. Get alerts on emerging threats and zero-day vulnerabilities before they hit.
            </p>

            <div className="flex gap-4 flex-wrap pt-2 mb-12">
              <button onClick={() => scrollToSection('getting-started')} className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-lg text-base md:text-lg">
                Start Free Trial
              </button>
              <button onClick={() => scrollToSection('features')} className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 text-base md:text-lg">
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/15 backdrop-blur px-5 py-4 rounded-lg border border-white/20">
                <p className="text-3xl md:text-4xl font-black text-red-400">96.35%</p>
                <p className="text-white font-semibold text-sm mt-1">Accuracy Rate</p>
              </div>
              <div className="bg-white/15 backdrop-blur px-5 py-4 rounded-lg border border-white/20">
                <p className="text-3xl md:text-4xl font-black text-red-400">50+</p>
                <p className="text-white font-semibold text-sm mt-1">Data Sources</p>
              </div>
              <div className="bg-white/15 backdrop-blur px-5 py-4 rounded-lg border border-white/20">
                <p className="text-3xl md:text-4xl font-black text-red-400">24/7</p>
                <p className="text-white font-semibold text-sm mt-1">Live Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">SERVICES</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl">Comprehensive cybersecurity intelligence solutions designed for modern threat landscapes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Classification",
                desc: "Advanced ML/DL models with 96.35% accuracy for threat detection and classification"
              },
              {
                icon: Radio,
                title: "Real-Time Monitoring",
                desc: "24/7 live surveillance across surface, deep, and dark web sources"
              },
              {
                icon: AlertCircle,
                title: "Zero-Day Detection",
                desc: "Identify emerging threats before they become widespread attacks"
              },
              {
                icon: TrendingUp,
                title: "Threat Analytics",
                desc: "LDA and NMF topic modeling for trend analysis and threat prediction"
              },
              {
                icon: Zap,
                title: "Instant Alerts",
                desc: "Real-time notifications with actionable intelligence for your team"
              },
              {
                icon: Lock,
                title: "Threat Intelligence",
                desc: "Proactive CTI for informed security decisions and faster response"
              }
            ].map((service, idx) => (
              <div
                key={idx}
                className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition duration-300 border border-gray-200 hover:border-red-600"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Axians Image */}
      <section id="features" className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side content */}
            <div>
              <span className="text-red-600 font-bold text-sm uppercase tracking-widest">FEATURES</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-8">Advanced Threat Detection</h2>

              <div className="space-y-5">
                {[
                  {
                    title: "Multi-Source Intelligence",
                    desc: "Collect data from 50+ hacker forums, security communities, and dark web sources with real-time aggregation",
                    icon: "🌐"
                  },
                  {
                    title: "Real-Time Classification",
                    desc: "Binary and multiclass threat classification achieving 96.35% accuracy using advanced ML algorithms",
                    icon: "🎯"
                  },
                  {
                    title: "Emerging Threat Detection",
                    desc: "LDA and NMF models identify zero-day attacks through intelligent topic modeling",
                    icon: "⚡"
                  },
                  {
                    title: "Predictive Analytics",
                    desc: "Monitor topic distribution over time for proactive threat prediction and trend analysis",
                    icon: "📊"
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="group bg-gray-50 rounded-lg p-5 hover:bg-red-50 transition border border-gray-200 hover:border-red-600">
                    <div className="flex gap-4 items-start">
                      <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
                Explore All Features
              </button>
            </div>

            {/* Right side image */}
            <div className="relative rounded-lg overflow-hidden shadow-xl h-96 md:h-full min-h-[500px]">
              <img
                src="/Img.webp"
                alt="Features"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Classification Accuracy", value: "96.35%", icon: "🎯" },
              { label: "Binary Classification", value: "93.67%", icon: "📊" },
              { label: "Active Data Sources", value: "50+", icon: "🌐" },
              { label: "Response Time", value: "<1 sec", icon: "⚡" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-red-500 mb-1">{stat.value}</div>
                <p className="text-gray-400 text-sm font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Two images with proper content */}
      <section id="about" className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* First Part - Financial Express Image */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Image on left */}
              <div className="relative rounded-lg overflow-hidden shadow-xl h-96 md:h-full min-h-[500px]">
                <img
                  src="https://images.financialexpressdigital.com/2022/01/cyber.jpg"
                  alt="Cyber Security"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content on right */}
              <div>
                <span className="text-red-600 font-bold text-sm uppercase tracking-widest">ABOUT US</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-6">Next Generation Threat Intelligence</h2>

                <p className="text-base md:text-lg text-gray-700 mb-5 leading-relaxed">
                  ThreatSense is a cutting-edge cyber threat intelligence platform that revolutionizes how organizations detect and respond to emerging threats. Our AI-powered framework combines machine learning, deep learning, and natural language processing to deliver unprecedented threat detection capabilities.
                </p>

                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  Built on years of cybersecurity research, we monitor surface, deep, and dark web sources to provide real-time, actionable intelligence. Our proprietary algorithms achieve 96.35% accuracy in threat classification.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    "ML/DL Algorithms",
                    "Multi-Source Monitoring",
                    "Zero-Day Detection",
                    "Real-Time Analytics"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition">
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>

          {/* Second Part - Businessman Image */}
          <div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Content on left */}
              <div>
                <span className="text-red-600 font-bold text-sm uppercase tracking-widest">WHY CHOOSE US</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-6">Enterprise-Grade Security</h2>

                <div className="space-y-4">
                  {[
                    {
                      title: "Proven Track Record",
                      desc: "Trusted by Fortune 500 companies for critical threat detection"
                    },
                    {
                      title: "Advanced Technology",
                      desc: "Cutting-edge AI/ML algorithms that continuously evolve"
                    },
                    {
                      title: "Expert Support",
                      desc: "24/7 dedicated support from cybersecurity experts"
                    },
                    {
                      title: "Compliance Ready",
                      desc: "Full compliance with GDPR, ISO 27001, and SOC 2"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image on right */}
              <div className="relative rounded-lg overflow-hidden shadow-xl h-96 md:h-full min-h-[500px]">
                <img
                  src="https://www.facilitiesnet.com/resources/editorial/2023/businessman-on-blurred-background-using-antivirus-sstock_617737619.jpg"
                  alt="Enterprise Security"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="getting-started" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-600 font-bold text-sm uppercase tracking-widest">GET STARTED</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">Launch in 4 Simple Steps</h2>
            <p className="text-lg text-gray-600">Start your threat intelligence journey today</p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Create Your Account",
                desc: "Sign up in seconds and get instant access to our advanced threat detection platform"
              },
              {
                step: 2,
                title: "Configure Data Sources",
                desc: "Select which web sources you want to monitor - surface, deep, or dark web"
              },
              {
                step: 3,
                title: "Set Alert Rules",
                desc: "Customize threat severity levels and notification channels for your team"
              },
              {
                step: 4,
                title: "Start Monitoring",
                desc: "Begin receiving real-time threat alerts and actionable intelligence"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-red-600 transition hover:shadow-lg group"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-black text-lg text-white group-hover:scale-110 transition">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => { navigate("/reg") }} className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition text-lg">
              Start Your Free Trial Today
            </button>
            <p className="text-gray-600 mt-3 font-semibold">No credit card required • 14 days free access</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">

                <img src='Logo1.png' className="w-10 h-10 text-white" style={{ borderRadius: "10px" }} />

                <span className="font-black text-white text-lg">ThreatSense</span>
              </div>
              <p className="text-gray-400 text-sm">Real-time cyber threat intelligence platform protecting organizations worldwide.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-red-500 transition">Features</a></li>
                <li><a href="#services" className="hover:text-red-500 transition">Services</a></li>
                <li><a href="#about" className="hover:text-red-500 transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Careers</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-500 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Terms</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2025 ThreatSense. All rights reserved. Protecting the digital world, one threat at a time.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ThreatSense;