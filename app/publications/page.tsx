"use client"

import { useState } from 'react'
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
  Filter
} from 'lucide-react'
import { publications, categories, types } from '@/lib/publications'


export default function PublicationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedType, setSelectedType] = useState("Tous")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPublications = publications.filter(pub => {
    const matchesCategory = selectedCategory === "Tous" || pub.category === selectedCategory
    const matchesType = selectedType === "Tous" || pub.type === selectedType
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesType && matchesSearch
  })

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
            {filteredPublications.map((publication) => (
              <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={publication.image}
                      alt={publication.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {publication.abstract}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {publication.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}