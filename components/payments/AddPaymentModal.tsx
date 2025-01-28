// components/payments/AddPaymentModal.tsx
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Payment } from '@/data/publications'

export function AddPaymentModal({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Payment>({
    id: 0,
    user_id: '',
    publication_id: '',
    amount: 0,
    payment_method: '',
    status: 'Pending',
    created_at: '',
    details: '',
    customer_email: '',
    customer_name: '',
    reason: ''
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          user_id: formData.user_id,
          publication_id: formData.publication_id,
          amount: formData.amount,
          payment_method: formData.payment_method,
          status: formData.status,
          details: formData.details,
          customer_email: formData.customer_email,
          customer_name: formData.customer_name,
          reason: formData.reason,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Succès",
        description: "Paiement ajouté avec succès"
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error adding payment:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le paiement"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Paiement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col px-10">
        <DialogHeader>
          <DialogTitle>Ajouter un Paiement</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4">
        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          <div className="space-y-2">
            <Label>Nom du Client</Label>
            <Input
              required
              value={formData.customer_name}
              onChange={(e: any) => setFormData({ ...formData, customer_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email du Client</Label>
            <Input
              type="email"
              required
              value={formData.customer_email}
              onChange={(e: any) => setFormData({ ...formData, customer_email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Montant (Fc)</Label>
            <Input
              type="number"
              required
              min="0"
              step="1000"
              value={formData.amount || 0}
              onChange={(e: any) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Motif du Paiement</Label>
            <Input
              required
              value={formData.reason}
              onChange={(e: any) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ex: Frais d'inscription, Publication..."
            />
          </div>

          <div className="space-y-2">
            <Label>Détails Supplémentaires</Label>
            <Input
              value={formData.details || ''}
              onChange={(e: any) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Détails optionnels..."
            />
          </div>

          <div className="space-y-2">
            <Label>Méthode de Paiement</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte Bancaire</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Pending' | 'Completed' | 'Failed') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">En attente</SelectItem>
                <SelectItem value="Completed">Complété</SelectItem>
                <SelectItem value="Failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        </div>
        <div className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant="outline">Annuler</Button>
            </DialogTrigger>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter'
              )}
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}