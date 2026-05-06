import React from "react";

const RocketLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-12 h-12 animate-bounce text-blue-500 dark:text-blue-400"
      >
        <path
          fill="currentColor"
          d="M12 2c-.3 0-.6.1-.8.3l-4 4c-.4.4-.4 1 0 1.4l.9.9-1.8 1.8c-.4.4-.4 1 0 1.4l1 1c.4.4 1 .4 1.4 0l1.8-1.8.9.9c.4.4 1 .4 1.4 0l4-4c.4-.4.4-1 0-1.4l-4-4C12.6 2.1 12.3 2 12 2zm-6 16c0 2.2 1.8 4 4 4 .5 0 1-.1 1.5-.3l-5.2-5.2c-.2.5-.3 1-.3 1.5zm6-2l6 6c.3-.5.5-1.1.5-1.7 0-2.2-1.8-4-4-4-.6 0-1.2.2-1.7.5z"
        />
      </svg>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Loading data...
      </p>
    </div>
  );
};

export default RocketLoader;
