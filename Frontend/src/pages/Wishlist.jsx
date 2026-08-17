import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ChevronRight, 
  Plus, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

const Wishlist = () => {
  const { 
    wishlist, 
    wishlistCount, 
    removeFromWishlist, 
    addToCart, 
    isInCart 
  } = useCartWishlist();

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    return Number(val).toLocaleString('en-IN');
  };

  const handleMoveToCart = async (product) => {
    const productId = product._id || product.id;
    if (productId) {
      const added = await addToCart(product, 1);
      if (added) {
        await removeFromWishlist(productId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative py-10 px-4 md:px-8 lg:px-12 xl:px-20 select-none">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#D5354F]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#B89AA2]">
          <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link to="/marketplace" className="hover:text-white transition-colors duration-200">Marketplace</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-[#ff4569] font-medium">Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D5354F]/10 border border-[#D5354F]/20 text-[#D5354F] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              <Heart size={12} className="fill-[#D5354F]" /> Saved Items
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Your <span className="text-[#D5354F]">Wishlist</span>
            </h1>
            <p className="text-sm text-[#B89AA2] mt-2 font-light">
              Keep track of textbook offers, gear, and items you're interested in purchasing later.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold">
              {wishlistCount} {wishlistCount === 1 ? 'Saved Item' : 'Saved Items'}
            </span>
          </div>
        </div>

        {/* Wishlist Main Section */}
        {!wishlist?.products || wishlist.products.length === 0 ? (
          /* Empty Wishlist State */
          <div className="text-center py-16 px-6 bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-lg mx-auto flex flex-col items-center gap-4 my-8 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#D5354F]/10 border border-[#D5354F]/20 flex items-center justify-center text-[#ff4569] mb-1">
              <Heart size={28} />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">Your Wishlist is Empty</h3>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm font-normal">
              Save items you are interested in by clicking the heart icon on any campus listing.
            </p>

            <Link
              to="/marketplace"
              className="mt-2 px-6 py-3 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {wishlist.products.map((product) => {
              if (!product || typeof product !== 'object') return null;
              const productId = product._id || product.id;
              const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
              const seller = product.seller || {};
              const inCart = isInCart(productId);

              return (
                <div
                  key={productId}
                  className="w-full max-w-[340px] sm:max-w-[350px] group relative rounded-[32px] overflow-hidden bg-[#0e1015]/90 border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.75)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between select-none"
                >
                  {/* Top Image Container */}
                  <div className="relative w-full h-[220px] overflow-hidden bg-[#161820]">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.title || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a1c23] to-[#0e1015] flex items-center justify-center text-white/40 text-xs font-semibold">
                        Campus Cart Listing
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/40 to-transparent pointer-events-none" />

                    {/* Remove Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(productId)}
                      className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 border border-white/15 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 backdrop-blur-md transition-all duration-200 cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 z-10 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-xs font-black text-white tracking-wide shadow-inner">
                      ₹{formatPrice(product.price)}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 pt-3 flex flex-col justify-between flex-1 gap-3 relative z-10">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-white/10 backdrop-blur-md border border-white/5 text-[11px] font-semibold text-white/90 px-3.5 py-0.5 rounded-full">
                          {product.category || 'General'}
                        </span>
                        <span className="bg-white/10 backdrop-blur-md border border-white/5 text-[11px] font-semibold text-white/90 px-3.5 py-0.5 rounded-full">
                          {product.condition || 'Good'}
                        </span>
                      </div>

                      <h3 
                        className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#ff4569] transition-colors duration-200"
                        title={product.title}
                      >
                        {product.title || 'Untitled Item'}
                      </h3>

                      <p 
                        className="text-xs text-gray-300/80 font-normal line-clamp-2 leading-relaxed"
                        title={product.description}
                      >
                        {product.description || 'No description provided.'}
                      </p>

                      {/* Seller Tag */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <div className="w-4 h-4 rounded-full bg-[#D5354F] text-white text-[9px] font-bold flex items-center justify-center uppercase">
                          {seller.userName?.[0] || 'S'}
                        </div>
                        <span className="truncate">{seller.userName || 'Campus Seller'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 mt-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToCart(product)}
                        className={`flex-1 font-extrabold text-xs uppercase tracking-wider py-3 rounded-full text-center transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                          inCart
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-white hover:bg-gray-100 text-black shadow-[0_10px_25px_rgba(255,255,255,0.12)]'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        <span>{inCart ? 'In Cart' : 'Move To Cart'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(productId)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
