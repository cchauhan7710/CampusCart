import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Check, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

const ProductDetailDrawer = () => {
  const { 
    selectedProduct, 
    closeProductDetails, 
    addToCart, 
    isInCart, 
    toggleWishlist, 
    isInWishlist 
  } = useCartWishlist();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setCurrentImgIndex(0);
    setQty(1);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const p = selectedProduct;
  const productId = p._id || p.id;
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [];
  const seller = typeof p.seller === 'object' && p.seller !== null ? p.seller : {};
  
  const collageName = seller.collageName || seller.collegeName || p.collageName || p.collegeName || "Campus Student";
  const sellerName = seller.userName || "Campus Seller";
  const department = seller.department || p.department || "General";
  
  const rawSemester = seller.semester || p.semester;
  const semesterDisplay = rawSemester 
    ? (String(rawSemester).toLowerCase().includes('sem') ? rawSemester : `Semester ${rawSemester}`)
    : "Campus Student";

  const phone = seller.phone || p.phone || "";
  const email = seller.email || p.email || "";

  const isWishlisted = isInWishlist(productId);
  const inCart = isInCart(productId);

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === "") return "0";
    return Number(val).toLocaleString("en-IN");
  };

  const getConditionClasses = (condition) => {
    switch (condition) {
      case "New":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "Like New":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "Fair":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      default:
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    }
  };

  const handleNextImage = () => {
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click Backdrop to Dismiss */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={closeProductDetails} 
      />

      {/* Sleek Compact Sidebar Drawer */}
      <div className="relative w-full sm:max-w-[410px] md:max-w-[430px] bg-[#0e1015] border-l border-white/10 h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col justify-between overflow-y-auto select-none">
        
        {/* Compact Header Bar */}
        <div className="sticky top-0 z-20 bg-[#0e1015]/95 backdrop-blur-xl px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#D5354F]/20 border border-[#D5354F]/40 text-[#ff4569] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {p.category || 'General'}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getConditionClasses(p.condition)}`}>
              {p.condition || 'Good'}
            </span>
          </div>

          <button
            onClick={closeProductDetails}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 flex flex-col gap-4 flex-1">
          
          {/* Image Showcase Gallery */}
          <div className="relative w-full h-[210px] sm:h-[230px] rounded-2xl overflow-hidden bg-[#161820] border border-white/10 group">
            {images[currentImgIndex] ? (
              <img
                src={images[currentImgIndex]}
                alt={p.title || 'Product'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a1c23] to-[#0e1015] flex items-center justify-center text-white/40 text-xs font-semibold">
                No Image Preview Available
              </div>
            )}

            {/* Navigation Arrows if Multiple Images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Thumbnails indicator */}
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentImgIndex === idx ? 'bg-[#ff4569] scale-110' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Floating Wishlist Heart Button */}
            <button
              onClick={() => toggleWishlist(p)}
              className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-red-500/30 border-red-500/60 text-red-400 scale-105 shadow-lg shadow-red-500/20'
                  : 'bg-black/50 border-white/20 text-white/80 hover:text-white hover:bg-black/70'
              }`}
              title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
            >
              <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Title & Price Section */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              {p.title || 'Untitled Item'}
            </h2>

            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-2xl font-black text-[#ff4569]">
                ₹{formatPrice(p.price)}
              </span>
              {p.price && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{formatPrice(Math.round(p.price * 1.55))}
                </span>
              )}
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
                Verified Seller
              </span>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Description
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-normal max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {p.description || 'No detailed description provided by seller.'}
            </p>
          </div>

          {/* Compact Seller Profile Card */}
          <div className="bg-gradient-to-br from-[#161822] to-[#0e1015] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {p.seller?.avatar ? (
                <img src={p.seller.avatar} alt={sellerName} className="w-10 h-10 rounded-xl object-cover border border-[#ff4569]/50 shadow-sm flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#D5354F] text-white font-black text-sm flex items-center justify-center shadow-sm uppercase flex-shrink-0">
                  {sellerName[0] || 'S'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-[#ff4569] uppercase tracking-wider">
                  Campus Seller
                </span>
                <h4 className="text-sm font-bold text-white leading-tight truncate">
                  {sellerName}
                </h4>
              </div>
            </div>

            {/* College, Department & Semester Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <GraduationCap size={15} className="text-[#ff4569] flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-gray-400 uppercase">College</span>
                  <span className="font-semibold text-white text-[11px] truncate">{collageName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Building size={15} className="text-purple-400 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-gray-400 uppercase">Department</span>
                  <span className="font-semibold text-white text-[11px] truncate">
                    {department}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-300 sm:col-span-2">
                <BookOpen size={15} className="text-amber-400 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-gray-400 uppercase">Semester</span>
                  <span className="font-semibold text-white text-[11px] truncate">
                    {semesterDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="flex gap-2 pt-1">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-500/30 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone size={13} className="text-emerald-400" />
                  Call
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}?subject=CampusCart Interest: ${encodeURIComponent(p.title || '')}`}
                  className="flex-1 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-blue-500/30 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Mail size={13} className="text-blue-400" />
                  Email
                </a>
              )}
            </div>
          </div>

          {/* Campus Handshake Guarantee Pill */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
            <div className="text-xs text-gray-300">
              <p className="font-bold text-white text-[11px]">Direct Campus Exchange</p>
              <p className="text-[10px] text-gray-400">Inspect the item in person before payment.</p>
            </div>
          </div>

        </div>

        {/* Compact Sticky Bottom Action Bar */}
        <div className="sticky bottom-0 z-20 bg-[#0e1015]/95 backdrop-blur-xl px-5 py-3 border-t border-white/10 flex items-center gap-3">
          
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#181a22] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-white">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Add to Cart Primary Button */}
          <button
            onClick={() => addToCart(p, qty)}
            className={`flex-1 font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              inCart
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-[#D5354F] hover:bg-[#ff4569] text-white shadow-[#D5354F]/20 hover:shadow-[#ff4569]/40'
            }`}
          >
            {inCart ? (
              <>
                <Check size={15} />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailDrawer;
