import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, X, LogOut, User, Heart, ShoppingBag, Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000]/90 backdrop-blur-xl border-b border-white/10 select-none transition-colors duration-300">
      <div className="h-[64px] sm:h-[72px] w-full flex justify-between items-center px-3 sm:px-6 md:px-10 lg:px-12 gap-2 sm:gap-4"> 
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-bold select-none flex-shrink-0 tracking-tight"
          aria-label="CampusCart Home"
        >
          <span className="text-[#F5EEF0]">Campus</span>
          <span className="text-[#D5354F]">Cart</span>
        </Link>
        
        {/* Search Bar - Flexible responsive width */}
        <div className="group h-9 sm:h-10 flex-1 min-w-[100px] max-w-[170px] sm:max-w-[240px] md:max-w-[220px] lg:max-w-[280px] bg-[#141414] border border-white/10 focus-within:border-[#ff4569]/70 focus-within:bg-[#1a1a1a] rounded-xl flex items-center px-2.5 sm:px-3 transition-all duration-300">
          <Search size={14} className="text-[#747474] group-focus-within:text-[#ff4569] transition-colors duration-200 flex-shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search..." 
            className="bg-transparent text-white placeholder-[#747474] text-xs sm:text-[13px] focus:outline-none w-full h-full pl-1.5 pr-1"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-gray-500 hover:text-white transition-colors duration-150 p-0.5 flex items-center justify-center cursor-pointer flex-shrink-0"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links (Visible on md and larger: >= 768px) */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6">
          <Link 
            to="/" 
            className={`transition-colors duration-200 text-xs md:text-sm font-medium ${
              path === '/' ? 'text-[#ff4569] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </Link>

          <Link 
            to="/marketplace" 
            className={`transition-colors duration-200 text-xs md:text-sm font-medium ${
              path === '/marketplace' ? 'text-[#ff4569] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Marketplace
          </Link>

          <Link 
            to="/addproduct" 
            className={`flex items-center gap-1 transition-colors duration-200 text-xs md:text-sm font-medium ${
              path === '/addproduct' ? 'text-[#ff4569] font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Plus size={15}/> Sell
          </Link>
        </nav>

        {/* Right Navigation & Control Area */}
        <div className="flex gap-1.5 sm:gap-2.5 md:gap-4 justify-end items-center text-[#FFFFFF] flex-shrink-0">
          
          {/* Wishlist Icon Button */}
          <Link
            to="/wishlist"
            className={`relative p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/wishlist'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : 'bg-[#141414] border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={17} className={wishlistCount > 0 ? "text-[#ff4569] fill-[#ff4569]/30" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon Button */}
          <Link
            to="/cart"
            className={`relative p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/cart'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : 'bg-[#141414] border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag size={17} className={cartCount > 0 ? "text-[#ff4569]" : ""} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button - Dual Pill on Tablet/Desktop (>= 640px) */}
          <button
            onClick={toggleTheme}
            className={`hidden sm:flex relative items-center gap-1 p-1 rounded-full border transition-all duration-300 cursor-pointer select-none ${
              isDark 
                ? 'bg-[#141414] border-white/15 text-gray-300 hover:border-white/30' 
                : 'bg-[#eae7e1] border-black/10 text-stone-800 hover:border-black/20'
            }`}
            title={isDark ? "Switch to Off-White Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <div 
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-amber-400/20 text-amber-300 shadow-sm border border-amber-400/30' 
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Moon size={13} className={isDark ? "transform -rotate-12" : ""} />
            </div>

            <div 
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                !isDark 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Sun size={13} className={!isDark ? "animate-spin-slow" : ""} />
            </div>
          </button>

          {/* Compact Theme Toggle Button for Mobile (< 640px) */}
          <button
            onClick={toggleTheme}
            className={`sm:hidden p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              isDark
                ? 'bg-[#141414] border-white/10 text-amber-300 hover:border-white/20'
                : 'bg-[#eae7e1] border-black/10 text-amber-600'
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Desktop User Auth Buttons (Visible on md and larger: >= 768px) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/profile" 
                className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title="Profile"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#141414] text-white border border-white/10 flex items-center justify-center text-xs font-bold uppercase">
                    {user?.userName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#141414] border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-gray-300 transition-all duration-200 cursor-pointer flex items-center justify-center"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/login" 
                className={`text-center px-3 py-1.5 rounded-lg transition-colors duration-200 text-xs font-medium ${
                  path === '/login' ? 'bg-white/10 text-[#ff4569]' : 'text-gray-300 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`text-center rounded-xl px-3.5 py-1.5 transition-all duration-200 text-xs font-bold shadow-md ${
                  path === '/register' 
                    ? 'bg-[#ff4569] text-white shadow-[#ff4569]/30' 
                    : 'bg-[#D5354F] hover:bg-[#ff4569] text-white shadow-[#D5354F]/20'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile/Tablet Menu Toggle Button (Visible on screens < 768px) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#141414] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>  

      {/* Mobile & Tablet Animated Dropdown Drawer (< 768px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[#0a0a0d] border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col gap-3 text-sm font-medium shadow-2xl"
          >
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)} 
              className={`py-2.5 px-3.5 rounded-xl transition-all ${
                path === '/' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              onClick={() => setMobileMenuOpen(false)} 
              className={`py-2.5 px-3.5 rounded-xl transition-all ${
                path === '/marketplace' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Marketplace
            </Link>
            <Link 
              to="/addproduct" 
              onClick={() => setMobileMenuOpen(false)} 
              className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center gap-2 ${
                path === '/addproduct' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Plus size={16} /> Sell Item
            </Link>

            {/* Expanded Theme Switcher inside Mobile Drawer */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className={`py-2.5 px-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                isDark 
                  ? 'bg-[#141414] border-white/10 text-gray-200' 
                  : 'bg-[#eae7e1] border-black/10 text-stone-800'
              }`}
            >
              <span className="flex items-center gap-2.5 text-xs font-bold">
                {isDark ? <Moon size={16} className="text-amber-300" /> : <Sun size={16} className="text-amber-500" />}
                <span>{isDark ? 'Dark Mode' : 'Off-White Light Mode'}</span>
              </span>

              <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-white border-black/10'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                  isDark ? 'bg-amber-400/20 text-amber-300' : 'text-stone-400'
                }`}>
                  <Moon size={11} />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                  !isDark ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500'
                }`}>
                  <Sun size={11} />
                </div>
              </div>
            </button>

            {/* Auth Section Divider */}
            <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3.5 rounded-xl text-gray-300 hover:bg-white/5 flex items-center gap-2.5"
                  >
                    <User size={16} /> My Profile ({user?.userName || user?.username || 'Student'})
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="py-2.5 px-3.5 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 text-left cursor-pointer transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center bg-[#D5354F] hover:bg-[#ff4569] rounded-xl text-xs font-bold text-white shadow-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
