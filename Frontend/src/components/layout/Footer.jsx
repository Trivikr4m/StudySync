import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 mt-12 border-t border-black/[0.04] dark:border-white/[0.04] text-center text-[#6E6E73] dark:text-[#86868B] bg-transparent transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto text-[11px] font-medium tracking-wide uppercase">
        <p>
          &copy; {year} StudySync. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:underline hover:text-primary transition-all">
            About Us
          </Link>
          <Link to="/contact" className="hover:underline hover:text-primary transition-all">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
