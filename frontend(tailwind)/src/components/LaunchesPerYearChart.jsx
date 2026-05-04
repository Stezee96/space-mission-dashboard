import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const launchIcon = "🚀";

  return (
    <div className="bg-white dark:bg-slate-700 p-2 rounded shadow text-black dark:text-white text-xs">
      <div className="flex items-center gap-1 font-semibold">
        <span>{launchIcon}</span>
        <span>Year: {label}</span>
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

const LaunchesPerYearChart = ({ data, loading }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  const labelColor = isDark ? "#d1d5db" : "#334155";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-slate-800 rounded-xl shadow-md min-h-[400px]">
        <div className="animate-bounce text-4xl">🚀</div>
        <span className="mt-2 text-gray-500 dark:text-gray-300">
          Loading launches per year...
        </span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No data available.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[400px]">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span>📈</span> Launches Per Year
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis
            dataKey="year"
            stroke={labelColor}
            tick={{ fill: labelColor, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: labelColor }}
          >
            <Label value="Year" offset={-5} position="insideBottom" fill={labelColor} />
          </XAxis>

          <YAxis
            stroke={labelColor}
            tick={{ fill: labelColor, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: labelColor }}
          >
            <Label
              value="Launches"
              angle={-90}
              position="insideLeft"
              fill={labelColor}
            />
          </YAxis>

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="count"
            fill="#f59e0b"
            className="hover:fill-amber-500 transition-colors duration-200"
          />
        </BarChart>
      </ResponsiveContainer>

      <style jsx="true">{`
        :root.dark .recharts-cartesian-axis-tick-value {
          fill: #d1d5db;
        }
        :root.dark .recharts-cartesian-axis-line,
        :root.dark .recharts-cartesian-grid-horizontal line,
        :root.dark .recharts-cartesian-grid-vertical line {
          stroke: #475569;
        }
        :root.dark .recharts-bar-rectangle path {
          fill: #4ade80 !important;
          stroke: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default LaunchesPerYearChart;