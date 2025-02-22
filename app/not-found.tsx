'use client'
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="max-w-md text-center px-8">
        {/* Animated SVG or Image */}
        <div className="mb-8 animate-bounce">
          <span className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
            404
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Page introuvable
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Désolé, nous ne trouvons pas la page que vous recherchez. Elle a peut-être été déplacée ou supprimée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            className="gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Accueil
            </Link>
          </Button>

          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Optional: Suggested Links */}
      </div>
    </div>
  )
}