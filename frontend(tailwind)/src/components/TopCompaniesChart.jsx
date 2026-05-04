import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const companyIcon = "🏢";

  return (
    <div className="bg-white dark:bg-slate-700 p-2 rounded shadow text-black dark:text-white text-xs">
      <div className="flex items-center gap-1 font-semibold">
        <span>{companyIcon}</span>
        <span>{label}</span>
      </div>
      <div>
        {payload.map((p) => (
          <p key={p.dataKey}>
            {p.dataKey}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

const TopCompaniesChart = ({ data, loading }) => {
  console.log("TopCompanies data:", data);
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[400px] flex flex-col justify-start">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span>🏢</span> Top 10 Companies
      </h2>

      {loading || !data ? (
  <div className="flex flex-col items-center justify-center flex-1 h-full py-10 text-gray-500 dark:text-gray-400">
    <div className="animate-bounce text-4xl">🚀</div>
    <p className="mt-2">Loading company data...</p>
  </div>
) : data.length === 0 ? (
  <p className="text-center text-gray-500 dark:text-gray-400 py-10">
    No data available.
  </p>
) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />
            <YAxis
              dataKey="company"
              type="category"
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
              width={150}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mission_count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopCompaniesChart;