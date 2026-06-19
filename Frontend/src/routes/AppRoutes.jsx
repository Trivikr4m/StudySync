import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layout/DashboardLayout';

// Import pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import StudyGroups from '../pages/StudyGroups';
import CreateStudyGroup from '../pages/CreateStudyGroup';
import GroupDetails from '../pages/GroupDetails';
import MyGroups from '../pages/MyGroups';
import Meetings from '../pages/Meetings';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Router Private Guard Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Router Public Guard Component (redirects back to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Landing Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
      {/* Route for private About/Contact when logged in, or fallback. We can expose it for both by mapping accordingly! */}
      <Route path="/about-system" element={<PrivateRoute><DashboardLayout><About /></DashboardLayout></PrivateRoute>} />
      
      <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
      <Route path="/contact-system" element={<PrivateRoute><DashboardLayout><Contact /></DashboardLayout></PrivateRoute>} />

      {/* Auth Pages */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Private Dashboard Pages */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><DashboardLayout><StudyGroups /></DashboardLayout></PrivateRoute>} />
      <Route path="/groups/create" element={<PrivateRoute><DashboardLayout><CreateStudyGroup /></DashboardLayout></PrivateRoute>} />
      <Route path="/groups/:id" element={<PrivateRoute><DashboardLayout><GroupDetails /></DashboardLayout></PrivateRoute>} />
      <Route path="/my-groups" element={<PrivateRoute><DashboardLayout><MyGroups /></DashboardLayout></PrivateRoute>} />
      <Route path="/meetings" element={<PrivateRoute><DashboardLayout><Meetings /></DashboardLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><DashboardLayout><Profile /></DashboardLayout></PrivateRoute>} />

      {/* 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
