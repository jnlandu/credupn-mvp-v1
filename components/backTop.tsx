// components/to-top.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

 const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = document.documentElement.scrollTop
      setShowScrollTop(scrollY > 400)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    // Push to same route with scroll behavior
    router.push(`${pathname}#top`, { scroll: true })
  }

  return (
      <button
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary text-black 
        shadow-lg transition-all duration-300 
        hover:bg-primary/90 hover:scale-110 hover:shadow-xl
        active:scale-95
        ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        onClick={scrollToTop}
        aria-label="Retour en haut"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    )
  }

export default ScrollToTop