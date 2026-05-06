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

  return (
    <div className="bg-white dark:bg-slate-700 p-2 rounded shadow text-black dark:text-white text-xs">
      <div className="font-semibold">{label}</div>
      <div>
        Count: <span className="font-bold">{payload[0].value}</span>
      </div>
    </div>
  );
};

const MissionStatusChart = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-md min-h-[400px]">
        <div className="animate-bounce text-4xl">🚀</div>
        <span className="mt-2 text-gray-500 dark:text-gray-300">
          Loading mission status...
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[400px]">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span>🚀</span> Mission Status
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis
            dataKey="mission_status"
            stroke="#334155"
            tick={{ fill: "#334155", fontSize: 12 }}
          />
          <YAxis
            stroke="#334155"
            tick={{ fill: "#334155", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MissionStatusChart;