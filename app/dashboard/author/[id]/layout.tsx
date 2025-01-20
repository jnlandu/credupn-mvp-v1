// app/dashboard/author/[id]/layout.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  ChevronLeft, 
  ChevronRight,
  Layout,
  Clock,
  CheckCircle2,
  PlusCircle
} from "lucide-react"

export default function AuthorLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white p-6 space-y-6 transition-all duration-300 relative`}>
        <div className="mb-8 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            <Link href="/author">Espace Auteur</Link>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link
            href="/author"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Layout className="h-5 w-5" />
            {isSidebarOpen && <span>Tableau de bord</span>}
          </Link>

          <Link
            href="/author/submissions"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            {isSidebarOpen && <span>Nouvelle soumission</span>}
          </Link>

          <Link
            href="/author/pending"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Clock className="h-5 w-5" />
            {isSidebarOpen && <span>En attente</span>}
          </Link>

          <Link
            href="/author/published"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <CheckCircle2 className="h-5 w-5" />
            {isSidebarOpen && <span>Publications</span>}
          </Link>

          <Link
            href="/author/statistics"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            {isSidebarOpen && <span>Statistiques</span>}
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="absolute bottom-6 w-full left-0 px-6">
          <Link
            href="/author/settings"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}