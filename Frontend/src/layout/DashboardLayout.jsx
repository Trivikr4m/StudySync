import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F5F5F7] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300">
      {/* Decorative blurred background glow blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.04),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,113,227,0.015),transparent_70%)] blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.03),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(168,85,247,0.008),transparent_70%)] blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.015),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.004),transparent_70%)] blur-[100px] pointer-events-none z-0" />

      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content column */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Top Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 bg-transparent transition-colors duration-300">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex-1 pb-10">
                  {children}
                </div>
                <Footer />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
