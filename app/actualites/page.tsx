"use client"

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from 'next/image'
import Link from 'next/link'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from '@/components/ui/badge'
// import { toast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button'
import { MapPin, Users, Calendar, Clock } from 'lucide-react'
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {events, categories} from '@/lib/events'


export default function ActualitesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const { toast } = useToast()



  // Update schema
  const registrationSchema = z.object({
    name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(10, "Numéro de téléphone invalide"),
    institution: z.string().min(2, "Institution requise"),
    motivation: z.string()
      .min(50, "La motivation doit contenir au moins 50 caractères")
      .max(500, "La motivation ne doit pas dépasser 500 caractères"),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      institution: "",
      motivation: ""
    }
  })

 
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      institution: "",
    }
  })

  const onSubmit = async (data) => {
    try {
      // TODO: Implement API call to save registration
      console.log('Registration data:', data)
      toast({
        title: "Inscription réussie!",
        description: "Vous recevrez un email de confirmation.",
      })
      setShowRegistration(false)
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Erreur",
        description: "L'inscription a échoué. Veuillez réessayer.",
      })
    }
  }

  const filteredEvents = events.filter(event => 
    selectedCategory === "Tous" || event.category === selectedCategory
  )


  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Actualités</h1>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedCategory(category)}
            >
              {category}s
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid gap-8">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <Badge className="absolute top-4 left-4 z-10">
                  {event.category}
                </Badge>
              </div>
              <div className="md:col-span-2 p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {event.price}
                    </Badge>
                    {event.registration && (
                      <Badge variant="secondary" className="text-xs">
                        Inscription requise
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {event.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.maxParticipants} participants max
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-700 mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Intervenants:</h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {event.speakers.map((speaker, idx) => (
                          <li key={idx}>{speaker}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={() => setSelectedEvent(event)}>
                      Voir les détails
                    </Button>
                      {event.registration && (
                        <Button 
                          variant="outline"
                          onClick={() => setShowRegistration(true)}
                        >
                          S'inscrire
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-gray-500" />
                  <span>{selectedEvent.attendees} participants</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p>{selectedEvent.longDescription || selectedEvent.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Intervenants:</h3>
                <ul className="list-disc list-inside">
                  {selectedEvent.speakers.map((speaker, idx) => (
                    <li key={idx}>{speaker}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>


        {/* Registration Dialog  */}
      </Dialog>
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Inscription à l'événement</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+243..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre institution" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        {/* // Add inside form component after other fields */}
            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre motivation pour participer à cet événement... (500 caractères max)"
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-gray-500 text-right">
                    {field.value?.length}/500 caractères
                  </div>
                </FormItem>
              )}
            />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRegistration(false)}>
                  Annuler
                </Button>
                <Button type="submit">S'inscrire</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </div>
    
  )
}