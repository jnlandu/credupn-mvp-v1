"use client"

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, AlertCircle, Smartphone } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'

interface PaymentDetails {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  customer_email?: string
  customer_name?: string
  payment_method?: string
  publication: {
    title: string
  }
  check?: boolean
}

interface PageProps {
  params: Promise<{ id: string }>
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Carte bancaire',
    icon: CreditCard,
    description: 'Visa, Mastercard',
    color: 'bg-blue-50'
  },
  {
    id: 'mobile',
    name: 'Paiement Mobile',
    icon: Smartphone,
    description: 'M-Pesa, Orange Money, Airtel Money',
    color: 'bg-orange-50'
  }
]

export default function PaymentPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const publicationId = searchParams.get('pub')
  const paymentId = searchParams.get('pay')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>('card')
  const [isModalProcessing, setIsModalProcessing] = useState(false)
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const [formData, setFormData] = useState({
    orderNumber: '',
    phone: ''
  })

  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes countdown
  const isValidPhone = (phone: string) => {
    return /^243[0-9]{9}$/.test(phone)
  }

  const { id } = use(params)
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

  const extractReferenceNumber = (orderNumber: string) => {
    const phoneStartIndex = orderNumber.indexOf('243')
    
    if (phoneStartIndex === -1) {
      return {
        reference: orderNumber,
        phoneNumber: ''
      }
    }

    const reference = orderNumber.substring(0, phoneStartIndex)
    const phoneNumber = orderNumber.substring(phoneStartIndex)
  
    return {
      reference,
      phoneNumber
    }
  }

  const handleMethodClick = (method: string) => {
    setSelectedMethod(method)
    if (method === 'mobile') {
      setShowPhoneDialog(true)
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

  const notifyAdmin = async (publicationId: string, paymentId: string, reference: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'PAYMENT_COMPLETED',
        publicationId,
        paymentId,
        reference
      })
    })
  
    if (!response.ok) {
      throw new Error('Failed to send notification')
    }
  
    return response.json()
  }
  
  const notifyAuthor = async (publicationId: string, paymentId: string, reference: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'

    const response = await fetch(`${baseUrl}/api/author/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'PAYMENT_COMPLETED',
        publicationId,
        paymentId,
        reference
      })
    })
  
    if (!response.ok) {
      throw new Error('Failed to send notification')
    }
  
    return response.json()
  }
  
  const handleConfirmation = async () => {
    if (!isValidPhone(formData.phone)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Numéro de téléphone invalide"
      })
      return
    }

    setIsModalProcessing(true)
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
        
      if (userError) throw userError
  
      const data = {
        Numero: formData.phone,
        Montant:  1000,
        currency: 'CDF',
        description: 'Paiement de publication',
      }
      const gateway = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/payment`
      const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FLEXPAIE_TOKEN}`
      }  
      const response = await axios.post(gateway, data, { headers, timeout: 60000 })
      const responseData = response.data
      const orderNumber = responseData.orderNumber
  
      if (!orderNumber) {
        throw new Error('Payment processing failed')
      }

      const { reference, phoneNumber } = extractReferenceNumber(orderNumber)
      await supabase
        .from('payments')
        .update({ 
          status: 'pending',
          user_id: user?.id,
          amount: 500,
          payment_method: selectedMethod,
          publication_id: publicationId,
          details:  data.description,
          created_at: new Date().toISOString(),
          customer_name: user?.user_metadata.full_name,
          customer_email: user?.email,
          order_number: phoneNumber,
          reference_number: reference
        })
        .eq('id', paymentId)

      setShowPhoneDialog(false)
      await checkPaymentStatus(reference, phoneNumber, orderNumber)

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le paiement a échoué"
      })
    } finally {
      setIsModalProcessing(false)
    }
  }

  const checkPaymentStatus = async (reference: string, phoneNumber: string, orderNumber: string) => {
    const maxAttempts = 20;
    let attempts = 0;
    
    setIsModalProcessing(true);
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    const pollStatus = async () => {
      if (attempts >= maxAttempts || timeLeft <= 0) {
        clearInterval(timer);
        setIsModalProcessing(false);
        setTimeLeft(120); // Reset timer
        toast({
          variant: "destructive",
          title: "Délai dépassé",
          description: "La confirmation du paiement a pris trop de temps"
        });
        return;
      }
  
      try {
        const gateway = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/check-payment/${orderNumber}`;
        const response = await axios.get(gateway);
        const { verification, message } = response.data;
  
        switch (verification) {
          case '0':
            clearInterval(timer);
            await updatePaymentStatus(reference, phoneNumber, true);
            setIsModalProcessing(false);
            setTimeLeft(120);
            toast({
              title: "Succès",
              description: "Paiement confirmé!"
            });
            router.push(`/dashboard/author/${id}/publications`);
            break;
  
          case '1':
            clearInterval(timer);
            await updatePaymentStatus(reference, phoneNumber, false);
            setIsModalProcessing(false);
            setTimeLeft(120);
            toast({
              variant: "destructive",
              title: "Échec",
              description: message || "Le paiement a échoué"
            });
            break;
  
          case '2':
            attempts++;
            setTimeout(pollStatus, 6000);
            break;
  
          default:
            clearInterval(timer);
            setIsModalProcessing(false);
            setTimeLeft(120);
            throw new Error('Invalid verification status');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(pollStatus, 6000);
        } else {
          clearInterval(timer);
          setIsModalProcessing(false);
          setTimeLeft(120);
        }
      }
    };
  
    await pollStatus();
  };

  const updatePaymentStatus = async (reference: string, phoneNumber: string, isSuccessful: boolean) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('payments')
      .update({ 
        check: isSuccessful,
        status: isSuccessful ? 'completed' : 'failed'
      })
      .eq('reference_number', reference)
      .eq('order_number', phoneNumber)

    if (error) throw error

    if (isSuccessful) {
      await notifyAdmin(publicationId!, paymentId!, reference)
      await notifyAuthor(publicationId!, paymentId!, reference)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 sm:py-12">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 border-b pb-6">
          <CardTitle className="text-2xl font-bold">Détails du Paiement</CardTitle>
          <CardDescription>
            Veuillez vérifier les détails avant de procéder au paiement
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-gray-500">
                Chargement des détails du paiement...
              </p>
            </div>
          ) : paymentDetails ? (
            <div className="space-y-8">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Publication</h3>
                <p className="text-lg font-medium text-gray-900">{paymentDetails.publication?.title}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Montant</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {paymentDetails.amount} FC
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                  <Badge className={getStatusBadge(paymentDetails.status)}>
                    {paymentDetails.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Separator className="my-8" />
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-500">
                  Choisissez votre méthode de paiement
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className={`h-auto p-6 flex flex-col items-center justify-center space-y-3 transition-all ${
                        selectedMethod === method.id 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : `${method.color} hover:bg-primary/5`
                      }`}
                      onClick={() => handleMethodClick(method.id)}
                    >
                      <method.icon className={`h-8 w-8 ${
                        selectedMethod === method.id ? 'text-primary' : 'text-gray-600'
                      }`} />
                      <div className="text-center">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Alert className="mt-8 bg-blue-50 border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800">Important</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Le paiement validera votre soumission et démarrera le processus d'évaluation.
                </AlertDescription>
              </Alert>
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
      <Dialog open={showPhoneDialog} onOpenChange={(open) => !isModalProcessing && setShowPhoneDialog(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Entrez votre numéro de téléphone</DialogTitle>
            <DialogDescription>
              Ce numéro sera utilisé pour le paiement mobile
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="243XXXXXXXXX"
                value={formData.phone}
                onChange={(e: any) => {
                  const input = e.target.value
                  const cleaned = input.replace(/\D/g, '')
                  if (cleaned.length <= 12 && (cleaned.startsWith('243') || cleaned.length <= 3)) {
                    setFormData(prev => ({
                      ...prev,
                      phone: cleaned
                    }))
                  }
                }}
                className="font-mono tracking-wide"
                disabled={isModalProcessing}
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: 243XXXXXXXXX (12 chiffres)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPhoneDialog(false)}
              disabled={isModalProcessing}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmation}
              disabled={isModalProcessing}
            >
              {isModalProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 {/*  Traitement de paiement */}
      <Dialog 
          open={isModalProcessing} 
          onOpenChange={() => {}}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Traitement du paiement</DialogTitle>
              <DialogDescription>
                Veuillez confirmer le paiement sur votre téléphone. Cette fenêtre se fermera automatiquement une fois le paiement confirmé.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                En attente de confirmation...
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Temps restant: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}