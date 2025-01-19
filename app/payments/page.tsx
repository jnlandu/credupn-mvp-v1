// app/payments/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, Wallet } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('card')

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Paiement de la soumission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Montant à payer</h3>
            <p className="text-2xl font-bold">50 USD</p>
          </div>

          <div className="space-y-4">
            <Label>Méthode de paiement</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value: 'card' | 'mpesa') => setPaymentMethod(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Carte bancaire
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem
                  value="mpesa"
                  id="mpesa"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="mpesa"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Wallet className="mb-3 h-6 w-6" />
                  M-Pesa
                </Label>
              </div>
            </RadioGroup>
          </div>

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

          {paymentMethod === 'mpesa' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Numéro M-Pesa</Label>
                <Input id="phone" placeholder="+243..." />
              </div>
            </div>
          )}

          <Button className="w-full" size="lg">
            Payer maintenant
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}