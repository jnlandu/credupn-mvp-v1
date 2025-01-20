import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Users, BookOpen, Trophy } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Chercheurs", value: "50+" },
    { icon: BookOpen, label: "Publications", value: "200+" },
    { icon: Building2, label: "Partenaires", value: "15+" },
    { icon: Trophy, label: "Prix reçus", value: "10+" },
  ]

  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center">
        <Image
          src="/images/library-bg.jpg"
          alt="CRIDUPN Logo"
          fill
          className="object-cover brightness-50"
        />
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-5xl font-bold mb-4">À propos de CRIDUPN</h1>
          <p className="text-xl max-w-2xl">
            Centre d'excellence en recherche en République Démocratique du Congo
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Le CREDUPN est dédié à l'avancement de la recherche en éducation en RDC. 
                Nous travaillons pour améliorer la qualité de l'enseignement à travers 
                la recherche, l'innovation et la formation continue.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Notre Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                Devenir un centre d'excellence reconnu en Afrique centrale pour la recherche 
                en éducation et le développement des pratiques pédagogiques innovantes, 
                contribuant activement au développement du système éducatif congolais.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "Nous visons l'excellence dans toutes nos activités de recherche et publications."
              },
              {
                title: "Innovation",
                description: "Nous encourageons l'innovation et les approches créatives dans la recherche éducative."
              },
              {
                title: "Collaboration",
                description: "Nous favorisons la collaboration entre chercheurs et institutions."
              }
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-black" />
                <div className="text-3xl font-bold mb-1 text-black">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Notre Localisation</h2>
          <p className="text-gray-700 mb-2">Université Pédagogique Nationale</p>
          <p className="text-gray-700 mb-2">Kinshasa, République Démocratique du Congo</p>
          <p className="text-gray-700">
            Email: contact@cridupn.cd<br />
            Tél: +243  81 090 1443
          </p>
        </div>
      </div>
    </div>
  )
}