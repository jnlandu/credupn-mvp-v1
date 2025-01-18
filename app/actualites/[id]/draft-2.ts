import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { events } from '../page'



interface PageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: PageProps) {
  const event = events.find(e => e.id === params.id)
  
  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/actualites" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux actualités
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <Badge className="absolute top-4 left-4 z-10">
              {event.category}
            </Badge>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
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
            <p className="text-gray-700 whitespace-pre-line">
              {event.longDescription}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Intervenants</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {event.speakers.map((speaker, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{speaker}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Informations</h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Prix:</strong> {event.price}
                  </p>
                  <p>
                    <strong>Places disponibles:</strong> {event.maxParticipants}
                  </p>
                  <p>
                    <strong>Lieu:</strong> {event.location}
                  </p>
                </div>
              </div>

              {event.registration && (
                <div>
                  <Button className="w-full">S'inscrire à l'événement</Button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    L'inscription est requise pour participer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}