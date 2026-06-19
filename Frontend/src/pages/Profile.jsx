import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import groupService from '../services/groupService';
import meetingService from '../services/meetingService';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiMail, 
  FiBookOpen, 
  FiClock, 
  FiKey, 
  FiShield, 
  FiSave, 
  FiAward, 
  FiZap, 
  FiCalendar, 
  FiActivity, 
  FiCheckSquare,
  FiUsers,
  FiExternalLink
} from 'react-icons/fi';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, updateUserProfileState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Custom states for statistics
  const [myGroups, setMyGroups] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [fetchingStats, setFetchingStats] = useState(true);

  const fetchStats = async () => {
    try {
      const groupsRes = await groupService.getAllGroups({ size: 100 });
      if (groupsRes.success && groupsRes.data) {
        const allGroups = groupsRes.data.content || [];
        const localJoined = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
        const localJoinedSet = new Set(localJoined);
        const filtered = allGroups.filter(g => 
          g.createdBy?.id === user?.id || 
          localJoinedSet.has(g.id)
        );
        setMyGroups(filtered);
      }
      
      const meetingsRes = await meetingService.getAllMeetings();
      if (meetingsRes.success && meetingsRes.data) {
        setMeetings(meetingsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load profile stats data', err);
    } finally {
      setFetchingStats(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  // Form bindings
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      password: '',
      department: user?.department || '',
      year: user?.year || 1,
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        department: data.department,
        year: parseInt(data.year, 10),
      };

      // Only include password if user filled it in
      if (data.password && data.password.trim() !== '') {
        payload.password = data.password;
      }

      const res = await userService.updateProfile(payload);
      if (res.success && res.data) {
        toast.success(res.message || 'Profile updated successfully!');
        
        // Sync context state
        updateUserProfileState(res.data);
        setEditing(false);
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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

  const achievementsList = [
    {
      id: 'founder',
      name: 'Circle Founder',
      desc: 'Owner of a study circle',
      icon: FiBookOpen,
      color: 'from-neutral-400/10 to-neutral-600/10 text-main border-color',
      unlocked: myGroups.some(g => g.createdBy?.id === user?.id),
    },
    {
      id: 'collaborator',
      name: 'Active Member',
      desc: 'Member of a study circle',
      icon: FiUsers,
      color: 'from-neutral-400/10 to-neutral-600/10 text-main border-color',
      unlocked: myGroups.length > 0,
    },
    {
      id: 'scholar',
      name: 'Consistent Scholar',
      desc: 'Joined 3+ study circles',
      icon: FiAward,
      color: 'from-neutral-400/10 to-neutral-600/10 text-main border-color',
      unlocked: myGroups.length >= 3,
    },
    {
      id: 'earlybird',
      name: 'Meeting Scholar',
      desc: 'Scheduled a meeting session',
      icon: FiClock,
      color: 'from-neutral-400/10 to-neutral-600/10 text-main border-color',
      unlocked: meetings.length > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-4 animate-fade-in">
      {/* Header Info */}
      <div className="space-y-1 select-none">
        <h1 className="text-[28px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-3">
          <FiUser className="text-main w-6 h-6" />
          Account Settings
        </h1>
        <p className="text-[13px] font-medium text-[#6E6E73] dark:text-[#86868B] mt-1">
          Manage your personal credentials, credentials security, achievements, and study circles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar & Summary (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Large Profile Summary Card */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm flex flex-col items-center text-center space-y-5 border border-black/[0.02] dark:border-white/[0.02] relative overflow-hidden">
            {/* Glow blobs inside card */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-primary/8 rounded-full blur-[30px] pointer-events-none" />
            
            <div className="relative group select-none">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neutral-400 to-neutral-600 opacity-10 group-hover:opacity-25 transition-opacity duration-300 blur-[8px]" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-neutral-400/10 to-neutral-600/10 text-main font-extrabold text-4xl shadow-sm border border-color">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
            <div className="space-y-1 select-none">
              <h2 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] truncate max-w-[220px] tracking-tight">{user?.name}</h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-50 text-main text-[9px] font-black uppercase tracking-wider border border-color">
                {user?.role}
              </span>
            </div>

            <div className="w-full text-xs border-t border-black/[0.04] dark:border-white/[0.04] pt-5 text-left space-y-3 text-[#6E6E73] dark:text-[#86868B] font-medium select-none">
              <div className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center">
                  <FiMail className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center">
                  <FiBookOpen className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <span className="truncate">{user?.department || 'General'}</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <span>Year {user?.year} Student</span>
              </div>
            </div>
          </div>

          {/* Activity Ring & Streak Card */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm space-y-5 border border-black/[0.02] dark:border-white/[0.02] select-none">
            <h3 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
              Study Streak
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-50 text-main flex items-center justify-center animate-pulse-subtle">
                <FiZap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">0 Days</p>
                <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Active Study Streak</p>
              </div>
            </div>

            {/* Activity Rings mock week deck */}
            <div className="grid grid-cols-7 gap-2 pt-3 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const checked = false; // All active days reset to false
                return (
                  <div key={i} className="space-y-1.5">
                    <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B]">{day}</span>
                    <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                      checked
                        ? 'bg-primary text-primary-text border-primary shadow-sm'
                        : 'bg-black/[0.02] dark:bg-white/5 border-black/[0.04] dark:border-white/[0.04] text-[#6E6E73]/40'
                    }`}>
                      {checked ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Editor Form & Stats (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Personal Details & Security Credentials Form */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.04] mb-6 select-none">
              <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                Personal Credentials & Security
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 border border-primary rounded-full transition-all duration-300 cursor-pointer select-none"
                >
                  Edit Profile
                </button>
              ) : (
                <span className="text-[10px] font-black text-main uppercase tracking-wider">Editing Profile Details</span>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!editing}
                    className={`w-full pl-11 pr-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                      errors.name ? 'border-red-400' : 'border-black/[0.02] dark:border-white/[0.02]'
                    }`}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      maxLength: { value: 50, message: 'Name must be under 50 characters' },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-[9px] text-red-500 mt-0.5 font-bold">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Always Read-only on backend) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#6E6E73]/50 dark:text-[#86868B]/40 uppercase tracking-wider">
                  Campus Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-[#6E6E73]/40">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-11 pr-4 py-3 text-xs font-semibold bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.01] dark:border-white/[0.01] rounded-full text-[#6E6E73]/50 dark:text-[#86868B]/50 cursor-not-allowed select-none font-semibold"
                  />
                </div>
                <span className="text-[9px] text-[#6E6E73]/60 dark:text-[#86868B]/40 italic select-none">Login email address cannot be changed</span>
              </div>

              {/* Password (Optional change) */}
              {editing && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
                    Update Password (leave blank if keeping current)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                      <FiKey className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 ${
                        errors.password ? 'border-red-400' : 'border-black/[0.02] dark:border-white/[0.02]'
                      }`}
                      {...register('password', {
                        minLength: { value: 6, message: 'New password must be at least 6 characters' },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[9px] text-red-500 mt-0.5 font-bold">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
                    Academic Department
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                      <FiBookOpen className="w-4 h-4" />
                    </div>
                    <select
                      disabled={!editing}
                      className="w-full pl-11 pr-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      {...register('department', { required: true })}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Academic Year */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
                    Curriculum Year
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-[#6E6E73] dark:text-[#86868B]">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <select
                      disabled={!editing}
                      className="w-full pl-11 pr-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      {...register('year', { required: true })}
                    >
                      {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              {editing && (
                <div className="flex gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] mt-6">
                  <button
                    type="button"
                    className="flex-1 py-2.5 px-4 text-xs font-bold bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    onClick={() => {
                      reset();
                      setEditing(false);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={loading}
                  >
                    <FiSave className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Study & Meeting Statistics Cards deck */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] space-y-6 select-none">
            <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Study Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] text-center space-y-1">
                <FiUsers className="w-5 h-5 mx-auto text-main" />
                <p className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">{myGroups.length}</p>
                <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Joined Circles</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] text-center space-y-1">
                <FiCalendar className="w-5 h-5 mx-auto text-main" />
                <p className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">{meetings.length}</p>
                <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Sessions Joined</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] text-center space-y-1">
                <FiCheckSquare className="w-5 h-5 mx-auto text-main" />
                <p className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">0</p>
                <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Tasks Complete</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] text-center space-y-1">
                <FiActivity className="w-5 h-5 mx-auto text-main" />
                <p className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">0 hrs</p>
                <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Active Learning</p>
              </div>
            </div>
          </div>

          {/* Dynamic Achievements metal badges deck */}
          <div className="glass-card p-8 rounded-[28px] shadow-sm border border-black/[0.02] dark:border-white/[0.02] space-y-6 select-none">
            <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Study Achievements & Badges
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {achievementsList.map((ach) => {
                const Icon = ach.icon;
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      ach.unlocked
                        ? `bg-black/[0.02] dark:bg-white/[0.02] ${ach.color.split(' ')[2]} ${ach.color.split(' ')[3] || 'border-color'}`
                        : 'bg-black/[0.01] dark:bg-white/[0.01] border-black/[0.02] dark:border-white/[0.02] opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br border ${
                      ach.unlocked
                        ? ach.color.split(' ').slice(0, 2).join(' ') + ' border-color shadow-sm'
                        : 'from-black/5 to-black/10 dark:from-white/5 dark:to-white/10 border-transparent'
                    }`}>
                      <Icon className="w-5 h-5 text-inherit" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
                        <span>{ach.name}</span>
                        {ach.unlocked && (
                          <span className="text-[8px] font-black uppercase tracking-wider bg-primary-50 border border-color text-main px-1.5 py-0.5 rounded-full select-none">
                            Unlocked
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-medium mt-0.5">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

};

export default Profile;
