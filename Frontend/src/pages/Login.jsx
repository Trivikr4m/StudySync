import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn, FiSun, FiMoon } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Read form bindings
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Display message if session expired
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.warning('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      toast.success(res.message || 'Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased transition-colors duration-500">
      {/* Liquid Glass and Custom Keyframes Animation */}
      <style>{`
        .premium-glass {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(35px) saturate(210%);
          -webkit-backdrop-filter: blur(35px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 
            0 24px 60px rgba(0, 0, 0, 0.03), 
            0 2px 8px rgba(0, 0, 0, 0.01),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .dark .premium-glass {
          background: rgba(26, 26, 28, 0.65);
          backdrop-filter: blur(35px) saturate(210%);
          -webkit-backdrop-filter: blur(35px) saturate(210%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.3), 
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }
        .premium-input {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: #1D1D1F;
        }
        .dark .premium-input {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: #F5F5F7;
        }
        .premium-input:focus {
          background: rgba(255, 255, 255, 0.85);
          border-color: var(--btn-primary-bg);
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }
        .dark .premium-input:focus {
          background: rgba(0, 0, 0, 0.45);
          border-color: var(--btn-primary-bg);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
        }
        @keyframes float-fluid {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.08); }
        }
        @keyframes premium-reveal {
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
        .premium-reveal-in {
          animation: premium-reveal 0.9s cubic-bezier(0.15, 1, 0.3, 1) forwards;
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

      {/* Premium Fluid Background Reflections */}
      <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] rounded-full bg-black/[0.01] dark:bg-white/[0.01] blur-[130px] animate-fluid pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[40rem] h-[40rem] rounded-full bg-[#86868B]/3 dark:bg-[#ffffff]/2 blur-[130px] animate-fluid-delayed pointer-events-none" />

      <div className="relative w-full max-w-[440px] z-10 premium-reveal-in px-4">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#1D1D1F] dark:bg-[#F5F5F7] text-[#F5F5F7] dark:text-[#1D1D1F] font-black text-2xl shadow-sm group-hover:scale-[1.02] transition-transform duration-300">
              S
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              StudySync
            </span>
          </Link>
          <p className="text-sm text-[#6E6E73] dark:text-[#86868B] mt-3 font-medium">
            Sign in to access your study groups & agenda
          </p>
        </div>

        {/* Liquid Glassmorphism Card */}
        <div className="premium-glass p-8 md:p-10 rounded-[30px] relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 text-sm premium-input rounded-2xl placeholder-slate-400/80 focus:outline-none transition-all duration-200 ${
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
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3.5 text-sm premium-input rounded-2xl placeholder-slate-400/80 focus:outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500' : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-semibold bg-[#1D1D1F] hover:bg-[#2D2D2F] text-[#F5F5F7] dark:bg-[#F5F5F7] dark:hover:bg-[#E8E8ED] dark:text-[#1D1D1F] rounded-2xl shadow-sm hover:shadow active:scale-[0.98] hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <FiLogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prompt Sign up */}
          <div className="text-center mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] text-sm text-[#6E6E73] dark:text-[#86868B] relative z-10">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-primary hover:underline transition-all"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
