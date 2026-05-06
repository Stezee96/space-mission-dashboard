import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MissionsTable = ({ rocket, company, status, startYear, endYear, search }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://space-mission-dashboard.onrender.com/api/missions", {
          params: {
            rocket,
            company,
            status,
            start_year: startYear,
            end_year: endYear,
            search
          },
        });
        setMissions(res.data);
      } catch (err) {
        console.error("Failed to fetch missions", err);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [rocket, company, status, startYear, endYear, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-bounce text-4xl">🚀</div>
        <span className="mt-2 text-gray-600 dark:text-gray-300">Loading missions...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-slate-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Mission</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Rocket</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          {missions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">No missions found.</td>
            </tr>
          ) : (
            missions.map((mission, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">{mission.mission}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">{mission.rocket}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">{mission.company}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">{mission.location}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">{mission.mission_status}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">
                  {new Date(mission.launch_date).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MissionsTable;
