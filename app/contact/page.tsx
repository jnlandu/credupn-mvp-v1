import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Nous Contacter</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Votre nom" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Votre message" className="h-32" />
              </div>
              <Button type="submit" className="w-full">Envoyer</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Coordonnées</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="text-gray-700">123 Avenue de l'Université<br />Kinshasa, RDC</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-700">contact@credupn.cd</p>
              </div>
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p className="text-gray-700">+243 123 456 789</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}