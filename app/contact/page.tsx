"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useToast } from "@/hooks/use-toast"
import { Badge } from '@/components/ui/badge'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Implement form submission
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
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
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-gray-900 mix-blend-multiply" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20 border-white/20">
              Centre de Recherche
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à vos questions et vous accompagner dans vos démarches.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: MapPin,
                title: "Adresse",
                content: "Université Pédagogique Nationale, Kinshasa, RDC"
              },
              {
                icon: Mail,
                title: "Email",
                content: "contact@credupn.cd"
              },
              {
                icon: Phone,
                title: "Téléphone",
                content: "+243 81 090 1443"
              },
              {
                icon: Clock,
                title: "Heures d'ouverture",
                content: "Lundi - Vendredi: 8h00 - 16h00\nSamedi: 9h00 - 12h00"
              }
            ].map((item, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map Section */}
          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <Card className="border border-gray-200 shadow-md h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">Envoyez-nous un message</h2>
                  <p className="text-gray-600 mb-6">Complétez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                  <Separator className="mb-6" />
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Nom complet</Label>
                      <Input 
                        id="name" 
                        placeholder="Votre nom" 
                        disabled={isLoading}
                        className="mt-1" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="votre@email.com" 
                        disabled={isLoading} 
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium">Sujet</Label>
                      <Input 
                        id="subject" 
                        placeholder="Sujet de votre message" 
                        disabled={isLoading} 
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Détaillez votre demande ou question ici..." 
                        className="h-32 resize-none mt-1" 
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full mt-2" 
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Map */}
            <div className="md:col-span-3">
              <Card className="border border-gray-200 shadow-md h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">Notre Localisation</h2>
                  <p className="text-gray-600 mb-6">
                    Visitez-nous à l'Université Pédagogique Nationale, un environnement académique propice à la recherche et à l'innovation.
                  </p>
                  <Separator className="mb-6" />
                  
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.8076457466207!2d15.310833776167172!3d-4.338661195657292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a338c4bb7f695%3A0x44c4cb27fd1d0c99!2sUniversit%C3%A9%20P%C3%A9dagogique%20Nationale!5e0!3m2!1sen!2scd!4v1701835138318"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* FAQ or Additional Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Besoin d'aide supplémentaire?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Consultez notre section FAQ pour trouver des réponses aux questions fréquentes ou contactez directement notre équipe pour une assistance personnalisée.
            </p>
            <Button variant="outline" className="mx-auto">
              Consulter la FAQ
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}