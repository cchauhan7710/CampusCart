import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, X, LogOut, User, Heart, ShoppingBag, Menu, Sun, Moon } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-[#000000]/90 backdrop-blur-xl border-b border-white/10 select-none">
      <div className="h-[68px] sm:h-[72px] w-full flex justify-between items-center px-3 sm:px-6 md:px-12 gap-2"> 
        
        {/* Brand Logo */}
        <Link to="/" className="text-xl sm:text-2xl md:text-[32px] font-bold select-none flex-shrink-0">
          <span className="text-[#F5EEF0]">Campus</span>
          <span className="text-[#D5354F]">Cart</span>
        </Link>
        
        {/* Right Navigation & Control Area */}
        <div className="flex gap-1.5 sm:gap-3 md:gap-5 justify-end items-center text-[#FFFFFF]">
          
          {/* Search Bar */}
          <div className="group h-9 sm:h-10 w-24 xs:w-32 sm:w-48 md:w-56 lg:w-64 bg-[#141414] border border-white/10 focus-within:border-[#ff4569]/70 focus-within:bg-[#1a1a1a] rounded-xl flex items-center px-2.5 sm:px-3 transition-all duration-300">
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
                className="text-gray-500 hover:text-white transition-colors duration-150 p-1 flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link 
              to="/" 
              className={`transition-colors duration-200 text-xs md:text-sm font-medium ${
                path === '/' ? 'text-[#ff4569]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/marketplace" 
              className={`transition-colors duration-200 text-xs md:text-sm font-medium ${
                path === '/marketplace' ? 'text-[#ff4569]' : 'text-gray-300 hover:text-white'
              }`}
            >
              Marketplace
            </Link>

            <Link 
              to="/addproduct" 
              className={`flex items-center gap-1 transition-colors duration-200 text-xs md:text-sm font-medium ${
                path === '/addproduct' ? 'text-[#ff4569]' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Plus size={15}/> Sell
            </Link>
          </nav>

          {/* Wishlist Icon Button */}
          <Link
            to="/wishlist"
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/wishlist'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : 'bg-[#141414] border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
            title="Wishlist"
          >
            <Heart size={17} className={wishlistCount > 0 ? "text-[#ff4569] fill-[#ff4569]/30" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon Button */}
          <Link
            to="/cart"
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
              path === '/cart'
                ? 'bg-[#D5354F]/20 border-[#D5354F]/50 text-[#ff4569]'
                : 'bg-[#141414] border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
            }`}
            title="Cart"
          >
            <ShoppingBag size={17} className={cartCount > 0 ? "text-[#ff4569]" : ""} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D5354F] text-white text-[9px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Professional Dual-Icon Theme Toggle Pill Switch */}
          <button
            onClick={toggleTheme}
            className={`relative flex items-center gap-1 p-1 rounded-full border transition-all duration-300 cursor-pointer select-none group ${
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

          {/* Desktop User Auth Buttons */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/profile" 
                className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title="Profile"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
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
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/login" 
                className={`text-center px-3 py-1.5 rounded-lg transition-colors duration-200 text-xs ${
                  path === '/login' ? 'bg-white/10 text-[#ff4569] font-medium' : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`text-center rounded-xl px-4 py-1.5 transition-all duration-200 text-xs font-bold shadow-md ${
                  path === '/register' 
                    ? 'bg-[#ff4569] text-white shadow-[#ff4569]/30' 
                    : 'bg-[#D5354F] hover:bg-[#ff4569] text-white shadow-[#D5354F]/20'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-[#141414] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>  

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0d] border-b border-white/10 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)} 
            className={`py-2 px-3 rounded-xl transition-colors ${path === '/' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold' : 'text-gray-300 hover:bg-white/5'}`}
          >
            Home
          </Link>
          <Link 
            to="/marketplace" 
            onClick={() => setMobileMenuOpen(false)} 
            className={`py-2 px-3 rounded-xl transition-colors ${path === '/marketplace' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold' : 'text-gray-300 hover:bg-white/5'}`}
          >
            Marketplace
          </Link>
          <Link 
            to="/addproduct" 
            onClick={() => setMobileMenuOpen(false)} 
            className={`py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 ${path === '/addproduct' ? 'bg-[#D5354F]/20 text-[#ff4569] font-bold' : 'text-gray-300 hover:bg-white/5'}`}
          >
            <Plus size={16} /> Sell Item
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
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

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-xl text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <User size={16} /> My Profile ({user?.userName || user?.username || 'Student'})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="py-2 px-3 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2 text-left cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center bg-white/10 rounded-xl text-xs font-bold text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center bg-[#D5354F] rounded-xl text-xs font-bold text-white shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
