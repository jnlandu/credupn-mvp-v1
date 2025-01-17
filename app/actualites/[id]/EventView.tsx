// app/actualites/[id]/EventView.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock 
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location: string
  image: string
  category: string
  attendees?: number
  registration?: boolean
}

const registrationSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  institution: z.string().min(2, "Institution requise"),
})

export default function EventView({ event }: { event: Event }) {
  const [showRegistration, setShowRegistration] = useState(false)
  const { toast } = useToast()
  
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      institution: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      // TODO: Implement API call
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

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/actualites" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux actualités
        </Link>
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[400px]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover rounded-lg"
              />
              <Badge 
                className="absolute top-4 left-4"
                variant="secondary"
              >
                {event.category}
              </Badge>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              <p className="text-gray-700 mb-6">
                {event.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{event.date}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                {event.attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>{event.attendees} participants</span>
                  </div>
                )}
              </div>

              {event.registration && (
                <div className="mt-8">
                  <Button 
                    className="w-full"
                    onClick={() => setShowRegistration(true)}
                  >
                    S'inscrire à l'événement
                  </Button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    L'inscription est requise pour participer
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent>
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
              
              <Button type="submit" className="w-full">
                Confirmer l'inscription
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}