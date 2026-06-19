import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiBookOpen, FiClock, FiShield, FiUserPlus, FiSun, FiMoon } from 'react-icons/fi';
import Button from '../components/common/Button';

const Register = () => {
  const { register: registerUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
      department: '',
      year: 1,
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    // Strip confirmPassword before sending to backend DTO
    const { confirmPassword, ...registerData } = data;
    const payload = {
      ...registerData,
      year: parseInt(data.year, 10),
    };

    const res = await registerUser(payload);
    setLoading(false);

    if (res.success) {
      toast.success(res.message || 'Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Registration failed. Check inputs.');
    }
  };

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Information Technology',
    'Business Administration',
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased transition-colors duration-500">
      {/* Liquid Glass and Custom Keyframes Animation */}
      <style>{`
        .form-input {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: var(--text-main);
        }
        .dark .form-input {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: var(--text-main);
        }
        .form-input:focus {
          background: rgba(255, 255, 255, 0.85);
          border-color: var(--btn-primary-bg);
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }
        .dark .form-input:focus {
          background: rgba(0, 0, 0, 0.45);
          border-color: var(--btn-primary-bg);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
        }
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
        type="button"
        className="absolute top-6 right-6 p-3 bg-white/40 dark:bg-black/10 border border-black/[0.04] dark:border-white/[0.05] rounded-full text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-white/70 dark:hover:bg-white/[0.03] transition-all cursor-pointer shadow-sm z-20"
        aria-label="Toggle Theme"
      >
        {darkMode ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5" />}
      </button>

      {/* Premium Fluid Background Reflections */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-black/[0.01] dark:bg-white/[0.01] blur-[130px] animate-fluid pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-[#86868B]/3 dark:bg-[#ffffff]/2 blur-[130px] animate-fluid-delayed pointer-events-none" />

      <div className="relative w-full max-w-[620px] z-10 reveal-in-animation px-4 py-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1D1D1F] dark:bg-[#F5F5F7] text-[#F5F5F7] dark:text-[#1D1D1F] font-black text-2xl shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
              S
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              StudySync
            </span>
          </Link>
          <p className="text-sm text-[#6E6E73] dark:text-[#86868B] mt-3 font-medium">
            Create your account to start collaborating
          </p>
        </div>

        {/* Liquid Glassmorphism Card */}
        <div className="glass-panel p-8 md:p-10 rounded-[28px] relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 text-xs font-semibold form-input rounded-full placeholder-slate-450 focus:outline-none transition-all duration-200 ${
                      errors.name ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : ''
                    }`}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      maxLength: { value: 50, message: 'Name must be under 50 characters' },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3 text-xs font-semibold form-input rounded-full placeholder-slate-455 focus:outline-none transition-all duration-200 ${
                      errors.email ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : ''
                    }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 text-xs font-semibold form-input rounded-full placeholder-slate-455 focus:outline-none transition-all duration-200 ${
                      errors.password ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : ''
                    }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 text-xs font-semibold form-input rounded-full placeholder-slate-455 focus:outline-none transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : ''
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === password || 'Passwords do not match',
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Department */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Academic Department
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiBookOpen className="w-4 h-4" />
                  </div>
                  <select
                    className={`w-full pl-11 pr-8 py-3 text-xs font-semibold form-input rounded-full focus:outline-none transition-all duration-200 ${
                      errors.department ? 'border-red-500/50 focus:ring-red-500/10' : ''
                    }`}
                    {...register('department', { required: 'Department is required' })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                  Academic Year
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <select
                    className="w-full pl-11 pr-8 py-3 text-xs font-semibold form-input rounded-full focus:outline-none transition-all duration-200"
                    {...register('year', { required: true })}
                  >
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role / User Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                Register As
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                  <FiShield className="w-4 h-4" />
                </div>
                <select
                  className="w-full pl-11 pr-8 py-3 text-xs font-semibold form-input rounded-full focus:outline-none transition-all duration-200"
                  {...register('role', { required: true })}
                >
                  <option value="STUDENT">Student (Standard User)</option>
                  <option value="ADMIN">Administrator (Group Creator)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 text-xs font-bold bg-[#1D1D1F] hover:bg-[#2D2D2F] text-[#F5F5F7] dark:bg-[#F5F5F7] dark:hover:bg-[#E8E8ED] dark:text-[#1D1D1F] rounded-full shadow-sm hover:shadow active:scale-[0.98] hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Registering...</span>
                  </span>
                ) : (
                  <>
                    <FiUserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prompt Sign in */}
          <div className="text-center mt-6 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] text-xs text-[#6E6E73] dark:text-[#86868B] relative z-10">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
