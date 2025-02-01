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
  UserCheck
} from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { NotificationsMenu } from '@/components/notifications'
import { AuthorNotificationsMenu } from '@/components/users/AuthorNotificationsMenu'
// import { Notification } from '@/data/publications'


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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()  

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
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white p-6 space-y-6 transition-all duration-300 relative`}>
        <div className="mb-8 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            
            <Link href="#">Espace Auteur</Link>
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
            href={`/dashboard/author/${id}`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Layout className="h-5 w-5" />
            {isSidebarOpen && <span>Tableau de bord</span>}
          </Link>

          <Link
            href={`/dashboard/author/${id}/soumettre`}
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            {isSidebarOpen && <span>Nouvelle soumission</span>}
          </Link>

          <Link
             href={`/dashboard/author/${id}/pending`} 
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Clock className="h-5 w-5" />
            {isSidebarOpen && <span>En attente</span>}
          </Link>

          <Link
            href={`/dashboard/author/${id}/published`} 
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
            href={`/dashboard/author/${id}/settings`} 
            className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
      <div className="border-b px-8 py-4 flex justify-end">
          <AuthorNotificationsMenu/>
          <button 
            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium"
            onClick={() => router.push(`/dashboard/author/${id}/settings`)}
          >
            {user?.name ? getInitials(user.name) : getInitials('Mayala Lemba')}
          </button>

        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}