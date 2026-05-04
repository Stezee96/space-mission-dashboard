import React from 'react';
import Header from '../partials/Header';
import Banner from '../partials/Banner';
import PredictForm from "../components/PredictionForm";
import RocketStatusBarChart from "../components/RocketStatusBarChart";

// Example ML/Analytics components
const MissionRiskPrediction = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[300px]">
    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
      Mission Risk Prediction
    </h2>
    <PredictForm /> {/* ⬅️ Render the actual prediction form */}
  </div>
);

const FeatureCorrelationHeatmap = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[300px]">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
      Feature Correlation Heatmap
    </h2>
    <RocketStatusBarChart />
  </div>
);

function Analytics({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Title */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                📊 Analytics & Machine Learning
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base mt-1">
                In-depth analysis, predictions, and data science insights.
              </p>
            </div>
          </div>

          {/* Analytics Components */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <MissionRiskPrediction />
            </div>
            <div className="col-span-12">
              <FeatureCorrelationHeatmap />
            </div>
          </div>
        </div>
      </main>

      <Banner />
    </div>
  );
}

export default Analytics;
