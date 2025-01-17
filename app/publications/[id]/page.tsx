// app/publications/[id]/page.tsx
import { notFound } from 'next/navigation'
import { publications } from '@/lib/publications'
import PublicationView from './PublicationView'

export async function generateStaticParams() {
  return publications.map((pub) => ({
    id: pub.id,
  }))
}

export default function PublicationPage({ params }: { params: { id: string } }) {
  const publication = publications.find(p => p.id === params.id)
  
  if (!publication) {
    notFound()
  }

  return <PublicationView publication={publication} />
}