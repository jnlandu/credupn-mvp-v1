'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function PaymentWaitingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(true)

  const reference = searchParams.get('ref')
  const phoneNumber = searchParams.get('phone')
  const returnUrl = searchParams.get('returnUrl')

  useEffect(() => {
    if (!reference || !phoneNumber) return

    const checkPaymentStatus = async () => {
      const maxAttempts = 20
      let attempts = 0

      const pollStatus = async () => {
        if (attempts >= maxAttempts) {
          setIsChecking(false)
          toast({
            variant: "destructive",
            title: "Délai dépassé",
            description: "La confirmation du paiement a pris trop de temps"
          })
          return
        }

        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('payments')
            .select('status')
            .eq('reference_number', reference)
            .eq('order_number', phoneNumber)
            .single()

          if (error) throw error

          if (data.status === 'completed') {
            setIsChecking(false)
            toast({
              title: "Succès",
              description: "Paiement confirmé!"
            })
            if (returnUrl) {
              router.push(returnUrl)
            }
            return
          } else if (data.status === 'failed') {
            setIsChecking(false)
            toast({
              variant: "destructive", 
              title: "Échec",
              description: "Le paiement a échoué"
            })
            return
          }

          // Still pending, continue polling
          attempts++
          setTimeout(pollStatus, 6000)
        } catch (error) {
          console.error('Error checking payment:', error)
          attempts++
          setTimeout(pollStatus, 6000)
        }
      }

      await pollStatus()
    }

    checkPaymentStatus()
  }, [reference, phoneNumber, returnUrl])

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">
              En attente de confirmation...
            </h2>
            <p className="text-gray-500">
              Veuillez confirmer le paiement sur votre téléphone
            </p>
            <p className="text-sm text-gray-400">
              Cette page se mettra à jour automatiquement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}