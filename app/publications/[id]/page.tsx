// app/publications/[id]/page.tsx
"use client"

import { use, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Calendar, Users, BookMarked, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Giscus from '@giscus/react'


interface Comment {
  id: string;
  user_id: string;
  publication_id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
  }
}

interface Publication {
  id: string;
  title: string;
  abstract: string;
  author: string[] | string | null;
  created_at: string;
  category: string;
  type: string;
  doi?: string;
  isbn?: string;
  citations?: number;
  keywords: string[] | null;
  pdf_url?: string;
  is_restricted?: boolean;
}

interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}
interface PageProps {
  params: Promise<{ id: string }>
}

export default function PublicationPage({ params }: PageProps) {
  const [publication, setPublication] = useState<Publication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adjacentPubs, setAdjacentPubs] = useState<{ prev: string | null; next: string | null }>({
    prev: null,
    next: null
  })

  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { id } = use(params)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchPublication = async () => {
      const supabase = createClient()
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        setPublication(data)
      } catch (error) {
        console.error('Error fetching publication:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la publication"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublication()
  }, [id])

  const fetchAdjacentPublications = async () => {
    const supabase = createClient()
    
    try {
      // Get previous publication
      const { data: prevData } = await supabase
        .from('publications')
        .select('id, title')
        .lt('created_at', publication?.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
  
      // Get next publication
      const { data: nextData } = await supabase
        .from('publications')
        .select('id, title')
        .gt('created_at', publication?.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
  
      setAdjacentPubs({
        prev: prevData?.id || null,
        next: nextData?.id || null
      })
    } catch (error) {
      console.error('Error fetching adjacent publications:', error)
    }
  }

  useEffect(() => {
    if (publication) {
      fetchAdjacentPublications()
    }
  }, [publication])


  // useEffect(() => {
  //   const fetchComments = async () => {
  //     const supabase = createClient()
      
  //     try {
  //       const { data, error } = await supabase
  //       .from('comments')
  //       .select(`
  //         *,
  //         users!comment_user_id(
  //           name
  //         )
  //       `)
  //       .eq('publication_id', id)
  //       .order('created_at', { ascending: false })
  
  //       if (error) {
  //         console.error('Supabase error details:', {
  //           code: error.code,
  //           message: error.message,
  //           details: error.details,
  //           hint: error.hint
  //         })
  //         throw error
  //       }
  
  //       setComments(data || [])
  //     } catch (error) {
  //       const err = error as DatabaseError
  //       console.error('Error fetching comments:', {
  //         code: err.code,
  //         message: err.message,
  //         details: err.details,
  //         hint: err.hint
  //       })
        
  //       toast({
  //         variant: "destructive",
  //         title: "Erreur",
  //         description: `Impossible de charger les commentaires: ${err.message}, ${err.details}`
  //       })
  //     }
  //   }
  
  //   fetchComments()
  
  //   // Set up real-time subscription
  //   const supabase = createClient()
  //   const channel = supabase
  //     .channel('comments')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'comments',
  //         filter: `publication_id=eq.${id}`
  //       },
  //       () => {
  //         fetchComments()
  //       }
  //     )
  //     .subscribe()
  
  //   return () => {
  //     supabase.removeChannel(channel)
  //   }
  // }, [id, toast])


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Publication non trouvée</h1>
          <p className="text-gray-600">Cette publication n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Publication Details */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{publication.category}</Badge>
                <Badge variant="secondary">{publication.type}</Badge>
                {publication.doi && (
                  <Badge variant="outline">DOI: {publication.doi}</Badge>
                )}
                {publication.isbn && (
                  <Badge variant="outline">ISBN: {publication.isbn}</Badge>
                )}
              </div>
              <CardTitle className="text-3xl">{publication.title}</CardTitle>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {Array.isArray(publication.author) 
                    ? publication.author.join(", ")
                    : publication.author ?? "Auteur inconnu"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(publication.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
                {publication.citations! > 0 && (
                  <div className="flex items-center gap-1">
                    <BookMarked className="h-4 w-4" />
                    {publication.citations} citation{publication.citations! > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Résumé</h2>
                <p className="text-gray-300">{publication.abstract}</p>
              </div>
              
              {publication.keywords && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Mots-clés</h2>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/*  Adjancent navigation */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              disabled={!adjacentPubs.prev}
              onClick={() => adjacentPubs.prev && router.push(`/publications/${adjacentPubs.prev}`)}
            >
              ← Publication précédente
            </Button>
            <Button
              variant="outline"
              disabled={!adjacentPubs.next}
              onClick={() => adjacentPubs.next && router.push(`/publications/${adjacentPubs.next}`)}
            >
              Publication suivante →
            </Button>
          </div>
          {/*  Comments */}
          <Card className="mt-8">
    <CardHeader>
      <CardTitle>Commentaires</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Comment Form */}
      <div className="space-y-4">
        <textarea
          className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e: any) => setNewComment(e.target.value)}
        />
        <Button 
          onClick={async () => {
            if (!newComment.trim()) return
            
            setIsSubmitting(true)
            const supabase = createClient()
            
            try {
              const { data: { user } } = await supabase.auth.getUser()
              if (!user) throw new Error('Not authenticated')

              const { error } = await supabase
                .from('comments')
                .insert({
                  publication_id: id,
                  user_id: user.id,
                  content: newComment.trim()
                })

              if (error) throw error

              setNewComment('')
              toast({
                title: "Succès",
                description: "Commentaire ajouté"
              })
            } catch (error) {
              console.error('Error posting comment:', error)
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'ajouter le commentaire"
              })
            } finally {
              setIsSubmitting(false)
            }
          }}
          disabled={!newComment.trim() || isSubmitting}
        >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi...
          </>
        ) : (
          'Commenter'
        )}
      </Button>
    </div>   
    </CardContent>
  </Card>
  </div>
      

        {/* Right Column - PDF Preview */}
        {publication.pdf_url && !publication.is_restricted && (
          <div className="lg:sticky lg:top-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document complet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
                  <iframe
                    src={publication.pdf_url}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                </div>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <a 
                      href={publication.pdf_url} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}