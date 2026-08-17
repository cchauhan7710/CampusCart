import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { SkeletonGrid } from "../components/SkeletonLoader";

function LandingPageProductCard({ selectedCategory, limit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function GetAllData() {
    try {
      setLoading(true);
      const DataResponse = await axios.get(
        "http://localhost:5000/api/product/allProducts"
      );

      setProducts(DataResponse.data?.allProducts?.products || DataResponse.data?.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetAllData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  if (loading) {
    return (
      <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6">
        <SkeletonGrid count={limit || 4} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6">
      {displayedProducts.length > 0 ? (
        <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 justify-items-center items-stretch no-scrollbar">
          {displayedProducts.map((product) => (
            <div key={product._id || product.id} className="flex-shrink-0 w-[300px] xs:w-[320px] sm:w-full flex justify-center">
              <ProductCard product={product} variant="original" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[#B89AA2] text-base border border-dashed border-white/5 rounded-3xl max-w-[1180px] mx-auto">
          No listings found in this category yet.
        </div>
      )}
    </div>
  );
}

export default LandingPageProductCard;