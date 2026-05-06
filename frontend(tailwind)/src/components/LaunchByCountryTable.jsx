import React, { useEffect, useState } from "react";
import axios from "axios";

const LaunchByCountryTable = () => {
  const [data, setData] = useState([]);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://space-mission-dashboard.onrender.com/api/launch-summary-by-country")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.error("Expected array but got:", res.data);
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCountry = async (country) => {
    if (expandedCountry === country) {
      setExpandedCountry(null);
      setLocationData([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://space-mission-dashboard.onrender.com/api/launch-sites-by-country?country=${country}`
      );
      if (Array.isArray(res.data)) {
        setExpandedCountry(country);
        setLocationData(res.data);
      } else {
        console.error("Invalid data returned for", country, res.data);
        setExpandedCountry(null);
        setLocationData([]);
      }
    } catch (err) {
      console.error("Error fetching launch sites:", err);
      setExpandedCountry(null);
      setLocationData([]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        {/* 🚀 Rocket Loader */}
        <div className="animate-bounce text-4xl">🚀</div>
        <span className="mt-2 text-gray-500 dark:text-gray-300">Loading launch summary...</span>
      </div>
    );
  }

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-slate-800 shadow-md rounded-xl">
      <header className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-white">
          🌍 Launch Summary by Country
        </h2>
      </header>
      <div className="p-3 overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="text-xs uppercase text-gray-400 bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
            <tr>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-center">Total Launches</th>
              <th className="p-2 text-center">Successful</th>
              <th className="p-2 text-center">Failed</th>
              <th className="p-2 text-center">Active Programs</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-100 divide-y divide-gray-100 dark:divide-slate-700">
            {data?.length ? (
              data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    onClick={() => toggleCountry(row.country)}
                  >
                    <td className="p-2 font-medium">
                      {expandedCountry === row.country ? "▼" : "▶"} {row.country}
                    </td>
                    <td className="p-2 text-center">{row.total_launches}</td>
                    <td className="p-2 text-center">{row.successful}</td>
                    <td className="p-2 text-center">{row.failed}</td>
                    <td className="p-2 text-center">{row.active_programs}</td>
                  </tr>

                  {expandedCountry === row.country &&
                    Array.isArray(locationData) &&
                    locationData.map((loc, i) => (
                      <tr
                        key={`${row.country}-loc-${i}`}
                        className="bg-gray-50 dark:bg-slate-700 text-sm"
                      >
                        <td className="p-2 pl-6 text-gray-600 dark:text-gray-200">
                          ↳ {loc.location}
                        </td>
                        <td className="p-2 text-center">{loc.total_launches}</td>
                        <td className="p-2 text-center">{loc.successful}</td>
                        <td className="p-2 text-center">{loc.failed}</td>
                        <td className="p-2 text-center">{loc.active_programs}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center text-red-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaunchByCountryTable;
