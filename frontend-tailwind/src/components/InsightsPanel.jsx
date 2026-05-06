import React from "react";

const RocketLoader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-bounce text-4xl">🚀</div>
    <span className="ml-2 text-gray-600 dark:text-gray-300">
      Loading Smart Insights...
    </span>
  </div>
);

const InsightsPanel = ({ data, loading }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        🧠 Smart Insights
      </h2>

      {loading ? (
        <RocketLoader />
      ) : !data || data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No insights available.
        </p>
      ) : (
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-6">
          {data.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InsightsPanel;