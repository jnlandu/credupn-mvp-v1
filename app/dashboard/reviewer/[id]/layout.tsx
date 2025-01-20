// app/dashboard/reviewer/[id]/layout.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  ClipboardList,
  Clock, 
  CheckCircle2,
  XCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layout,
  History,
  TrendingUp
} from "lucide-react"

export default function ReviewerLayout({
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
            <Link href="/reviewer">Espace Évaluateur</Link>
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
            href="/reviewer"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Layout className="h-5 w-5" />
            {isSidebarOpen && <span>Tableau de bord</span>}
          </Link>

          <Link
            href="/reviewer/pending"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Clock className="h-5 w-5" />
            {isSidebarOpen && <span>À évaluer</span>}
          </Link>

          <Link
            href="/reviewer/completed"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <CheckCircle2 className="h-5 w-5" />
            {isSidebarOpen && <span>Évaluations complétées</span>}
          </Link>

          <Link
            href="/reviewer/history"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <History className="h-5 w-5" />
            {isSidebarOpen && <span>Historique</span>}
          </Link>

          <Link
            href="/reviewer/statistics"
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            {isSidebarOpen && <span>Statistiques</span>}
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="absolute bottom-6 w-full left-0 px-6">
          <Link
            href="/reviewer/settings"
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