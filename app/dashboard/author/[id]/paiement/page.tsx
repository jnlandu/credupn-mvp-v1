// app/payment/page.tsx
"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PaymentDetails {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  publication: {
    title: string
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const publicationId = searchParams.get('pub')
  const paymentId = searchParams.get('pay')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPaymentDetails()
  }, [publicationId, paymentId])

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

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // Add payment processing logic here
      toast({
        title: "Paiement en cours",
        description: "Veuillez patienter pendant le traitement de votre paiement..."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le paiement a échoué. Veuillez réessayer."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    }
    return statusStyles[status as keyof typeof statusStyles]
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Détails du Paiement</CardTitle>
          <CardDescription>
            Veuillez vérifier les détails avant de procéder au paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-500">
                Chargement des détails du paiement...
              </p>
            </div>
          ) : paymentDetails ? (
            <div className="space-y-6">
              <div className="rounded-lg  p-4">
                <h3 className="font-medium text-gray-900">Publication</h3>
                <p className="mt-1 text-gray-700">{paymentDetails.publication?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg  p-4">
                  <h3 className="font-medium text-gray-900">Montant</h3>
                  <p className="mt-1 text-2xl font-semibold text-primary">
                    {paymentDetails.amount} USD
                  </p>
                </div>

                <div className="rounded-lg  p-4">
                  <h3 className="font-medium text-gray-900">Statut</h3>
                  <Badge className={getStatusBadge(paymentDetails.status)}>
                    {paymentDetails.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Méthode de paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 space-y-2"
                    onClick={() => handlePayment()}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Carte bancaire</span>
                  </Button>
                  {/* Add more payment methods as needed */}
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Le paiement validera votre soumission et démarrera le processus d'évaluation.
                </AlertDescription>
              </Alert>

              <Button 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  "Procéder au paiement"
                )}
              </Button>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Impossible de trouver les détails du paiement
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}