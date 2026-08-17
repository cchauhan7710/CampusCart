import React from 'react'
import { BookOpen, FileText, Laptop, Pencil, Shirt, Package } from 'lucide-react'

// Map dbValues to mockups
const categoryMockups = {
  'Book': { image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #FF6B6B 0%, #D5354F 100%)' },
  'Electronics': { image: '/cmapus cart mac.png', bg: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)' },
  'Notes': { image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #48DBFB 0%, #1DD1A1 100%)' },
  'Stationery': { image: '/calc camous cart.png', bg: 'linear-gradient(135deg, #54A0FF 0%, #5F27CD 100%)' },
  'Lab Equipment': { image: '/hoddie campus cart.png', bg: 'linear-gradient(135deg, #FF9F43 0%, #FF6B6B 100%)' },
  'Other': { image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #A8B2C1 0%, #708090 100%)' }
}

const Category = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'book', name: 'Books', dbValue: 'Book', image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #FF6B6B 0%, #D5354F 100%)', color: 'text-[#FF6B6B] bg-[#FF6B6B]/10', hoverShadow: 'hover:shadow-[#FF6B6B]/5' },
    { id: 'electronics', name: 'Laptops & Gear', dbValue: 'Electronics', image: '/cmapus cart mac.png', bg: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)', color: 'text-[#48DBFB] bg-[#48DBFB]/10', hoverShadow: 'hover:shadow-[#48DBFB]/5' },
    { id: 'notes', name: 'Class Notes', dbValue: 'Notes', image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #48DBFB 0%, #1DD1A1 100%)', color: 'text-[#1DD1A1] bg-[#1DD1A1]/10', hoverShadow: 'hover:shadow-[#1DD1A1]/5' },
    { id: 'stationery', name: 'Sci-Calculators', dbValue: 'Stationery', image: '/calc camous cart.png', bg: 'linear-gradient(135deg, #54A0FF 0%, #5F27CD 100%)', color: 'text-[#54A0FF] bg-[#54A0FF]/10', hoverShadow: 'hover:shadow-[#54A0FF]/5' },
    { id: 'lab', name: 'Clothings', dbValue: 'Lab Equipment', image: '/hoddie campus cart.png', bg: 'linear-gradient(135deg, #FF9F43 0%, #FF6B6B 100%)', color: 'text-[#FF9F43] bg-[#FF9F43]/10', hoverShadow: 'hover:shadow-[#FF9F43]/5' },
    { id: 'other', name: 'Other Items', dbValue: 'Other', image: '/Campus Cart Books.png', bg: 'linear-gradient(135deg, #A8B2C1 0%, #708090 100%)', color: 'text-[#A8B2C1] bg-[#A8B2C1]/10', hoverShadow: 'hover:shadow-[#A8B2C1]/5' }
  ]

  return (
    <div className="bg-[#050505] pt-24 pb-12">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Shop by <span className="text-[#D5354F]">Category</span>
        </h2>
        <p className="text-sm md:text-base text-[#B89AA2] mt-4 font-light max-w-md mx-auto">
          Click a category to filter listings. Click it again to show all.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mt-12 max-w-5xl mx-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.dbValue

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isActive ? null : cat.dbValue)}
                className={`group flex flex-col items-center gap-4 p-5 rounded-2xl border transition-all duration-500 cursor-pointer select-none w-full
                  ${isActive 
                    ? 'bg-[#180A0C] border-[#D5354F] shadow-[0_12px_24px_rgba(213,53,79,0.18)] scale-[1.04] -translate-y-1' 
                    : `bg-[#111111]/40 border-white/5 hover:border-white/15 hover:bg-[#151515] hover:-translate-y-1.5 hover:scale-[1.04] ${cat.hoverShadow} hover:shadow-lg`
                  }`}
              >
                <div className={`w-16 h-12 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden relative ${
                  isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'
                }`}
                style={{ 
                  background: cat.image ? 'none' : cat.color,
                }}
                >
                  {cat.image ? (
                    <>
                      {/* Ambient Glow behind category image */}
                      <div 
                        className={`absolute inset-1.5 rounded-lg blur-md transition-all duration-500 opacity-25 pointer-events-none group-hover:opacity-50`}
                        style={{ background: cat.bg }}
                      />
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-contain relative z-10 select-none pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]" 
                      />
                    </>
                  ) : (
                    <span className="text-2xl">{cat.name[0]}</span>
                  )}
                </div>
                <span 
                  className={`text-xs font-semibold tracking-wide transition-colors duration-300 
                    ${isActive ? 'text-[#D5354F]' : 'text-gray-400 group-hover:text-white'}`}
                >
                  {cat.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Category
