"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Book, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileText, BookOpen, ScrollText } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/about' },
    { name: 'Publications', href: '/publications' },
    { name: 'Actualités', href: '/actualites' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
  // Update the header component with sticky positioning
  <header className="sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* <Link href="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-black" />
              <span className="text-xl font-bold text-black">CRIDUPN</span>
            </Link> */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/logo/upn-logo.jpeg"  // Make sure to add logo to public/images/
                  alt="UPN Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <Book className="h-8 w-8 text-black" />
              <span className="text-xl font-bold text-black">CRIDUPN</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild variant="outline" className="bg-black">
              <Link href="/auth/login">Connexion</Link>
            </Button>
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/auth/login">Connexion</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
    
  )
}