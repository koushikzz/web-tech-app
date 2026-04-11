import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import Ledger from './pages/Ledger';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div className="app-layout">
        <Sidebar />
        <div className="main-scroll-area">
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </div>
    </div>
  );
}

export default App;
