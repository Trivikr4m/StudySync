import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft, FiGrid, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans antialiased transition-colors duration-500">
      {/* Liquid Glass styles */}
      <style>{`
        @keyframes float-fluid {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes reveal-in {
          from { opacity: 0; transform: scale(0.98) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fluid {
          animation: float-fluid 15s infinite alternate ease-in-out;
        }
        .animate-fluid-delayed {
          animation: float-fluid 20s infinite alternate-reverse ease-in-out;
          animation-delay: 3s;
        }
        .reveal-in-animation {
          animation: reveal-in 0.9s cubic-bezier(0.15, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Sleek Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 bg-white/40 dark:bg-black/10 border border-black/[0.04] dark:border-white/[0.05] rounded-full text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-white/70 dark:hover:bg-white/[0.03] transition-all cursor-pointer shadow-sm z-20"
        aria-label="Toggle Theme"
      >
        {darkMode ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5" />}
      </button>

      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-black/[0.01] dark:bg-white/[0.01] blur-[130px] animate-fluid pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] rounded-full bg-[#86868B]/3 dark:bg-[#ffffff]/2 blur-[130px] animate-fluid-delayed pointer-events-none" />
      
      <div className="relative w-full max-w-md z-10 reveal-in-animation px-4">
        {/* Brand Header */}
        <div className="text-center mb-8 select-none">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1D1D1F] dark:bg-[#F5F5F7] text-[#F5F5F7] dark:text-[#1D1D1F] font-black text-2xl shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
              S
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              StudySync
            </span>
          </Link>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-[30px] space-y-6 text-center shadow-sm">
          {/* Visual Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 border border-red-500/10 select-none">
            <FiAlertOctagon className="w-8 h-8" />
          </div>

          {/* Text Details */}
          <div className="space-y-2 select-none">
            <h1 className="text-5xl font-black text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">404</h1>
            <h2 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Page Not Found</h2>
            <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed max-w-xs mx-auto font-medium">
              Sorry, the page you are looking for does not exist or has been moved to another path.
            </p>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-col gap-3 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 text-xs font-bold text-white bg-[#111111] hover:bg-[#222222] dark:bg-white dark:hover:bg-[#eeeeee] dark:text-black rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiGrid className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 text-xs font-bold text-white bg-[#111111] hover:bg-[#222222] dark:bg-white dark:hover:bg-[#eeeeee] dark:text-black rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            )}
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center text-xs font-bold text-[#6E6E73] dark:text-[#86868B] hover:text-primary hover:underline transition-all py-2"
            >
              Contact System Administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
