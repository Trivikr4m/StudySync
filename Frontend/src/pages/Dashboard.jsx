import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import dashboardService from '../services/dashboardService';
import meetingService from '../services/meetingService';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiCheckSquare, 
  FiPlus, 
  FiSearch, 
  FiActivity,
  FiBell,
  FiArrowRight,
  FiTrendingUp,
  FiCheck,
  FiBookOpen
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-3 py-2.5 rounded-[16px] border border-black/[0.04] dark:border-white/[0.04] text-[11px] shadow-sm select-none">
        <p className="font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] mb-0.5">{label}</p>
        <p className="font-bold text-main">{payload[0].name}: {payload[0].value} hrs</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Premium task list state for dashboard checklist
  const [localTasks, setLocalTasks] = useState([]);

  const toggleTask = (id) => {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedTasksCount = localTasks.filter(t => t.completed).length;
  const taskProgressPercent = localTasks.length > 0 ? Math.round((completedTasksCount / localTasks.length) * 100) : 0;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await dashboardService.getDashboardStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }

        const meetingsRes = await meetingService.getAllMeetings();
        if (meetingsRes.success) {
          // Sort by date ascending and take upcoming ones
          const now = new Date();
          const getMeetingDateTime = (m) => new Date(m.meetingDate + 'T' + (m.meetingTime.substring(0, 5) || '00:00') + ':00');
          const upcoming = meetingsRes.data
            .filter(m => getMeetingDateTime(m) >= now)
            .sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b))
            .slice(0, 3);
          setMeetings(upcoming);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock charts data based on database totals or standard templates
  const getLineData = () => [
    { name: 'Mon', sessions: 0, hours: 0 },
    { name: 'Tue', sessions: 0, hours: 0 },
    { name: 'Wed', sessions: 0, hours: 0 },
    { name: 'Thu', sessions: 0, hours: 0 },
    { name: 'Fri', sessions: 0, hours: 0 },
    { name: 'Sat', sessions: 0, hours: 0 },
    { name: 'Sun', sessions: 0, hours: 0 },
  ];

  const getPieData = () => {
    const completed = stats?.totalTasks > 0 ? Math.round(stats.totalTasks * 0.6) : 0;
    const inProgress = stats?.totalTasks > 0 ? Math.round(stats.totalTasks * 0.25) : 0;
    const pending = stats?.totalTasks > 0 ? (stats.totalTasks - completed - inProgress) : 0;

    return [
      { name: 'Completed', value: completed, color: '#3A3A3C' },
      { name: 'In Progress', value: inProgress, color: '#8E8E93' },
      { name: 'Pending', value: pending, color: '#AEAEB2' },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-14 py-8 max-w-7xl mx-auto px-4 md:px-6">
        {/* Banner Skeleton */}
        <div className="h-36 rounded-[30px] bg-slate-200/30 dark:bg-white/[0.04] animate-pulse" />
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(n => <Skeleton key={n} variant="card" />)}
        </div>

        {/* Charts and Lists Grid */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 h-80 rounded-[28px] bg-slate-200/30 dark:bg-white/[0.04] animate-pulse" />
          <div className="lg:col-span-4 h-80 rounded-[28px] bg-slate-200/30 dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    );
  }

  const chartData = getLineData();
  const taskPieData = getPieData();

  return (
    <div className="space-y-14 py-8 max-w-7xl mx-auto px-4 md:px-6">
      {/* Liquid-Glass Custom CSS */}
      <style>{`
        .checkbox-container input:checked ~ .checkbox-custom {
          background-color: var(--btn-primary-bg);
          border-color: var(--btn-primary-bg);
        }
        .checkbox-container input:checked ~ .checkbox-custom svg {
          transform: scale(1);
          opacity: 1;
        }
      `}</style>

      {/* Redesigned Premium Hero Section */}
      <div className="glass-panel p-10 md:p-12 rounded-[30px] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
        <div className="absolute top-0 right-0 w-[45%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,var(--hover-color),transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[radial-gradient(circle,var(--hover-color),transparent_70%)] pointer-events-none" />
        
        <div className="space-y-3 relative z-10 select-none">
          <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] tracking-widest uppercase">
            {getFormattedDate()}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-none">
            {getGreeting()}, <span className="bg-gradient-to-r from-[#1D1D1F] via-[#6E6E73] to-[#1D1D1F] dark:from-[#F5F5F7] dark:via-[#86868B] dark:to-[#F5F5F7] bg-clip-text text-transparent font-sans">{user?.name}.</span>
          </h1>
          <p className="text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] tracking-wide pt-1.5">
            Ready to continue studying today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3.5 relative z-10 flex-wrap">
          <button
            onClick={() => navigate('/groups')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-[#1D1D1F]/5 hover:bg-[#1D1D1F]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer border border-black/[0.02] dark:border-white/[0.02] shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
          >
            <FiSearch className="w-3.5 h-3.5" />
            <span>Find Groups</span>
          </button>
          <button
            onClick={() => navigate('/groups/create')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-sm"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Redesigned Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Groups Card */}
        <div className="glass-card p-8 rounded-[24px] premium-hover-card flex flex-col justify-between h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Study Groups</span>
            <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.03] dark:border-white/[0.03]">
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h3 className="text-3.5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">{stats?.totalStudyGroups || 0}</h3>
            <span className="text-[9px] font-bold text-main bg-black/[0.04] dark:bg-white/5 border border-color px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              Active
            </span>
          </div>
        </div>

        {/* Meetings Card */}
        <div className="glass-card p-8 rounded-[24px] premium-hover-card flex flex-col justify-between h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Meetings</span>
            <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.03] dark:border-white/[0.03]">
              <FiCalendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h3 className="text-3.5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">{stats?.totalMeetings || 0}</h3>
            <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] bg-black/[0.03] dark:bg-white/5 px-2.5 py-0.5 rounded-full">
              Scheduled
            </span>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="glass-card p-8 rounded-[24px] premium-hover-card flex flex-col justify-between h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Total Tasks</span>
            <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.03] dark:border-white/[0.03]">
              <FiCheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h3 className="text-3.5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">{stats?.totalTasks || 0}</h3>
            <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] bg-black/[0.03] dark:bg-white/5 px-2.5 py-0.5 rounded-full">
              Kanban
            </span>
          </div>
        </div>

        {/* Resources Card */}
        <div className="glass-card p-8 rounded-[24px] premium-hover-card flex flex-col justify-between h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Resources</span>
            <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/5 text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.03] dark:border-white/[0.03]">
              <FiFileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h3 className="text-3.5xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">{stats?.totalResources || 0}</h3>
            <span className="text-[9px] font-bold text-main bg-black/[0.04] dark:bg-white/5 border border-color px-2.5 py-0.5 rounded-full font-sans">
              Synced
            </span>
          </div>
        </div>
      </div>

      {/* Redesigned Charts & Weekly study Volume */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Weekly Activity Volume Chart (Liquid-Glass Styled) */}
        <div className="lg:col-span-8 glass-card p-8 rounded-[28px] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 tracking-tight">
                <FiActivity className="text-main w-4.5 h-4.5" />
                Weekly Study Volume
              </h3>
              <p className="text-[10px] font-semibold text-[#6E6E73] dark:text-[#86868B] mt-0.5">Hours logged across study platforms</p>
            </div>
            <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase bg-black/[0.03] dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/[0.02] dark:border-white/[0.02]">
              Historicals
            </span>
          </div>
          
          <div className="h-64 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--btn-primary-bg)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--btn-primary-bg)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.03)" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.02)" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#86868B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#86868B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" name="Study Hours" stroke="var(--btn-primary-bg)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Pie and Task Section (Redesigned) */}
        <div className="lg:col-span-4 glass-card p-8 rounded-[28px] flex flex-col justify-between shadow-sm">
          <div className="pb-4 border-b border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 tracking-tight">
              <FiCheckSquare className="text-main w-4.5 h-4.5" />
              Task Progress
            </h3>
            <span className="text-[10px] font-bold text-main bg-black/[0.04] dark:bg-white/5 border border-color px-2 py-0.5 rounded-full">{taskProgressPercent}% done</span>
          </div>

          {/* Checklist Area (with animations) */}
          <div className="py-5 space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-52">
            {localTasks.map(task => (
              <label 
                key={task.id} 
                className="checkbox-container flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
              >
                <div className="relative mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleTask(task.id)} 
                    className="sr-only" 
                  />
                  <div className="checkbox-custom w-4 h-4 rounded-full border border-[#6E6E73]/50 flex items-center justify-center transition-all">
                    <FiCheck className="w-2.5 h-2.5 text-white transform scale-0 opacity-0 transition-transform" />
                  </div>
                </div>
                <div className="space-y-0.5 select-none">
                  <p className={`text-xs font-bold leading-tight transition-all ${
                    task.completed 
                      ? 'text-[#6E6E73]/70 dark:text-[#86868B]/70 line-through decoration-[#6E6E73]/40' 
                      : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
                  }`}>
                    {task.title}
                  </p>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6E6E73]/60 dark:text-[#86868B]/60">
                    {task.category}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Progress Indicator line */}
          <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.04] space-y-2 select-none">
            <div className="flex justify-between items-center text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
              <span>Sync Status</span>
              <span>{completedTasksCount}/{localTasks.length} Goals</span>
            </div>
            <div className="w-full bg-[#1D1D1F]/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${taskProgressPercent}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Upcoming Meetings & System Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upcoming Meetings (Redesigned as Calendar Blocks) */}
        <div className="glass-card p-8 rounded-[28px] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 tracking-tight">
              <FiCalendar className="text-main w-4.5 h-4.5" />
              Upcoming Meetings
            </h3>
            <Link 
              to="/meetings" 
              className="text-[10px] font-bold text-main hover:opacity-85 transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Agenda</span> <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {meetings.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#6E6E73] dark:text-[#86868B] font-medium border border-dashed border-black/[0.05] dark:border-white/[0.05] rounded-2xl select-none">
                No upcoming meetings scheduled.
              </div>
            ) : (
              meetings.map((meeting) => {
                const dateObj = new Date(meeting.meetingDate);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleDateString([], { month: 'short' }).toUpperCase();
                const isLink = meeting.location?.startsWith('http');
                
                return (
                  <div 
                    key={meeting.id}
                    className="p-4 bg-white/40 dark:bg-[#1a1a1c]/20 border border-black/[0.02] dark:border-white/[0.02] rounded-[20px] flex items-center justify-between gap-4 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Calendar Date Badge */}
                      <div className="flex-shrink-0 w-12 h-14 bg-black/[0.02] dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.04] rounded-2xl flex flex-col items-center justify-center font-sans shadow-sm select-none">
                        <span className="text-[9px] font-extrabold text-[#6E6E73] dark:text-[#86868B] tracking-wider">{month}</span>
                        <span className="text-lg font-black text-[#1D1D1F] dark:text-[#F5F5F7] leading-none mt-0.5">{day}</span>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug line-clamp-1">{meeting.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#6E6E73] dark:text-[#86868B] font-medium">
                          <span>Group: {meeting.groupName || 'Study Circle'}</span>
                          <span>&bull;</span>
                          <span>{meeting.meetingTime.substring(0, 5) || '00:00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    {isLink ? (
                      <a
                        href={meeting.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-4 py-2 text-[10px] font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-all"
                      >
                        Join
                      </a>
                    ) : (
                      <span className="flex-shrink-0 text-[9px] bg-black/[0.03] dark:bg-white/5 px-3 py-1.5 rounded-full text-[#6E6E73] dark:text-[#86868B] font-bold truncate max-w-[110px] border border-black/[0.02] dark:border-white/[0.02] select-none">
                        {meeting.location}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Announcements (Redesigned as Notification Cards) */}
        <div className="glass-card p-8 rounded-[28px] space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2 tracking-tight">
              <FiBell className="text-main w-4.5 h-4.5" />
              Notices & Announcements
            </h3>
            <span className="text-[9px] font-bold text-[#6E6E73] dark:text-[#86868B] tracking-widest uppercase bg-black/[0.03] dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/[0.02] dark:border-white/[0.02]">
              {stats?.totalAnnouncements || 0} Posted
            </span>
          </div>

          <div className="space-y-4">
            <div className="text-center py-10 text-xs text-[#6E6E73] dark:text-[#86868B] font-medium border border-dashed border-black/[0.05] dark:border-white/[0.05] rounded-2xl select-none">
              No notices or announcements posted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
