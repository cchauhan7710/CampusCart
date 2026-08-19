import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { 
  Search, 
  Sparkles, 
  Plus, 
  ArrowUpDown, 
  ChevronRight, 
  X, 
  Info, 
  ShoppingBag,
  RefreshCw,
  Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonLoader';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ["All", "Book", "Electronics", "Lab Equipment", "Notes", "Stationery", "Other"];

  // Fetch all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/product/allProducts");
      
      if (response.data?.allProducts?.products) {
        setProducts(response.data.allProducts.products);
      } else if (Array.isArray(response.data?.products)) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Unable to load marketplace items. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category counts calculation
  const getCategoryCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Category match
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      // Search match (title, description, category)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-high') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'title-az') {
        return (a.title || '').localeCompare(b.title || '');
      }
      // Default: newest first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-black text-white relative py-10 px-4 md:px-8 lg:px-12 xl:px-20 select-none">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#D5354F]/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 69, 105, 0.3);
          border-radius: 10px;
        }
        .glow-button {
          box-shadow: 0 0 20px rgba(213, 53, 79, 0.2);
          transition: all 0.3s ease;
        }
        .glow-button:hover {
          box-shadow: 0 0 28px rgba(213, 53, 79, 0.4);
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#B89AA2]">
          <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-[#ff4569] font-medium">Marketplace</span>
        </div>

        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
          <div>
            <div className="inline-flex items-center bg-[#D5354F]/10 border border-[#D5354F]/20 text-[#D5354F] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              Live Student Marketplace
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Campus <span className="text-[#D5354F]">Marketplace</span>
            </h1>
            <p className="text-sm md:text-base text-[#B89AA2] mt-2 max-w-2xl font-light">
              Browse secondhand books, electronics, lab gear, and accessories listed directly by peer students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/addproduct"
              className="bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs md:text-sm font-bold px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 glow-button whitespace-nowrap"
            >
              <Plus size={16} />
              List Your Gear
            </Link>
            <button
              onClick={fetchProducts}
              className="p-3.5 bg-[#141414] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all duration-200 cursor-pointer"
              title="Refresh Listings"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-[#ff4569]" : ""} />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-5 bg-[#111111]/70 border border-white/5 p-4 md:p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input Bar */}
            <div className="md:col-span-8 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by title, category, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 text-white rounded-2xl py-3.5 pl-11 pr-10 text-sm focus:outline-none focus:border-[#ff4569]/70 focus:ring-1 focus:ring-[#ff4569]/20 transition-all duration-300 placeholder-gray-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 relative flex items-center">
              <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                <ArrowUpDown size={15} />
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#161616] border border-white/10 text-white rounded-2xl py-3.5 pl-10 pr-8 text-xs font-semibold focus:outline-none focus:border-[#ff4569]/70 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title-az">Alphabetical: A to Z</option>
              </select>
              <div className="pointer-events-none absolute right-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar pt-1">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 pr-2 uppercase tracking-wider select-none">
              <Filter size={12} className="text-[#ff4569]" /> Category:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = getCategoryCount(cat);

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D5354F] text-white shadow-lg shadow-[#D5354F]/20 font-bold border border-[#ff4569]/50'
                      : 'bg-[#161616] border border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Bar Info */}
        <div className="flex items-center justify-between text-xs text-[#B89AA2] px-1">
          <div>
            Showing <span className="font-bold text-white">{filteredAndSortedProducts.length}</span> {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
            {(selectedCategory !== 'All' || searchTerm) && (
              <span className="ml-1">
                for <span className="text-[#ff4569] font-semibold">"{selectedCategory !== 'All' ? selectedCategory : searchTerm}"</span>
              </span>
            )}
          </div>

          {(selectedCategory !== 'All' || searchTerm || sortBy !== 'newest') && (
            <button
              onClick={clearFilters}
              className="text-[#ff4569] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid Area */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 px-4 bg-[#111111]/50 border border-red-500/20 rounded-3xl max-w-xl mx-auto flex flex-col items-center gap-4">
            <Info size={36} className="text-red-400" />
            <h3 className="text-lg font-bold text-white">Could Not Load Marketplace</h3>
            <p className="text-xs text-[#B89AA2] leading-relaxed">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-5 py-2.5 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Retry Connection
            </button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          /* Empty Search Results State */
          <div className="text-center py-20 px-4 bg-[#111111]/40 border border-white/5 rounded-3xl max-w-2xl mx-auto flex flex-col items-center gap-4 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-1">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">No Listings Found</h3>
            <p className="text-xs md:text-sm text-[#B89AA2] leading-relaxed max-w-md">
              We couldn't find any campus items matching your search criteria. Try clearing filters or list your item today!
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                Reset Filters
              </button>
              <Link
                to="/addproduct"
                className="px-5 py-2.5 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#D5354F]/20"
              >
                <Plus size={14} /> Sell First Item
              </Link>
            </div>
          </div>
        ) : (
          /* Main Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;
