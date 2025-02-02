'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, FileText, GraduationCap,ScrollText, Loader2 } from 'lucide-react'
import {members} from '@/lib/members'
import { publicationProcess, userComments } from '@/data/publications'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
// import {userComments} from '@/data/publications'

interface Publication {
  id: string
  title: string
  author: string[] | string
  created_at: string
  abstract: string
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED'
  journal?: string
  volume?: string
  issue?: string
  doi?: string
  keywords?: string[]
}

export default function Home() {
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecentPublications = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('publications')
          .select(`
            id,
            title,
            author,
            created_at,
            abstract,
            status,
            journal,
            volume,
            issue,
            doi,
            keywords
          `)
          // .eq('status', 'PUBLISHED')
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error
        setRecentPublications(data || [])
      } catch (error) {
        console.error('Error fetching publications:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les publications récentes"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentPublications()
  }, [])
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66"
          alt="CRIDUPN Centre de Recherche Interdisciplinaire"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 " />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Université Pédagogique Nationale
          </h1>
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-2">
            Centre de Recherche Interdisciplinaire
          </h2>
          <p className="text-xl text-white mb-8 max-w-xl mt-0">
            Excellence en recherche pour le développement de l'éducation en République Démocratique du Congo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/publications">Nos Publications</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-white/10 backdrop-blur-sm">
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-4 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Nos Domaines de Recherche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Éducation',
                description: 'Recherche sur les méthodes pédagogiques innovantes'
              },
              {
                icon: Users,
                title: 'Développement Social',
                description: 'Études sur l\'impact social de l\'éducation'
              },
              {
                icon: FileText,
                title: 'Publications',
                description: 'Production scientifique et académique'
              },
              {
                icon: GraduationCap,
                title: 'Formation',
                description: 'Développement professionnel des chercheurs'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-white dark:text-gray-100 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Latest Publications Preview */}
    <section className="py-4 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Publications Récentes</h2>
          <Button asChild variant="secondary">
            <Link href="/publications">Voir plus des publications</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentPublications.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Aucune publication récente</p>
            </div>
          ) : (
            recentPublications.map((publication) => (
              <Card 
                key={publication.id}
               className="hover:shadow-lg transition-shadow"
               
               >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {publication.title}
                    </CardTitle>
                    <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium">
                        {Array.isArray(publication.author) 
                          ? publication.author.join(', ') 
                          : publication.author}
                      </div>
                      <div>
                        {publication.journal && (
                          <span className="font-medium">{publication.journal}</span>
                        )}
                        {publication.volume && `, Volume ${publication.volume}`}
                        {publication.issue && `, Issue ${publication.issue}`}
                        {publication.doi && (
                          <div className="mt-1">
                            DOI: <a href={`https://doi.org/${publication.doi}`} className="hover:underline" target="_blank" rel="noopener noreferrer">{publication.doi}</a>
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        Publié le {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      {publication.keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {publication.keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  </CardHeader>
                  <CardContent>
                    <span className="text-muted-foreground line-clamp-3">
                      {publication.abstract}
                    </span>
                  </CardContent>
                </Card>
            ))
          )}
        </div>
      </div>
    </section>

{/* Call for Papers Section */}
<section className="py-4 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black">Appel à publications</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        La revue CRIDUPN accepte les soumissions de recherches originales dans tous les domaines. 
        Nous publions des articles scientifiques, des livres et des rapports de recherche.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="text-center p-6">
        <div className="mb-4">
          <FileText className="h-12 w-12 mx-auto " />
        </div>
        <h3 className="font-bold mb-2">Articles Scientifiques</h3>
        <p className="text-gray-600 mb-4">Soumettez vos articles de recherche pour publication</p>
        <Button asChild variant="secondary">
          <Link href="/publications/soumettre">Soumettre un article</Link>
        </Button>
      </Card>
      <Card className="text-center p-6">
        <div className="mb-4">
          <BookOpen className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="font-bold mb-2">Livres</h3>
        <p className="text-gray-600 mb-4">Publiez vos ouvrages académiques</p>
        <Button asChild variant="secondary">
          <Link href="/publications/soumettre-livre">Proposer un livre</Link>
        </Button>
      </Card>
      <Card className="text-center p-6">
        <div className="mb-4">
          <ScrollText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="font-bold mb-2">Rapports</h3>
        <p className="text-gray-600 mb-4">Partagez vos rapports de recherche</p>
        <Button asChild variant="secondary">
          <Link href="/soumission">Soumettre un rapport</Link>
        </Button>
      </Card>
    </div>
  </div>
</section>

{/* Publication Process */}
<section className="py-4 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12 text-black">Processus de Publication</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {publicationProcess.map((step) => (
        <div key={step.step} className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            {/* <span className="text-black">{step.step} </span> */}
            <step.icon className="h-6 w-6 text-black  dark:text-black" />
          </div>
          <h3 className="font-bold mb-2 text-black">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
       
        </div>
      ))}
    </div>
  </div>
</section>

{/* Lead Reviewers Section */}
<section className="py-4 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-black mb-12">Nos Membres</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {members.map((reviewer, index) => (
        <Card key={index} className="overflow-hidden bg-black">
          <div className="relative aspect-[4/3] mb-4">
            <Image
              src={reviewer.image}
              alt={reviewer.name}
              fill
              className="object-cover"
              style={{ objectPosition: 'center 20%' }} 
              priority
            />
          </div>
          <CardContent className="">
            <h3 className="text-xl font-bold mb-1">{reviewer.name}</h3>
            <p className="text-primary font-semibold mb-2">{reviewer.title}</p>
            <p className="text-sm text-muted-foreground mb-2">
              <span className="font-semibold">Spécialisation : </span> 
              <span className="">{reviewer.specialization} </span>
            </p>
            <p className="text-sm  mb-4">
              <span className="font-semibold text-muted-foreground">Institution:</span>
              <span className="text-muted-foreground"> {reviewer.institution}</span>
            </p>
            <p className="text-sm text-gray-700">
            <span className="font-semibold text-muted-foreground">Bio :</span>
            <span className="text-muted-foreground"> {reviewer.bio} </span>

            </p>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="text-center mt-4">
      <Button asChild variant="secondary">
        <Link href="/members/">En savoir plus sur nos Membres</Link>
      </Button>
      </div>
  </div>
</section>


{/* Testimonials Section */}
<section className="py-4 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-black mb-12">Témoignages</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {userComments.map((testimonial, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image 
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold">{testimonial.name}</h3>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-gray-700 italic">{testimonial.comment}</p>
        </Card>
      ))}
    </div>
  </div>
</section>


      
</div>
  )
}