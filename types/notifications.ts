// types/notification.ts
interface Notification {
    id: string
    type: 'submission' | 'review' | 'system'
    message: string
    date: string
    read: boolean
  }