import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  BarChart,
  Bar
} from "recharts";

const HeatmapLaunches = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://space-mission-dashboard.onrender.com/api/heatmap-data")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Heatmap data fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const getColor = (status) => {
    switch (status) {
      case "Success":
        return "#34d399";
      case "Failure":
        return "#f87171";
      case "Partial Failure":
        return "#fbbf24";
      case "Prelaunch Failure":
        return "#60a5fa";
      default:
        return "#d1d5db";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[400px] flex flex-col justify-start">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        🚀 Mission Outcomes by Rocket Status
      </h2>

      <div className="w-full h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-bounce text-4xl">🚀</div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading heatmap...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="rocket_status" />
              <Tooltip />
              <Bar dataKey="count" name="Count">
                <LabelList dataKey="mission_status" position="right" />
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.mission_status)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default HeatmapLaunches;
