// app/auth/confirm/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { createClient } from '@/utils/supabase/client'

export default function ConfirmPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!tokenHash || !type) {
          throw new Error('Invalid verification link')
        }

        const supabase = createClient()
        
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email'
        })

        if (error) throw error

        // Wait briefly before redirecting
        setTimeout(() => {
          router.push('/auth/login?verified=true')
        }, 3000)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Vérification de l'email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-4 animate-spin text-primary" />
              <p>Vérification de votre email...</p>
            </>
          ) : error ? (
            <>
              <XCircle className="h-8 w-8 text-destructive" />
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/signup')}
              >
                Retour à l'inscription
              </Button>
            </>
          ) : (
            <>
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-green-600">Email vérifié avec succès!</p>
              <p className="text-sm text-muted-foreground">
                Redirection vers la page de connexion...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}