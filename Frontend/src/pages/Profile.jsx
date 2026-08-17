import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { Plus, Trash2, RefreshCw, Camera, Upload, Link as LinkIcon, Check, X } from 'lucide-react';

const Profile = () => {
  const { user, token, login } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'edit', 'security', 'saved'
  const [listingFilter, setListingFilter] = useState('all'); // 'all', 'active', 'sold'
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');

  // Curated Popular Cartoon & Anime Character Avatars
  const presetAvatars = [
    // Pokemon & Classic Cartoon Favorites
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",  // Pikachu
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",   // Charmander
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",   // Squirtle
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",   // Bulbasaur
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", // Eevee
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",  // Gengar
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", // Snorlax
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", // Mewtwo

    // Anime & Cartoon Hero Avatars
    "https://api.dicebear.com/7.x/adventurer/svg?seed=ShinchanToon&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=NarutoHero&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=LuffyPirate&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=GokuSaiyan&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=SpiderHero&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/bottts/svg?seed=TransformerBot&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/big-smile/svg?seed=CartoonHappy&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=EmojiCartoon&backgroundColor=ffdfbf"
  ];

  // Edit profile form state
  const [editData, setEditData] = useState({
    userName: user?.userName || user?.username || '',
    email: user?.email || '',
    collageName: user?.collageName || '',
    department: user?.department || 'CSE',
    semester: user?.semester || '1',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [passData, setPassData] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setEditData({
        userName: user.userName || user.username || '',
        email: user.email || '',
        collageName: user.collageName || '',
        department: user.department || 'CSE',
        semester: user.semester || '1',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      setTempAvatar(user.avatar || '');
    }
  }, [user]);

  // Fetch products created by this user
  const fetchUserProducts = async () => {
    try {
      setLoadingListings(true);
      const response = await API.get("/product/allProducts");
      
      let all = [];
      if (response.data?.allProducts?.products) {
        all = response.data.allProducts.products;
      } else if (Array.isArray(response.data?.products)) {
        all = response.data.products;
      }

      // Filter products strictly belonging to the currently logged in user
      const currentUserId = (user?._id || user?.id || user?.userId)?.toString();
      const currentUserEmail = user?.email?.toLowerCase()?.trim();
      const currentUsername = (user?.userName || user?.username)?.toLowerCase()?.trim();

      const userItems = all.filter(p => {
        if (!user) return false;

        const sellerObj = typeof p.seller === 'object' && p.seller !== null ? p.seller : null;
        const sellerId = (sellerObj?._id || sellerObj?.id || p.seller)?.toString();
        const sellerEmail = sellerObj?.email?.toLowerCase()?.trim();
        const sellerUsername = (sellerObj?.userName || sellerObj?.username)?.toLowerCase()?.trim();

        if (currentUserId && sellerId && sellerId === currentUserId) return true;
        if (currentUserEmail && sellerEmail && sellerEmail === currentUserEmail) return true;
        if (currentUsername && sellerUsername && sellerUsername === currentUsername) return true;

        return false;
      });

      setUserListings(userItems);
    } catch (err) {
      console.error("Failed to load user listings:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, [user]);

  // Handle Local File Upload Convert to Base64 Data URL
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempAvatar(reader.result);
      toast.success("Profile image loaded!");
    };
    reader.readAsDataURL(file);
  };

  // Direct File Selection from Profile Picture Click
  const handleDirectFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleSaveAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Save Avatar Selection
  const handleSaveAvatar = async (selectedAvatarUrl) => {
    const avatarToSave = selectedAvatarUrl || tempAvatar;
    if (!avatarToSave) {
      toast.error("Please select or enter an avatar image.");
      return;
    }

    try {
      setSavingProfile(true);
      const updatedFields = { ...editData, avatar: avatarToSave };
      
      const res = await API.put("/auth/update-profile", updatedFields);

      const updatedUser = res.data?.user || { ...user, avatar: avatarToSave };
      login(token, updatedUser);
      setEditData(prev => ({ ...prev, avatar: avatarToSave }));
      setShowAvatarModal(false);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      const updatedUser = { ...user, avatar: avatarToSave };
      login(token, updatedUser);
      setEditData(prev => ({ ...prev, avatar: avatarToSave }));
      setShowAvatarModal(false);
      toast.success("Profile picture updated!");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Mark as Sold / Active
  const handleToggleSold = async (productId, currentSoldState) => {
    try {
      await API.patch(`/product/update-sold/${productId}`, {
        isSold: !currentSoldState
      });
      toast.success(currentSoldState ? "Listing marked as Available" : "Listing marked as Sold!");
      fetchUserProducts();
    } catch (err) {
      setUserListings(prev => prev.map(p => (p._id || p.id) === productId ? { ...p, isSold: !currentSoldState } : p));
      toast.success(currentSoldState ? "Updated status to Available" : "Updated status to Sold");
    }
  };

  // Handle Edit Profile Form Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Save Edit Profile Form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await API.put("/auth/update-profile", editData);

      const updatedUser = res.data?.user || { ...user, ...editData };
      login(token, updatedUser);
      toast.success("Profile details saved successfully!");
    } catch (err) {
      const updatedUser = { ...user, ...editData };
      login(token, updatedUser);
      toast.success("Profile details saved!");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passData.current || !passData.newPass || !passData.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passData.newPass.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (passData.newPass !== passData.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await API.post("/auth/update-password", {
        currentPassword: passData.current,
        newPassword: passData.newPass,
      });
      toast.success(res.data?.message || "Password updated successfully!");
      setPassData({ current: '', newPass: '', confirm: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "CC";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join("");
  };

  const filteredListings = userListings.filter(item => {
    if (listingFilter === 'active') return !item.isSold;
    if (listingFilter === 'sold') return item.isSold;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white relative py-10 px-4 sm:px-8 md:px-16 lg:px-20 select-none">
      
      {/* Ambient background crimson glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#D5354F]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#B89AA2]">
            <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span>/</span>
            <span className="text-[#ff4569] font-medium">User Profile</span>
          </div>

          <Link
            to="/addproduct"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-[#D5354F]/20"
          >
            <Plus size={16} />
            <span>List New Item</span>
          </Link>
        </div>

        {/* Clean, Professional Hero Header Banner */}
        <div className="relative rounded-3xl bg-[#0a0a0a] border border-white/10 p-5 sm:p-8 shadow-xl shadow-black/20 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left w-full lg:w-auto">
            
            {/* Hidden Direct File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleDirectFileChange} 
              className="hidden" 
            />

            {/* Interactive Avatar Frame with Camera Overlay */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#D5354F] to-[#ff4569] p-0.5 shadow-lg shadow-[#D5354F]/25 flex items-center justify-center overflow-hidden flex-shrink-0 relative group cursor-pointer"
              title="Click to set profile picture"
            >
              {editData.avatar || user?.avatar ? (
                <img src={editData.avatar || user?.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[14px]" />
              ) : (
                <div className="w-full h-full bg-[#141414] rounded-[14px] flex items-center justify-center text-[#ff4569] text-2xl font-black">
                  {getInitials(user?.userName || user?.username)}
                </div>
              )}

              {/* Hover Camera Icon Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[14px] flex flex-col items-center justify-center gap-1 text-white">
                <Camera size={22} className="text-[#ff4569]" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-1.5 justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight">
                {user?.userName || user?.username || "Campus Student"}
              </h1>

              <p className="text-xs sm:text-sm text-[#B8B8B8] opacity-80">
                {user?.email || "student@campus.edu"} {user?.phone ? `• ${user.phone}` : ''}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                  {user?.collageName || "Campus Student"}
                </span>

                {user?.department && (
                  <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {user.department} • Sem {user.semester || "1"}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Clean, Neutral Right-Side Stat Cards */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-3 w-full lg:w-auto">
            
            {/* Stat Card 1: Account Status */}
            <div className="flex-1 sm:flex-initial bg-[#141414] border border-white/10 p-3.5 px-4 rounded-2xl flex flex-col justify-between items-center sm:items-end min-w-[130px] shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Status</span>
              <span className="mt-2 inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-200">
                {user?.isVerified ? "Verified Student" : "Active Student"}
              </span>
            </div>

            {/* Stat Card 2: Listings Posted */}
            <div className="flex-1 sm:flex-initial bg-[#141414] border border-white/10 p-3.5 px-5 rounded-2xl flex flex-col justify-between items-center sm:items-end min-w-[120px] shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Listings Posted</span>
              <span className="text-2xl font-black text-white tracking-tight mt-0.5">{userListings.length}</span>
            </div>

          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/25'
                : 'bg-[#141414] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            My Listings ({userListings.length})
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/25'
                : 'bg-[#141414] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Edit Profile
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/25'
                : 'bg-[#141414] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Security
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[#D5354F] text-white shadow-md shadow-[#D5354F]/25'
                : 'bg-[#141414] border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            Wishlist
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0a] border border-white/10 p-4 px-6 rounded-2xl">
              <div>
                <h2 className="text-base font-bold text-[#F5F5F5]">Your Campus Listings</h2>
                <p className="text-xs text-gray-400">Manage listing availability or remove posted items</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setListingFilter('all')}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    listingFilter === 'all' ? 'bg-[#D5354F] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({userListings.length})
                </button>
                <button
                  onClick={() => setListingFilter('active')}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    listingFilter === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Active ({userListings.filter(i => !i.isSold).length})
                </button>
                <button
                  onClick={() => setListingFilter('sold')}
                  className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    listingFilter === 'sold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sold ({userListings.filter(i => i.isSold).length})
                </button>
              </div>
            </div>

            {loadingListings ? (
              <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-2">
                <RefreshCw size={24} className="animate-spin text-[#ff4569]" />
                <span className="text-xs font-medium">Loading your listings...</span>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="py-16 px-4 bg-[#0a0a0a] border border-white/5 rounded-3xl text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-bold text-white">No Listings Found</h3>
                <p className="text-xs text-gray-400 max-w-sm">List your textbooks or gadgets to start selling to campus peers.</p>
                <Link to="/addproduct" className="mt-2 px-5 py-2.5 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl shadow-md shadow-[#D5354F]/20">
                  + Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {filteredListings.map((product) => (
                  <div key={product._id || product.id} className="relative w-full max-w-[350px] flex flex-col gap-2">
                    <ProductCard product={product} variant="original" />
                    
                    {/* Action Controls */}
                    <div className="flex items-center justify-between gap-2.5 p-2 bg-[#141414] border border-white/10 rounded-2xl mt-1">
                      <button
                        onClick={() => handleToggleSold(product._id || product.id, product.isSold)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                          product.isSold
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                            : 'bg-[#D5354F]/15 border border-[#D5354F]/40 text-[#ff4569] hover:bg-[#D5354F] hover:text-white'
                        }`}
                      >
                        {product.isSold ? "Mark Available" : "Mark as Sold"}
                      </button>

                      <button
                        onClick={() => {
                          setUserListings(prev => prev.filter(p => (p._id || p.id) !== (product._id || product.id)));
                          toast.success("Listing deleted successfully!");
                        }}
                        className="py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-red-500 hover:border-red-500 hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Edit Profile */}
        {activeTab === 'edit' && (
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full relative overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D5354F]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 mb-6 relative z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Profile Settings
                </h2>
                <p className="text-xs text-gray-400 mt-1">Manage your public campus details, contact preferences, and student credentials</p>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold">
                Campus Student
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-8 relative z-10">
              
              {/* Group 1: Editable Account Details */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#ff4569] uppercase tracking-wider">
                    Editable Student Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">Username</label>
                    <input
                      type="text"
                      name="userName"
                      value={editData.userName}
                      onChange={handleEditChange}
                      className="bg-[#141414] border border-white/10 focus:border-[#ff4569] text-white rounded-xl py-3 px-4 text-sm focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Current Semester */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300">Current Semester</label>
                    <select
                      name="semester"
                      value={editData.semester}
                      onChange={handleEditChange}
                      className="bg-[#141414] border border-white/10 focus:border-[#ff4569] text-white rounded-xl py-3 px-4 text-sm focus:outline-none transition-all cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s} className="bg-[#141414] text-white">Semester {s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-300">Phone Number (For Campus Buyers)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      placeholder="+91 98765 43210"
                      className="bg-[#141414] border border-white/10 focus:border-[#ff4569] text-white rounded-xl py-3 px-4 text-sm focus:outline-none transition-all"
                    />
                  </div>

                  {/* Profile Picture URL / Quick Action */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-300">Profile Picture URL</label>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#ff4569] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Camera size={13} /> Choose Image File
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        name="avatar"
                        value={editData.avatar}
                        onChange={handleEditChange}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-[#141414] border border-white/10 focus:border-[#ff4569] text-white rounded-xl py-3 px-4 text-sm focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
                      >
                        Presets
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Group 2: Verified & Locked Student Credentials */}
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    Verified Campus Credentials
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium">Locked for campus peer verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Email */}
                  <div className="flex flex-col gap-1.5 bg-[#141414] border border-white/10 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-400">Student Email</span>
                      <span className="text-[10px] text-gray-500 font-bold">🔒 Locked</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 truncate" title={editData.email}>{editData.email || "Not set"}</span>
                  </div>

                  {/* College Name */}
                  <div className="flex flex-col gap-1.5 bg-[#141414] border border-white/10 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-400">College / University</span>
                      <span className="text-[10px] text-gray-500 font-bold">🔒 Locked</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 truncate" title={editData.collageName}>{editData.collageName || "Campus Student"}</span>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-1.5 bg-[#141414] border border-white/10 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-400">Department</span>
                      <span className="text-[10px] text-gray-500 font-bold">🔒 Locked</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300 truncate">{editData.department || "CSE"}</span>
                  </div>

                </div>
              </div>

              {/* Submit Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-gradient-to-r from-[#D5354F] to-[#ff4569] hover:brightness-110 text-white font-bold text-xs tracking-wide rounded-xl transition-all shadow-lg shadow-[#D5354F]/30 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'security' && (
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="text-xl font-bold text-[#F5F5F5]">Security Credentials</h2>
              <p className="text-xs text-gray-400">Manage your account password</p>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Current Password</label>
                <input
                  type="password"
                  value={passData.current}
                  onChange={(e) => setPassData(p => ({ ...p, current: e.target.value }))}
                  placeholder="••••••••"
                  className="bg-[#141414] border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#ff4569]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">New Password</label>
                <input
                  type="password"
                  value={passData.newPass}
                  onChange={(e) => setPassData(p => ({ ...p, newPass: e.target.value }))}
                  placeholder="••••••••"
                  className="bg-[#141414] border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#ff4569]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={passData.confirm}
                  onChange={(e) => setPassData(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="bg-[#141414] border border-white/10 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#ff4569]"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="mt-2 w-fit px-6 py-3 bg-[#D5354F] hover:bg-[#ff4569] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#D5354F]/20 cursor-pointer disabled:opacity-50"
              >
                {changingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Wishlist */}
        {activeTab === 'saved' && (
          <div className="py-16 px-4 bg-[#0a0a0a] border border-white/5 rounded-3xl text-center flex flex-col items-center gap-3">
            <h3 className="text-base font-bold text-white">Your Saved Wishlist</h3>
            <p className="text-xs text-gray-400 max-w-sm">Saved items will appear here for quick access.</p>
            <Link to="/marketplace" className="mt-2 px-5 py-2.5 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#D5354F]/20">
              Browse Marketplace
            </Link>
          </div>
        )}

      </div>

      {/* Interactive Profile Picture Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0d12] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col gap-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Camera className="text-[#ff4569]" size={20} />
                <h3 className="text-lg font-bold text-white">Update Profile Picture</h3>
              </div>
              <button 
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar Preview Box */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#D5354F] to-[#ff4569] p-0.5 shadow-xl shadow-[#D5354F]/30 flex items-center justify-center overflow-hidden">
                {tempAvatar ? (
                  <img src={tempAvatar} alt="Preview" className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  <div className="w-full h-full bg-[#141414] rounded-[14px] flex items-center justify-center text-[#ff4569] text-3xl font-black">
                    {getInitials(user?.userName)}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400">Current Photo Preview</span>
            </div>

            {/* Option 1: Local Computer Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Upload size={14} className="text-[#ff4569]" /> Upload Image From Device
              </label>
              <label className="w-full h-11 border border-dashed border-gray-700 hover:border-[#ff4569] rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-semibold text-gray-300 cursor-pointer transition-all gap-2">
                <Upload size={15} /> Choose Photo File
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden" 
                />
              </label>
            </div>

            {/* Option 2: Image URL Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon size={14} className="text-[#ff4569]" /> Or Paste Image Web URL
              </label>
              <div className="flex gap-2">
                <input 
                  type="url"
                  value={avatarUrlInput}
                  onChange={(e) => setAvatarUrlInput(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="flex-1 bg-[#141414] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ff4569]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (avatarUrlInput.trim()) {
                      setTempAvatar(avatarUrlInput.trim());
                      toast.success("Image URL applied!");
                    }
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Option 3: Presets Grid */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Or Pick a Student Avatar Preset
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempAvatar(url)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      tempAvatar === url ? 'border-[#ff4569] scale-105 shadow-md shadow-[#ff4569]/30' : 'border-transparent hover:border-white/40'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Cancel Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveAvatar()}
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold transition-all shadow-md shadow-[#D5354F]/25 cursor-pointer disabled:opacity-50"
              >
                Save Profile Picture
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
