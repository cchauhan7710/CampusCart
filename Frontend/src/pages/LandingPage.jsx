import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const LandingPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredCardId, setHoveredCardId] = useState(null)

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const maxScroll = 500
          const progress = Math.min(scrollY / maxScroll, 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cards = [
    { id: 1, image: '/Campus Cart Books.png', emoji: '📚', label: 'Books', bg: 'linear-gradient(135deg, #FF6B6B 0%, #D5354F 100%)', className: 'top-[10%] left-[8%] md:top-[12%] md:left-[14%]', rotate: -6, dirX: 180, dirY: 100 },
    { id: 2, image: '/cmapus cart mac.png', emoji: '💻', label: 'Laptops & Gear', bg: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)', className: 'top-[6%] right-[8%] md:top-[8%] md:right-[15%]', rotate: 12, dirX: -180, dirY: 100 },
    { id: 3, image: '/Campus cart phone.png', emoji: '📱', label: 'Smartphones', bg: 'linear-gradient(135deg, #FF9F43 0%, #FF6B6B 100%)', className: 'top-[42%] right-[2%] md:top-[44%] md:right-[8%]', rotate: -12, dirX: -220, dirY: -10 },
    { id: 4, image: '/labcoat campus cart.png', emoji: '🥼', label: 'Lab Coats', bg: 'linear-gradient(135deg, #A8B2C1 0%, #708090 100%)', className: 'bottom-[8%] right-[8%] md:bottom-[10%] md:right-[16%]', rotate: 6, dirX: -180, dirY: -120 },
    { id: 5, image: '/hoddie campus cart.png', emoji: '🧥', label: 'Clothes', bg: 'linear-gradient(135deg, #D5354F 0%, #801B2A 100%)', className: 'bottom-[6%] left-[8%] md:bottom-[8%] md:left-[16%]', rotate: -8, dirX: 180, dirY: -120 },
    { id: 6, image: '/notes campus cart.png', emoji: '📝', label: 'Class Notes', bg: 'linear-gradient(135deg, #48DBFB 0%, #1DD1A1 100%)', className: 'top-[42%] left-[2%] md:top-[44%] md:left-[8%]', rotate: 8, dirX: 220, dirY: -10 },
    { id: 7, image: '/tools campus cart.png', emoji: '📐', label: 'Drafter Kits', bg: 'linear-gradient(135deg, #54A0FF 0%, #5F27CD 100%)', className: 'top-[3%] left-[45%] hidden md:flex', rotate: 15, dirX: 0, dirY: 150 },
    { id: 8, image: '/calc camous cart.png', emoji: '🧮', label: 'Sci-Calculators', bg: 'linear-gradient(135deg, #00D2D3 0%, #01A3A4 100%)', className: 'bottom-[3%] left-[45%] hidden md:flex', rotate: -10, dirX: 0, dirY: -150 }
  ];

  return (
    <div className='min-h-[70vh] sm:min-h-[calc(100vh-72px)] text-white bg-black relative flex flex-col items-center justify-center overflow-hidden px-6 py-12 sm:py-20 select-none'>
      <style>{`
        .premium-transition {
          transition: transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.18s ease-out;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Background glow effects */}
      <div className='absolute w-[600px] h-[600px] bg-[#D5354F]/5 rounded-full blur-[130px] pointer-events-none' />

      {/* Orbiting Cards (Desktop scattered layout) */}
      <div className='absolute inset-0 w-full h-full pointer-events-none hidden sm:block'>
        {cards.map((card) => {
          const isHovered = hoveredCardId === card.id
          const hoverScale = isHovered ? 1.15 : 1
          const hoverTranslateY = isHovered ? -12 : 0

          const tx = card.dirX * scrollProgress
          const ty = card.dirY * scrollProgress + hoverTranslateY
          const opacity = 1 - scrollProgress * 0.85
          const scale = (1 - scrollProgress * 0.15) * hoverScale
          const currentRotate = card.rotate + (0 - card.rotate) * scrollProgress

          const isImageCard = !!card.image

          return (
            <div 
              key={card.id} 
              className={`absolute flex flex-col items-center gap-2.5 pointer-events-auto premium-transition cursor-pointer ${card.className} ${isHovered ? 'brightness-110 z-30' : 'brightness-100 z-20'}`}
              style={{
                transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${currentRotate}deg) scale(${scale})`,
                opacity
              }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div 
                className={`w-20 h-16 md:w-28 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl premium-transition ${
                  isImageCard 
                    ? 'border-none bg-transparent' 
                    : `border shadow-xl ${
                        isHovered 
                          ? 'border-[#D5354F]/50 shadow-[#D5354F]/20' 
                          : 'border-white/10 shadow-black/50'
                      }`
                }`}
                style={{ 
                  background: isImageCard ? 'none' : card.bg 
                }}
              >
                {isImageCard ? (
                  <>
                    {/* Subtle theme-colored ambient glow behind the card */}
                    <div 
                      className={`absolute inset-4 rounded-2xl blur-2xl transition-all duration-500 pointer-events-none ${
                        isHovered ? 'opacity-50 scale-110' : 'opacity-25 scale-100'
                      }`}
                      style={{ background: card.bg }}
                    />
                    <img 
                      src={card.image} 
                      alt={card.label} 
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-contain select-none pointer-events-none transition-all duration-300 relative z-10 ${
                        isHovered ? 'scale-110 drop-shadow-[0_12px_20px_rgba(0,0,0,0.55)]' : 'scale-100 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]'
                      }`} 
                    />
                  </>
                ) : (
                  card.emoji
                )}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold tracking-wider uppercase premium-transition ${isHovered ? 'text-[#D5354F]' : 'text-[#B89AA2]'}`}>{card.label}</span>
            </div>
          )
        })}
      </div>

      {/* Center content */}
      <div className='relative z-10 max-w-2xl text-center flex flex-col items-center'>
        <h1 className='text-4xl md:text-6xl lg:text-[68px] font-black leading-[1.1] tracking-tighter text-white'>
          Get exclusive access
          <br />
          to our <span className='text-[#D5354F]'>marketplace</span>
        </h1>

        <p className='text-sm md:text-lg text-[#B89AA2] mt-6 max-w-md font-light leading-relaxed'>
          Unlimited tools to list, search, and trade campus essentials with peer students securely.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full sm:w-auto px-4 sm:px-0 justify-center'>
          <Link 
            to='/marketplace' 
            className='bg-[#D5354F] hover:bg-[#ff4569] text-white text-[15px] font-medium px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#D5354F]/20 hover:shadow-[#ff4569]/30 active:scale-95 text-center'
          >
            Explore Marketplace
            <ArrowRight size={16} />
          </Link>
          <Link 
            to='/addproduct' 
            className='border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[15px] font-medium px-6 py-3.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 text-center'
          >
            Sell an Item
          </Link>
        </div>
      </div>

    </div>
  )
}

export default LandingPage
