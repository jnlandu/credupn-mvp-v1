// app/auth/verify-email/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from '@/lib/supabase'
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react"

function VerifyEmailPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') // Get email from URL params
  const { toast } = useToast()
  const router = useRouter()

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Adresse email manquante"
      })
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email de vérification"
      })
    } else {
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception"
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Mail className="h-6 w-6" />
            <span>Vérifiez votre email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Un email de vérification a été envoyé à votre adresse.
              Veuillez cliquer sur le lien pour activer votre compte.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleResendEmail}
            >
              Renvoyer l'email de vérification
            </Button>

            <Link href="/auth/login">
              <Button 
                variant="ghost" 
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    }>
      <VerifyEmailPageContent />
    </Suspense>
  )   
}