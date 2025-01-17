// app/publications/[id]/PublicationView.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Eye } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Publication } from '@/lib/publications'

export default function PublicationView({ publication }: { publication: Publication }) {
  const [showPreview, setShowPreview] = useState(false)

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
              
              <div className="flex gap-4 mt-8">
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
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add PDF Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <iframe
              src={`${publication.pdfUrl}#toolbar=0`}
              className="w-full h-full"
              title={`Preview of ${publication.title}`}
            />
          </DialogContent>
        </Dialog>
    </div>
  )
}