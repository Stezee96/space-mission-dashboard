import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.webp"; 

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-4 transition-colors duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:static lg:translate-x-0`}
      >
        {/* Logo and close button */}
        <div className="flex justify-between items-center mb-10">
          <NavLink to="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="AstroRisk Logo"
              width="100"
              height="40"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-800 dark:text-white">AstroRisk</span>
          </NavLink>

          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-4">
          <NavLink
            end
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm font-medium ${
                isActive ? "bg-violet-500 text-white" : "text-gray-700 hover:bg-gray-200 dark:text-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            end
            to="/analytics"
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm font-medium ${
                isActive ? "bg-violet-500 text-white" : "text-gray-700 hover:bg-gray-200 dark:text-gray-200"
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            end
            to="/missions"
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm font-medium ${
                isActive ? "bg-violet-500 text-white" : "text-gray-700 hover:bg-gray-200 dark:text-gray-200"
              }`
            }
          >
            Missions
          </NavLink>
          <NavLink
            end
            to="/about"
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm font-medium ${
                isActive ? "bg-violet-500 text-white" : "text-gray-700 hover:bg-gray-200 dark:text-gray-200"
              }`
            }
          >
            About Me
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
