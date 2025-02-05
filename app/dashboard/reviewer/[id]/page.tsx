// app/dashboard/reviewer/[id]/page.tsx
"use client"

import { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  ChartBar,
  UserCheck, 
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

interface Review {
  id: string
  publication_id: string
  reviewer_id: string,
  reviewer_name: string[] | [] //author
  reviewer_title: string //title
  sent_date: string
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  comments?: string
  created_at: string
  updated_at: string
  publication: {
    title: string
    author: string[] | string
  }
}
interface ReviewerStats {
  totalReviews: number
  pendingReviews: number
  completedReviews: number
  rejectedReviews: number
}
interface DatabaseError {
  code?: string
  message?: string
  details?: string
  hint?: string
}

interface PageProps {
  params: Promise<{ id: string }>
}
export default function ReviewerDashboard({ params }: PageProps) {
  // const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewerStats>({
    totalReviews: 0,
    pendingReviews: 0,
    completedReviews: 0,
    rejectedReviews: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()
  const { id } = use(params)

  // Mock data
  const reviewerStats = {
    totalReviews: 15,
    pendingReviews: 3,
    completedReviews: 10,
    rejectedReviews: 2
  }

  const fetchReviewsAndStats = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          publication:publications (
            title,
            author
          )
        `)
        .eq('reviewer_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(reviews)

      // Calculate stats
      const stats = {
        totalReviews: reviews.length,
        pendingReviews: reviews.filter(r => r.status === 'PENDING').length,
        completedReviews: reviews.filter(r => r.status === 'COMPLETED').length,
        rejectedReviews: reviews.filter(r => r.status === 'REJECTED').length
      }

      setStats(stats)
    } catch (error) {
      const err = error as DatabaseError
      console.error('Error fetching reviews:', {
        code: err.code,
        message: err.message,
        details: err.details,
        hint: err.hint
      })
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les évaluations"
      })
    } finally {
      setIsLoading(false)
    }
  }
  // Initial fetch and real-time subscription
  useEffect(() => {
    fetchReviewsAndStats()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `reviewer_id=eq.${id}`
        },
        () => {
          fetchReviewsAndStats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const pendingReviews = reviews.filter(review => review.status === 'PENDING')
  const completedReviews = reviews.filter(review => review.status === 'COMPLETED')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Évaluateur</h1>
            <p className="text-gray-500">Gérez vos évaluations et suivez leurs statuts</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total des évaluations</p>
                  <p className="text-2xl font-bold">{reviewerStats.totalReviews}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">En attente</p>
                  <p className="text-2xl font-bold">{reviewerStats.pendingReviews}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Complétées</p>
                  <p className="text-2xl font-bold">{reviewerStats.completedReviews}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejetées</p>
                  <p className="text-2xl font-bold">{reviewerStats.rejectedReviews}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="pending">À évaluer</TabsTrigger>
            <TabsTrigger value="completed">Complétées</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{review.reviewer_title}</h3>
                        <p className="text-sm text-gray-500">
                          Par {review.reviewer_name} • Envoyé le {new Date(review.sent_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Évaluer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques d'évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <ChartBar className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 ml-2">Graphique des évaluations</p>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Publications à évaluer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="py-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{review.reviewer_title}</h3>
                          <p className="text-sm text-gray-500">
                            Par {review.reviewer_name} • Soumis le {new Date(review.sent_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant="outline">En attente</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir le document
                        </Button>
                        <Button size="sm">
                          Commencer l'évaluation
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations complétées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  Historique des évaluations
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}