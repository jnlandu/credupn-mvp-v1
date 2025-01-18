// types/event.ts
export interface Event {
    id: string
    title: string
    time: string
    description: string
    longDescription: string
    image: string
    location: string
    speakers: string[]
    category: string
    price: string
    registration: boolean
    maxParticipants: number
  }