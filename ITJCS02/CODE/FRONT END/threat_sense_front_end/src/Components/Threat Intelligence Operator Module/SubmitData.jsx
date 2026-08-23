import React, { useState, useEffect } from 'react';
import TIONavbar from './Navabar';

function SubmitData() {
    const tioEmail = sessionStorage.getItem("tioEmail");
    const [analysts, setAnalysts] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [activeTab, setActiveTab] = useState('CSO Online');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedAnalyst, setSelectedAnalyst] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const tabToCategoryMap = {
        'CSO Online': 'CSO Online',
        'BleepingComputer': 'BleepingComputer',
        'The Hacker News': 'The Hacker News'
    };

    useEffect(() => {
        fetchAnalysts();
        fetchNewsData();
    }, []);

    const fetchAnalysts = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/analysts');
            const data = await response.json();
            setAnalysts(data.securityAnalysts || []);
        } catch (error) {
            console.error('Error fetching analysts:', error);
        }
    };

    const fetchNewsData = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/data/all');
            const data = await response.json();
            console.log('Fetched data:', data);
            setNewsData(data);
        } catch (error) {
            console.error('Error fetching news data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClick = () => {
        setShowModal(true);
        setSelectedAnalyst('');
    };

    const handleSubmitToAnalyst = async () => {
        if (!selectedAnalyst) return;

        setSubmitting(true);
        try {
            const category = tabToCategoryMap[activeTab];
            const encodedAnalyst = encodeURIComponent(selectedAnalyst);
            const encodedTioEmail = encodeURIComponent(tioEmail);
            const encodedCategory = encodeURIComponent(category);

            const response = await fetch(
                `http://localhost:8082/api/admin/sendDataToAnalyst/${encodedAnalyst}/${encodedTioEmail}/${encodedCategory}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                alert("Successfully submitted to analyst!");
                setShowModal(false);
                setSelectedAnalyst("");
                fetchNewsData();
            } else {
                const errorMsg = await response.text();
                alert(`Failed to submit: ${errorMsg}`);
                console.error("Submission failed:", errorMsg);
            }
        } catch (error) {
            console.error("Error submitting to analyst:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getFilteredNews = (source) => {
        return newsData.filter(item => item.source === source);
    };

    const tabs = [
        { key: 'CSO Online', label: 'CSO Online', icon: '🛡️' },
        { key: 'BleepingComputer', label: 'BleepingComputer', icon: '💻' },
        { key: 'The Hacker News', label: 'The Hacker News', icon: '🔥' }
    ];

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high':
            case 'critical':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'low':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'pending':
                return 'text-gray-600 bg-gray-50 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const filteredNews = getFilteredNews(activeTab);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50" style={{ fontFamily: "'Poppins', 'Arial', sans-serif" }}>
            <TIONavbar />

            <div className="pt-32 px-4 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Submit Data Hub
                    </h1>
                    <p className="text-gray-700 font-medium text-lg">Monitor and submit cybersecurity news in real-time</p>
                </div>

                {/* Tabs */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-orange-200 p-6">
                    <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-orange-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                                    activeTab === tab.key
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40'
                                        : 'text-gray-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-600'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* News Content */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
                            <p className="mt-4 text-gray-700 font-medium">Loading news articles...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNews.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-gray-700 text-lg font-semibold">No articles available for {activeTab}</p>
                                </div>
                            ) : (
                                filteredNews.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border-2 border-orange-200 rounded-xl p-5 hover:shadow-xl hover:shadow-orange-200/50 hover:border-orange-400 transition-all duration-300 bg-gradient-to-r from-orange-50/30 to-amber-50/30"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {item.headline || 'Untitled'}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(item.severityLevel)}`}>
                                                        {item.severityLevel}
                                                    </span>
                                                </div>

                                                {item.url && (
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-orange-600 hover:text-orange-700 text-sm mb-2 inline-flex items-center gap-1 font-semibold hover:underline"
                                                    >
                                                        View Article 
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </a>
                                                )}

                                                <div className="flex items-center gap-3 text-xs text-gray-700 mt-3 flex-wrap">
                                                    <span className="font-semibold">{item.source}</span>
                                                    <span className="text-orange-400">•</span>
                                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-semibold border border-blue-200">
                                                        {item.threatType}
                                                    </span>
                                                    <span className="text-orange-400">•</span>
                                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg font-semibold border border-purple-200">
                                                        {item.threatNature}
                                                    </span>
                                                    {item.collectedAt && (
                                                        <>
                                                            <span className="text-orange-400">•</span>
                                                            <span className="font-medium">{new Date(item.collectedAt).toLocaleString()}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {item.collectedBy && (
                                                    <p className="text-xs text-gray-600 mt-2 font-medium">
                                                        Collected by: {item.collectedBy.username} ({item.collectedBy.email})
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Submit Button at Bottom */}
                    {!loading && filteredNews.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleSubmitClick}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-bold text-base shadow-xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transform"
                            >
                                Submit to Analyst
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn border-2 border-orange-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            Select Security Analyst
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                                Choose an analyst to submit {activeTab} articles:
                            </label>
                            <select
                                value={selectedAnalyst}
                                onChange={(e) => setSelectedAnalyst(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 font-medium text-gray-700 transition-all"
                            >
                                <option value="">Select an analyst...</option>
                                {analysts.map((analyst, index) => (
                                    <option key={index} value={analyst.email}>
                                        {analyst.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border-2 border-orange-200">
                            <p className="text-sm text-gray-800 mb-2 font-medium">
                                <span className="font-bold text-orange-600">Source:</span> {activeTab}
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                                <span className="font-bold text-orange-600">Articles:</span> {filteredNews.length} item(s)
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedAnalyst('');
                                }}
                                className="flex-1 px-4 py-3 border-2 border-orange-300 text-gray-700 rounded-xl hover:bg-orange-50 transition-all duration-200 font-semibold"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitToAnalyst}
                                disabled={!selectedAnalyst || submitting}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/40"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}

export default SubmitData;