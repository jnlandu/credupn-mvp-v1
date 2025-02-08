// app/privacy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Politique de Confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Collecte des Informations</h2>
            <p className="text-gray-700 mb-4">
              Nous collectons les informations suivantes lorsque vous utilisez notre plateforme :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Informations d'identification (nom, email, institution)</li>
              <li>Informations professionnelles (spécialisation, publications)</li>
              <li>Données de connexion et d'utilisation</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Utilisation des Données</h2>
            <p className="text-gray-700 mb-4">
              Vos informations sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Gérer votre compte et vos publications</li>
              <li>Améliorer nos services</li>
              <li>Communiquer avec vous concernant vos soumissions</li>
              <li>Assurer le processus d'évaluation par les pairs</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Protection des Données</h2>
            <p className="text-gray-700 mb-4">
              Nous prenons la sécurité de vos données au sérieux et mettons en place des mesures appropriées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Protéger vos informations personnelles</li>
              <li>Prévenir l'accès non autorisé</li>
              <li>Maintenir l'intégrité des données</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Vos Droits</h2>
            <p className="text-gray-700 mb-4">
              Vous disposez des droits suivants concernant vos données :
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Droit d'accès et de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
            </ul>
          </section>

          <Separator className="my-8" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
            <p className="text-gray-700">
              Pour toute question concernant notre politique de confidentialité, contactez-nous à :{' '}
              <a 
                href="mailto:privacy@cridupn.cd" 
                className="text-primary hover:underline"
              >
                privacy@cridupn.cd
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}