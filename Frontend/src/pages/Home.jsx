import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  FiUsers, 
  FiCalendar, 
  FiCheckSquare, 
  FiFileText, 
  FiArrowRight, 
  FiShield, 
  FiSun, 
  FiMoon, 
  FiActivity, 
  FiBell, 
  FiSearch, 
  FiBookOpen, 
  FiCheck, 
  FiPlus, 
  FiChevronDown, 
  FiChevronUp, 
  FiStar, 
  FiSmartphone, 
  FiSliders, 
  FiMessageSquare, 
  FiLock 
} from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: FiUsers,
      title: 'Study Groups',
      description: 'Create or join study circles organized by subject, academic department, and class year.',
      color: 'text-main bg-primary-50 border border-color',
    },
    {
      icon: FiCalendar,
      title: 'Meeting Scheduler',
      description: 'Coordinate online review meetups or in-person library sessions with synced calendar agendas.',
      color: 'text-main bg-primary-50 border border-color',
    },
    {
      icon: FiFileText,
      title: 'Resource Sharing',
      description: 'Upload references, textbooks, links, and lecture notes directly to your group library repository.',
      color: 'text-main bg-primary-50 border border-color',
    },
    {
      icon: FiMessageSquare,
      title: 'Group Discussions',
      description: 'Post questions, answer peers, and brainstorm on message boards within your group circles.',
      color: 'text-main bg-primary-50 border border-color',
    },
    {
      icon: FiActivity,
      title: 'Study Analytics',
      description: 'Track weekly study hours logged, completed study plans, and team progress metrics dynamically.',
      color: 'text-main bg-primary-50 border border-color',
    },
    {
      icon: FiBell,
      title: 'Smart Notifications',
      description: 'Receive real-time alerts for scheduled group meetings, new files uploaded, and notices.',
      color: 'text-main bg-primary-50 border border-color',
    },
  ];

  const timeline = [
    {
      step: '01',
      title: 'Create an Account',
      description: 'Sign up in seconds using your student details. Set your academic department and year to personalize your dashboard feed.',
    },
    {
      step: '02',
      title: 'Join or Create Groups',
      description: 'Browse the catalog of active study groups or launch your own CSE study circle. Send requests to join existing student groups.',
    },
    {
      step: '03',
      title: 'Collaborate & Succeed',
      description: 'Log hours, complete study targets on kanban boards, share slides, hold online video meets, and achieve higher grades.',
    },
  ];

  const whyChooseUs = [
    {
      title: 'Easy Collaboration',
      description: 'No more switching between separate chat rooms, calendar tools, and file shares. Everything is combined in one layout.',
    },
    {
      title: 'Real-Time Communication',
      description: 'Stay updated instantly with live announcement notice boards, board comment logs, and schedule triggers.',
    },
    {
      title: 'Resource Sharing',
      description: 'Organize files by subject and download slides or notes in a single centralized academic repository.',
    },
    {
      title: 'Productivity Tracking',
      description: 'Define study goals, assign tasks, track completion milestones, and view weekly hour charts.',
    },
    {
      title: 'Minimal Learning Curve',
      description: 'An elegant, fluid layout designed to keep you focused. No complex setup or server structure needed.',
    },
  ];

  const testimonials = [
    {
      quote: "StudySync entirely changed how our group prepares for midterms. We tracked assignments and shared PDF notes, resulting in A grades for all of us!",
      author: "Priya Sharma",
      major: "Computer Engineering, Year 3",
      rating: 5,
    },
    {
      quote: "Scheduling group meetings used to be a nightmare of group chats. Now we just set meetings here and everyone knows the Google Meet link and agenda.",
      author: "Rahul Verma",
      major: "Mechanical Engineering, Year 2",
      rating: 5,
    },
    {
      quote: "The resource library is amazing. Having all our lecture slides, past exams, and references organized in one place saves hours of search time.",
      author: "Sneha Reddy",
      major: "Information Technology, Year 4",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Is StudySync free to use?",
      answer: "Yes, StudySync is completely free for college students and faculty. You can create unlimited study groups, upload shared resources, and coordinate meetings.",
    },
    {
      question: "How do I join an existing study group?",
      answer: "Navigate to the Study Groups tab, search by subject or department, select a group, and click 'Request Join'. The group creator will be notified of your request.",
    },
    {
      question: "Can I schedule online and offline meetings?",
      answer: "Absolutely! When scheduling a meeting, you can provide a physical room number (e.g. Library Room 204) or paste an online video link (e.g. Google Meet or Zoom) for instant join options.",
    },
    {
      question: "What types of resources can I upload?",
      answer: "You can share reference links, upload PDF notes, XLSX logs, Keynote slides, DOCX sheets, or images up to the platform file limit. Files are secure within your group scope.",
    },
    {
      question: "How does the Task Board work?",
      answer: "Each study group features a Kanban Board where administrators can create, assign, and drag tasks across Todo, In Progress, and Completed states to keep goals clear.",
    },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-500 relative overflow-x-hidden font-sans antialiased selection:bg-primary selection:text-primary-text pb-0">
      
      {/* Background gradients and blurs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary/3 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-10 w-[35rem] h-[35rem] rounded-full bg-[#86868B]/4 dark:bg-[#ffffff]/1 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-neutral-400/2 dark:bg-white/2 blur-[160px] pointer-events-none z-0" />
 
      {/* Floating Sticky Navbar */}
      <div className="sticky top-4 z-50 max-w-5xl mx-auto px-4 md:px-6 w-full select-none">
        <nav className="glass-panel py-3 px-6 rounded-full flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#1D1D1F] dark:bg-[#F5F5F7] text-[#F5F5F7] dark:text-[#1D1D1F] font-black text-lg shadow-sm">
              S
            </div>
            <span className="text-base font-extrabold tracking-tight">
              StudySync
            </span>
          </div>
 
          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('mockups')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer">Screenshots</button>
            <button onClick={() => scrollToSection('why-choose-us')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer">Why Us</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer">FAQ</button>
          </div>
 
          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#86868B] dark:hover:text-[#F5F5F7] rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FiSun className="w-4 h-4 text-yellow-500 animate-spin-slow" /> : <FiMoon className="w-4 h-4" />}
            </button>
 
            <div className="w-px h-3 bg-black/[0.08] dark:bg-white/[0.08]" />
 
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Dashboard</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
 
      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center z-10 select-none">
        {/* Left copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-50 text-main text-[10px] font-black uppercase tracking-widest border border-color">
            <FiShield className="w-3.5 h-3.5" />
            Learn Together. Achieve Together.
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.05] font-sans">
            Study Better.<br />
            <span className="text-main">Together.</span>
          </h1>
          <p className="text-xs md:text-sm text-[#6E6E73] dark:text-[#86868B] max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Join study groups, collaborate with classmates, schedule meetings, share resources, and stay productive—all in one place. Designed specifically for college communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3.5 text-xs font-bold bg-primary text-primary-text hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3.5 text-xs font-bold bg-primary text-primary-text hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-6 py-3.5 text-xs font-bold border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  Learn More
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Dashboard/CSS Illustration */}
        <div className="lg:col-span-5 flex justify-center relative">
          {/* Main Visual CSS Mockup */}
          <div className="relative glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-w-sm w-full space-y-5 transform hover:scale-[1.02] transition-transform duration-500 select-none overflow-hidden">
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] pb-3.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] tracking-wider uppercase">Live Activity</span>
            </div>

            {/* Simulated Session */}
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-main text-[9px] font-black uppercase tracking-wider border border-color max-w-max block">
                Calculus II
              </span>
              <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug">Exam Study Session</h4>
              
              {/* Fake avatars */}
              <div className="flex items-center -space-x-1.5 pt-1">
                {['T', 'P', 'R', 'S'].map((char, index) => (
                  <div 
                    key={index}
                    className="w-6 h-6 rounded-full border border-white dark:border-[#0D0D0F] bg-black/5 dark:bg-white/10 text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center shadow-sm"
                  >
                    {char}
                  </div>
                ))}
                <span className="text-[10px] text-[#6E6E73] dark:text-[#86868B] font-bold pl-2">7 classmates active</span>
              </div>
            </div>

            {/* Fake progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B]">
                <span>Week 2 Project Tasks</span>
                <span>85% complete</span>
              </div>
              <div className="w-full bg-black/[0.04] dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Fake list card */}
            <div className="p-3 bg-white/40 dark:bg-white/[0.02] border border-black/[0.02] dark:border-white/[0.02] rounded-[18px] flex items-center justify-between text-[10.5px]">
              <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Resource Shared
              </span>
              <span className="text-[#6E6E73] dark:text-[#86868B] font-bold">Cheat_Sheet.pdf</span>
            </div>
          </div>

          {/* Floaters */}
          <div className="absolute -top-6 -right-6 glass-card p-3 rounded-2xl shadow-md border border-white/20 select-none transform rotate-3 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <FiCalendar className="text-main w-4.5 h-4.5" />
            <span className="text-[10px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">Meeting at 4 PM</span>
          </div>
          <div className="absolute -bottom-4 -left-6 glass-card p-3 rounded-2xl shadow-md border border-white/20 select-none transform -rotate-3 flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <FiCheckSquare className="text-main w-4.5 h-4.5" />
            <span className="text-[10px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">Task Done</span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-white/30 dark:bg-white/[0.01] border-y border-black/[0.04] dark:border-white/[0.04] z-10 relative">
        <div className="max-w-5xl mx-auto px-6 select-none">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Platform capabilities</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">
              Everything Needed for Success
            </h3>
            <p className="text-xs md:text-sm text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">
              StudySync bundles standard academic features into a unified workflow, eliminating separate calendars, repositories, and spreadsheets.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i} 
                  className="glass-card p-6.5 rounded-[28px] premium-hover-card border border-black/[0.02] dark:border-white/[0.02] shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-5 h-5 text-inherit" />
                    </div>
                    <h3 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight">{feat.title}</h3>
                    <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Timeline Section */}
      <section id="how-it-works" className="py-24 z-10 relative select-none">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">ONBOARDING WORKFLOW</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">How It Works</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {timeline.map((item, i) => (
              <div 
                key={i}
                className="glass-card p-8 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4 relative flex flex-col justify-between transform hover:scale-[1.01] transition-transform"
              >
                <div className="space-y-4">
                  {/* Step bubble */}
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.04] text-[13px] font-black text-main flex items-center justify-center select-none shadow-sm">
                    {item.step}
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-tight">{item.title}</h4>
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Showcase Grid */}
      <section id="mockups" className="py-24 bg-white/30 dark:bg-white/[0.01] border-y border-black/[0.04] dark:border-white/[0.04] z-10 relative select-none">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">PRODUCT INTERFACE</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">Explore the Platform</h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">A sleek dashboard layout crafted for premium visuals and complete responsiveness.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dashboard Mockup */}
            <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
              <div className="flex items-center gap-1 border-b border-black/[0.04] dark:border-white/[0.04] pb-2 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                <span>Dashboard Layout</span>
              </div>
              <div className="p-4 bg-black/[0.02] dark:bg-black/20 rounded-[20px] space-y-3 font-sans">
                <div className="h-6 w-1/3 bg-black/5 dark:bg-white/5 rounded-full" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-14 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex items-center justify-center font-bold text-[14px]">3 Groups</div>
                  <div className="h-14 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex items-center justify-center font-bold text-[14px]">5 Meets</div>
                  <div className="h-14 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex items-center justify-center font-bold text-[14px]">12 Tasks</div>
                </div>
                <div className="h-24 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[9px] text-[#6E6E73] font-bold uppercase">Weekly activity</span>
                  <div className="flex items-end gap-2.5 h-10 pt-1 select-none justify-between">
                    {[30, 60, 45, 90, 70, 100, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-black/10 dark:bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Study Groups Mockup */}
            <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
              <div className="flex items-center gap-1 border-b border-black/[0.04] dark:border-white/[0.04] pb-2 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                <span>Group Directory</span>
              </div>
              <div className="p-4 bg-black/[0.02] dark:bg-black/20 rounded-[20px] space-y-3">
                <div className="h-8 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-full flex items-center px-3 gap-2">
                  <FiSearch className="text-[#6E6E73] w-3 h-3" />
                  <div className="h-3 w-1/2 bg-black/5 dark:bg-white/5 rounded-full" />
                </div>
                {[1, 2].map(n => (
                  <div key={n} className="p-3 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="h-3 w-28 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="h-2 w-16 bg-black/5 dark:bg-white/5 rounded-full mt-2" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-primary text-primary-text text-[8px] font-bold">Join</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meetings Mockup */}
            <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
              <div className="flex items-center gap-1 border-b border-black/[0.04] dark:border-white/[0.04] pb-2 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-450 dark:bg-neutral-400" />
                <span>Scheduler System</span>
              </div>
              <div className="p-4 bg-black/[0.02] dark:bg-black/20 rounded-[20px] space-y-3">
                {[1, 2].map((n, i) => (
                  <div key={n} className="p-3 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-10 bg-black/5 dark:bg-white/10 rounded-lg flex flex-col items-center justify-center text-[9px] font-bold">
                      <span className="text-main">JUN</span>
                      <span className="text-xs font-black">{18 + i}</span>
                    </div>
                    <div>
                      <div className="h-3 w-36 bg-black/10 dark:bg-white/10 rounded-full" />
                      <div className="h-2.5 w-24 bg-black/5 dark:bg-white/5 rounded-full mt-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Mockup */}
            <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
              <div className="flex items-center gap-1 border-b border-black/[0.04] dark:border-white/[0.04] pb-2 text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-350 dark:bg-neutral-500" />
                <span>Files Vault</span>
              </div>
              <div className="p-4 bg-black/[0.02] dark:bg-black/20 rounded-[20px] grid grid-cols-2 gap-3">
                {['Syllabus.pdf', 'Lecture_02.ppt', 'Formulas.xlsx', 'Code_Ref.zip'].map((name, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02] rounded-xl flex flex-col justify-between h-16">
                    <FiFileText className="w-4 h-4 text-main" />
                    <span className="text-[9px] font-bold truncate text-[#1D1D1F] dark:text-[#F5F5F7]">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Counter section */}
      <section className="py-24 z-10 relative select-none">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-panel p-10 rounded-[32px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-8 text-center bg-gradient-to-r from-black/[0.01] to-black/[0.03] dark:from-white/[0.01] dark:to-white/[0.03]">
            <div className="space-y-1.5">
              <p className="text-3.5xl font-black text-main tracking-tight leading-none">500+</p>
              <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Active Students</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3.5xl font-black text-main tracking-tight leading-none">120+</p>
              <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Study Circles</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3.5xl font-black text-main tracking-tight leading-none">1000+</p>
              <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Resources Synced</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-3.5xl font-black text-main tracking-tight leading-none">250+</p>
              <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">Sessions Scheduled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose StudySync Section */}
      <section id="why-choose-us" className="py-24 bg-white/30 dark:bg-white/[0.01] border-y border-black/[0.04] dark:border-white/[0.04] z-10 relative select-none">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">VALUE PROPOSITION</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">Why Choose StudySync</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {whyChooseUs.map((item, i) => (
              <div 
                key={i}
                className="glass-card p-6.5 rounded-[24px] border border-black/[0.01] dark:border-white/[0.01] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#30D158]/10 text-[#30D158] flex items-center justify-center border border-[#30D158]/10">
                      <FiCheck className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-black text-[#1D1D1F] dark:text-[#F5F5F7] uppercase tracking-wider">{item.title}</h4>
                  </div>
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium pt-1.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 z-10 relative select-none">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">STUDENT REVIEWS</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">Endorsed by Peers</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div 
                key={i}
                className="glass-card p-6.5 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-yellow-500">
                    {[...Array(test.rating)].map((_, index) => (
                      <FiStar key={index} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B] italic leading-relaxed font-medium">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2.5 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] mt-5">
                  <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] flex items-center justify-center select-none shadow-sm">
                    {test.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{test.author}</h5>
                    <p className="text-[9px] text-[#6E6E73] dark:text-[#86868B] font-semibold">{test.major}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ section */}
      <section id="faq" className="py-24 bg-white/30 dark:bg-white/[0.01] border-t border-black/[0.04] dark:border-white/[0.04] z-10 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16 select-none">
            <h2 className="text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-widest">HELP DIRECTORY</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-none">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="glass-card rounded-[20px] border border-black/[0.01] dark:border-white/[0.01] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between text-xs font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.01] dark:hover:bg-white/[0.01] focus:outline-none transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <FiChevronUp className="w-4 h-4 text-main" /> : <FiChevronDown className="w-4 h-4 text-[#6E6E73]" />}
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 border-t border-black/[0.03] dark:border-white/[0.03]' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <p className="px-6 py-4 text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium bg-black/[0.005] dark:bg-white/[0.002]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) frosted panel */}
      <section className="py-24 z-10 relative select-none">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-panel p-10 md:p-14 rounded-[32px] border border-black/[0.03] dark:border-white/[0.03] text-center space-y-6 relative overflow-hidden bg-gradient-to-r from-black/[0.01] to-black/[0.03] dark:from-white/[0.01] dark:to-white/[0.03]">
            <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,rgba(142,142,147,0.06),transparent_60%)] pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-none">Ready to Start Learning Together?</h2>
            <p className="text-xs md:text-sm text-[#6E6E73] dark:text-[#86868B] max-w-md mx-auto leading-relaxed font-medium">
              Create an account with your campus credentials to form study circles, share class notes, coordinate review meets, and excel together.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-3.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                >
                  <span>Go to Dashboard</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3.5 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3.5 text-xs font-bold border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="py-12 bg-white dark:bg-[#0D0D0F] border-t border-black/[0.04] dark:border-white/[0.04] text-[11px] text-[#6E6E73] dark:text-[#86868B] transition-colors select-none z-10 relative">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left font-sans">
          <div className="space-y-3 col-span-2 md:col-span-1 pr-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-text font-extrabold text-xs">
                S
              </div>
              <span className="text-sm font-extrabold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                StudySync
              </span>
            </div>
            <p className="text-[10px] text-[#6E6E73] dark:text-[#86868B] leading-relaxed">
              Empowering college classmates to collaborate, sync schedules, catalog files, and coordinate task boards dynamically.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-wider uppercase text-[9px]">Product Links</h5>
            <ul className="space-y-2 font-semibold">
              <li><button onClick={() => scrollToSection('features')} className="hover:underline hover:text-main transition-colors cursor-pointer text-left">Features</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:underline hover:text-main transition-colors cursor-pointer text-left">How It Works</button></li>
              <li><button onClick={() => scrollToSection('mockups')} className="hover:underline hover:text-main transition-colors cursor-pointer text-left">Screenshots</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-wider uppercase text-[9px]">Directory</h5>
            <ul className="space-y-2 font-semibold">
              <li><Link to="/about" className="hover:underline hover:text-main transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline hover:text-main transition-colors">Contact Support</Link></li>
              <li><Link to="/login" className="hover:underline hover:text-main transition-colors">Login Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-wider uppercase text-[9px]">Legal & Social</h5>
            <ul className="space-y-2 font-semibold">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-main transition-colors">GitHub Repository</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-main transition-colors">LinkedIn Network</a></li>
              <li><span className="cursor-default hover:underline hover:text-main transition-colors">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 border-t border-black/[0.04] dark:border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-[10px] uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} StudySync System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed for College Collaboration</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
