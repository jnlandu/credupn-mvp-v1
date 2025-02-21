'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, FileText, GraduationCap,ScrollText, Loader2 } from 'lucide-react'
import {members} from '@/lib/members'
import { partnerships, publicationProcess, recentNews, servicesFeatures, upcomingEvents, userComments } from '@/data/publications'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

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

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
}
export default function Home() {
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const router = useRouter()
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
          .eq('status', 'PUBLISHED')
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


function AnimatedCounter({ target, duration = 2000, suffix = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      let start = 0
      const stepTime = 10
      const increment = target / (duration / stepTime)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          start = target
          clearInterval(timer)
        }
        setCount(Math.floor(start))
      }, stepTime)
      
      return () => clearInterval(timer)
    }, [target, duration])
    
    return <span>{count}{suffix}</span>
  }
  
  const handleSubmitClick = async () => {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter ou créer un compte pour soumettre une publication",
        variant: "default",
        duration: 6000
      })
      router.push('/auth/signup')
    }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
       <section className="relative h-screen">
        <Image
          src="images/hero.jpeg"
          alt="CRIDUPN Centre de Recherche Interdisciplinaire"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight [text-wrap:balance] animate-fade-up">
              Université Pédagogique Nationale
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white/90 animate-fade-up [animation-delay:200ms]">
              Centre de Recherche Interdisciplinaire
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-up [animation-delay:400ms]">
              Excellence en recherche pour le développement scientifique et social en Afrique et République Démocratique du Congo
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-up [animation-delay:600ms]">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-colors"
              >
                <Link href="/publications">Nos Publications</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <Link href="/about">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-1 h-16 rounded-full bg-white/20 relative overflow-hidden">
            <div className="w-full h-1/2 bg-white absolute top-0 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 [text-wrap:balance]">
              Nos Domaines de Recherche
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos axes de recherche principaux et notre contribution à l'avancement de l'éducation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
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
      {/* Stats Section with Animated Counters */}
      <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter target={50} suffix="+" />
            </h3>
            <p className="text-gray-600">Chercheurs</p>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter target={200} suffix="+" />
            </h3>
            <p className="text-gray-600">Publications</p>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter target={15} suffix="+" />
            </h3>
            <p className="text-gray-600">Partenariats</p>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter target={30} suffix="+" />
            </h3>
            <p className="text-gray-600">Projets Actifs</p>
          </div>
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
            recentPublications.map((publication, index) => (
              <div 
              key={publication.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              >
               <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
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
                    <p className="text-muted-foreground line-clamp-3">
                      {publication.abstract}
                    </p>
                    <div className="mt-3">
                      <Button asChild variant="link" size="sm" className="text-primary p-0 h-auto">
                        <Link href={`/publications/${publication.id}`}>
                          Lire plus
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </div>
            ))
          )}
        </div>
      </div>
    </section>

{/* Call for Papers Section */}
<section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Appel à publications</h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        La revue CRIDUPN accepte les soumissions de recherches originales dans tous les domaines.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Article Submission Card */}
      <Card className="group hover:shadow-xl transition-all duration-300">
      <CardContent className="p-8 text-center">
        <div className="mb-6 relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <FileText className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4">Articles Scientifiques</h3>
        <p className="text-gray-600 mb-6">Soumettez vos articles de recherche pour publication</p>
        <Button 
          className="w-full" 
          variant="default"
          onClick={handleSubmitClick}
        >
          Soumettre un article
        </Button>
      </CardContent>
    </Card>
      {/* Book Submission Card */}
      <Card className="group hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8 text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Livres</h3>
          <p className="text-gray-600 mb-6">Publiez vos ouvrages scientifiques, academiques et littéraires</p>
          <Button 
          className="w-full" 
          variant="default"
          onClick={handleSubmitClick}
        >
          Soumettre un livre

        </Button>
        </CardContent>
      </Card>
      {/* Reports Submission Card */}
      <Card className="group hover:shadow-xl transition-all duration-300">
        <CardContent className="p-8 text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <ScrollText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Rapports</h3>
          <p className="text-gray-600 mb-6">Publiez et partagez vos rapports de recherche ou de labo</p>
          <Button 
          className="w-full" 
          variant="default"
          onClick={handleSubmitClick}
          >
          Soumettre un rapport
        </Button>
        </CardContent>
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
    <section className="py-20 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-16 text-black">Ce que disent nos chercheurs</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {userComments.map((testimonial, index) => (
        <Card 
          key={index} 
          className="group hover:shadow-xl transition-all duration-300"
        >
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic leading-relaxed">
              "{testimonial.comment}"
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


{/* Partnerships and Collaborations Section */}
<section className="py-4 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-black mb-12">Partenariats et Collaborations</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Map through partnerships and collaborations */}
      {partnerships.map((partner, index) => (
        <Card key={index} className="p-6">
          <h3 className="font-bold mb-2">{partner.name}</h3>
          <p className="text-gray-700">{partner.description}</p>
        </Card>
      ))}
    </div>
  </div>
</section>
{/* Replace local image paths with public URLs */}
<section className="py-12 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black">Indexation de la Revue</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        La revue CRIDUPN est indexée dans les bases de données internationales suivantes:
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <Card className="text-center p-6 hover:shadow-lg ">
      <div className="mb-4 relative h-20">
        <Image
          src="https://www.crossref.org/images/Crossref_Cited_By_logo_screen.png"
          alt="Crossref"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // onError={(e: any) => {
          //   e.currentTarget.src = '/fallback-image.png' 
          // }}
        />
      </div>
      <h3 className="font-bold mb-2">Crossref</h3>
      <p className="text-gray-600">DOI: 10.XXXX/XXXXX</p>
    </Card>
      <Card className="text-center p-6 hover:shadow-lg ">
        <div className="mb-4 relative h-20">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Scopus_logo.svg"
            alt="Scopus"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-bold mb-2">Scopus</h3>
        <p className="text-gray-600">Base de données Elsevier</p>
      </Card>

      <Card className="text-center p-6 hover:shadow-lg transition-shadow">
        <div className="mb-4 relative h-20">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DOAJ_logo.svg"
            alt="DOAJ"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-bold mb-2">DOAJ</h3>
        <p className="text-gray-600">Directory of Open Access Journals</p>
      </Card>

      <Card className="text-center p-6 hover:shadow-lg transition-shadow">
        <div className="mb-4 relative h-20">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/28/Google_Scholar_logo.png"
            alt="Google Scholar"
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-bold mb-2">Google Scholar</h3>
        <p className="text-gray-600">Index académique Google</p>
      </Card>
    </div>
  </div>
</section>

      
</div>
  )
}