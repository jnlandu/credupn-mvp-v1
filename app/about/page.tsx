import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">À propos de CREDUPN</h1>
      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
            <p className="text-gray-700">
              Le Centre de Recherche pour le Développement de l'Université Pédagogique Nationale (CREDUPN) 
              est dédié à l'avancement de la recherche en éducation en République Démocratique du Congo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Notre Vision</h2>
            <p className="text-gray-700">
              Devenir un centre d'excellence reconnu en Afrique centrale pour la recherche en éducation
              et le développement des pratiques pédagogiques innovantes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Notre Équipe</h2>
            <p className="text-gray-700">
              Notre équipe est composée de chercheurs passionnés et expérimentés dans divers domaines
              de l'éducation et du développement social.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}