import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomeComponents/HomePage';
import SADashboard from './Components/Security Analyst Module/Dashboard';
import TIODashboard from './Components/Threat Intelligence Operator Module/Dashboard';
import CISDashboard from './Components/CISO Alerting Module/Dashboard';
import Login from './Components/HomeComponents/Login';
import TIODirectory from './Components/CISO Alerting Module/TIODirectory';
import SecurityAnalystDirectory from './Components/CISO Alerting Module/SecurityAnalystDirectory';
import CollectData from './Components/Threat Intelligence Operator Module/CollectData';
import SubmitData from './Components/Threat Intelligence Operator Module/SubmitData';
import TIOAnalytics from './Components/Threat Intelligence Operator Module/TIOAnalytics';
import SAViewData from './Components/Security Analyst Module/ViewData';
import SAViewDataAnalysis from './Components/Security Analyst Module/SAAnalysis';
import SAAnalytics from './Components/Security Analyst Module/SAAnalytics';
import AnalyticsAndAlerts from './Components/CISO Alerting Module/AnalyticsAndAlerts';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/tioDB" element={<TIODashboard />} />
        <Route path="/saDB" element={<SADashboard />} />
        <Route path="/cisoDB" element={<CISDashboard />} />
        <Route path="/reg" element={<Login />} />
        <Route path="/cisodct" element={<TIODirectory />} />
        <Route path="/cisosadct" element={<SecurityAnalystDirectory />} />
        <Route path="/tioCD" element={<CollectData />} />
        <Route path="/tioSD" element={<SubmitData />} />
        <Route path="/tioAI" element={<TIOAnalytics />} />
        <Route path="/saCD" element={<SAViewData />} />
        <Route path="/saSD" element={<SAViewDataAnalysis />} />
        <Route path="/saAI" element={<SAAnalytics />} />
        <Route path="/ctisAI" element={<AnalyticsAndAlerts />} />
      </Routes>
    </Router>
  );
}

export default App;
