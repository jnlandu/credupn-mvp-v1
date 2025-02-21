// app/error.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Home, LogIn, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oups !
        </h1>

        <div className="space-y-3 mb-8">
          <p className="text-xl text-gray-700">
            Une erreur est survenue
          </p>
          <p className="text-gray-500">
            Nous sommes désolés pour la gêne occasionnée. 
            Veuillez vous connecter ou retourner à l'accueil.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Button>

          <Button
            onClick={() => router.push('/auth/login')}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Besoin d'aide ? {' '}
          <a 
            href="mailto:support@cridupn.com" 
            className="text-gray-500 hover:underline"
          >
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  )
}