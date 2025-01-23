// app/publications/[id]/page.tsx
import { notFound } from 'next/navigation'
import { publications } from '@/lib/publications'
import PublicationView from './PublicationView'

export async function generateStaticParams() {
  const validPublications = publications.filter(pub => pub && pub.id)
  return validPublications.map((pub) => ({
    id: pub.id,
  }))
}

interface PageProps {
  params: {
    id: string
  }
}
export default async function PublicationPage({ params }: PageProps) {
 
  try {
    const { id } =  await params
    const publication = publications.find(p => p.id === id)
    
    if (!publication) {
      notFound()
    }

    return <PublicationView publication={publication} />
  } catch (error) {
    console.error('Error fetching publication:', error)
    notFound()
  }
}