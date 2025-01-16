import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Calendar,
  Users,
  BookMarked,
  Download,
  BookOpen,
  Building,
  Hash,
  FileText
} from 'lucide-react'

// Import publications data
import { publications } from '../page'

export default function PublicationPage({ params }: { params: { id: string } }) {
  const publication = publications.find(p => p.id === params.id)
  
  if (!publication) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/publications" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux publications
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={publication.image}
              alt={publication.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge>{publication.category}</Badge>
              <Badge variant="secondary">{publication.type}</Badge>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              {publication.doi && (
                <Badge variant="outline">DOI: {publication.doi}</Badge>
              )}
              {publication.isbn && (
                <Badge variant="outline">ISBN: {publication.isbn}</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {publication.authors.join(", ")}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(publication.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long'
                })}
              </div>
              {publication.citations > 0 && (
                <div className="flex items-center gap-1">
                  <BookMarked className="h-4 w-4" />
                  {publication.citations} citation{publication.citations > 1 ? 's' : ''}
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Résumé</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">
                {publication.abstract}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {publication.keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Informations</h2>
                <div className="space-y-4">
                  {publication.journal && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Journal</p>
                        <p className="text-gray-600">{publication.journal}</p>
                        {publication.volume && publication.issue && (
                          <p className="text-sm text-gray-500">
                            Vol. {publication.volume}, No. {publication.issue}, pp. {publication.pages}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {publication.institution && (
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Institution</p>
                        <p className="text-gray-600">{publication.institution}</p>
                      </div>
                    </div>
                  )}

                  {publication.publisher && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Éditeur</p>
                        <p className="text-gray-600">{publication.publisher}</p>
                      </div>
                    </div>
                  )}

                  {publication.pages && (
                    <div className="flex items-start gap-2">
                      <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Pages</p>
                        <p className="text-gray-600">{publication.pages}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" asChild>
              <Link href={publication.downloadUrl} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger la publication
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}