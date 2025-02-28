'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { BookOpen, Users, FileText, GraduationCap, ScrollText, Loader2, ArrowRight, ChevronRight, ExternalLink, User, Building2 } from 'lucide-react'
import { members } from '@/lib/members'
import { partnerships, publicationProcess, recentNews, servicesFeatures, upcomingEvents, userComments } from '@/data/publications'
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'


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
  const [scrollY, setScrollY] = useState(0)
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
  }, [toast])

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Intersection Observer for fade-in effects
  const useInView = (ref: any) => {
    const [isInView, setIsInView] = useState(false)
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Once element is in view, stop observing - this keeps it visible
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        },
        { threshold: 0.1 }
      )
  
      if (ref.current) {
        observer.observe(ref.current)
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }, [ref])
  
    return isInView
  }

  // Animated Section Component
// Update the AnimatedSection component to only animate in, never out
const AnimatedSection = ({ children, delay = 0, direction = 'up' }: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);
  
  // Define different transform styles based on direction
  const transforms = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10'
  };

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out ${
        isInView 
          ? 'opacity-100 transform-none' 
          : `opacity-0 ${transforms[direction]}`
      }`}
      style={{ 
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
      
    </div>
  );
};
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - More Professional & Clean */}
      <section className="relative h-[90vh] overflow-hidden">
      <Image
    src="/images/hero.jpeg"
    alt="CRIDUPN Centre de Recherche Interdisciplinaire"
    fill
    className="object-cover"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
  <div className="relative z-10 flex items-center justify-center h-full px-4 max-w-7xl mx-auto">
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col space-y-2">
        <Badge className="w-fit text-sm px-4 py-1 mb-4 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
          Centre d'Excellence en Recherche
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight [text-wrap:balance] animate-fade-up">
          Centre de Recherche Interdisciplinaire
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white/90 animate-fade-up [animation-delay:200ms]">
          Université Pédagogique Nationale
        </h2>
      </div>
      <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed animate-fade-up [animation-delay:400ms]">
        Promouvoir l'excellence académique et la recherche scientifique pour le développement durable de l'Afrique et de la République Démocratique du Congo
      </p>
      <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:600ms]">
        <Button 
          asChild 
          size="lg" 
          className="text-base px-6 py-6 bg-primary hover:bg-primary/90 transition-colors"
        >
          <Link href="/publications" className="flex items-center gap-2">
            Explorer nos Publications <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button 
          asChild 
          size="lg" 
          variant="outline" 
          className="text-base px-6 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border-white/30"
        >
          <Link href="/about">Notre Centre</Link>
        </Button>
      </div>
    </div>
  </div>
</section>

      {/* Introduction Section - New */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <div>
          <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Notre Institution</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">
            Un Pôle d'Excellence pour la Recherche et l'Innovation
          </h3>
          <Separator className="bg-primary/30 h-1 w-24 mt-6" />
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">
          Le <span className="font-semibold">CRIDUPN</span> se positionne comme une institution académique de référence en République Démocratique du Congo, mobilisant l'expertise pluridisciplinaire de ses chercheurs pour relever les défis contemporains.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Notre vision est de contribuer significativement au développement scientifique, technologique, économique et social du continent africain à travers une recherche innovante et des partenariats stratégiques.
        </p>
        <Button asChild variant="default" size="lg" className="mt-4">
          <Link href="/about" className="flex items-center gap-2">
            Découvrir notre mission <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
        <Image
          // src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
          src="/images/logo/campus.webp"
          alt="Centre de Recherche UPN"
          fill
          className="object-cover z-10"
        />
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-3xl z-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-tr-3xl z-20" />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-20" />
        
        <div className="absolute inset-0 border-2 border-primary/30 rounded-xl z-30 pointer-events-none" />
        
        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-medium text-gray-800 z-30 shadow-lg">
          Campus Universitaire, UPN.
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Research Domains Section - Redesigned */}
      <section className="py-20 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Domaines d'Excellence</h2>
      <h3 className="text-3xl font-bold text-gray-900 [text-wrap:balance]">
        Axes de Recherche Principaux
      </h3>
      <Separator className="bg-primary/30 h-1 w-32 mx-auto my-4" />
      <p className="text-lg text-gray-700 max-w-3xl mx-auto">
        Notre centre développe des projets de recherche dans plusieurs domaines stratégiques, avec une approche interdisciplinaire et collaborative
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {servicesFeatures.map((feature, index) => (
        <div key={index} className="text-center">
          <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Stats Section - Redesigned */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900 relative text-white">
  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1423592707957-3b212afa6733?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center"></div>
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Notre Impact</h2>
      <h3 className="text-3xl font-bold text-white mt-2">CRIDUPN en Chiffres</h3>
      <Separator className="bg-primary/30 h-1 w-32 mx-auto my-6" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {[
        { count: 50, label: "Chercheurs", suffix: "+" },
        { count: 200, label: "Publications", suffix: "+" },
        { count: 15, label: "Partenariats", suffix: "+" },
        { count: 30, label: "Projets Actifs", suffix: "+" }
      ].map((stat, index) => (
        <div key={index} className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-xl transform rotate-3"></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10 shadow-xl">
            <h3 className="text-5xl font-bold text-primary mb-4">
              <AnimatedCounter 
                target={stat.count} 
                suffix={stat.suffix} 
              />
            </h3>
            <p className="text-white/90 font-medium text-xl">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Latest Publications Section - Redesigned */}
      <section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
      <div className="mb-6 md:mb-0">
        <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Recherche & Publications</h2>
        <h3 className="text-3xl font-bold text-gray-900 mt-2">Publications Récentes</h3>
        <Separator className="bg-primary/30 h-1 w-32 my-4" />
      </div>
      <Button asChild variant="outline" className="flex items-center gap-2">
        <Link href="/publications">
          Bibliothèque complète <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {isLoading ? (
        <div className="col-span-3 flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recentPublications.length === 0 ? (
        <div className="col-span-3 text-center py-16">
          <p className="text-gray-500">Aucune publication récente disponible</p>
        </div>
      ) : (
        recentPublications.map((publication, index) => (
          <div key={publication.id}>
            <Card className="h-full border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="h-2 bg-primary/80 w-full"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {publication.title}
                </CardTitle>
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-medium text-gray-400">
                    {Array.isArray(publication.author) 
                      ? publication.author.join(', ') 
                      : publication.author}
                  </p>
                  <div className="text-sm text-gray-500">
                    {publication.journal && (
                      <span className="italic">{publication.journal}</span>
                    )}
                    {publication.volume && `, Volume ${publication.volume}`}
                    {publication.issue && `, Issue ${publication.issue}`}
                  </div>
                  <p className="text-xs text-gray-500">
                    Publié le {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 line-clamp-3">
                  {publication.abstract}
                </p>
              </CardContent>
              <CardFooter className="pt-0 flex flex-col items-start">
                {publication.keywords && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {publication.keywords.slice(0, 3).map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {publication.keywords.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{publication.keywords.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <Button asChild variant="link" size="sm" className="text-primary p-0 h-auto group-hover:underline">
                  <Link href={`/publications/${publication.id}`} className="flex items-center gap-1">
                    Lire l'article complet <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))
      )}
    </div>
  </div>
</section>

      {/* Call for Papers Section - Redesigned */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* <AnimatedSection> */}
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Soumission</h2>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">Appel à publications</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                La revue CRIDUPN accepte les soumissions de recherches originales dans tous les domaines académiques.
              </p>
            </div>
          {/* </AnimatedSection> */}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Articles Scientifiques",
                description: "Soumettez vos articles de recherche pour publication dans notre revue scientifique",
                icon: FileText
              },
              {
                title: "Livres",
                description: "Publiez vos ouvrages scientifiques, académiques et littéraires à travers notre maison d'édition",
                icon: BookOpen
              },
              {
                title: "Rapports",
                description: "Publiez et partagez vos rapports de recherche ou de laboratoire avec la communauté scientifique",
                icon: ScrollText
              }
            ].map((item, index) => (
              <div key={index}>
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={handleSubmitClick}
                    >
                      Soumettre
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publication Process - Redesigned */}
  {/* Publication Process - Enhanced with Visual Elements */}
<section className="py-20 px-4 bg-primary/5">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Notre méthode</h2>
      <h3 className="text-3xl font-bold text-white mt-2">Processus de Publication</h3>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
        Un processus rigoureux garantissant la qualité et l'intégrité scientifique
      </p>
    </div>
    
    {/* Process Steps with Connection Lines */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      {publicationProcess.map((step, index) => (
         <div key={step.step} >
          <div className="relative">
            {index < publicationProcess.length - 1 && (
               <AnimatedSection key={step.step} delay={index * 100}>
              <div className="absolute top-6 left-[50%] w-full h-0.5 bg-gradient-to-r from-primary/20 to-primary/50 hidden md:block" />
              </AnimatedSection>
            )}
            <div className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-6 z-10 relative transition-transform hover:scale-110 duration-300">
                <span className="text- font-bold">{index + 1}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 animate-ping-slow opacity-50"></div>
              <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100">
                <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-black font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </div>
        {/* // </AnimatedSection> */}
        </div>
      ))}
    </div>
    
    {/* Visual Demonstration */}
      <div className="mt-16 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:w-1/2 relative bg-gray-50">
            {/* Illustration or Video Placeholder */}
            <div className="aspect-video relative">
              <Image
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Processus de publication"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment soumettre une publication ?</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Créer un compte</h4>
                  <p className="text-gray-600 text-sm">L'inscription à la plateforme est requise pour soumettre une publication</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Préparer votre manuscrit</h4>
                  <p className="text-gray-600 text-sm">Suivez nos directives de formatage pour optimiser vos chances d'acceptation</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Suivre le processus</h4>
                  <p className="text-gray-600 text-sm">Notre système vous guidera à travers toutes les étapes nécessaires</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSubmitClick} className="flex items-center gap-2">
                Commencer une soumission <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" asChild>
                <Link href="/guidelines" className="flex items-center gap-2">
                  Consulter les directives <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Authentication Notice */}
      <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">Note importante:</span> La soumission de publications nécessite la création d'un compte sur notre plateforme. Cela nous permet de faciliter le suivi de vos soumissions et la communication avec les évaluateurs.
        </p>
      </div>
    </div>
  </section>

      {/* Our Members Section - Professional Redesign */}
  <section className="py-20 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
     {/* <div className="flex flex-col md:flex-row justify-center items-start md:items-center mb-16"> */}
       <div className="mb-6 md:mb-0">
        <h2 className="text-center text-sm uppercase tracking-wider text-black font-semibold">Notre équipe</h2>
        <h3 className="text-center text-3xl font-bold text-gray-900 mt-2">Chercheurs et Membres</h3>
        <Separator className="bg-black h-1 w-32 my-4" />
      </div>
      {/* <Button asChild variant="outline" className="flex items-center gap-2">
        <Link href="/members/">
          Voir tous les membres <ArrowRight className="h-4 w-4" />
        </Link>
      </Button> */}
    {/* </div> */}
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {members.slice(0, 3).map((member, index) => (
        <div key={index} >
          <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group h-full">
            {/* Image Header with Overlay */}
            <div className="relative h-72">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                style={{ objectPosition: 'center 15%' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              
              {/* Academic Info Overlay */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                {/* <Badge className="bg-whit text-primary border-0 py-1 px-3 shadow-sm">
                  <GraduationCap className="h-3.5 w-3.5 mr-1" />
                  {member.publications} publications
                </Badge> */}
                
                {/* <Badge className="bg-primary/20 text-white border-0 shadow-sm">
                  {member.specialization}
                </Badge> */}
              </div>
            </div>
            
            {/* Profile Card Content */}
            <CardContent className="relative pt-8 pb-4">
              {/* Avatar */}
              <div className="absolute -top-12 left-6 rounded-full border-4 border-white shadow-md overflow-hidden h-24 w-24">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 15%' }}
                />
              </div>
              
              {/* Member Info */}
              <div className="ml-28">
                <h3 className="text-xl font-bold mb-1 text-gray-400">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.title}</p>
              </div>
              
              <Separator className="my-4" />
              {/* Details */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Building2 className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className="text-sm text-gray-700">{member.institution}</span>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2 mt-4">Domaines d'expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.research_areas.map((area, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-normal">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-3 italic">
                    "{member.bio}"
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 pb-4 flex justify-end border-t border-gray-100 mt-2">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary hover:bg-primary/5 transition-colors"
                asChild
              >
                <Link href={`/members/${member.id}`} className="flex items-center gap-1.5">
                  Voir le profil complet <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
    
    {/* CTA for All Members */}
    <div className="mt-14 text-center">
      <Button asChild size="lg" variant="outline" className="gap-2">
        <Link href="/members/" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Découvrir tous nos chercheurs et experts
        </Link>
      </Button>
    </div>
  </div>
</section>

      {/* Testimonials Section - Redesigned */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          {/* <AnimatedSection> */}
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Témoignages</h2>
              <h3 className="text-3xl font-bold text-white mt-2">Ce que disent nos chercheurs</h3>
            </div>
          {/* </AnimatedSection> */}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userComments.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <CardContent className="pt-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed border-l-4 border-primary/20 pl-4">
                      "{testimonial.comment}"
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships and Indexing Combined - More Professional */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* <AnimatedSection> */}
            <div className="text-center mb-16">
              <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">Collaborations</h2>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">Partenariats et Indexation</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                Notre centre collabore avec des institutions prestigieuses et notre revue est indexée 
                dans des bases de données internationales reconnues
              </p>
            </div>
          {/* </AnimatedSection> */}
          
          <div className="mb-16">
            <h4 className="text-xl font-semibold mb-8 border-b pb-2 text-black">Partenaires académiques</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerships.map((partner, index) => (
                <div key={index} >
                  <Card className="border border-gray-200 shadow-sm p-6 h-full">
                    <h3 className="font-bold text-lg mb-2">{partner.name}</h3>
                    <p className="text-gray-700">{partner.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-8 border-b pb-2 text-black">Indexation de la Revue</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Crossref",
                  description: "DOI: 10.XXXX/XXXXX",
                  image: "https://www.crossref.org/images/Crossref_Cited_By_logo_screen.png"
                },
                {
                  name: "Scopus",
                  description: "Base de données Elsevier",
                  image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Scopus_logo.svg"
                },
                {
                  name: "DOAJ",
                  description: "Directory of Open Access Journals",
                  image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/DOAJ_logo.svg"
                },
                {
                  name: "Google Scholar",
                  description: "Index académique Google",
                  image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Google_Scholar_logo.png"
                }
              ].map((indexer, i) => (
                <div key={i} >
                  <Card className="text-center p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <div className="mb-4 relative h-16">
                      <Image
                        src={indexer.image}
                        alt={indexer.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold mb-1">{indexer.name}</h3>
                    <p className="text-gray-600 text-sm">{indexer.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}