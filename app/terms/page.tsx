// app/terms/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Conditions d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des Conditions</h2>
            <p className="text-gray-700 mb-4">
              En accédant et en utilisant la plateforme CRIDUPN, vous acceptez d'être lié par ces conditions d'utilisation.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Admissibilité</h2>
            <p className="text-gray-700 mb-4">
              Pour utiliser nos services, vous devez :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Être affilié à une institution académique ou de recherche</li>
              <li>Avoir au moins 18 ans</li>
              <li>Fournir des informations exactes et à jour</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Soumission des Publications</h2>
            <p className="text-gray-700 mb-4">
              En soumettant une publication, vous :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Garantissez être l'auteur ou avoir les droits nécessaires</li>
              <li>Acceptez le processus d'évaluation par les pairs</li>
              <li>Respectez les normes académiques et éthiques</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Propriété Intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              Tous les droits de propriété intellectuelle restent la propriété de leurs auteurs respectifs. 
              La publication sur notre plateforme ne constitue pas un transfert de ces droits.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Comportement des Utilisateurs</h2>
            <p className="text-gray-700 mb-4">
              Les utilisateurs s'engagent à :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Respecter les autres utilisateurs</li>
              <li>Ne pas publier de contenu inapproprié ou offensant</li>
              <li>Ne pas compromettre la sécurité de la plateforme</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Modifications des Conditions</h2>
            <p className="text-gray-700 mb-4">
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les modifications entrent en vigueur dès leur publication sur la plateforme.
            </p>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant ces conditions, contactez-nous à :{' '}
              <a 
                href="mailto:contact@cridupn.cd" 
                className="text-primary hover:underline"
              >
                contact@cridupn.cd
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}