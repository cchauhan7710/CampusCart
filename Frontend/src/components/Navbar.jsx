import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, X, LogOut, User, Heart, ShoppingBag, Menu, Sun, Moon, 
  ChevronDown, Command, Sparkles, Tag, Home, Store, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();
  const { isDark, toggleTheme } = useTheme();

  // Close profile dropdown & search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search input, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu & search focus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setIsSearchFocused(false);
  }, [path]);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full backdrop-blur-2xl border-b transition-all duration-300 select-none ${
        isDark 
          ? 'bg-black/80 border-white/10 text-white' 
          : 'bg-[#f8f7f4]/85 border-black/10 text-stone-900 shadow-sm'
      }`}
    >
      <div className="w-full h-[64px] sm:h-[72px] flex justify-between items-center px-3 sm:px-6 md:px-8 lg:px-10"> 
        
        {/* Left Section: Brand Logo & Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-shrink-0">
          <Link 
            to="/" 
            className="group flex items-center text-xl sm:text-2xl font-black tracking-tight hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label="CampusCart Home"
          >
            <span>
              <span className={isDark ? "text-white" : "text-stone-900"}>Campus</span>
              <span className="text-[#D5354F]">Cart</span>
            </span>
          </Link>

          {/* Enhanced Interactive Search Bar (Visible on Tablet & Desktop >= 640px) */}
          <div className="hidden sm:block relative" ref={searchContainerRef}>
            <div 
              className={`group h-9 sm:h-10 w-[150px] focus-within:w-[220px] sm:w-[210px] sm:focus-within:w-[280px] md:w-[240px] md:focus-within:w-[320px] lg:w-[280px] lg:focus-within:w-[360px] rounded-2xl flex items-center px-3 border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#141417] border-white/15 focus-within:border-[#ff4569] focus-within:bg-[#1a1a1f] focus-within:shadow-[0_0_22px_rgba(255,69,105,0.3)]' 
                  : 'bg-white border-stone-300 focus-within:border-[#ff4569] focus-within:bg-stone-50 focus-within:shadow-md'
              }`}
            >
              <Search 
                size={15} 
                className={`flex-shrink-0 transition-colors ${
                  isDark ? 'text-gray-400 group-focus-within:text-[#ff4569]' : 'text-stone-500 group-focus-within:text-[#ff4569]'
                }`} 
              />
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search books, gear, notes..." 
                className={`bg-transparent text-xs sm:text-sm focus:outline-none w-full h-full pl-2 pr-1 font-semibold ${
                  isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-stone-500'
                }`}
              />
              
              {searchQuery ? (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-0.5 flex items-center justify-center cursor-pointer flex-shrink-0"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400 pointer-events-none flex-shrink-0">
                  <Command size={10} />
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Quick Trending Searches Suggestion Overlay Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute left-0 top-full mt-2 w-full min-w-[280px] max-w-[380px] rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-3 ${
                    isDark ? 'bg-[#0f0f13]/95 border-white/10 text-white' : 'bg-white/95 border-stone-200 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#ff4569]" /> Trending Campus Searches
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">ESC to close</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Semester Books', cat: 'Book' },
                      { name: 'Class Notes', cat: 'Notes' },
                      { name: 'Laptops', cat: 'Electronics' },
                      { name: 'Lab Drafters', cat: 'Lab Equipment' },
                      { name: 'Stationery', cat: 'Stationery' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item.name);
                          navigate(`/marketplace?category=${encodeURIComponent(item.cat)}`);
                          setIsSearchFocused(false);
                        }}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isDark 
                            ? 'bg-white/5 border-white/10 hover:border-[#ff4569]/50 hover:bg-[#D5354F]/20 text-gray-200 hover:text-[#ff4569]' 
                            : 'bg-stone-100 border-stone-200 hover:border-[#ff4569]/50 hover:bg-[#D5354F]/10 text-stone-700 hover:text-[#ff4569]'
                        }`}
                      >
                        <Tag size={12} className="text-[#ff4569]" />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>

                  {searchQuery.trim() && (
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left py-2 px-3 rounded-xl bg-[#D5354F]/20 border border-[#D5354F]/40 text-[#ff4569] text-xs font-bold flex items-center justify-between hover:bg-[#D5354F]/30 transition-all cursor-pointer"
                      >
                        <span>Search for &quot;{searchQuery}&quot;</span>
                        <Search size={13} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Center Section: Desktop Pill Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 p-1.5 rounded-2xl border bg-white/5 border-white/10 backdrop-blur-md">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
              path === '/' 
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/30 font-bold' 
                : isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Home size={15} />
            <span>Home</span>
          </Link>

          <Link 
            to="/marketplace" 
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
              path === '/marketplace' 
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/30 font-bold' 
                : isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Store size={15} />
            <span>Marketplace</span>
          </Link>

          <Link 
            to="/addproduct" 
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
              path === '/addproduct' 
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/30 font-bold' 
                : isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
            }`}
          >
            <Plus size={15} className={path === '/addproduct' ? "text-white" : "text-[#ff4569]"} />
            <span>Sell Gear</span>
          </Link>
        </nav>

        {/* Right Section: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
          
          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/wishlist'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : isDark 
                  ? 'bg-[#121214] border-white/10 hover:border-white/20 text-gray-300 hover:text-white' 
                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 shadow-sm'
            }`}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={17} className={wishlistCount > 0 ? "text-[#ff4569] fill-[#ff4569]/40" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/cart'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : isDark 
                  ? 'bg-[#121214] border-white/10 hover:border-white/20 text-gray-300 hover:text-white' 
                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 shadow-sm'
            }`}
            title="Cart"
            aria-label="Cart"
          >
            <ShoppingBag size={17} className={cartCount > 0 ? "text-[#ff4569]" : ""} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className={`hidden sm:flex relative items-center gap-1 p-1 rounded-full border transition-all duration-300 cursor-pointer select-none ${
              isDark 
                ? 'bg-[#121214] border-white/15 text-gray-300 hover:border-white/30' 
                : 'bg-stone-200 border-stone-300 text-stone-800'
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <div 
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                  : 'text-stone-400'
              }`}
            >
              <Moon size={13} />
            </div>

            <div 
              className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                !isDark 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
                  : 'text-gray-500'
              }`}
            >
              <Sun size={13} />
            </div>
          </button>

          {/* Desktop User Auth & Profile Menu (>= 768px) */}
          {isAuthenticated ? (
            <div className="hidden md:block relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1 pr-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  profileDropdownOpen 
                    ? 'bg-[#D5354F]/20 border-[#D5354F]/40' 
                    : isDark 
                      ? 'bg-[#121214] border-white/10 hover:border-white/20' 
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                }`}
                aria-expanded={profileDropdownOpen}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-7 h-7 rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#D5354F] to-[#ff4569] text-white flex items-center justify-center text-xs font-black uppercase">
                    {user?.userName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                )}
                <span className={`text-xs font-bold truncate max-w-[90px] ${isDark ? 'text-white' : 'text-stone-900'}`}>
                  {user?.userName || user?.username || 'Account'}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-[#ff4569]' : 'text-gray-400'}`} />
              </button>

              {/* Modern Profile Dropdown Card */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={`absolute right-0 mt-2 w-64 rounded-3xl border p-3 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-1 ${
                      isDark ? 'bg-[#0f0f13] border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  >
                    {/* Profile Header */}
                    <div className={`p-3 rounded-2xl flex items-center gap-3 border ${
                      isDark ? 'bg-white/5 border-white/5' : 'bg-stone-50 border-stone-200'
                    }`}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D5354F] to-[#ff4569] text-white font-black flex items-center justify-center text-sm uppercase">
                          {user?.userName?.[0] || user?.username?.[0] || 'U'}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate">{user?.userName || user?.username || 'Student Seller'}</span>
                        <span className="text-[11px] text-[#ff4569] font-semibold truncate">{user?.collageName || 'Campus Verified'}</span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-0.5 pt-1">
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isDark ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-stone-100 text-stone-800'
                        }`}
                      >
                        <User size={15} className="text-[#ff4569]" />
                        <span>My Profile Dashboard</span>
                      </Link>

                      <Link
                        to="/addproduct"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isDark ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-stone-100 text-stone-800'
                        }`}
                      >
                        <Tag size={15} className="text-[#ff4569]" />
                        <span>List Campus Product</span>
                      </Link>

                    </div>

                    <div className={`my-1 h-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/login" 
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  path === '/login' 
                    ? 'bg-[#D5354F]/20 text-[#ff4569]' 
                    : isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-white/5' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-black/5'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D5354F] to-[#ff4569] hover:shadow-lg hover:shadow-[#D5354F]/30 transition-all duration-300 cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button (< 768px) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#121214] border-white/10 text-gray-300 hover:text-white' 
                : 'bg-white border-stone-200 text-stone-700 hover:text-stone-900 shadow-sm'
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>  

      {/* Mobile Animated Dropdown Drawer (< 768px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`md:hidden overflow-hidden border-b px-4 py-5 flex flex-col gap-4 text-sm font-medium shadow-2xl ${
              isDark ? 'bg-[#0a0a0d] border-white/10 text-white' : 'bg-[#f8f7f4] border-stone-200 text-stone-900'
            }`}
          >
            {/* Mobile Search Input */}
            <div className="relative w-full">
              <div 
                className={`h-10 w-full rounded-2xl flex items-center px-3 border transition-all ${
                  isDark 
                    ? 'bg-[#141417] border-white/15 focus-within:border-[#ff4569]' 
                    : 'bg-white border-stone-300 focus-within:border-[#ff4569]'
                }`}
              >
                <Search size={16} className={isDark ? 'text-gray-400' : 'text-stone-500'} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search books, gear, notes..." 
                  className={`bg-transparent text-sm focus:outline-none w-full h-full pl-2 pr-1 font-semibold ${
                    isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-stone-500'
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white p-0.5">
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-1">
              <Link 
                to="/" 
                className={`py-2.5 px-4 rounded-2xl transition-all flex items-center justify-between ${
                  path === '/' 
                    ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' 
                    : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-stone-700 hover:bg-black/5'
                }`}
              >
                <span>Home</span>
                <Home size={16} />
              </Link>
              <Link 
                to="/marketplace" 
                className={`py-2.5 px-4 rounded-2xl transition-all flex items-center justify-between ${
                  path === '/marketplace' 
                    ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' 
                    : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-stone-700 hover:bg-black/5'
                }`}
              >
                <span>Marketplace</span>
                <Store size={16} />
              </Link>
              <Link 
                to="/addproduct" 
                className={`py-2.5 px-4 rounded-2xl transition-all flex items-center justify-between ${
                  path === '/addproduct' 
                    ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold border border-[#D5354F]/30' 
                    : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-stone-700 hover:bg-black/5'
                }`}
              >
                <span>Sell Campus Gear</span>
                <Plus size={16} className="text-[#ff4569]" />
              </Link>
            </div>

            {/* Mobile Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`py-3 px-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                isDark 
                  ? 'bg-[#121214] border-white/10 text-gray-200' 
                  : 'bg-white border-stone-200 text-stone-800 shadow-sm'
              }`}
            >
              <span className="flex items-center gap-2.5 text-xs font-bold">
                {isDark ? <Moon size={16} className="text-amber-300" /> : <Sun size={16} className="text-amber-500" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </span>

              <div className={`flex items-center gap-1 p-0.5 rounded-full border ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-stone-100 border-stone-200'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  isDark ? 'bg-amber-400/20 text-amber-300' : 'text-stone-400'
                }`}>
                  <Moon size={11} />
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                  !isDark ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500'
                }`}>
                  <Sun size={11} />
                </div>
              </div>
            </button>

            {/* Mobile Auth & User Profile Section */}
            <div className={`pt-3 border-t flex flex-col gap-2 ${isDark ? 'border-white/10' : 'border-stone-200'}`}>
              {isAuthenticated ? (
                <>
                  <div className={`p-3 rounded-2xl flex items-center gap-3 border ${
                    isDark ? 'bg-white/5 border-white/5' : 'bg-stone-100 border-stone-200'
                  }`}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D5354F] to-[#ff4569] text-white font-black flex items-center justify-center text-xs uppercase">
                        {user?.userName?.[0] || user?.username?.[0] || 'U'}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">{user?.userName || user?.username || 'Student'}</span>
                      <span className="text-[10px] text-[#ff4569] font-medium">{user?.collageName || 'Campus Verified'}</span>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className={`py-2.5 px-4 rounded-xl flex items-center gap-2.5 text-xs font-bold ${
                      isDark ? 'hover:bg-white/5 text-gray-200' : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <User size={16} className="text-[#ff4569]" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="py-2.5 px-4 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 text-xs font-bold text-left cursor-pointer transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2.5 pt-1">
                  <Link
                    to="/login"
                    className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-stone-200 hover:bg-stone-300 text-stone-900'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2.5 text-center bg-gradient-to-r from-[#D5354F] to-[#ff4569] text-white rounded-xl text-xs font-bold shadow-md transition-all"
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
