import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, FileText, GraduationCap,ScrollText } from 'lucide-react'
import { 
  Upload, 
  UserCheck, 
  FileEdit, 
} from 'lucide-react'
// import Footer  from '@/components/footer'


export default function Home() {
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
            Centre de Recherche  Interdisciplinaire <br/>
            CRIDUPN
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mt-0">
            Excellence en recherche pour le développement de l'éducation en République Démocratique du Congo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/publications">Nos Publications</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm">
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
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
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
            <Button asChild variant="outline">
              <Link href="/publications">Voir toutes les publications</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Titre de la publication {index + 1}
                  </CardTitle>
                  <CardDescription>
                    Auteur(s) • {new Date().toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

{/* Call for Papers Section */}
<section className="py-4 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4 text-black">Appel à publications</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        CRIDUPN accepte les soumissions de recherches originales dans tous les domaines. 
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
        <Button asChild variant="outline">
          <Link href="/publications/soumettre">Soumettre un article</Link>
        </Button>
      </Card>
      <Card className="text-center p-6">
        <div className="mb-4">
          <BookOpen className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="font-bold mb-2">Livres</h3>
        <p className="text-gray-600 mb-4">Publiez vos ouvrages académiques</p>
        <Button asChild variant="outline">
          <Link href="/soumission">Proposer un livre</Link>
        </Button>
      </Card>
      <Card className="text-center p-6">
        <div className="mb-4">
          <ScrollText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="font-bold mb-2">Rapports</h3>
        <p className="text-gray-600 mb-4">Partagez vos rapports de recherche</p>
        <Button asChild variant="outline">
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
      {[
        {
          step: 1,
          icon: Upload,
          title: "Soumission",
          description: "Envoyez votre manuscrit via notre plateforme en ligne"
        },
        {
          step: 2,
          icon: UserCheck,
          title: "Évaluation",
          description: "Examen par les pairs experts du domaine"
        },
        {
          step: 3,
          icon: FileEdit,
          title: "Révision",
          description: "Modifications basées sur les retours des évaluateurs"
        },
        {
          step: 4,
          icon: BookOpen,
          title: "Publication",
          description: "Publication finale après validation"
        }
      ].map((step) => (
        <div key={step.step} className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
            {/* <span className="text-black">{step.step} </span> */}
            <step.icon className="h-6 w-6 text-black" />
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
      {[
        {
          name: "Prof. Dr Jean-Paul Yawidi Mayinzambi",
          title: "Directeur  et Rédacteur en Chef",
          image: "/images/yawidi.jpg",
          specialization: "Sciences de l'Éducation",
          institution: "Université Pédagogique Nationale",
          bio: "Professeur titulaire spécialisé en méthodologie de recherche éducative à l'UPN. Directeur de plusieurs thèses doctorales.",
        },
        {
          name: "Prof. Dr Mayala Lemba Francis",
          title: "Chargé de Recherche  ",
          image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80",
          specialization: "Psychologie de l'Éducation",
          institution: "CREDUPN",
          bio: "Docteure en psychologie éducative, experte en développement cognitif et apprentissage dans le contexte congolais.",
        },
        {
          name: "Chef de Travaux Jean Mathy Ilunga",
          title: "Sécretaire",
          image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80",
          specialization: "Politique Éducative",
          institution: "Université de Kinshasa",
          bio: "Spécialiste des politiques éducatives en RDC, consultant pour plusieurs projets de réforme éducative.",
        }
      ].map((reviewer, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative h-64">
            <Image
              src={reviewer.image}
              alt={reviewer.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-1">{reviewer.name}</h3>
            <p className="text-primary font-semibold mb-2">{reviewer.title}</p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Spécialisation:</span> {reviewer.specialization}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Institution:</span> {reviewer.institution}
            </p>
            <p className="text-sm text-gray-700">{reviewer.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


{/* Testimonials Section */}
<section className="py-4 px-4 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-black mb-12">Témoignages</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          name: "Dr. Jean Mukendi",
          role: "Chercheur en Sciences de l'Éducation",
          comment: "CREDUPN offre un processus de publication rigoureux et professionnel. L'accompagnement éditorial est excellent.",
          image: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&q=80"
        },
        {
          name: "Prof. Marie Kabongo",
          role: "Professeure en Pédagogie",
          comment: "Une revue de qualité qui contribue significativement à la recherche en éducation en RDC.",
          image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?auto=format&fit=crop&q=80"
        },
        {
          name: "Dr. Paul Ntumba",
          role: "Auteur et Chercheur",
          comment: "La plateforme idéale pour partager ses recherches avec la communauté académique africaine.",
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80"
        }
      ].map((testimonial, index) => (
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