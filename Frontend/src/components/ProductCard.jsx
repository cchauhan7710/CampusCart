import React, { useState, memo } from "react";
import { FiHeart } from "react-icons/fi";
import { ArrowRight, ShoppingBag, Check, GraduationCap, Info } from "lucide-react";
import { useCartWishlist } from "../context/CartWishlistContext";

function ProductCard({ product, listing, variant = "luxury" }) {
  const p = product || listing || {};
  const productId = p._id || p.id;
  
  // Extract images array or fallback
  const images = Array.isArray(p.images) && p.images.length > 0 
    ? p.images 
    : [];

  const seller = typeof p.seller === 'object' && p.seller !== null ? p.seller : {};
  const collageName = seller.collageName || seller.collegeName || p.collageName || p.collegeName || "Campus";
  const sellerName = seller.userName || "Campus Seller";

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { toggleWishlist, isInWishlist, addToCart, isInCart, openProductDetails } = useCartWishlist();

  const isLiked = isInWishlist(productId);
  const inCart = isInCart(productId);

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === "") return "0";
    return Number(val).toLocaleString("en-IN");
  };

  const getInitials = (text) => {
    if (!text) return "CC";
    return text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  const getConditionClasses = (condition) => {
    switch (condition) {
      case "New":
        return "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] text-[#10b981]";
      case "Like New":
        return "border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]";
      case "Fair":
        return "border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.1)] text-[#f59e0b]";
      default:
        return "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] text-[#10b981]";
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(p);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(p, 1);
  };

  const handleCardClick = () => {
    openProductDetails(p);
  };

  // ORIGINAL DESIGN (Used for Landing Page)
  if (variant === "original" || variant === "classic") {
    return (
      <div 
        onClick={handleCardClick}
        className="cc-card mx-auto cursor-pointer group"
      >
        <div className="cc-card__shine" />
        <div className="cc-card__glow" />
        <div className="cc-card__content flex flex-col justify-between h-full">
          {/* Top/Body Section */}
          <div>
            {/* Image Container */}
            <div className="relative mb-3.5 cc-card__image bg-gradient-to-b from-[#151515] to-[#0d0d0d]">
              {images[0] ? (
                <img
                  src={images[0]}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover rounded-[14px] transition duration-[500ms] ease-out group-hover:scale-[1.05]"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#ff4569]/30 to-[#7c3aed]/30 flex items-center justify-center text-white/50 text-xs">
                  No Image
                </div>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`absolute right-3 top-3 flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.75)] backdrop-blur-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition duration-[220ms] ease-out hover:scale-110 cursor-pointer z-10 ${
                  isLiked ? "text-red-400 bg-red-500/20 border-red-500/40" : "text-white/85 hover:text-[#ff90b6]"
                }`}
                aria-label="Add to wishlist"
              >
                <FiHeart className={`h-4.5 w-4.5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Category & Condition Badges */}
            <div className="mb-2.5 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[rgba(255,69,105,0.18)] bg-[rgba(255,69,105,0.12)] px-2.5 py-0.5 text-[11px] font-semibold text-[#FF4A6E] shadow-[0_0_10px_rgba(255,69,105,0.08)]">
                {p.category || "General"}
              </span>
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getConditionClasses(
                  p.condition
                )}`}
              >
                {p.condition || "New"}
              </span>
            </div>

            {/* Product Title */}
            <h3 className="cc-card__title text-[18px] font-bold leading-snug text-[#F5F5F5] transition-all duration-300 line-clamp-1 group-hover:text-[#ff4569]" title={p.title}>
              {p.title || "Product Title"}
            </h3>

            {/* Product Description */}
            <p className="cc-card__description mt-1.5 text-[13px] leading-relaxed text-[#B8B8B8] opacity-75 transition-all duration-300 line-clamp-2" title={p.description}>
              {p.description || "No description provided."}
            </p>
          </div>

          {/* Bottom/Footer Section */}
          <div>
            {/* Price Area & Action Button */}
            <div className="flex items-center justify-between gap-4 mt-3">
              <div className="flex items-baseline gap-2">
                <span className="cc-card__price text-[26px] font-[800] text-white">
                  ₹{formatPrice(p.price)}
                </span>
                {p.price && (
                  <span className="text-[12px] text-[#5F565C] line-through decoration-[1.2px] opacity-75">
                    ₹{formatPrice(Math.round(p.price * 1.55))}
                  </span>
                )}
              </div>

              <button
                className={`cc-card__button cursor-pointer ${inCart ? 'bg-[#ff4569] text-white' : ''}`}
                type="button"
                onClick={handleAddToCartClick}
                aria-label="Add to Cart"
                title={inCart ? "In Cart" : "Add to Cart"}
              >
                {inCart ? (
                  <Check size={14} />
                ) : (
                  <svg height={14} width={14} viewBox="0 0 24 24">
                    <path
                      strokeWidth={2.5}
                      stroke="currentColor"
                      d="M4 12H20M12 4V20"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-3.5 h-px bg-[rgba(255,255,255,0.06)]" />

            {/* Seller & College Profile */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] bg-[#191919] border border-[rgba(255,255,255,0.06)] text-[#FF4569] text-xs font-semibold">
                {getInitials(sellerName)}
              </div>
              <div className="overflow-hidden">
                <p className="text-[13px] font-[500] text-[#EAEAEA] truncate">
                  {sellerName}
                </p>
                <p className="text-[10px] text-[#ff4569] font-medium truncate flex items-center gap-1">
                  <GraduationCap size={11} /> {collageName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LUXURY REFERENCE DESIGN (Used for Marketplace Page)
  return (
    <div 
      onClick={handleCardClick}
      className="w-full max-w-[340px] xs:max-w-[360px] sm:max-w-none group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#0e1015]/90 border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.75)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none cursor-pointer"
    >
      
      {/* Top Image Container with Dark Gradient Blur Fade */}
      <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[230px] overflow-hidden bg-[#161820]">
        {images[currentImgIndex] ? (
          <img
            src={images[currentImgIndex]}
            alt={p.title || "Product"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1c23] to-[#0e1015] flex items-center justify-center text-white/40 text-xs font-semibold">
            Campus Cart Listing
          </div>
        )}

        {/* College Tag Badge Overlay on Image */}
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-gray-200 flex items-center gap-1.5 shadow-lg max-w-[190px]">
          <GraduationCap size={13} className="text-[#ff4569] flex-shrink-0" />
          <span className="truncate">{collageName}</span>
        </div>

        {/* Gradient Overlay matching reference image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/45 to-transparent pointer-events-none" />

        {/* Wishlist Floating Pill */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
            isLiked 
              ? 'bg-red-500/30 border-red-500/60 text-red-400 scale-110 shadow-lg shadow-red-500/20' 
              : 'bg-black/40 border-white/15 text-white/80 hover:bg-black/60 hover:text-white'
          }`}
          aria-label="Wishlist"
          title={isLiked ? "In Wishlist" : "Add to Wishlist"}
        >
          <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10">
          {(images.length > 1 ? images : [0, 1, 2]).slice(0, 3).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (images.length > 1) setCurrentImgIndex(idx % images.length);
              }}
              className={`transition-all duration-300 rounded-full ${
                (images.length > 1 ? currentImgIndex : 0) === idx
                  ? "w-4 h-1.5 bg-white shadow-sm"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 pt-2 flex flex-col justify-between flex-1 gap-3 relative z-10">
        
        <div className="flex flex-col gap-2">
          {/* Title & Price Badge Row */}
          <div className="flex items-start justify-between gap-3">
            <h3 
              className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#ff4569] transition-colors duration-200"
              title={p.title}
            >
              {p.title || "Untitled Item"}
            </h3>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-xs font-black text-white tracking-wide shadow-inner whitespace-nowrap">
              ₹{formatPrice(p.price)}
            </div>
          </div>

          {/* Description Text */}
          <p 
            className="text-xs text-gray-300/80 font-normal line-clamp-2 leading-relaxed"
            title={p.description}
          >
            {p.description || "No description provided for this campus item."}
          </p>
        </div>

        {/* Bottom Area: Tags, Seller/College info & Action Button */}
        <div className="flex flex-col gap-3 mt-1">
          {/* Tags & Seller Info Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="bg-white/10 backdrop-blur-md border border-white/5 text-[11px] font-semibold text-white/90 px-3 py-0.5 rounded-full">
                {p.category || "General"}
              </span>
              <span className="bg-white/10 backdrop-blur-md border border-white/5 text-[11px] font-semibold text-white/90 px-3 py-0.5 rounded-full">
                {p.condition || "Good"}
              </span>
            </div>

            {/* Seller initials */}
            <div className="text-[11px] text-gray-400 font-medium truncate flex items-center gap-1 max-w-[120px]" title={`Seller: ${sellerName}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4569]" />
              <span className="truncate">{sellerName}</span>
            </div>
          </div>

          {/* Full-width Capsule Action Button */}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`flex-1 font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-full text-center transition-all duration-200 cursor-pointer ${
                inCart
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-[#D5354F] to-[#ff4569] hover:brightness-110 active:scale-[0.98] text-white shadow-[0_8px_20px_rgba(213,53,79,0.35)]'
              }`}
            >
              <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openProductDetails(p);
              }}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              title="View Details"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(ProductCard);
