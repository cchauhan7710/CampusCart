import React from 'react';

// Single Product Card Skeleton
export const SkeletonCard = () => {
  return (
    <div className="rounded-2xl bg-[#141414] border border-white/10 p-3.5 flex flex-col justify-between h-[340px] sm:h-[360px] animate-pulse">
      {/* Image Thumbnail Placeholder */}
      <div className="w-full h-44 sm:h-48 bg-white/5 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-white/5" />
      </div>

      {/* Content Placeholders */}
      <div className="flex flex-col gap-2 flex-1 justify-between">
        <div>
          {/* Badge & Category */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-16 bg-white/5 rounded-md" />
            <div className="h-3 w-12 bg-white/5 rounded-md" />
          </div>

          {/* Title Lines */}
          <div className="h-4 w-3/4 bg-white/10 rounded-md mb-1.5" />
          <div className="h-3 w-1/2 bg-white/5 rounded-md" />
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <div className="h-5 w-20 bg-white/10 rounded-lg" />
          <div className="h-8 w-24 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// Grid of Product Card Skeletons
export const SkeletonGrid = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

// Full Page Layout Skeleton for Route Suspense Fallback
export const SkeletonPage = () => {
  return (
    <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 flex flex-col gap-8 animate-pulse">
      
      {/* Hero Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 rounded-3xl bg-[#141414] border border-white/10 p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-3 max-w-lg">
          <div className="h-8 w-3/4 bg-white/10 rounded-xl" />
          <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-white/10 rounded-xl" />
          <div className="h-10 w-28 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-64 bg-[#141414] border border-white/10 rounded-xl" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-24 bg-[#141414] border border-white/10 rounded-xl" />
          <div className="h-10 w-24 bg-[#141414] border border-white/10 rounded-xl" />
        </div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <SkeletonGrid count={8} />
      </div>

    </div>
  );
};

export default SkeletonPage;
