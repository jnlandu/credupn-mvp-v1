// components/notifications.tsx
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from 'lucide-react'
import { cn } from "@/lib/utils"

const notifications: Notification[] = [
  {
    id: '1',
    type: 'submission',
    message: 'Nouvelle soumission par Dr. Marie Kabongo',
    date: '2024-03-15',
    read: false
  },
  {
    id: '2',
    type: 'review',
    message: 'Évaluation terminée pour "L\'impact des Technologies"',
    date: '2024-03-14',
    read: false
  },
{
    id: '3',
    type: 'message',
    message: 'Nouveau message de l\'administration',
    date: '2024-03-13',
    read: true
},
{
    id: '4',
    type: 'alert',
    message: 'Mise à jour du système prévue pour le 20 mars',
    date: '2024-03-12',
    read: false
}
]

export function NotificationsMenu() {
    const [unreadCount, setUnreadCount] = useState(
      notifications.filter(n => !n.read).length
    )
  
    const markAsRead = (id: string) => {
      // Update notification read status
      setUnreadCount(prev => Math.max(0, prev - 1))
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
        <DropdownMenuContent align="end" className="w-80">
          <div className="max-h-96 overflow-auto p-4 space-y-4">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  "p-3 rounded-lg transition-colors",
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.date}
                </p>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }