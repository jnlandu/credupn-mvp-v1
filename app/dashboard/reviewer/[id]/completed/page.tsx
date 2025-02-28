"use client"

import { use, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Search,
  FileText,
  CheckCircle2,
  Calendar,
  Loader2,
  ExternalLink,
  Download
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ReviewedPublication {
    id: string;
    title: string;
    author: string[] | string;
    status: string;
    created_at: string;
    reviewer_decision: 'ACCEPTED' | 'REJECTED';
    review_comments: string;
    reviewed_at: string;
    abstract?: string;
    pdf_url?: string;
    reviewer_ids?: string[];
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default function CompletedReviews({ params }: PageProps)  {
  const { id } = use(params)
  const [reviews, setReviews] = useState<ReviewedPublication []>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState<ReviewedPublication | null>(null)
  const { toast } = useToast()

  const fetchCompletedReviews = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`*`)
        .contains('reviewer_ids', [id])
        .eq('status', 'REVIEWED')
        .order('reviewed_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])

    } catch (error) {
      console.error('Error fetching completed reviews:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les évaluations complétées"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletedReviews()
  }, [id])

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <Card>
        <CardHeader className="px-4 md:px-6 py-3 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-base md:text-lg">Évaluations Complétées</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-3 w-3 md:h-4 md:w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 h-9 text-xs md:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          {isLoading ? (
            <div className="flex justify-center py-6 md:py-8">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Desktop view: Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Publication</TableHead>
                      <TableHead>Date d'évaluation</TableHead>
                      <TableHead>Décision</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                          Aucune évaluation complétée trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">
                            {review.title}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {new Date(review.reviewed_at).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                review.reviewer_decision === 'ACCEPTED'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-700'
                              )}
                            >
                              {review.reviewer_decision === 'ACCEPTED' ? 'Accepté' : 'Rejeté'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReview(review)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Voir les détails
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile view: Card list */}
              <div className="md:hidden space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    Aucune évaluation complétée trouvée
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm line-clamp-2">{review.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-2 whitespace-nowrap text-xs",
                            review.reviewer_decision === 'ACCEPTED'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          )}
                        >
                          {review.reviewer_decision === 'ACCEPTED' ? 'Accepté' : 'Rejeté'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(review.reviewed_at).toLocaleDateString('fr-FR')}
                      </div>

                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-8"
                          onClick={() => setSelectedReview(review)}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Voir les détails
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog 
        open={!!selectedReview} 
        onOpenChange={(open) => {
          if (!open) setSelectedReview(null);
        }}
      >
        <DialogContent className="max-w-[90vw] md:max-w-3xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Détails de l'évaluation</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-sm md:text-lg font-semibold line-clamp-2">{selectedReview.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Évalué le {new Date(selectedReview.reviewed_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="space-y-1 md:space-y-2">
                <h4 className="text-sm md:text-base font-medium">Commentaires d'évaluation</h4>
                <div className="border rounded-md p-3 md:p-4 text-xs md:text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 max-h-[40vh] overflow-y-auto">
                  {selectedReview.review_comments || "Aucun commentaire"}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  asChild
                >
                  <a 
                    href={selectedReview.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Voir le document
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  asChild
                >
                  <a 
                    href={selectedReview.pdf_url} 
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Télécharger
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}