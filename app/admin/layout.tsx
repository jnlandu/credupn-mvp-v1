// app/admin/layout.tsx
"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { EuroIcon } from "lucide-react"


export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Your sidebar code */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white p-6 space-y-6 transition-all duration-300 flex flex-col relative`}>
        <div className="mb-8 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
              <Link href="/admin">Tableau de bord</Link>
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
        
          <nav className="space-y-2 flex-1">
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
              {isSidebarOpen &&
              <Link  
              href="/admin/submissions/" 
              className="ml-2"
              >
              Soumissions
            </Link>
              }
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
            >
              <TrendingUp className="h-4 w-4" />
              {isSidebarOpen && 
              <Link  
              href="/admin/statistics/" 
              className="ml-2"
              >
              Statistiques
            </Link>
              }
            </Button>

            <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
                >
                  <EuroIcon className="h-4 w-4" />
                  {isSidebarOpen && 
                    <Link  
                      href="/admin/payments/" 
                      className="ml-2"
                    >
                      Paiements
                    </Link>
                  }
                </Button>                 
          </nav>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <Settings className="h-4 w-4" />
            {isSidebarOpen && 
            <Link  
            href="/admin/settings/" 
            className="ml-2"
            >
            Paramètres
           </Link>
            }
          </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  )
}