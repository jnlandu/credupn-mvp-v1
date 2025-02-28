// app/dashboard/author/[id]/layout.tsx
"use client"

import { use, useEffect, useState } from 'react'
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
  PlusCircle,
  Bell,
  UserCheck,
  Menu, 
  X,
  User
} from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { AuthorNotificationsMenu } from '@/components/users/AuthorNotificationsMenu'
import { Toaster } from '@/components/ui/toaster'

// Add interfaces
interface User {
  id: string
  name: string
  email: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
  user_id: string
  publication_id?: string
  payment_id?: string,
  reference_code: string
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function AuthorLayout({
  children, params
}: LayoutProps) {
  const { id } = use(params) // Unwrap params using React.use()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  
  const router = useRouter()  

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      }
    }

    fetchNotifications()

    // Subscribe to new notifications
    const supabase = createClient()
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => prev - 1)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', id)
        .single()
  
      if (data) {
        setUser(data)
      }
    }
  
    fetchUser()
  }, [id])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          ${isMobileMenuOpen ? 'top-16 translate-x-0' : 'top-16 -translate-x-full lg:translate-x-0'}
          bg-black text-white p-6 space-y-6 
          transition-all duration-300 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            <Link href={`/dashboard/author/${id}`}>Espace Auteur</Link>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 hidden lg:block"
            aria-label={isSidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-800 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <Link
            href={`/dashboard/author/${id}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Layout className="h-5 w-5" />
            {isSidebarOpen && <span>Tableau de bord</span>}
          </Link>

          <Link
            href={`/dashboard/author/${id}/soumettre`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <PlusCircle className="h-5 w-5" />
            {isSidebarOpen && <span>Nouvelle soumission</span>}
          </Link>
          <Link
            href={`/dashboard/author/${id}/publications`} 
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CheckCircle2 className="h-5 w-5" />
            {isSidebarOpen && <span>Mes publications</span>}
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="pt-6 mt-6 border-t border-gray-800">
          <Link
            href={`/dashboard/author/${id}/settings`} 
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-0 pl-0">
        <div className="border-b px-4 md:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsMobileMenuOpen(true)
                setIsSidebarOpen(true)
              }}
              className="lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-1 hidden lg:block">
            <h1 className="text-xl font-bold tracking-tight">
              Bonjour, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez vos publications et soumissions
            </p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <AuthorNotificationsMenu/>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/author.png" alt="Author" />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : getInitials('Auteur')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/author/${id}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/author/${id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8">
          {/* Show greeting on mobile */}
          <div className="mb-4 lg:hidden">
            <h1 className="text-xl font-bold tracking-tight">
              Bonjour, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez vos publications et soumissions
            </p>
          </div>
          
          {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  )
}