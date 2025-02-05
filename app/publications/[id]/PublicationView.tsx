// app/publications/[id]/PublicationView.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Eye, X, Lock, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Publication } from '@/lib/publications'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'


interface DatabasePublication {
  id: string
  title: string
  abstract: string
  author: string[] | string
  created_at: string
  category: string
  type: string
  image: string
  pdf_url: string
  preview_url?: string
  is_restricted: boolean
  doi?: string
  isbn?: string
  keywords?: string[]
}

interface PublicationViewProps {
  id: string
}


export default function PublicationView({ id }: PublicationViewProps) {
  const [publication, setPublication] = useState<DatabasePublication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()


  useEffect(() => {
    const fetchPublication = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setPublication(data)
      } catch (error) {
        console.error('Error fetching publication:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la publication"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublication()
  }, [id])
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Publication non trouvée</h1>
          <p className="text-gray-600">Cette publication n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    )
  }

  const pdfToShow = publication.is_restricted ? publication.preview_url : publication.pdf_url


  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/publications" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux publications
        </Link>
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[400px]">
              <Image
                src={publication.image}
                alt={publication.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{publication.title}</h1>
              <p className="text-gray-600 mb-4">
              Par {Array.isArray(publication.author) 
                ? publication.author.join(", ")
                : publication.author}
              </p>
              <p className="text-gray-700 mb-6">
                {publication.abstract}
              </p>
              
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Date:</span> {publication.created_at}
                </div>
                <div>
                  <span className="font-semibold">Catégorie:</span> {publication.category}
                </div>
                <div>
                  <span className="font-semibold">Type:</span> {publication.type}
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Aperçu
                </Button>
                
                {!publication.is_restricted ? (
                  <Button variant="outline" asChild>
                    <a href={publication.pdf_url} download>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le PDF
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/payments">
                      <Lock className="mr-2 h-4 w-4" />
                      Accès complet
                    </Link>
                  </Button>
                )}
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      

  {/* Add PDF Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-5xl p-4">
        <div className="flex flex-col h-[90vh]">
          <DialogTitle className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span>
              Aperçu de {publication.title}
              {publication.is_restricted && (
                <Badge variant="secondary" className="ml-2">
                  Aperçu limité
                </Badge>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogTitle>
          
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <object
              data={pdfToShow}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex items-center justify-center h-full p-8 text-center">
                <p className="text-gray-500">
                  Le PDF ne peut pas être affiché. 
                  <a 
                    href={pdfToShow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Cliquez ici pour l'ouvrir
                  </a>
                </p>
              </div>
            </object>
            
            {publication.is_restricted && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Ceci est un aperçu limité. Connectez-vous pour accéder au document complet.
                </p>
                <Button asChild size="sm">
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}