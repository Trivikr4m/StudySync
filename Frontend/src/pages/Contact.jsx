import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiMessageSquare, 
  FiSend, 
  FiGithub, 
  FiTwitter, 
  FiLink, 
  FiChevronDown,
  FiMap,
  FiInfo
} from 'react-icons/fi';
import Button from '../components/common/Button';

const Contact = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all form fields');
      return;
    }

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      toast.success('Your message has been sent successfully! We will get back to you shortly.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1200);
  };

  const faqs = [
    {
      q: 'How can I request a higher group member capacity?',
      a: 'Please write your study group name and the specific capacity required in the feedback message below. College admins will review and adjust limit configurations.',
    },
    {
      q: 'Can I transfer group ownership to another student?',
      a: 'Yes. Use the contact form to provide the Group ID and target student email, and our administration support desk will update the system cache.',
    },
  ];

  const renderMapMockup = () => (
    <div className="relative w-full h-44 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.04] overflow-hidden select-none">
      {/* Grid lines representing map coordinates */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-color)_1px,transparent_1px),linear-gradient(90deg,var(--border-color)_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.25]" />
      
      {/* Decorative campus block mockups */}
      <div className="absolute top-8 left-12 w-20 h-12 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-color flex items-center justify-center text-[9px] font-black text-main uppercase tracking-wider">
        Block 3
      </div>
      <div className="absolute top-16 right-16 w-24 h-14 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-color flex items-center justify-center text-[9px] font-black text-main uppercase tracking-wider">
        Campus Center
      </div>
      <div className="absolute bottom-4 left-24 w-16 h-10 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-color flex items-center justify-center text-[9px] font-black text-main uppercase tracking-wider">
        Lab Block
      </div>

      {/* Ping location marker */}
      <div className="absolute top-12 left-28 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 border border-primary/30 animate-pulse">
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-md" />
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="max-w-5xl mx-auto space-y-12 py-4 animate-fade-in">
      {/* Header Info */}
      <div className="space-y-1 text-center select-none">
        <h1 className="text-[28px] font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
          Campus Support Desk
        </h1>
        <p className="text-[13px] font-medium text-[#6E6E73] dark:text-[#86868B] max-w-lg mx-auto mt-1">
          Have questions about group thresholds, credentials security, or custom platform features? Reach out to support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* College Details Column (5/12) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* College details card */}
          <div className="glass-card p-8 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight select-none">
              College Support Directories
            </h2>
            
            <div className="space-y-4 select-none">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Email Directory</p>
                  <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">studysync@college.edu</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Hotline Directory</p>
                  <p className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">+1 (555) 019-2834</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-4 h-4 text-[#6E6E73] dark:text-[#86868B]" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Campus Center</p>
                  <p className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B] mt-0.5 leading-relaxed">
                    Dept. of Computer Science & Engineering<br />
                    Academic Block 3, Campus Center
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive CSS Blueprint Map Card */}
          <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider flex items-center gap-2 select-none">
              <FiMap className="w-3.5 h-3.5" />
              Campus Blueprint Map
            </h3>
            {renderMapMockup()}
          </div>

          {/* Social connections deck */}
          <div className="glass-card p-6 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider select-none">
              Online Intranet
            </h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-text transition-all duration-300"
              >
                <FiGithub className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-text transition-all duration-300"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://college.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-text transition-all duration-300"
              >
                <FiLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Contact Form Column (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          
          <form 
            onSubmit={handleSubmit}
            className="glass-card p-8 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-5"
          >
            <h2 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2.5 pb-2 border-b border-black/[0.04] dark:border-white/[0.04] select-none">
              <FiMessageSquare className="text-main w-5 h-5" />
              Send a Feedback Message
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-black/30 dark:focus:border-white/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu"
                  className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-black/30 dark:focus:border-white/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Group capacity extension request"
                className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-full border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-[#6E6E73] dark:text-[#86868B] uppercase tracking-wider">Message Detail</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter details here..."
                className="w-full px-4 py-3 text-xs font-semibold bg-black/[0.04] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/8 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73]/50 dark:placeholder-[#86868B]/40 rounded-2xl border border-black/[0.02] dark:border-white/[0.02] focus:border-primary/30 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold text-primary-text bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer select-none"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <FiSend className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick FAQ deck */}
          <div className="glass-card p-8 rounded-[28px] border border-black/[0.02] dark:border-white/[0.02] shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2 select-none">
              <FiInfo className="text-main w-4.5 h-4.5" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3 pt-2">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="rounded-xl border border-black/[0.03] dark:border-white/[0.03] overflow-hidden select-none">
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <span>{faq.q}</span>
                      <FiChevronDown className={`w-4 h-4 text-[#6E6E73] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed font-medium border-t border-black/[0.02] dark:border-white/[0.02] pt-2.5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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
          <Link to="/about" className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors">About</Link>
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

export default Contact;
