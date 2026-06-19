import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu, FiSun, FiMoon, FiBell, FiChevronDown, FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/groups') return 'Study Groups';
    if (path === '/groups/create') return 'Create Group';
    if (path.startsWith('/groups/')) return 'Group Details';
    if (path === '/my-groups') return 'My Groups';
    if (path === '/meetings') return 'Meetings Schedule';
    if (path === '/profile') return 'Account Profile';
    if (path === '/about') return 'About System';
    if (path === '/contact') return 'Contact Directory';
    return 'StudySync';
  };

  return (
    <header className="sticky top-4 z-30 flex items-center justify-between h-16 px-6 mt-4 mx-4 md:mx-8 mb-2 glass-panel rounded-[28px] shadow-sm transition-all duration-300">
      {/* Left Area: Toggle + Title + Date */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-[#6E6E73] rounded-full hover:bg-black/[0.03] lg:hidden dark:text-[#86868B] dark:hover:bg-white/[0.03] transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="w-5.5 h-5.5" />
        </button>
        <div className="flex flex-col select-none">
          <h2 className="hidden sm:block text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            {getPageTitle()}
          </h2>
          <span className="hidden md:inline-block text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Center Area: Spotlight Search Bar */}
      <div className="hidden md:flex items-center relative max-w-[240px] lg:max-w-[280px] w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E6E73] dark:text-[#86868B]">
          <FiSearch className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          placeholder="Spotlight Search..."
          className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#86868B]/60 rounded-full border border-black/[0.03] dark:border-white/[0.04] focus:border-primary/35 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)]"
        />
      </div>

      {/* Right Area: Controls + Profile */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#86868B] dark:hover:text-[#F5F5F7] rounded-full hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all hover:scale-105 active:scale-95"
          aria-label="Toggle Theme"
        >
          {darkMode ? <FiSun className="w-4.5 h-4.5 text-yellow-500 animate-spin-slow" /> : <FiMoon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications Icon (Placeholder) */}
        <button
          className="relative p-2 text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#86868B] dark:hover:text-[#F5F5F7] rounded-full hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all hover:scale-105 active:scale-95"
          aria-label="Notifications"
        >
          <FiBell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="w-px h-4 bg-black/[0.06] dark:bg-white/[0.06]" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all active:scale-[0.98] text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1D1D1F] dark:bg-[#F5F5F7] text-white dark:text-[#1D1D1F] font-bold text-xs border border-black/[0.05] dark:border-white/[0.05]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-xs font-bold">{user?.name}</span>
            <FiChevronDown className="w-3.5 h-3.5 text-[#6E6E73] dark:text-[#86868B]" />
          </button>

          {dropdownOpen && (
            <>
              {/* Overlay Backdrop to close */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 z-20 w-48 mt-2.5 origin-top-right glass-panel border border-black/[0.05] dark:border-white/[0.05] rounded-[20px] shadow-[0_12px_36px_rgba(0,0,0,0.06)] animate-fade-in focus:outline-none overflow-hidden p-1.5">
                <div className="py-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <FiUser className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-[14px] text-xs font-bold text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
