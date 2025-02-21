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
  Loader2,
  Calendar,
  History,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'



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

interface ReviewDeadline {
  startDate: string;
  endDate: string;
  daysRemaining: number;
  progress: number;
}

interface DatabaseError {
  code?: string
  message?: string
  details?: string
  hint?: string
}

interface ReviewerStats {
  totalAssigned: number;
  underReview: number;
  completed: number;
  rejected: number;
}

interface ReviewerPublication {
  id: string;
  title: string;
  author: string[] | string;
  status: string;
  created_at: string;
  abstract?: string;
  pdf_url?: string;
  comments?: string;
  reviewer_id: string,
}

interface ReviewedPublication {
  id: string;
  title: string;
  author: string[] | string;
  status: string;
  created_at: string;
  abstract?: string;
  pdf_url?: string;
  reviewer_ids?: string[];
}

// First update the ReviewDeadline interface
interface ReviewDeadline {
  startDate: string;
  endDate: string;
  daysRemaining: number;
  progress: number;
}

interface PageProps {
  params: Promise<{ id: string }>
}


export default function ReviewerDashboard({ params }: PageProps) {
  // const [activeTab, setActiveTab] = useState('overview')
  const [reviews, setReviews] = useState<ReviewerPublication[]>([])
  const [toreview, setToreview] = useState<ReviewedPublication[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<ReviewedPublication | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<'ACCEPTED' | 'REJECTED' | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const [pdfError, setPdfError] = useState(false);
    const [stats, setStats] = useState<ReviewerStats>({
    totalAssigned: 0,
    underReview: 0,
    completed: 0,
    rejected: 0
  })

  const [deadline, setDeadline] = useState<ReviewDeadline>({
    startDate: new Date().toISOString(), // Current date as start
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    daysRemaining: 30,
    progress: 0
  });
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = use(params)

  const fetchReviewsAndStats = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Get assigned publications
        const { data: publications, error } = await supabase
        .from('publications')
        .select(`*`)
        .contains('reviewer_ids', [id])
        .order('created_at', { ascending: false });

      if (error) throw error
        // Get assigned publications
        const { data: reviewPublications} = await supabase
        .from('publications')
        .select(`*`)
        .contains('reviewer_ids', [id])
        .eq('status', 'UNDER_REVIEW')
        .order('created_at', { ascending: false });

      // Calculate stats
      const stats = {
        totalAssigned: publications.length,
        underReview: publications.filter(p => p.status === 'UNDER_REVIEW').length,
        completed: publications.filter(p => p.status === 'REVIEWED').length,
        rejected: publications.filter(p => p.status === 'REJECTED').length
      };

      setReviews(publications);
      setToreview(reviewPublications || []); // Now properly typed
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

  const submitReview = async (publicationId: string) => {
    setIsSubmittingReview(true);
    const supabase = createClient();
  
    try {
      // Then update publication status
      const { error: updateError } = await supabase
        .from('publications')
        .update({
          status: 'REVIEWED',
          review_comments: reviewComments,
          review_decision: selectedDecision,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', publicationId);
  
      if (updateError) throw updateError;

      
  
      // Create notification for author
      const { error: notifyError } = await supabase
        .from('notifications')
        .insert({
          type: 'REVIEW_COMPLETED',
          user_id: id,
          title: 'Évaluation terminée',
          message: `Votre publication "${selectedPublication?.title}" a été évaluée.`,
          publication_id: publicationId,
          created_at: new Date().toISOString(),
          read: false,
          reference_code: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
  
      if (notifyError) throw notifyError;
  
      toast({
        title: "Succès",
        description: "Évaluation soumise avec succès"
      });
  
      setShowReviewModal(false);
      setReviewComments('');
      setSelectedDecision(null);
      fetchReviewsAndStats();
  
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de soumettre l'évaluation"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Add useEffect to calculate days remaining
useEffect(() => {
  const calculateDeadline = () => {
    const startDate = new Date(selectedPublication?.created_at || new Date());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 30); // 30 days deadline
    
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    const progress = ((30 - daysRemaining) / 30) * 100;

    setDeadline({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysRemaining: Math.max(0, daysRemaining),
      progress: Math.min(100, Math.max(0, progress))
    });
  };

  calculateDeadline();
}, [selectedPublication]);
  
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
        {/* Stats Overview */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl font-bold">
                        {stats.totalAssigned} 
                        {/* > 0 
                          ? Math.round((stats.completed / stats.totalAssigned) * 100)
                          : 0}% */}
                      </div>
                      <p className="text-sm text-gray-500">Total assigné </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl font-bold text-yellow-700">
                        {stats.underReview}
                      </div>
                      <p className="text-sm text-gray-500">En cours d'évaluation</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl font-bold text-green-700">
                        {stats.completed}
                      </div>
                      <p className="text-sm text-gray-500">Évaluations complétées</p>
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
            <div className="grid gap-6">
              {/* Recent Activity and Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((publication) => (
                        <div 
                          key={publication.id}
                          className="relative pl-6 pb-6 last:pb-0 before:absolute before:left-2 before:top-2 before:h-full before:w-[2px] before:bg-gray-200"
                        >
                          <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary bg-white" />
                          <div className="space-y-1">
                            <h4 className="font-medium line-clamp-1">{publication.title}</h4>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={
                                  publication.status === 'UNDER_REVIEW' 
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : publication.status === 'REVIEWED'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-gray-50 text-gray-700'
                                }
                              >
                                {publication.status === 'UNDER_REVIEW' ? 'En cours' : 
                                publication.status === 'REVIEWED' ? 'Complété' : 'En attente'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* // Update the Card component */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Délai d'évaluation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Temps restant</span>
                              <span className={cn(
                                  "font-medium",
                                  deadline.daysRemaining <= 5 ? "text-red-500" :
                                  deadline.daysRemaining <= 10 ? "text-yellow-500" : 
                                  "text-green-500"
                                )}>
                                  {deadline.daysRemaining} jours
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  deadline.daysRemaining <= 5 ? "bg-red-500" :
                                  deadline.daysRemaining <= 10 ? "bg-yellow-500" : 
                                  "bg-green-500"
                                )}
                                style={{ 
                                  width: `${deadline.progress}%`
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{new Date(deadline.startDate).toLocaleDateString('fr-FR')}</span>
                            <span>{new Date(deadline.endDate).toLocaleDateString('fr-FR')}</span>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="text-center text-sm text-gray-500 mb-2">
                              {deadline.daysRemaining <= 5 ? (
                                <p className="text-red-500 font-medium">Action urgente requise !</p>
                              ) : deadline.daysRemaining <= 10 ? (
                                <p className="text-yellow-500">Délai approchant</p>
                              ) : (
                                <p className="text-green-500">Dans les délais</p>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => router.push(`/dashboard/reviewer/${id}/pending`)}
                            >
                              Voir mes évaluations en cours
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Publications à évaluer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {toreview
                  .filter(pub => pub.status === 'UNDER_REVIEW')
                  .map((publication) => (
                    <div 
                      key={publication.id} 
                      className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-lg font-medium hover:text-primary transition-colors">
                              {publication.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                Par {Array.isArray(publication.author) 
                                  ? publication.author.join(', ') 
                                  : publication.author}
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            En cours d'évaluation
                          </Badge>
                        </div>

                        {/* Abstract if available */}
                        {publication.abstract && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {publication.abstract}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              setSelectedPublication(publication);
                              setShowPreviewModal(true);
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            Voir le document
                          </Button>
                          <Button 
                              size="sm"
                              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                              onClick={() => {
                                setSelectedPublication(publication);
                                setShowReviewModal(true);
                              }}
                            >
                              <ClipboardList className="h-4 w-4" />
                              Commencer l'évaluation
                            </Button>
                          </div>

                          {/* Deadline indicator */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Délai: 30 jours restants</span>
                          </div>
                        </div>
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
      {/*  Preview of the document to evaluate */}
      {/* // Add document preview modal component */}
      <Dialog 
        open={showPreviewModal} 
        onOpenChange={(open) => {
          setShowPreviewModal(open);
          if (!open) setSelectedPublication(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          
          {selectedPublication && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">{selectedPublication.title}</h3>
              
              <div className="h-[60vh] border rounded-lg overflow-hidden">
                {isPreviewLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : pdfError ? (
                  <div className="h-full flex items-center justify-center flex-col gap-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p>Impossible de charger le PDF</p>
                    <Button variant="outline" asChild>
                      <a 
                        href={selectedPublication.pdf_url} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir dans un nouvel onglet
                      </a>
                    </Button>
                  </div>
                ) : (
                  <object
                    data={selectedPublication.pdf_url}
                    type="application/pdf"
                    className="w-full h-full"
                    onLoad={() => {
                      setIsPreviewLoading(false);
                      setPdfError(false);
                    }}
                    onError={() => {
                      setIsPreviewLoading(false);
                      setPdfError(true);
                    }}
                  >
                    <p>Le PDF ne peut pas être affiché</p>
                  </object>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    {/*// Add review modal component  */}

    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Évaluation de la publication</DialogTitle>
    </DialogHeader>

    {selectedPublication && (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">{selectedPublication.title}</h3>
          <p className="text-sm text-gray-500">
            Par {Array.isArray(selectedPublication.author) 
              ? selectedPublication.author.join(', ') 
              : selectedPublication.author}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Commentaires d'évaluation</Label>
            <Textarea
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              placeholder="Saisissez vos commentaires..."
              className="h-40"
            />
          </div>

          <div className="space-y-2">
            <Label>Décision</Label>
            <div className="flex gap-4">
              <Button
                variant={selectedDecision === 'ACCEPTED' ? 'default' : 'outline'}
                onClick={() => setSelectedDecision('ACCEPTED')}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accepter
              </Button>
              <Button
                variant={selectedDecision === 'REJECTED' ? 'default' : 'outline'}
                onClick={() => setSelectedDecision('REJECTED')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReviewModal(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={() => submitReview(selectedPublication.id)}
            disabled={!reviewComments || !selectedDecision || isSubmittingReview}
          >
            {isSubmittingReview ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              'Soumettre l\'évaluation'
            )}
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


    </div>
  )
}