import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiBookOpen, 
  FiCpu, 
  FiGithub, 
  FiCheckCircle, 
  FiUsers, 
  FiCalendar, 
  FiActivity, 
  FiClock, 
  FiLayers, 
  FiChevronDown, 
  FiCompass, 
  FiChevronRight,
  FiInfo,
  FiZap
} from 'react-icons/fi';

const About = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const projectFeatures = [
    {
      title: 'Secure Accounts',
      desc: 'Role-based credentials authorization & JWT validation protocols.',
      icon: FiLayers,
      color: 'from-zinc-500/10 to-stone-500/10 text-main',
    },
    {
      title: 'Learning Analytics',
      desc: 'Dynamic charts showing meeting hours, tasks completeness, and circles statistics.',
      icon: FiActivity,
      color: 'from-zinc-500/10 to-stone-500/10 text-main',
    },
    {
      title: 'Study Directories',
      desc: 'Filterable, searchable catalogs to discover departmental circles.',
      icon: FiUsers,
      color: 'from-zinc-500/10 to-stone-500/10 text-main',
    },
    {
      title: 'Assets Indexing',
      desc: 'Study folders for uploading reference PDFs, shared documents, and web hyperlinks.',
      icon: FiBookOpen,
      color: 'from-zinc-500/10 to-stone-500/10 text-main',
    },
  ];

  const teamMembers = [
    {
      name: 'Trivikram',
      role: 'Lead UI/UX Architect',
      desc: 'Pioneered the system interface and Liquid Glass layout redesign.',
      initials: 'T',
      // or similar
    },
    {
      name: 'John Doe',
      role: 'Backend Core Engineer',
      desc: 'Designed Spring Boot 3 API structures and databases constraints.',
      initials: 'JD',
    },
    {
      name: 'Jane Smith',
      role: 'Systems Integrator',
      desc: 'Connected Recharts visual statistics and local cache structures.',
      initials: 'JS',
    },
  ];

  const timelineSteps = [
    {
      period: 'Q1 2026',
      title: 'Conception',
      desc: 'Core architecture plans and data relationship definitions.',
    },
    {
      period: 'Q2 2026',
      title: 'Alpha Release',
      desc: 'JWT authentications, endpoints wiring, and Spring Boot engines.',
    },
    {
      period: 'Q3 2026',
      title: 'Beta Release',
      desc: 'Kanban boards, resource indexes, and scheduled study sessions.',
    },
    {
      period: 'Q4 2026',
      title: 'Tahoe Redesign',
      desc: 'Overhaul UI into high-fidelity Liquid Glass cards and premium aesthetics.',
    },
  ];

  const faqs = [
    {
      q: 'Who can create and join study groups?',
      a: 'Any registered student can browse study groups and join approved departments. Creators can edit tasks, schedules, and membership states.',
    },
    {
      q: 'How do index resources work?',
      a: 'Students can index direct links (like Google Drive paths or reference sites) or download files shared by other group workspace members.',
    },
    {
      q: 'Is my student profile data secure?',
      a: 'Absolutely. All APIs use encrypted passwords and securely store curriculum profiles with authorization tags.',
    },
  ];

  const renderContent = () => (
    <div className="space-y-24 max-w-5xl mx-auto py-8">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 select-none py-12">
        {/* Absolute glow effects */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 dark:bg-white/5 rounded-full blur-[70px] pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/5 text-main text-[10px] font-black uppercase tracking-wider border border-color">
          <FiCompass className="w-3.5 h-3.5" />
          The Academic WorkSpace
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight max-w-3xl mx-auto leading-[1.1] pt-2">
          Think forward.<br className="sm:hidden" /> Learn together.
        </h1>
        
        <p className="text-sm md:text-base text-[#6E6E73] dark:text-[#86868B] max-w-xl mx-auto leading-relaxed font-medium">
          StudySync is a premium collaboration hub built for university students to align study schedules, track milestones, and share reference resources.
        </p>

        <div className="pt-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-sm cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-sm cursor-pointer"
            >
              <span>Get Started</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mission Section */}
      <div className="glass-card p-10 md:p-14 rounded-[32px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm flex flex-col md:flex-row items-center gap-10 select-none relative overflow-hidden">
        {/* Glow blob */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 dark:bg-white/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="space-y-4 md:w-1/2 z-10">
          <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Our Mission</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight leading-snug">
            Streamlining student workspace coordination.
          </h3>
          <p className="text-xs md:text-sm text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">
            We aim to remove the friction of scheduling, document indexing, and task tracking. Our tool transforms collaborative learning into a beautiful, visual, and highly structured environment.
          </p>
        </div>

        {/* Dashboard visual CSS mockup */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-52 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.04] p-5 flex flex-col justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-400 to-neutral-600 opacity-80" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-black/10 dark:bg-white/15 rounded-full" />
                <div className="h-1.5 w-16 bg-black/5 dark:bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-xl bg-black/[0.01] dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02]" />
              <div className="h-16 rounded-xl bg-primary-50 border border-color" />
              <div className="h-16 rounded-xl bg-black/[0.01] dark:bg-white/5 border border-black/[0.02] dark:border-white/[0.02]" />
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="space-y-10 select-none">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Features</h2>
          <h3 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Built for university workflows</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projectFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="glass-card p-6 rounded-[28px] premium-hover-card border border-black/[0.02] dark:border-white/[0.02] shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color.split(' ').slice(0, 2).join(' ')} ${feat.color.split(' ')[2]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-inherit" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{feat.title}</h4>
                  <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Metrics / Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none border-y border-black/[0.04] dark:border-white/[0.04] py-10 text-center">
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">99.9%</p>
          <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider mt-1">Indexing Uptime</p>
        </div>
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">5K+</p>
          <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider mt-1">Active Accounts</p>
        </div>
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">12K+</p>
          <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider mt-1">Tasks Completed</p>
        </div>
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">3.5 hrs</p>
          <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider mt-1">Average Session</p>
        </div>
      </div>

      {/* Development Timeline */}
      <div className="space-y-10 select-none">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Evolution</h2>
          <h3 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Project Timeline</h3>
        </div>

        <div className="relative pl-6 border-l border-black/[0.06] dark:border-white/[0.08] max-w-2xl mx-auto space-y-8">
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative">
              {/* Bullet dot */}
              <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-[2px] border-primary bg-[#F5F5F7] dark:bg-[#0D0D0F]" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-black text-main uppercase tracking-wider">{step.period}</span>
                <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{step.title}</h4>
                <p className="text-xs text-[#6E6E73] dark:text-[#86868B] font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-10 select-none">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Team</h2>
          <h3 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Contributors</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div 
              key={i}
              className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-black/[0.04] dark:bg-white/5 text-main flex items-center justify-center text-sm font-black border border-color">
                {member.initials}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">{member.name}</h4>
                <p className="text-[10px] font-bold text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 select-none max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Questions</h2>
          <h3 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i}
                className="glass-card rounded-2xl overflow-hidden border border-black/[0.02] dark:border-white/[0.02]"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-xs md:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors text-left"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown className={`w-4 h-4 text-[#6E6E73] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-black/[0.02] dark:border-white/[0.02] text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Repository link */}
      <div className="glass-card p-8 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] text-center space-y-4 max-w-2xl mx-auto select-none">
        <h2 className="text-sm font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">Development Info</h2>
        <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium">
          StudySync is handcrafted using reactive UI patterns, modular Spring Boot APIs, and premium design guidelines.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-main hover:opacity-80 transition-opacity"
          >
            <FiGithub className="w-4 h-4" /> <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </div>
  );

  if (isAuthenticated) {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0D0D0F] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300">
      {/* Guest Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.04] select-none">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-text font-black text-sm">S</div>
          <span className="text-base font-extrabold tracking-tight">StudySync</span>
        </Link>
        <div className="flex items-center gap-6 text-xs font-bold text-[#6E6E73] dark:text-[#86868B]">
          <Link to="/" className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">Home</Link>
          <Link to="/contact" className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">Contact</Link>
          <Link to="/login" className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-text rounded-full transition-all duration-300 hover:scale-[1.03] shadow-sm">Sign In</Link>
        </div>
      </nav>

      {/* Main Page Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default About;
