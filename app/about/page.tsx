import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, BookOpen, Trophy, Star, Lightbulb, HandshakeIcon, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Chercheurs", value: "50+" },
    { icon: BookOpen, label: "Publications", value: "200+" },
    { icon: Building2, label: "Partenaires", value: "15+" },
    { icon: Trophy, label: "Prix reçus", value: "10+" },
  ]

  return (
    <div className="min-h-screen ">
      {/* Hero Section - Refined */}
      <section className="relative h-[60vh] flex items-center">
        <Image
          // src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2086&q=80"
          src="/images/divers/batupn.jpg"
          alt="CRIDUPN Centre de Recherche"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 px-3 py-1 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
              Centre de Recherche Interdisciplinaire
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              À propos de notre Centre
            </h1>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
              Un centre d'excellence dédié à l'innovation et à la recherche en éducation 
              en République Démocratique du Congo
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm uppercase tracking-wider text-gray-900 font-semibold mb-2">Notre Histoire</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Excellence et Innovation depuis 1990
            </h2>
            <Separator className="bg-primary/30 h-1 w-24 mb-8" />
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Fondé en 1990, le Centre de Recherche Interdisciplinaire de l'Université Pédagogique Nationale (CRIDUPN) 
              s'est développé pour devenir un pilier de l'excellence académique en République Démocratique du Congo.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Notre centre rassemble des chercheurs de diverses disciplines dans le but commun de faire progresser 
              la connaissance scientifique et de contribuer au développement socio-économique de notre pays et du continent africain.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Modernized */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto mb-16">
            <div className="text-center mb-12">
              <div className="text-sm uppercase tracking-wider text-gray-900 font-semibold mb-2">Ce qui nous définit</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Notre Mission & Vision</h2>
              <Separator className="bg-gray-700 h-1 w-32 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-2 overflow-hidden">
                <div className="h-2 bg-primary/80 w-full rounded-t-sm mb-2"></div>
                <CardContent className="p-8">
                    <div className='flex  flex-row gap-4'>
                    <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6 mt-2">
                      <Star className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-g">Notre Mission</h3>
                    </div>
                    {/* <h3 className="text-2xl font-bold mb-4 text-g"> Notre Mission </h3> */}
                    <p className="text-gray-200 leading-relaxed">
                      Le CREDUPN est dédié à l'avancement de la recherche interdisciplinaire en RDC. 
                      Nous travaillons pour résoudre les défis contemporains à travers 
                      la recherche scientifique rigoureuse, l'innovation méthodologique et la formation des chercheurs.
                    </p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-2 overflow-hidden">
                <div className="h-2 bg-primary/80 w-full rounded-t-sm mb-2"></div>
                <CardContent className="p-8">
                <div className='flex  flex-row gap-4'>
                  <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                    <Lightbulb className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text0">Notre Vision</h3>
                </div>
                  {/* <h3 className="text-2xl font-bold mb-4 text0"> Notre Vision </h3> */}
                  <p className="text-gray-200 leading-relaxed">
                    Devenir un centre d'excellence de renommée internationale pour la recherche 
                    interdisciplinaire en Afrique, contribuant significativement au développement 
                    scientifique, technologique, économique et social du continent africain.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900 relative text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="text-sm uppercase tracking-wider text-primary font-semibold">Notre Impact</div>
            <h2 className="text-3xl font-bold text-white mt-2">CRIDUPN en Chiffres</h2>
            <Separator className="bg-primary/30 h-1 w-32 mx-auto my-6" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-xl transform rotate-3"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10 shadow-xl">
                  <stat.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                  <div className="text-4xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Values - Modernized */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-sm uppercase tracking-wider text-gray-900  font-semibold">Principes Fondamentaux</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Nos Valeurs</h2>
              <Separator className="bg-gray-700 h-1 w-32 mx-auto" />
              <p className="text-gray-600 max-w-2xl mx-auto mt-6">
                Ces valeurs guident notre approche de la recherche et façonnent notre culture institutionnelle
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Star,
                  title: "Excellence",
                  description: "Nous visons l'excellence dans toutes nos activités de recherche et publications scientifiques."
                },
                {
                  icon: Lightbulb,
                  title: "Innovation",
                  description: "Nous encourageons l'innovation et les approches créatives pour résoudre les défis contemporains."
                },
                {
                  icon: HandshakeIcon,
                  title: "Collaboration",
                  description: "Nous favorisons la collaboration entre chercheurs, disciplines et institutions à l'échelle nationale et internationale."
                }
              ].map((value, index) => (
                <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-6">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-sm uppercase tracking-wider text-gray-900 font-semibold">Nous Contacter</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Notre Localisation</h2>
              <Separator className="bg-gray-600 h-1 w-32 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4 mb-6">
                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xl font-semibold text-gray-900">Université Pédagogique Nationale</p>
                      <p className="text-gray-600 mt-1">Croisement de l'avenue Peuple et Maman Yemo</p>
                      <p className="text-gray-600">Kinshasa, République Démocratique du Congo</p>
                    </div>
                  </div>
                  <div className="space-y-4 pl-10 border-l-2 border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email:</p>
                      <p className="text-primary hover:underline">contact@cridupn.cd</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Téléphone:</p>
                      <p className="text-gray-900 font-medium">+243 81 090 1443</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Heures d'ouverture:</p>
                      <p className="text-gray-900">Lundi - Vendredi: 8:00 - 17:00</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full flex justify-end items-center gap-2 py-6">
                  <Link href="/contact" className="flex items-center gap-2">
                    <span>Prendre rendez-vous</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5436426559784!2d15.3118!3d-4.3244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33d43c8280b3%3A0x88439c66032f2cb5!2sUniversit%C3%A9%20P%C3%A9dagogique%20Nationale!5e0!3m2!1sfr!2scd!4v1691234567890!5m2!1sfr!2scd"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute inset-0 border-4 border-white/10 rounded-xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}