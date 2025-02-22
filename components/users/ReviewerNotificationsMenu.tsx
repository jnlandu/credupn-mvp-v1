"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Loader2, FileText, Info, ClipboardCheck } from 'lucide-react'
import { cn } from "@/lib/utils"
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


interface ReviewerNotification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
  user_id: string
  publication_id?: string
  reference_code?: string
  publications?: {
    title: string
    status: string
  }
}


export function ReviewerNotificationsMenu() {
  const [notifications, setNotifications] = useState<ReviewerNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const fetchNotifications = async () => {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user){
        router.push('/unauthorized')
      }
  
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          publications(
            title,
            status
          )
        `)
        .eq('user_id', user?.id)
        .eq('to', 'reviewer')
        .order('created_at', { ascending: false })
  
        if (error) {
          console.error('Notifications error:', {
            code: error.code,
            message: error.message,
            details: error.details
          });
          throw error;
        }
  
      // console.log('Fetched notifications:', data); // Debug log
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
  
 
    } catch (error: any) {
      console.error('Error fetching notifications:', {
        name: error.name,
        message: error.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error.stack
      });
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les notifications"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  
    // Create async function for subscription setup
    
      const supabase = createClient();
        const channel = supabase
          .channel('reviewer-notifications')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              // filter: `user_id=eq.${user.id}::uuid AND to=eq.reviewer`
            },
            () => {
              // console.log('Notification change:', payload);
              fetchNotifications();
            }
          )
          .subscribe();
  
        return () => {
          supabase.removeChannel(channel);
        };

  }, []);

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REVIEW_REQUEST':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'REVIEW_COMPLETED':
        return <ClipboardCheck className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="max-h-[80vh] overflow-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune notification
            </p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg transition-colors cursor-pointer border",
                  notification.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {notification.publications && (
                      <p className="text-sm text-gray-600">
                        Publication: <span className="font-medium">{notification.publications.title}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}