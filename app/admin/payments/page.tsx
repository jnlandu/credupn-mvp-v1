// app/admin/payments/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  Euro,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddPaymentModal } from '@/components/payments/AddPaymentModal'
import { Payment } from '@/data/publications'


const statusStyles: Record<string, string> = {
    completed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    failed: "bg-red-100 text-red-800 border-red-200"
  }

export default function PaymentsAdmin() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

// Add fetch function
const fetchPayments = async () => {
  const supabase = createClient()
  setIsLoading(true)
  
  try {
    console.log('Fetching payments...')
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        user:user_id (
          name,
          email
        ),
        publication:publication_id (
          title
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      throw error
    }

    console.log('Fetched payments:', data)
    setPayments(data || [])
  } catch (error) {
    console.error('Error fetching payments:', error)
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger les paiements"
    })
  } finally {
    setIsLoading(false)
  }
}

// Add real-time subscription
useEffect(() => {
  const supabase = createClient()
  
  fetchPayments()

  const channel = supabase
    .channel('payments_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'payments'
      },
      () => {
        fetchPayments()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])


const refreshPayments = async () => {
    setIsRefreshing(true)
    await fetchPayments()
    setIsRefreshing(false)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPayments}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Actualisation...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </>
            )}
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          <AddPaymentModal onSuccess={refreshPayments} />
        </div>
      </div>
      <div className="rounded-lg  overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50'>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-slate-400">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.customer_name}</TableCell>
                  <TableCell>{payment.customer_email}</TableCell>
                  <TableCell>€{payment.amount}</TableCell>
                  <TableCell>€{payment.reason}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>
                  <Badge
                        variant="outline"
                        className={statusStyles[payment.status.toLowerCase()]}
                        >
                        {payment.status}
                </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du Paiement</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm">ID Transaction</p>
                  <p>{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Montant</p>
                  <p>€{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Client</p>
                  <p>{selectedPayment.customer_name}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Méthode</p>
                  <p>{selectedPayment.payment_method}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Date</p>
                  <p>{new Date(selectedPayment.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Statut</p>
                  <Badge
                        variant="outline"
                        className={statusStyles[selectedPayment.status.toLowerCase()]}
                        >
                        {selectedPayment.status}
                </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}