// app/publications/[id]/PublicationView.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Eye, X, Badge, Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Publication } from '@/lib/publications'

export default function PublicationView({ publication }: { publication: Publication }) {
  const [showPreview, setShowPreview] = useState(false)
  const pdfToShow = publication.isRestricted ? publication.previewUrl : publication.pdfUrl

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
                Par {publication.authors.join(", ")}
              </p>
              <p className="text-gray-700 mb-6">
                {publication.abstract}
              </p>
              
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Date:</span> {publication.date}
                </div>
                <div>
                  <span className="font-semibold">Catégorie:</span> {publication.category}
                </div>
                <div>
                  <span className="font-semibold">Type:</span> {publication.type}
                </div>
              </div>
              
              {/* <div className="flex gap-4 mt-8">
              <Button onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Aperçu
                </Button>
                <Button variant="outline" asChild>
                  <a href={publication.pdfUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le PDF
                  </a>
                </Button>
              </div> */}
              <div className="flex gap-4 mt-8">
                <Button onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Aperçu
                </Button>
                
                {!publication.isRestricted ? (
                  <Button variant="outline" asChild>
                    <a href={publication.pdfUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le PDF
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">
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
              {publication.isRestricted && (
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
            
            {publication.isRestricted && (
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