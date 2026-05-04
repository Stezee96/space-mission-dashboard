import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './partials/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Missions from './pages/Missions';
import AboutMe from './pages/AboutMe';
import './css/style.css';
import './charts/ChartjsConfig';

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          />
          <Route
            path="/analytics"
            element={<Analytics sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          />
          <Route
            path="/missions"
            element={<Missions sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          />
          <Route
            path="/about"
            element={<AboutMe sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          />
        </Routes>
      </div>
    </div>
  );
}
