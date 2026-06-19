import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiGrid, 
  FiUsers, 
  FiBookmark, 
  FiCalendar, 
  FiUser, 
  FiInfo, 
  FiMail, 
  FiLogOut,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Study Groups', path: '/groups', icon: FiUsers },
    { name: 'My Groups', path: '/my-groups', icon: FiBookmark },
    { name: 'Meetings', path: '/meetings', icon: FiCalendar },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'About', path: '/about', icon: FiInfo },
    { name: 'Contact', path: '/contact', icon: FiMail },
  ];

  return (
    <>
      {/* Mobile Offcanvas Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#1D1D1F]/20 dark:bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 transition-all duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white/95 dark:bg-[#0D0D0F]/95 border-r border-[#1D1D1F]/5 dark:border-white/5 lg:border lg:my-4 lg:ml-4 lg:rounded-[28px] lg:h-[calc(100vh-2rem)] lg:glass-panel lg:shadow-[0_10px_40px_rgba(0,0,0,0.12)]`}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-extrabold text-base border border-black/[0.04] dark:border-white/[0.04] shadow-sm animate-pulse-subtle">
              S
            </div>
            <span className="text-lg font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] font-sans">
              StudySync
            </span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 text-[#6E6E73] rounded-full hover:bg-black/[0.03] lg:hidden dark:text-[#86868B] dark:hover:bg-white/[0.03]"
            aria-label="Close Sidebar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 mx-4 mt-6 rounded-[20px] bg-white/40 dark:bg-black/10 border border-black/[0.03] dark:border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1D1D1F]/5 dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.04] font-bold text-xs select-none">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">{user?.name}</p>
              <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-medium tracking-wide uppercase select-none">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 mt-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-[18px] text-[13px] font-bold tracking-tight transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#111111] dark:bg-white/12 text-white border border-[#111111] dark:border-white/15 shadow-sm'
                      : 'text-[#6E6E73] dark:text-[#86868B] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-black/[0.04] dark:border-white/[0.04]">
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-[18px] text-[13px] font-bold text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 active:scale-[0.97] transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
