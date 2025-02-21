"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Download, 
  Search,
  BookMarked,
  GraduationCap,
  FileText,
  Filter,
  Loader2
} from 'lucide-react'
import { publications, categories, types } from '@/lib/publications'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Publication {
  id: string
  title: string
  abstract: string
  author: string[] | string | null
  created_at: string
  category: string
  type: string
  doi?: string
  isbn?: string
  is_restricted?: boolean
  citations?: number
  keywords: string[] | null
  image: string
  downloadUrl: string
}
interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

const DEFAULT_IMAGE = '/images/divers/upn-3.jpg' // Default image for publications

export default function PublicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedType, setSelectedType] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  

  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()




 // Fetch publications from Supabase
 useEffect(() => {
  const fetchPublications = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          id,
          title,
          abstract,
          author,
          created_at,
          category,
          type,
          doi,
          isbn,
          citations,
          keywords,
          image_url,
          pdf_url
        `)
        .eq('status', 'PUBLISHED') // Add filter for published status
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Fetched publications:', data)
      setPublications(data?.map(pub => ({
        ...pub,
        created_at: pub.created_at,
        image: pub.image_url,
        downloadUrl: pub.pdf_url
      })) || [])

    } catch (error) {
      const err = error as DatabaseError
      console.error('Error fetching publications:', {
        code: err.code,
        message: err.message,
        details: err.details,
        hint: err.hint
      })
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de charger les publications"
      })
    } finally {
      setIsLoading(false)
    }
  }

  fetchPublications()
}, [toast])

const filteredPublications = publications.filter(pub => {
  const matchesCategory = selectedCategory === "Tous" || pub.category === selectedCategory
  const matchesType = selectedType === "Tous" || pub.type === selectedType
  // Update search logic with proper type checking
  const matchesSearch = 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(pub.author) 
        ? pub.author.some(aut => aut.toLowerCase().includes(searchQuery.toLowerCase()))
        : pub.author?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  return matchesCategory && matchesType && matchesSearch
})

const indexOfLastItem = currentPage * itemsPerPage
const indexOfFirstItem = indexOfLastItem - itemsPerPage
const currentPublications = filteredPublications.slice(indexOfFirstItem, indexOfLastItem)
const totalPages = Math.ceil(filteredPublications.length / itemsPerPage)

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Publications</h1>
            <p className="text-gray-600">
              Découvrez nos dernières publications et recherches
            </p>
          </div>
          <Button asChild>
            <Link href="/publications/soumettre" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Soumettre un article
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          {/* Filters Sidebar */}
          <Card className="h-fit">
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedType === type ? "default" : "secondary"}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publications Grid */}
          <div className="space-y-6">
              {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : currentPublications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune publication trouvée</p>
              </div>
            ) : ( currentPublications.map((publication) => (
                <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="relative h-64 md:h-auto">
                      <Image
                          src={publication.image ?? DEFAULT_IMAGE}
                          alt={publication.title || "Publication placeholder"}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge>{publication.category}</Badge>
                        <Badge variant="secondary">{publication.type}</Badge>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {publication.doi && (
                            <Badge variant="outline" className="text-xs">
                              DOI: {publication.doi}
                            </Badge>
                          )}
                          {publication.isbn && (
                            <Badge variant="outline" className="text-xs">
                              ISBN: {publication.isbn}
                            </Badge>
                          )}
                        </div>
                        <Link 
                          href={`/publications/${publication.id}`}
                          className="hover:underline"
                        >
                          <h2 className="text-2xl font-semibold">
                            {publication.title}
                          </h2>
                        </Link>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {Array.isArray(publication?.author) 
                                ? publication.author.join(", ")
                                : publication?.author ?? "Auteur inconnu"}
                            </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(publication.created_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </div>
                          {publication.citations! > 0 && (
                            <div className="flex items-center gap-1">
                              <BookMarked className="h-4 w-4" />
                              {publication.citations} citation{publication.citations! > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {publication.abstract}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {publication.keywords?.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          )) ?? []}
                        </div>
                        <div className="flex gap-4">
                          <Button asChild>
                            <Link href={`/publications/${publication.id}`}>
                              Lire plus
                            </Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href={publication.downloadUrl} className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Télécharger
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
                )
              ))}
            </div>
          </div>
      </div>
      {/* Pagination controls */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          className="border rounded p-2"
          value={itemsPerPage}
          onChange={(e: any) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          <option value={6}>6 par page</option>
          <option value={12}>12 par page</option>
          <option value={24}>24 par page</option>
        </select>
        <span className="text-sm text-gray-600">
          Affichage {filteredPublications.length === 0 ? 0 : indexOfFirstItem + 1} à{' '}
          {Math.min(indexOfLastItem, filteredPublications.length)} sur {filteredPublications.length}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </Button>
      </div>
    </div>
    </div>
  )
}