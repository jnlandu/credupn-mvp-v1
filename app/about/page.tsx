import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, BookOpen, Trophy, Star, Lightbulb, HandshakeIcon, MapPin } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Chercheurs", value: "50+" },
    { icon: BookOpen, label: "Publications", value: "200+" },
    { icon: Building2, label: "Partenaires", value: "15+" },
    { icon: Trophy, label: "Prix reçus", value: "10+" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center bg-gradient-to-r from-gray-100 to-gray-400">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/grid-pattern.svg')]" />
        <Image
          src="/images/library-bg.jpg"
          alt="CRIDUPN Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">À propos de CRIDUPN</h1>
          <p className="text-xl max-w-2xl leading-relaxed">
            Un centre d'excellence dédié à l'innovation et à la recherche en éducation 
            en République Démocratique du Congo
          </p>
        </div>
      </section>

      <div className="container mx-auto py-20 px-4">
        {/* Mission & Vision */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Notre Mission & Vision</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Notre Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Le CREDUPN est dédié à l'avancement de la recherche en éducation en RDC. 
                  Nous travaillons pour améliorer la qualité de l'enseignement à travers 
                  la recherche, l'innovation et la formation continue.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Notre Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  Devenir un centre d'excellence reconnu en Afrique centrale pour la recherche 
                  en éducation et le développement des pratiques pédagogiques innovantes, 
                  contribuant activement au développement du système éducatif congolais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24 bg-gray-50 py-16 rounded-2xl">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Nos Valeurs</h2>
            <div className="grid md:grid-cols-3 gap-8 px-4">
              {[
                {
                  icon: Star,
                  title: "Excellence",
                  description: "Nous visons l'excellence dans toutes nos activités de recherche et publications."
                },
                {
                  icon: Lightbulb,
                  title: "Innovation",
                  description: "Nous encourageons l'innovation et les approches créatives dans la recherche éducative."
                },
                {
                  icon: HandshakeIcon,
                  title: "Collaboration",
                  description: "Nous favorisons la collaboration entre chercheurs et institutions."
                }
              ].map((value, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <value.icon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-900 rounded-2xl p-12 mb-24 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-4 text-blue-300" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">Notre Localisation</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-medium">Université Pédagogique Nationale</p>
                  <p className="text-gray-600">Croisement de l'avenue Peuple et Maman Yemo</p>
                  <p className="text-gray-600">Kinshasa, République Démocratique du Congo</p>
                </div>
              </div>
              <div className="space-y-2 pl-9">
                <p className="text-gray-700">
                  Email: <span className="text-blue-600 hover:underline">contact@cridupn.cd</span>
                </p>
                <p className="text-gray-700">
                  Tél: <span className="text-blue-600">+243 81 090 1443</span>
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5436426559784!2d15.3118!3d-4.3244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33d43c8280b3%3A0x88439c66032f2cb5!2sUniversit%C3%A9%20P%C3%A9dagogique%20Nationale!5e0!3m2!1sfr!2scd!4v1691234567890!5m2!1sfr!2scd"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}