import React, { useState, useEffect } from 'react';
import TIONavbar from './Navabar';

function CollectData() {
  const tioEmail = sessionStorage.getItem("tioEmail");

  const [activeTab, setActiveTab] = useState('cso');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('view');
  const [collectSuccess, setCollectSuccess] = useState(false);

  const sourceMap = {
    cso: 'CSO Online',
    bleeping: 'BleepingComputer',
    hackernews: 'The Hacker News'
  };

  const sourceIcons = {
    cso: '🛡️',
    bleeping: '💻',
    hackernews: '🔥'
  };

  useEffect(() => {
    if (!tioEmail) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setCollectSuccess(false);

      try {
        let url;
        if (mode === 'collect') {
          url = `http://localhost:8082/api/data/scrape/${activeTab}/${tioEmail}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to collect data');
          await response.text();
          setCollectSuccess(true);
          setTimeout(() => setMode('view'), 800);
        }
        
        if (mode === 'view') {
          url = `http://localhost:8082/api/data/all`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch data');
          const json = await response.json();
          const filtered = json.filter(item => item.source === sourceMap[activeTab]);
          setData(filtered);
        }
      } catch (err) {
        setError(err.message || 'Error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, mode, tioEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
      <TIONavbar />

      <div className="pt-32 px-4 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
            Data Collection Hub
          </h1>
          <p className="text-gray-700 font-medium text-lg">Monitor and collect cybersecurity news in real-time</p>
        </div>

        {/* Tabs - Modern Pill Style */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/90 backdrop-blur-lg rounded-full p-1.5 shadow-xl border-2 border-orange-200">
            {Object.keys(sourceMap).map(key => (
              <button
                key={key}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40' 
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                onClick={() => {
                  setActiveTab(key);
                  setMode('view');
                  setError(null);
                  setCollectSuccess(false);
                }}
              >
                <span className="mr-2">{sourceIcons[key]}</span>
                {sourceMap[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {/* Collect Card */}
          <div 
            className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
              mode === 'collect' ? 'border-orange-500 ring-4 ring-orange-100 shadow-orange-200/50' : 'border-orange-200 hover:border-orange-400'
            }`}
            onClick={() => !loading && setMode('collect')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Collect Data</h3>
                  <p className="text-sm text-gray-600 font-medium">Fetch latest articles</p>
                </div>
              </div>
              {collectSuccess && (
                <div className="text-green-500 animate-pulse">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </div>
            {mode === 'collect' && loading && (
              <div className="flex items-center space-x-2 text-orange-600">
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold">Collecting...</span>
              </div>
            )}
          </div>

          {/* View Card */}
          <div 
            className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
              mode === 'view' ? 'border-amber-500 ring-4 ring-amber-100 shadow-amber-200/50' : 'border-orange-200 hover:border-amber-400'
            }`}
            onClick={() => !loading && setMode('view')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">👁️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">View Data</h3>
                  <p className="text-sm text-gray-600 font-medium">Browse collected articles</p>
                </div>
              </div>
              {!loading && data.length > 0 && mode === 'view' && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {data.length}
                </div>
              )}
            </div>
            {mode === 'view' && loading && (
              <div className="flex items-center space-x-2 text-amber-600">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-orange-100/80 to-amber-100/80 px-6 py-4 border-b-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{sourceIcons[activeTab]}</span>
                <span className="font-bold text-gray-900">{sourceMap[activeTab]}</span>
                {!loading && data.length > 0 && mode === 'view' && (
                  <span className="text-sm text-gray-700 font-medium">• {data.length} articles found</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold">Processing...</span>
                  </div>
                )}
                {!loading && mode === 'view' && data.length > 0 && (
                  <span className="text-xs text-green-600 flex items-center space-x-1 font-semibold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[400px]">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-red-700 font-semibold">Error: {error}</p>
                </div>
              </div>
            )}

            {!loading && !error && data.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-700 text-lg font-semibold">No data available for {sourceMap[activeTab]}</p>
                <p className="text-gray-600 text-sm mt-2 font-medium">Click "Collect Data" to fetch latest articles</p>
              </div>
            )}

            {!loading && !error && data.length > 0 && (
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors flex-1 pr-4">
                          {item.headline || 'No Title'}
                        </h3>
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      {item.description && (
                        <p className="text-gray-700 font-medium mt-2 line-clamp-2">{item.description}</p>
                      )}
                      {item.author && (
                        <div className="flex items-center space-x-2 mt-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center">
                            <span className="text-xs">✍️</span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">By: {item.author}</p>
                        </div>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectData;