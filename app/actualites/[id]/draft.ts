// app/actualites/[id]/page.tsx
import { notFound } from 'next/navigation'
import { events } from '@/lib/events'
import EventView from './EventView'




// Type for the params
type Props = {
  params: {
    id: string
  }
}

// Remove async from function
export function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }))
}


// Make it a regular function, not async
export default function EventPage({ params }: Props) {
  // Find event synchronously
  const event = events.find(e => e.id === params.id)
  
  if (!event) {
    notFound()
  }

  return <EventView event={event} />
}