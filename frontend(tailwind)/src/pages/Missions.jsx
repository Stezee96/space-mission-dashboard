import React, { useEffect, useState } from 'react';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import MissionTable from '../components/MissionTable';
import axios from 'axios';

function Missions({ sidebarOpen, setSidebarOpen }) {
  const [rockets, setRockets] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [statuses] = useState(["Success", "Failure", "Partial Failure", "Prelaunch Failure"]);

  const [selectedRocket, setSelectedRocket] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startYear, setStartYear] = useState(1957);
  const [endYear, setEndYear] = useState(2025);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://space-analysis-backend.onrender.com/api/distinct-values").then((res) => {
      setRockets(res.data.rockets || []);
      setCompanies(res.data.companies || []);
    });
  }, []);

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">🚀 Mission Log</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base mt-1">
                View historical launch data with status, rocket, and more.
              </p>
            </div>
          </div>

          {/* Filter UI */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <select value={selectedRocket} onChange={(e) => setSelectedRocket(e.target.value)} className="border p-2 rounded">
              <option value="">All Rockets</option>
              {rockets.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="border p-2 rounded">
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border p-2 rounded">
              <option value="">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Search Mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Data Table */}
          <MissionTable
            rocket={selectedRocket}
            company={selectedCompany}
            status={selectedStatus}
            startYear={startYear}
            endYear={endYear}
            search={search}
          />
        </div>
      </main>

      <Banner />
    </div>
  );
}

export default Missions;
