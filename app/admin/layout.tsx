// app/admin/layout.tsx
"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Your sidebar code */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white p-6 space-y-6 transition-all duration-300 relative`}>
      <div className="mb-8 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            CRIDUPN Admin
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-6 bg-black text-white rounded-full p-1 hover:bg-gray-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <nav className="space-y-4">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <BookOpen className="h-4 w-4" />
            {isSidebarOpen && 
             <Link  
             href="/admin/publications/" 
             className="ml-2"
             >
              Publications
            </Link>
            }
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <Users className="h-4 w-4" />
            {isSidebarOpen && 
            <Link href="/admin/users" className="ml-2">
              Utilisateurs
            </Link>
            }
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <FileText className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Soumissions</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <TrendingUp className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Statistiques</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <Settings className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Paramètres</span>}
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}