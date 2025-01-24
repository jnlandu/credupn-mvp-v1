// types/payment.ts
interface Payment {
    id: string
    amount: number
    status: 'pending' | 'completed' | 'failed'
    customerName: string
    date: Date
    paymentMethod: string
  }