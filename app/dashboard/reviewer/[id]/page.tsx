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
      const totalDays = 30; // Total review period in days
      const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      const daysRemaining = totalDays - daysPassed;
      
      // Progress is the percentage of days that have passed
      const progress = (daysPassed / totalDays) * 100;
  
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

// Add this function to calculate deadline for any publication
const calculateDeadlineForPublication = (createdAt: string) => {
  const startDate = new Date(createdAt);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 30); // 30 days deadline
  
  const now = new Date();
  const totalDays = 30; // Total review period in days
  const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const daysRemaining = totalDays - daysPassed;
  
  // Progress is the percentage of days that have passed
  const progress = (daysPassed / totalDays) * 100;

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    daysRemaining: Math.max(0, daysRemaining),
    progress: Math.min(100, Math.max(0, progress))
  };
};

return (
  <div className="min-h-screen">
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      {/* Stats Overview - Updated for mobile responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold">
                {stats.totalAssigned}
              </div>
              <p className="text-xs md:text-sm text-gray-500">Total assigné</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold text-yellow-700">
                {stats.underReview}
              </div>
              <p className="text-xs md:text-sm text-gray-500">En cours d'évaluation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 sm:col-span-2 md:col-span-1">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold text-green-700">
                {stats.completed}
              </div>
              <p className="text-xs md:text-sm text-gray-500">Évaluations complétées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Updated for mobile responsiveness */}
      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="overview" className="text-xs md:text-base">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-base">À évaluer</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs md:text-base">Complétées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:gap-6">
            {/* Recent Activity and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="px-4 md:px-6 py-3 md:py-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <History className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6 py-0 md:py-0">
                  <div className="space-y-4 md:space-y-6">
                    {reviews.slice(0, 3).map((publication) => (
                      <div 
                        key={publication.id}
                        className="relative pl-5 md:pl-6 pb-4 md:pb-6 last:pb-0 before:absolute before:left-[6px] md:before:left-2 before:top-2 before:h-full before:w-[2px] before:bg-gray-200"
                      >
                        <div className="absolute left-0 top-2 h-3 w-3 md:h-4 md:w-4 rounded-full border-2 border-primary bg-white" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm md:text-base line-clamp-1">{publication.title}</h4>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4">
                            <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                              {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-1.5 py-0.5 md:px-2 md:py-0.5",
                                publication.status === 'UNDER_REVIEW' 
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : publication.status === 'REVIEWED'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-gray-50 text-gray-700'
                              )}
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

              {/* Update the Card component */}
              <Card>
                <CardHeader className="px-4 md:px-6 py-3 md:py-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Délai d'évaluation
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-6 py-0 md:py-0">
                  <div className="space-y-4 md:space-y-6">
                    {toreview.length > 0 ? (
                      <>
                        {(() => {
                          // Calculate deadline for first pending review
                          const pendingPublication = toreview[0];
                          const calculatedDeadline = calculateDeadlineForPublication(pendingPublication.created_at);
                          
                          return (
                            <>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs md:text-sm">
                                  <span className="text-gray-500">Temps restant</span>
                                  <span className={cn(
                                    "font-medium",
                                    calculatedDeadline.daysRemaining <= 5 ? "text-red-500" :
                                    calculatedDeadline.daysRemaining <= 10 ? "text-yellow-500" : 
                                    "text-green-500"
                                  )}>
                                    {calculatedDeadline.daysRemaining} jours
                                  </span>
                                </div>
                                <div className="h-1.5 md:h-2 rounded-full bg-gray-100">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      calculatedDeadline.daysRemaining <= 5 ? "bg-red-500" :
                                      calculatedDeadline.daysRemaining <= 10 ? "bg-yellow-500" : 
                                      "bg-green-500"
                                    )}
                                    style={{ 
                                      width: `${calculatedDeadline.progress}%`
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between text-[10px] md:text-xs text-gray-500">
                                <span>{new Date(calculatedDeadline.startDate).toLocaleDateString('fr-FR')}</span>
                                <span>{new Date(calculatedDeadline.endDate).toLocaleDateString('fr-FR')}</span>
                              </div>

                              <div className="pt-3 md:pt-4 border-t">
                                <div className="text-center text-xs md:text-sm text-gray-500 mb-2">
                                  {calculatedDeadline.daysRemaining <= 5 ? (
                                    <p className="text-red-500 font-medium">Action urgente requise !</p>
                                  ) : calculatedDeadline.daysRemaining <= 10 ? (
                                    <p className="text-yellow-500">Délai approchant</p>
                                  ) : (
                                    <p className="text-green-500">Dans les délais</p>
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full text-xs md:text-sm"
                                  onClick={() => router.push(`/dashboard/reviewer/${id}/pending`)}
                                >
                                  Voir mes évaluations en cours
                                </Button>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <div className="text-center py-6 md:py-8 text-gray-500 text-sm">
                        Aucune évaluation en cours
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader className="px-4 md:px-6 py-3 md:py-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <ClipboardList className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Publications à évaluer
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4">
                {toreview
                  .filter(pub => pub.status === 'UNDER_REVIEW')
                  .map((publication) => (
                    <div 
                      key={publication.id} 
                      className="p-3 md:p-4 border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="space-y-3 md:space-y-4">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0">
                          <div className="space-y-1">
                            <h3 className="text-base md:text-lg font-medium hover:text-primary transition-colors line-clamp-2">
                              {publication.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-gray-500">
                              <div className="flex items-center gap-1 line-clamp-1">
                                Par {Array.isArray(publication.author) 
                                  ? publication.author.join(', ') 
                                  : publication.author}
                              </div>
                              <span className="hidden md:inline">•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                                {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs md:text-sm px-1.5 py-0.5 md:px-2 md:py-0.5 whitespace-nowrap self-start">
                            En cours d'évaluation
                          </Badge>
                        </div>

                        {/* Abstract if available */}
                        {publication.abstract && (
                          <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                            {publication.abstract}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 pt-1 md:pt-2">
                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
                              onClick={() => {
                                setSelectedPublication(publication);
                                setShowPreviewModal(true);
                              }}
                            >
                              <FileText className="h-3 w-3 md:h-4 md:w-4" />
                              Voir le document
                            </Button>
                            <Button 
                              size="sm"
                              className="flex items-center gap-1 md:gap-2 bg-primary hover:bg-primary/90 text-xs md:text-sm h-8 md:h-9 px-2 md:px-3"
                              onClick={() => {
                                setSelectedPublication(publication);
                                setShowReviewModal(true);
                              }}
                            >
                              <ClipboardList className="h-3 w-3 md:h-4 md:w-4" />
                              Commencer l'évaluation
                            </Button>
                          </div>

                          {/* Deadline indicator */}
                          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-500 w-full md:w-auto justify-end">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            {(() => {
                              const deadline = calculateDeadlineForPublication(publication.created_at);
                              return (
                                <span className={cn(
                                  "whitespace-nowrap",
                                  deadline.daysRemaining <= 5 ? "text-red-500 font-medium" :
                                  deadline.daysRemaining <= 10 ? "text-yellow-500" : 
                                  "text-gray-500"
                                )}>
                                  Délai: {deadline.daysRemaining} j
                                </span>
                              );
                            })()}
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
            <CardHeader className="px-4 md:px-6 py-3 md:py-6">
              <CardTitle className="text-base md:text-lg">Évaluations complétées</CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="text-center text-gray-500 py-6 md:py-8 text-sm">
                Historique des évaluations
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    {/* Preview dialog - make responsive */}
    <Dialog 
      open={showPreviewModal} 
      onOpenChange={(open) => {
        setShowPreviewModal(open);
        if (!open) setSelectedPublication(null);
      }}
    >
      <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">Aperçu du document</DialogTitle>
        </DialogHeader>
        
        {selectedPublication && (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-sm md:text-lg font-semibold line-clamp-2">{selectedPublication.title}</h3>
            
            <div className="h-[50vh] md:h-[60vh] border rounded-lg overflow-hidden">
              {isPreviewLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
                </div>
              ) : pdfError ? (
                <div className="h-full flex items-center justify-center flex-col gap-2 px-4 text-center">
                  <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                  <p className="text-sm md:text-base">Impossible de charger le PDF</p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={selectedPublication.pdf_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs md:text-sm"
                    >
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
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

    {/* Review modal - make responsive */}
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="max-w-[90vw] md:max-w-2xl p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">Évaluation de la publication</DialogTitle>
        </DialogHeader>

        {selectedPublication && (
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <h3 className="font-medium text-sm md:text-base line-clamp-2">{selectedPublication.title}</h3>
              <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                Par {Array.isArray(selectedPublication.author) 
                  ? selectedPublication.author.join(', ') 
                  : selectedPublication.author}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <Label className="text-xs md:text-sm">Commentaires d'évaluation</Label>
                <Textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Saisissez vos commentaires..."
                  className="h-32 md:h-40 text-xs md:text-sm"
                />
              </div>

              <div className="space-y-1 md:space-y-2">
                <Label className="text-xs md:text-sm">Décision</Label>
                <div className="flex gap-2 md:gap-4">
                  <Button
                    size="sm"
                    variant={selectedDecision === 'ACCEPTED' ? 'default' : 'outline'}
                    onClick={() => setSelectedDecision('ACCEPTED')}
                    className="text-xs md:text-sm"
                  >
                    <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedDecision === 'REJECTED' ? 'default' : 'outline'}
                    onClick={() => setSelectedDecision('REJECTED')}
                    className="text-xs md:text-sm"
                  >
                    <XCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Rejeter
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReviewModal(false)}
                className="text-xs md:text-sm"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={() => submitReview(selectedPublication.id)}
                disabled={!reviewComments || !selectedDecision || isSubmittingReview}
                className="text-xs md:text-sm"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
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