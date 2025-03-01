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
import { useToast } from '@/hooks/use-toast'
import { SignOutButton } from '@/components/SignOutButton'

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
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  
  const router = useRouter()  
  const { toast } = useToast()

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

    const handleSignOut = async () => {
      setIsSigningOut(true)
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) throw error
        router.push('/auth/login')
        toast({
          title: "Déconnexion réussie",
          description: "À bientôt!"
        })
        
      } catch (error) {
        console.error('Error signing out:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de se déconnecter"
        })
      } finally {
        setIsSigningOut(false)
      }
    }

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
          ${isMobileMenuOpen ? 'top-16 translate-x-0' : 'top-16  -translate-x-full lg:translate-x-0 z-auto'}
          bg-black text-white p-6 space-y-6 
          transition-all duration-300 ease-in-out
          overflow-y-auto
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            <Link href={`/dashboard/reviewer/${id}`}>Espace  Auteur</Link>
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
        <nav className="space-y-1">
          <Link
            href={`/dashboard/author/${id}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Layout className="h-5 w-5" />
            {isSidebarOpen && <span>Espace Auteur</span>}
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
        <div className="absolute bottom-6 w-full left-0 px-6">
          <Link
            href={`/dashboard/author/${id}/settings`} 
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-0 pl-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="border-b pb-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    Bienvenue, {user?.name}
                  </h1>
                  <p className="text-sm text-muted-foreground hidden lg:block">
                    Gérer les évaluations, les évaluations complétées et l'historique
                  </p>
                </div>
                {/* Mobile menu trigger */}
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
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <AuthorNotificationsMenu />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/admin.png" alt="Admin" />
                        <AvatarFallback>{user?.name ? getInitials(user.name) : getInitials('Evaluateur')}</AvatarFallback>
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
                      <Link href={`/dashboard/reviewer/${id}/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/reviewer/${id}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 cursor-pointer"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      <SignOutButton 
                        onSignOut={handleSignOut} 
                        isSigningOut={isSigningOut} 
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
}