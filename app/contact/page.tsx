"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

import { useToast } from "@/hooks/use-toast"


export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Implement form submission
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Contactez-nous</h1>
        <p className="text-gray-600 text-center mb-12">
          Nous sommes là pour répondre à vos questions et vous accompagner dans vos démarches.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Informations</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-gray-600">
                        Université Pédagogique Nationale<br />
                        Kinshasa, RDC
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">contact@credupn.cd</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-gray-600">+243 81 090 1443</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Heures d'ouverture</h3>
                      <p className="text-gray-600">
                        Lundi - Vendredi: 8h00 - 16h00<br />
                        Samedi: 9h00 - 12h00
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Votre nom" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="Sujet de votre message" disabled={isLoading} />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Votre message" 
                    className="h-32 resize-none" 
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map or Additional Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Notre Localisation</h2>
            <div className="aspect-video bg-gray-100 rounded-lg">
              {/* Add map component or embed here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}