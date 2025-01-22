"use client"

import { useState} from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Router from 'next/router'
import { 
  CreditCard, 
  Phone,
  ArrowRight,
  Shield,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'card' | 'mpesa' | 'orange' | 'airtel'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const { toast } = useToast()
  const router = useRouter()

  const paymentMethods = [

    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, etc.',
      logoPath: '/images/payments/mastercard.svg'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Vodacom',
      logoPath: '/images/payments/mpesa.png'
    },
    {
      id: 'orange',
      name: 'Orange Money',
      description: 'Orange',
      logoPath: '/images/payments/orange.png'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Airtel',
      logoPath: '/images/payments/airtel.png'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xs mx-auto">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm mt-1">Méthode</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm mt-1">Détails</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm mt-1">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Choisissez votre méthode de paiement</h2>
                  <p className="text-gray-500">Montant à payer: <span className="font-semibold">50 USD</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setPaymentMethod(method.id as PaymentMethod)
                        setStep(2)
                      }}
                      className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="relative h-12 w-full mb-4">
                        <Image
                          src={method.logoPath}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Détails du paiement</h2>
                  <p className="text-gray-600">Via {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input id="cardNumber" placeholder="4242 4242 4242 4242" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiration</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input 
                      id="phone" 
                      className="mt-1"
                      placeholder={`+243 ${
                        paymentMethod === 'mpesa' ? '81' : 
                        paymentMethod === 'orange' ? '89' : 
                        '99'} XXXXXXX`}
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Retour
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="flex justify-center">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Confirmer le paiement</h2>
                  <p className="text-gray-500">
                    Vous allez payer <span className="font-semibold">50 USD</span> via{' '}
                    {paymentMethods.find(m => m.id === paymentMethod)?.name}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Transaction sécurisée et cryptée
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Retour
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={async () => {
                      setIsProcessing(true)
                      try {
                        // Simulate payment processing
                        await new Promise(resolve => setTimeout(resolve, 2000))
                        
                        setIsSuccess(true)
                        toast({
                          title: "Paiement réussi",
                          description: "Votre paiement a été traité avec succès.",
                        })
                      } catch (error) {
                        toast({
                          variant: "destructive",
                          title: "Erreur",
                          description: "Le paiement a échoué. Veuillez réessayer.",
                        })
                      } finally {
                        setIsProcessing(false)
                      }
                    }}
                    disabled={isProcessing || isSuccess}
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    ) : null}
                    {isSuccess ? "Paiement effectué" : "Payer maintenant"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={isProcessing} onOpenChange={setIsProcessing}>
      <DialogHeader>
      <DialogTitle className="text-center">
        Traitement du paiement
      </DialogTitle>
    </DialogHeader>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Traitement du paiement</h3>
          <p className="text-center text-gray-500">
            Veuillez patienter pendant que nous traitons votre paiement...
          </p>
        </div>
      </DialogContent>
    </Dialog>

    </div>
  )
}