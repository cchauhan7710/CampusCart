import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Check, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  X, 
  Image as ImageIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const Addproduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Book',
    condition: 'Good',
    images: []
  });

  // Raw File objects for multipart API upload
  const [rawFiles, setRawFiles] = useState([]);

  // UI States
  const [imageUrl, setImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  // Category and Condition Options
  const categories = ["Book", "Electronics", "Lab Equipment", "Notes", "Stationery", "Other"];
  const conditions = ["New", "Like New", "Good", "Fair"];

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Mark input as touched
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Validate single field
  const validateField = (field, value) => {
    let error = null;
    if (field === 'title') {
      if (!value.trim()) error = 'Title is required';
      else if (value.trim().length < 3) error = 'Title must be at least 3 characters';
    }
    if (field === 'price') {
      if (!value) error = 'Price is required';
      else if (isNaN(value) || Number(value) <= 0) error = 'Price must be a valid number greater than 0';
    }
    if (field === 'description') {
      if (!value.trim()) error = 'Description is required';
      else if (value.trim().length < 10) error = 'Description must be at least 10 characters';
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';

    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Drag Events for file upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Dropped Files
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle Selected Files
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Convert files to base64 URLs for local preview & store raw Files for API submission
  const handleFiles = (files) => {
    const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validImageFiles.length === 0) {
      alert("Please upload image files only.");
      return;
    }

    setRawFiles(prev => [...prev, ...validImageFiles]);

    validImageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: null }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Image URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    
    // Simple URL regex check
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?.*$/;
    if (!urlPattern.test(imageUrl)) {
      setErrors(prev => ({ ...prev, imageUrl: 'Please enter a valid URL' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl.trim()]
    }));
    setImageUrl('');
    setErrors(prev => ({ ...prev, images: null, imageUrl: null }));
  };

  // Remove Image from list
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setRawFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Trigger File Input Click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Real Form Submit to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Mark all as touched
    setTouched({
      title: true,
      price: true,
      description: true
    });

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("condition", formData.condition);

      // Append binary raw File objects for Multer backend
      rawFiles.forEach((file) => {
        submitData.append("images", file);
      });

      // Append any pasted URL strings
      const urlImages = formData.images.filter(
        (img) => typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))
      );
      if (urlImages.length > 0) {
        submitData.append("images", JSON.stringify(urlImages));
      }

      const response = await API.post("/product/create-product", submitData);

      if (response.data) {
        setIsSubmitting(false);
        setIsSuccess(true);
        toast.success("Listing published successfully!");
      }
    } catch (err) {
      console.error("API error while creating product:", err);
      setIsSubmitting(false);
      const message = err.response?.data?.message || err.message || "Failed to publish listing on the API. Please ensure you are logged in.";
      setApiError(message);
      toast.error(message);
    }
  };

  // Reset Form to list another product
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Book',
      condition: 'Good',
      images: []
    });
    setRawFiles([]);
    setTouched({});
    setErrors({});
    setApiError('');
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative py-12 px-4 md:px-8 lg:px-12 xl:px-20">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D5354F]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Embedded CSS for custom premium styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 69, 105, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 69, 105, 0.4);
        }
        .glow-button {
          box-shadow: 0 0 20px rgba(213, 53, 79, 0.15);
          transition: all 0.3s ease;
        }
        .glow-button:hover {
          box-shadow: 0 0 25px rgba(213, 53, 79, 0.35);
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#B89AA2] select-none">
          <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link to="/marketplace" className="hover:text-white transition-colors duration-200">Marketplace</Link>
          <ChevronRight size={14} className="opacity-50" />
          <span className="text-[#ff4569] font-medium">Sell Item</span>
        </div>

        {/* Header Title */}
        <div className="relative">
          <div className="inline-flex items-center bg-[#D5354F]/10 border border-[#D5354F]/20 text-[#D5354F] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
            Re-commerce Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            List Your <span className="text-[#D5354F]">Campus Gear</span>
          </h1>
          <p className="text-sm md:text-base text-[#B89AA2] mt-2 max-w-2xl font-light">
            Fill in the details below to publish your item instantly. Peer students will be able to search and contact you directly.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Product Form (Col span 7) */}
          <form 
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-[#111111]/70 border border-white/5 p-5 md:p-8 rounded-3xl shadow-2xl relative backdrop-blur-xl flex flex-col gap-6 md:gap-7"
          >
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
            
            {/* General Info Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#ff4569] rounded-full inline-block"></span>
                General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div 
                  className="md:col-span-2 flex flex-col gap-1.5"
                  data-error={touched.title && !!errors.title}
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Product Title <span className="text-[#ff4569]">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={() => handleBlur('title')}
                    placeholder="e.g. HC Verma Physics Vol 1"
                    maxLength={100}
                    className={`bg-[#141414]/90 border ${touched.title && errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#ff4569]/70'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#ff4569]/20 transition-all duration-300 placeholder-white/20 text-sm`}
                  />
                  {touched.title && errors.title && (
                    <span className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                      <AlertCircle size={12} /> {errors.title}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div 
                  className="flex flex-col gap-1.5"
                  data-error={touched.price && !!errors.price}
                >
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Price (INR) <span className="text-[#ff4569]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={() => handleBlur('price')}
                      placeholder="250"
                      min="0"
                      className={`w-full bg-[#141414]/90 border ${touched.price && errors.price ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#ff4569]/70'} text-white rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:ring-1 focus:ring-[#ff4569]/20 transition-all duration-300 placeholder-white/20 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                  </div>
                  {touched.price && errors.price && (
                    <span className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                      <AlertCircle size={12} /> {errors.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Category <span className="text-[#ff4569]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#141414]/90 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#ff4569]/70 focus:ring-1 focus:ring-[#ff4569]/20 transition-all duration-300 text-sm appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#111] text-white py-2">{cat}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Condition (Selector) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Item Condition <span className="text-[#ff4569]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-h-[46px]">
                    {conditions.map((cond) => {
                      const isActive = formData.condition === cond;
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                          className={`rounded-xl border text-xs font-semibold flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? 'border-[#ff4569] bg-[#ff4569]/10 text-white shadow-[0_0_15px_rgba(255,69,105,0.15)] font-bold' 
                              : 'border-white/5 bg-[#141414]/85 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#ff4569] rounded-full inline-block"></span>
                Detailed Description
              </h2>

              <div 
                className="flex flex-col gap-1.5"
                data-error={touched.description && !!errors.description}
              >
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Description <span className="text-[#ff4569]">*</span>
                  </label>
                  <span className="text-[10px] text-gray-500">
                    {formData.description.length}/1000
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur('description')}
                  placeholder="Tell students about your product. Include details like how long it's been used, specific damages, edition (for books), included accessories, or if meeting location is negotiable."
                  maxLength={1000}
                  rows={4}
                  className={`bg-[#141414]/90 border ${touched.description && errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#ff4569]/70'} text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#ff4569]/20 transition-all duration-300 placeholder-white/20 text-sm resize-y min-h-[100px] leading-relaxed`}
                />
                {touched.description && errors.description && (
                  <span className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                    <AlertCircle size={12} /> {errors.description}
                  </span>
                )}
              </div>
            </div>

            {/* Product Images Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#ff4569] rounded-full inline-block"></span>
                Product Images
              </h2>

              <div className="flex flex-col gap-4">
                
                {/* Drag and Drop File Input Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    dragActive 
                      ? 'border-[#ff4569] bg-[#ff4569]/5 scale-[0.99] shadow-[0_0_20px_rgba(255,69,105,0.08)]' 
                      : 'border-white/10 bg-[#141414]/50 hover:border-white/20'
                  }`}
                  onClick={onButtonClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-gray-400">
                    <Upload size={20} className={dragActive ? "animate-bounce text-[#ff4569]" : ""} />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-gray-200">
                      Drag & Drop image files, or <span className="text-[#ff4569] hover:underline">browse files</span>
                    </p>
                    <p className="text-xs text-gray-500">Supports PNG, JPG, JPEG, WebP. Recommended ratio 1:1.</p>
                  </div>
                </div>

                {/* Paste URL Option */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-gray-500 uppercase tracking-widest text-center">OR</span>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                        <ImageIcon size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: null }));
                        }}
                        className={`w-full bg-[#141414]/90 border ${errors.imageUrl ? 'border-red-500/50' : 'border-white/10 focus:border-[#ff4569]/70'} text-white rounded-xl py-2.5 pl-9 pr-4 focus:outline-none transition-all duration-300 placeholder-white/20 text-xs`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 bg-[#1a1a1a] hover:bg-[#ff4569]/10 border border-white/10 hover:border-[#ff4569] text-[#ff4569] text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                  {errors.imageUrl && (
                    <span className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={10} /> {errors.imageUrl}
                    </span>
                  )}
                </div>

                {/* Uploaded Files Preview Area */}
                <div 
                  className="flex flex-col gap-2"
                  data-error={touched.images && !!errors.images}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-400">Added Images ({formData.images.length})</span>
                    <span className="text-gray-500">The first image is the main card cover.</span>
                  </div>

                  {formData.images.length === 0 ? (
                    <div className="border border-white/5 bg-[#141414]/30 rounded-xl p-4 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
                      <Info size={14} />
                      No images added yet. Add at least one image to display.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 p-3 bg-[#141414]/50 border border-white/5 rounded-2xl overflow-y-auto max-h-[220px] custom-scrollbar">
                      {formData.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-black flex items-center justify-center"
                        >
                          <img 
                            src={image} 
                            alt={`Product Upload ${index + 1}`} 
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                          
                          {/* Image Actions Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-white transition-colors duration-150 cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Primary Cover Badge */}
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-[#ff4569] text-[9px] text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase select-none">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <span className="text-xs text-red-400 flex items-center gap-1.5 mt-0.5">
                      <AlertCircle size={12} /> {errors.images}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Form Action Button */}
            <div className="border-t border-white/5 pt-5 mt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D5354F] hover:bg-[#ff4569] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-[15px] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D5354F]/10 glow-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Publishing Listing...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Publish Listing
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Right: Live Preview Panel (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col items-center gap-5 lg:sticky lg:top-24">
            
            {/* Label */}
            <div className="flex items-center gap-2 justify-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-[#111]/80 border border-white/5 px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Card Preview
            </div>

            {/* Preview Frame */}
            <div className="w-full max-w-[340px] p-4 bg-[#111111]/40 border border-white/5 rounded-[32px] shadow-2xl relative backdrop-blur-xl flex justify-center items-center">
              
              {/* Dynamic Product Card render */}
              <ProductCard 
                product={{
                  title: formData.title.trim() || 'Awesome Product Title',
                  description: formData.description.trim() || 'Provide a compelling description. Students can browse, filter and check quality details here.',
                  price: formData.price ? Number(formData.price) : undefined,
                  category: formData.category,
                  condition: formData.condition,
                  images: formData.images.length > 0 ? formData.images : []
                }} 
              />

              {/* Shadow Overlay decoration to lock in details */}
              <div className="absolute inset-x-0 bottom-[-10px] h-[30px] bg-gradient-to-t from-black to-transparent pointer-events-none -z-10" />
            </div>

            {/* Preview helper guide */}
            <div className="max-w-[320px] bg-[#141414]/30 border border-white/5 rounded-2xl p-4 text-[11px] text-gray-500 leading-relaxed flex items-start gap-2.5">
              <Info size={14} className="text-[#ff4569] flex-shrink-0 mt-0.5" />
              <span>
                This is a live preview of your item card as it will be rendered on the <strong>CampusCart Marketplace</strong>. Verify styling, coverage, and details before publishing.
              </span>
            </div>
            
          </div>

        </div>

      </div>

      {/* Success Glassmorphic Modal Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 animate-fade-in">
          <div className="bg-[#111111] border border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full text-center relative shadow-2xl overflow-hidden flex flex-col items-center gap-5">
            {/* Absolute background color overlay blur */}
            <div className="absolute top-[-50px] w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />
            
            {/* Checkmark Circle Animation */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
              <Check size={32} className="animate-bounce" />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white">Listing Published!</h3>
            
            <p className="text-sm text-[#B89AA2] leading-relaxed">
              Your item <strong>"{formData.title}"</strong> has been listed successfully. Peers on campus can now search for and purchase your listing under the <span className="text-[#ff4569]">{formData.category}</span> catalog.
            </p>

            {/* Summary preview list */}
            <div className="w-full bg-[#161616] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5 text-left text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Price:</span><span className="font-bold text-white">₹{formData.price}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Category:</span><span className="text-white font-medium">{formData.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Condition:</span><span className="text-white font-medium">{formData.condition}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Images Uploaded:</span><span className="text-white font-medium">{formData.images.length} item(s)</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <button
                onClick={handleReset}
                className="py-3 px-4 border border-white/10 hover:border-white/20 bg-[#161616] hover:bg-[#202020] text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                Sell Another Item
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="py-3 px-4 bg-[#D5354F] hover:bg-[#ff4569] text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-[#D5354F]/20"
              >
                Go to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addproduct;

