import React from "react";

const GlobalFilterPanel = ({ filters, setFilters, compact = false }) => {
  const countries = [
    "All", "United States", "Russia", "China", "Japan", "India", "France",
    "New Zealand", "Iran", "South Korea", "North Korea", "Kenya", "Brazil"
  ];

  const statuses = ["All", "Success", "Failure"];

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleCountryChange = (e) => {
    setFilters({ ...filters, country: e.target.value });
  };

  const handleYearChange = (e, index) => {
    const updatedRange = [...filters.yearRange];
    updatedRange[index] = parseInt(e.target.value);
    setFilters({ ...filters, yearRange: updatedRange });
  };

  const wrapperClass = compact
    ? "mb-4"
    : "bg-white dark:bg-slate-800 shadow rounded-xl p-6 mb-8";

  return (
    <div className={wrapperClass}>
      {!compact && (
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🔍 Filters
        </h2>
      )}
      <div
        className={
          compact
            ? "grid grid-cols-1 md:grid-cols-3 gap-2 items-center text-sm"
            : "grid grid-cols-1 sm:grid-cols-3 gap-4"
        }
      >
        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mission Status
          </label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="form-select w-full dark:bg-slate-700 dark:text-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <select
            value={filters.country}
            onChange={handleCountryChange}
            className="form-select w-full dark:bg-slate-700 dark:text-white"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Launch Year Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1957"
              max="2023"
              value={filters.yearRange[0]}
              onChange={(e) => handleYearChange(e, 0)}
              className="form-input w-1/2 dark:bg-slate-700 dark:text-white"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="number"
              min="1957"
              max="2023"
              value={filters.yearRange[1]}
              onChange={(e) => handleYearChange(e, 1)}
              className="form-input w-1/2 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilterPanel;
