// src/pages/AboutMe.jsx
import React, { useState } from "react";
import Header from "../partials/Header";
import Banner from "../partials/Banner";

function AboutMe({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Steven J. Siciliano
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Data Analyst · Full-Stack Developer · Former Army Sergeant
            </p>
          </div>

          {/* Professional Overview */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <p className="text-gray-700 dark:text-gray-300">
              I am a data analyst and developer experienced in building full-stack applications and predictive models. After nearly a decade serving as a Non-Commissioned Officer in the U.S. Army, I transitioned into tech with a focus on Python, SQL, React, and machine learning. My projects emphasize clean, reliable solutions that help organizations make informed decisions.
            </p>
          </div>

          {/* Core Skills */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Core Skills</h2>
            <ul className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              <li>✅ Data Analysis & Visualization (Python, Pandas, Matplotlib)</li>
              <li>✅ Backend Development (FastAPI, PostgreSQL)</li>
              <li>✅ Frontend Development (React, Tailwind CSS)</li>
              <li>✅ Machine Learning (Scikit-learn, Predictive Modeling)</li>
              <li>✅ Web Performance Optimization</li>
              <li>✅ Leadership & Project Management</li>
            </ul>
          </div>

          {/* Featured Project */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Featured Project</h2>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Space Risk Analysis Tool:</strong> A web-based dashboard that analyzes historical mission data to estimate launch risks, combining a React frontend, FastAPI backend, and PostgreSQL database. Integrated machine learning models predict mission success probabilities and visualize risk factors.
            </p>
          </div>

          {/* Professional Timeline */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Professional Timeline</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>🎖 <strong>Army Non-Commissioned Officer (2013–2022):</strong> Transportation Manager, earned multiple leadership awards.</li>
              <li>🎓 <strong>B.S. in Computer Science – Farmingdale State College</strong></li>
              <li>💻 <strong>Data Analyst & Developer – Kelm Media:</strong> Database design, admissions system improvements, frontend performance optimization.</li>
              <li>🚀 <strong>Personal Projects:</strong> Interactive mission dashboard, predictive modeling tools.</li>
            </ul>
          </div>

          {/* Certificates */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Certificates</h2>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li>- Codecademy – Learn Python for Data Science</li>
              <li>- Coursera – Python for Data Science, AI & Development (IBM)</li>
              <li>- Coursera – Data Science Methodology (IBM)</li>
            </ul>
          </div>

          {/* External Links */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Contact & Links</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://github.com/Stezee96" target="_blank" rel="noopener noreferrer" className="bg-violet-500 text-white px-4 py-2 rounded text-center">GitHub</a>
              <a href="https://linkedin.com/in/stevensiciliano" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded text-center">LinkedIn</a>
              <a href="#" className="bg-gray-600 text-white px-4 py-2 rounded text-center">Main Biography (Coming Soon)</a>
            </div>
          </div>

          {/* Callout */}
          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg text-center">
            🎯 <em>Looking for more detail?</em> My full biography and portfolio website is in development.
          </div>
        </div>
      </main>

      <Banner />
    </div>
  );
}

export default AboutMe;
