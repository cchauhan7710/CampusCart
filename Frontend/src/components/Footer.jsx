import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import {
  PanelTop, Tag, UserPlus, UserRound,
  ShieldCheck, Mail, HatGlasses, FileTerminal,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0b10] border-t border-white/10 text-white pt-14 pb-10 select-none relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#D5354F]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid Layout - Clean 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-10">
          
          {/* Brand Info Column */}
          <div className="flex flex-col gap-4 max-w-sm">
            <Link to="/" className="inline-block group">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight transition-transform duration-300 group-hover:scale-105">
                <span className="text-[#F5EEF0]">Campus</span>
                <span className="text-[#D5354F]">Cart</span>
              </h1>
            </Link>

            <p className="text-[#B89AA2] text-xs sm:text-sm font-light leading-relaxed">
              The peer-to-peer marketplace for college students. Buy, sell, and discover campus essentials with zero middleman fees.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
                { icon: <FaGithub />, href: "#" }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl border border-gray-800 bg-white/5 flex items-center justify-center text-[#B89AA2] hover:text-[#ff4569] hover:border-[#ff4569]/50 hover:bg-[#ff4569]/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-md"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Platform Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-white/90 uppercase border-b border-white/10 pb-2.5 w-fit">
              Platform Links
            </h4>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#B89AA2]">
              <li>
                <Link to="/marketplace" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <PanelTop size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Browse Marketplace</span>
                </Link>
              </li>
              <li>
                <Link to="/addproduct" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <Tag size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Sell an Item</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <UserPlus size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Join CampusCart</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <UserRound size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>My Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-widest text-white/90 uppercase border-b border-white/10 pb-2.5 w-fit">
              Support & Safety
            </h4>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm text-[#B89AA2]">
              <li>
                <a href="mailto:support@campuscart.com" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <Mail size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a href="#about" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <ShieldCheck size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Safety Tips</span>
                </a>
              </li>
              <li>
                <a href="#about" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <HatGlasses size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#about" className="flex items-center gap-2.5 hover:text-[#ff4569] hover:translate-x-1.5 transition-all duration-200 group">
                  <FileTerminal size={16} strokeWidth={1} className="text-gray-400 group-hover:text-[#ff4569] transition-colors" />
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

        {/* Bottom copyright flex area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B89AA2] font-light pt-2">
          <p>© {new Date().getFullYear()} CampusCart. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart size={14} className="text-[#ff4569] fill-current animate-pulse" />
            <span>for campus peers</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
