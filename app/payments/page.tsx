"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { 
  CreditCard, 
  Phone,
  ChevronRight,
  LockClosedIcon,
  ShieldCheck, 
  Lock
} from 'lucide-react'

type PaymentMethod = 'card' | 'mpesa' | 'orange' | 'airtel'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, etc.',
      logoPath: '/images/payments/cards.png'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: Phone,
      description: 'Paiement mobile Vodacom',
      logoPath: '/images/payments/mpesa.png'
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: Phone,
      description: 'Paiement mobile Orange',
      logoPath: '/images/payments/orange.png'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: Phone,
      description: 'Paiement mobile Airtel',
      logoPath: '/images/payments/airtel.png'
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card className="border-2">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Paiement de la soumission</CardTitle>
          <p className="text-gray-500">Choisissez votre méthode de paiement préférée</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Amount Section */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-600">Montant à payer</h3>
              <p className="text-3xl font-bold text-gray-600">50 USD</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Paiement sécurisé
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
              className="grid gap-4"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id}
                    className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12">
                        <Image
                          src={method.logoPath}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Details Form */}
          <div className="space-y-4">
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {(paymentMethod === 'mpesa' || paymentMethod === 'orange' || paymentMethod === 'airtel') && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input 
                    id="phone" 
                    placeholder={`+243 ${
                      paymentMethod === 'mpesa' ? '81' : 
                      paymentMethod === 'orange' ? '89' : 
                      '99'} XXXXXXX`}
                  />
                </div>
              </div>
            )}
          </div>

          <Button className="w-full" size="lg">
            <Lock className="h-4 w-4 mr-2" />
            Payer maintenant
          </Button>

          <p className="text-center text-sm text-gray-500">
            Vos informations de paiement sont sécurisées et cryptées
          </p>
        </CardContent>
      </Card>
    </div>
  )
}