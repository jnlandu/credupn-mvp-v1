// app/payment/page.tsx
"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function PaymentContent() {
  const searchParams = useSearchParams()
  const publicationId = searchParams.get('pub')
  const paymentId = searchParams.get('pay')
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!publicationId || !paymentId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Informations de paiement manquantes"
        })
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          publication:publications(title)
        `)
        .eq('id', paymentId)
        .single()

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du paiement"
        })
        return
      }

      setPaymentDetails(data)
      setIsLoading(false)
    }

    fetchPaymentDetails()
  }, [publicationId, paymentId])

  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Détails du Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Chargement...</div>
          ) : paymentDetails ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Publication</h3>
                <p>{paymentDetails.publication?.title}</p>
              </div>
              <div>
                <h3 className="font-semibold">Montant</h3>
                <p>{paymentDetails.amount} USD</p>
              </div>
              <div>
                <h3 className="font-semibold">Statut</h3>
                <p>{paymentDetails.status}</p>
              </div>
              <Button onClick={() => {/* Add payment processing logic */}}>
                Procéder au paiement
              </Button>
            </div>
          ) : (
            <div>Paiement non trouvé</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default function PaymentPage() {

  return (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Chargement...</p>
      </div>
    </div>
  }>
    <PaymentContent/>
  </Suspense>
)
}
