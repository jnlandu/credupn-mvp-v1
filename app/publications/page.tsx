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

const publications = [
  {
    id: 'pub-1',
    title: "L'impact des Technologies Éducatives sur l'Apprentissage en RDC",
    authors: ["Dr. Marie Kalonji", "Prof. Jean-Pierre Mbula"],
    date: "2024-01-15",
    abstract: `Cette étude examine l'impact de l'introduction des technologies éducatives dans les écoles 
    congolaises, en mettant l'accent sur les zones urbaines et rurales. Les résultats montrent une 
    amélioration significative des résultats d'apprentissage lorsque la technologie est intégrée de 
    manière appropriée.`,
    keywords: ["technologie éducative", "apprentissage", "RDC", "éducation numérique"],
    category: "Recherche",
    type: "Article",
    journal: "Revue Africaine des Sciences de l'Éducation",
    volume: "12",
    issue: "3",
    pages: "45-67",
    doi: "10.1234/rase.2024.12.3.45",
    citations: 8,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
    downloadUrl: "#"
  },
  {
    id: 'pub-2',
    title: "Formation des Enseignants en RDC : Défis et Perspectives",
    authors: ["Prof. Sarah Mutombo", "Dr. Robert Ngandu", "Dr. Claire Dubois"],
    date: "2023-11-20",
    abstract: `Une analyse approfondie des programmes de formation des enseignants en République 
    Démocratique du Congo, identifiant les principaux défis et proposant des recommandations pour 
    l'amélioration de la qualité de la formation.`,
    keywords: ["formation des enseignants", "éducation", "RDC", "développement professionnel"],
    category: "Recherche",
    type: "Thèse",
    institution: "Université Pédagogique Nationale",
    pages: "245",
    citations: 12,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
    downloadUrl: "#"
  },
  {
    id: 'pub-3',
    title: "Méthodes Innovantes d'Évaluation dans l'Enseignement Supérieur",
    authors: ["Dr. Emmanuel Tshibangu", "Prof. Marie-Claire Muamba"],
    date: "2023-09-05",
    abstract: `Cette recherche présente une analyse comparative des méthodes d'évaluation innovantes 
    dans l'enseignement supérieur, avec un focus particulier sur leur applicabilité dans le contexte 
    de la RDC.`,
    keywords: ["évaluation", "enseignement supérieur", "innovation pédagogique"],
    category: "Méthodologie",
    type: "Article",
    journal: "Journal International de Pédagogie Universitaire",
    volume: "8",
    issue: "2",
    pages: "123-145",
    doi: "10.5678/jipu.2023.8.2.123",
    citations: 5,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80",
    downloadUrl: "#"
  },
  {
    id: 'pub-4',
    title: "Guide des Bonnes Pratiques en Enseignement à Distance",
    authors: ["Prof. Jean Kalala", "Dr. Jeanne Mwamba"],
    date: "2023-07-15",
    abstract: `Un guide complet détaillant les meilleures pratiques pour l'enseignement à distance 
    dans le contexte africain, basé sur des expériences réussies et des recherches empiriques.`,
    keywords: ["enseignement à distance", "e-learning", "pédagogie numérique"],
    category: "Guide Pratique",
    type: "Livre",
    publisher: "Éditions CREDUPN",
    pages: "180",
    isbn: "978-2-12345-678-9",
    citations: 15,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
    downloadUrl: "#"
  },
  {
    id: 'pub-5',
    title: "L'Éducation Inclusive en RDC : État des Lieux et Perspectives",
    authors: ["Dr. Pierre Lefebvre", "Prof. Samuel Mukendi"],
    date: "2023-06-01",
    abstract: `Une étude approfondie sur la situation de l'éducation inclusive en RDC, analysant 
    les politiques actuelles, les pratiques sur le terrain et proposant des recommandations pour 
    une meilleure inclusion.`,
    keywords: ["éducation inclusive", "RDC", "politiques éducatives"],
    category: "Politique Éducative",
    type: "Rapport",
    institution: "CREDUPN",
    pages: "95",
    citations: 7,
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80",
    downloadUrl: "#"
  },
  {
    id: 'pub-6',
    title: "Stratégies d'Apprentissage Collaboratif en Milieu Universitaire",
    authors: ["Dr. Alice Kabongo", "Prof. Marc Ntumba"],
    date: "2023-05-10",
    abstract: `Une analyse des méthodes d'apprentissage collaboratif et leur efficacité dans 
    l'enseignement supérieur en RDC. L'étude met en évidence les facteurs clés de succès et 
    les obstacles à surmonter.`,
    keywords: ["apprentissage collaboratif", "université", "pédagogie", "RDC"],
    category: "Méthodologie",
    type: "Article",
    journal: "Revue des Sciences de l'Éducation en Afrique",
    volume: "15",
    issue: "4",
    pages: "78-95",
    doi: "10.3456/rsea.2023.15.4.78",
    citations: 6,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80",
    downloadUrl: "#"
    },
    {
    id: 'pub-7',
    title: "L'Intelligence Artificielle dans l'Éducation Congolaise",
    authors: ["Prof. David Kasongo", "Dr. Sophie Mbemba"],
    date: "2023-04-15",
    abstract: `Cette étude explore les possibilités d'intégration de l'IA dans le système 
    éducatif congolais, en examinant les opportunités et les défis technologiques, 
    pédagogiques et infrastructurels.`,
    keywords: ["intelligence artificielle", "éducation", "innovation", "RDC"],
    category: "Recherche",
    type: "Article",
    journal: "Technologies Éducatives en Afrique",
    volume: "7",
    issue: "2",
    pages: "112-130",
    doi: "10.5678/tea.2023.7.2.112",
    citations: 4,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80",
    downloadUrl: "#"
    },
    {
      id: 'pub-8',
      title: "L'Éducation Environnementale dans les Écoles de la RDC",
      authors: ["Dr. Julie Mwanza", "Prof. Thomas Bokanga"],
      date: "2023-03-20",
      abstract: `Cette thèse examine l'état actuel de l'éducation environnementale dans les écoles 
      congolaises et propose un cadre méthodologique pour son intégration effective dans les 
      programmes scolaires.`,
      keywords: ["éducation environnementale", "développement durable", "RDC", "programme scolaire"],
      category: "Recherche",
      type: "Thèse",
      institution: "Université de Kinshasa",
      pages: "278",
      citations: 3,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      downloadUrl: "#"
    }
]

const categories = ["Tous", "Recherche", "Méthodologie", "Guide Pratique", "Politique Éducative"]
const types = ["Tous", "Article", "Thèse", "Livre", "Rapport"]

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
                    onChange={(e) => setSearchQuery(e.target.value)}
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