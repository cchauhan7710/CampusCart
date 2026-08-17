import React, { useState } from 'react'
import LandingPage from './LandingPage';
import LandingPageProductCard from './LandingPageProductCard';
import Category from '../components/Category'
import AboutSection from '../components/AboutSection'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <LandingPage />
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className="bg-[#050505] pb-16">
        <div className="text-center pt-16 pb-8">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {selectedCategory ? `${selectedCategory} Listings` : 'Recent Listings'}
          </h2>
          <p className="text-sm text-[#B89AA2] mt-3">
            {selectedCategory 
              ? `Showing all items currently listed under ${selectedCategory}` 
              : 'Browse active items listed by students on campus'}
          </p>
        </div>
        <LandingPageProductCard selectedCategory={selectedCategory} limit={4} />
      </div>
      
      {/* About CampusCart & Features Section */}
      <AboutSection />
    </>
  )
}

export default Home
