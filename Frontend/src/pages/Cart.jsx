import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck,
  User,
  X,
  MessageCircle,
  Building
} from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

const Cart = () => {
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    toggleWishlist,
    isInWishlist
  } = useCartWishlist();

  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const formatPrice = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    return Number(val).toLocaleString('en-IN');
  };

  const handleMoveToWishlist = async (product) => {
    if (product) {
      await toggleWishlist(product);
      await removeFromCart(product._id || product.id);
    }
  };

  const handleConfirmReservation = () => {
    setReservationSuccess(true);
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white relative py-10 px-4 md:px-8 lg:px-12 xl:px-20 select-none">
      {/* Glow overlays */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D5354F]/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#B89AA2]">
          <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link to="/marketplace" className="hover:text-white transition-colors duration-200">Marketplace</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-[#ff4569] font-medium">Shopping Cart</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D5354F]/10 border border-[#D5354F]/20 text-[#D5354F] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              <ShoppingBag size={12} /> Peer-to-Peer Cart
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Your <span className="text-[#D5354F]">Cart</span>
            </h1>
            <p className="text-sm text-[#B89AA2] mt-2 font-light">
              Review your items before reserving them with sellers across campus.
            </p>
          </div>

          {cart?.items?.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3.5 py-2 rounded-xl transition-all duration-200 w-fit cursor-pointer"
            >
              <Trash2 size={14} /> Clear Entire Cart
            </button>
          )}
        </div>

        {/* Main Cart Content */}
        {!cart?.items || cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 px-6 bg-[#0a0a0a] border border-white/10 rounded-3xl max-w-lg mx-auto flex flex-col items-center gap-4 my-8 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#D5354F]/10 border border-[#D5354F]/20 flex items-center justify-center text-[#ff4569] mb-1">
              <ShoppingBag size={28} />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">Your Cart is Empty</h3>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm font-normal">
              You haven't reserved any textbooks or campus gear yet. Explore available listings in the marketplace.
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
          /* Cart Items & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cart.items.map((item) => {
                const product = item.product || {};
                const productId = product._id || product.id || item._id;
                const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
                const itemPrice = item.price || product.price || 0;
                const itemTotal = itemPrice * (item.quantity || 1);
                const seller = product.seller || {};
                const wishlisted = isInWishlist(productId);

                return (
                  <div
                    key={item._id || productId}
                    className="bg-[#111111]/70 border border-white/10 hover:border-white/20 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between backdrop-blur-xl transition-all duration-300 group"
                  >
                    {/* Product Image & Info */}
                    <div className="flex gap-4 items-center flex-1 w-full sm:w-auto">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-white/10">
                        {images[0] ? (
                          <img
                            src={images[0]}
                            alt={product.title || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#ff4569]/20 to-purple-600/20 flex items-center justify-center text-white/40 text-xs font-semibold">
                            Campus Listing
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-[#D5354F]/15 text-[#ff4569] border border-[#D5354F]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {product.category || 'General'}
                          </span>
                          <span className="bg-white/10 text-gray-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                            {product.condition || 'Good'}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate hover:text-[#ff4569] transition-colors" title={product.title}>
                          {product.title || 'Untitled Item'}
                        </h3>

                        {/* Seller Pill */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-4 h-4 rounded-full bg-[#D5354F] text-white text-[9px] font-bold flex items-center justify-center uppercase">
                            {seller.userName?.[0] || 'S'}
                          </div>
                          <span className="truncate">{seller.userName || 'Campus Seller'}</span>
                          {seller.collageName && (
                            <span className="text-[10px] text-gray-500 hidden md:inline truncate">
                              • {seller.collageName}
                            </span>
                          )}
                        </div>

                        <div className="text-sm font-bold text-gray-300 mt-0.5">
                          ₹{formatPrice(itemPrice)} <span className="text-xs font-normal text-gray-500">/ unit</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Subtotal */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => updateCartQty(productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total & Action Buttons */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-lg font-black text-white tracking-tight">
                          ₹{formatPrice(itemTotal)}
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <button
                            onClick={() => handleMoveToWishlist(product)}
                            className="text-xs text-gray-400 hover:text-[#ff4569] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Move to Wishlist"
                          >
                            <Heart size={13} className={wishlisted ? 'fill-[#ff4569] text-[#ff4569]' : ''} />
                            <span className="hidden sm:inline">Wishlist</span>
                          </button>
                          <span className="text-gray-700 hidden sm:inline">•</span>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                            title="Remove from Cart"
                          >
                            <Trash2 size={13} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-[#111111]/80 border border-white/10 rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-xl sticky top-6 shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white tracking-tight">Reservation Summary</h2>
                <span className="bg-[#D5354F]/20 text-[#ff4569] px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Campus Pickup / Handshake</span>
                  <span className="font-semibold text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-emerald-400">₹0</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-white text-base">Total Price</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#ff4569]">₹{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
                <ShieldCheck size={24} className="text-[#ff4569] flex-shrink-0" />
                <div className="text-xs text-gray-300">
                  <p className="font-bold text-white">Verified Peer Exchange</p>
                  <p className="text-[11px] text-gray-400">Pay directly when meeting your campus seller.</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setReservationSuccess(false);
                  setIsReserveModalOpen(true);
                }}
                className="w-full bg-[#D5354F] hover:bg-[#ff4569] text-white font-extrabold text-sm tracking-wide py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-[#D5354F]/30 hover:shadow-[#ff4569]/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Items Now</span>
                <ArrowRight size={16} />
              </button>

            </div>

          </div>
        )}

      </div>

      {/* Reservation Confirmation Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsReserveModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            {!reservationSuccess ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D5354F]/20 text-[#ff4569] flex items-center justify-center border border-[#D5354F]/30">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Confirm Campus Reservation</h3>
                    <p className="text-xs text-gray-400">Reserve these items directly from student sellers</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {cart?.items?.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                      <span className="text-white font-medium truncate max-w-[220px]">
                        {item.product?.title || 'Item'} (x{item.quantity})
                      </span>
                      <span className="font-bold text-[#ff4569]">
                        ₹{formatPrice((item.price || item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#D5354F]/10 border border-[#D5354F]/30 rounded-2xl p-4 text-xs text-gray-300 flex flex-col gap-1.5">
                  <p className="font-bold text-[#ff4569] flex items-center gap-1.5">
                    <MessageCircle size={14} /> Peer Contact Info
                  </p>
                  <p>Once reserved, seller details will be active for contact & campus meet-up.</p>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-white pt-2">
                  <span>Total Amount Due at Pickup:</span>
                  <span className="text-xl text-[#ff4569]">₹{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setIsReserveModalOpen(false)}
                    className="flex-1 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="flex-1 py-3.5 bg-[#D5354F] hover:bg-[#ff4569] rounded-xl text-xs font-bold text-white shadow-lg shadow-[#D5354F]/30 transition-all cursor-pointer"
                  >
                    Confirm & Contact Sellers
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center animate-bounce">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white">Reservation Placed!</h3>
                <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                  Your reservation notice has been registered. You can connect with sellers directly through your profile.
                </p>
                <button
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-6 py-3 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all mt-2 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;
