"use client"

import { usePathname } from 'next/navigation'
import Footer from '@/components/footer'

export default function FooterClient() {
  const pathname = usePathname()
// Hide footer on contact page too
    if (pathname === '/contact') {
        return null
    }
    
  // Hide footer on login page
  if (pathname === '/auth/login') {
    return null
  }

  return <Footer />
}