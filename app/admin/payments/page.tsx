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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Payment } from '@/data/publications'



interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  customer_name: string;
  customer_email: string;
  payment_method: string;
  order_number: string;
  reference_number: string; 
  details?: string;
  created_at: string;

}
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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null);

  // Add pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const filteredPayments = payments.filter(payment => 
    payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
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

  const saveEdit = async (id: string, field: string, value: any) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('payments')
        .update({ [field]: value })
        .eq('id', id);
  
      if (error) throw error;
  
      // Update local state
      setPayments(payments.map(payment => 
        payment.id === id ? { ...payment, [field]: value } : payment
      ));
  
      toast({
        title: "Succès",
        description: "Modification enregistrée"
      });
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la modification"
      });
    } finally {
      setEditingCell(null);
    }
  };

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
            ) : currentPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : (
              currentPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell 
                      onDoubleClick={() => setEditingCell({
                        id: payment.id,
                        field: 'customer_name',
                        value: payment.customer_name
                      })}
                    >
                      {editingCell?.id === payment.id && editingCell.field === 'customer_name' ? (
                        <Input
                          autoFocus
                          value={editingCell.value}
                          onChange={(e) => setEditingCell({
                            ...editingCell,
                            value: e.target.value
                          })}
                          onBlur={() => saveEdit(payment.id, 'customer_name', editingCell.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(payment.id, 'customer_name', editingCell.value)
                            } else if (e.key === 'Escape') {
                              setEditingCell(null)
                            }
                          }}
                          className="min-w-[200px]"
                          placeholder="Nom du client"
                        />
                      ) : (
                        payment.customer_name || 'Non renseigné'
                      )}
                    </TableCell>
                  <TableCell>{payment.customer_email}</TableCell>
                  <TableCell 
                        onDoubleClick={() => setEditingCell({
                          id: payment.id,
                          field: 'amount',
                          value: payment.amount
                        })}
                      >
                        {editingCell?.id === payment.id && editingCell.field === 'amount' ? (
                          <Input
                            autoFocus
                            type="number"
                            value={editingCell.value}
                            onChange={(e) => setEditingCell({
                              ...editingCell,
                              value: e.target.value
                            })}
                            onBlur={() => saveEdit(payment.id, 'amount', editingCell.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit(payment.id, 'amount', editingCell.value)
                              } else if (e.key === 'Escape') {
                                setEditingCell(null)
                              }
                            }}
                          />
                        ) : (
                          payment.amount
                        )}
                      </TableCell>
                  <TableCell>{payment.details}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                  <TableCell
                      onDoubleClick={() => setEditingCell({
                        id: payment.id,
                        field: 'payment_method',
                        value: payment.payment_method
                      })}
                    >
                      {editingCell?.id === payment.id && editingCell.field === 'payment_method' ? (
                        <Input
                          autoFocus
                          value={editingCell.value}
                          onChange={(e) => setEditingCell({
                            ...editingCell,
                            value: e.target.value
                          })}
                          onBlur={() => saveEdit(payment.id, 'payment_method', editingCell.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(payment.id, 'payment_method', editingCell.value)
                            } else if (e.key === 'Escape') {
                              setEditingCell(null)
                            }
                          }}
                          className="min-w-[200px]"
                          placeholder="Méthode de paiement"
                        />
                      ) : (
                        payment.payment_method || 'Non renseigné'
                      )}
                    </TableCell>
                  <TableCell
                      onDoubleClick={() => setEditingCell({
                        id: payment.id,
                        field: 'status',
                        value: payment.status
                      })}
                    >
                      {editingCell?.id === payment.id && editingCell.field === 'status' ? (
                        <Select
                          value={editingCell.value}
                          onValueChange={(value) => {
                            saveEdit(payment.id, 'status', value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue>{editingCell.value}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="completed">Complété</SelectItem>
                            <SelectItem value="failed">Échoué</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge>{payment.status}</Badge>
                      )}
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
      {/*  Payment pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            className="border rounded p-1"
            value={itemsPerPage}
            onChange={(e: any) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
          </select>
          <span className="text-sm text-gray-600">
            Affichage {filteredPayments.length === 0 ? 0 : indexOfFirstItem + 1} à{' '}
            {Math.min(indexOfLastItem, filteredPayments.length)} sur {filteredPayments.length}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>
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