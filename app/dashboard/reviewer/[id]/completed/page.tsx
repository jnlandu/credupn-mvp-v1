// app/dashboard/reviewer/[id]/completed/page.tsx
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
  ExternalLink
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  const [selectedReview, setSelectedReview] = useState<ReviewedPublication  | null>(null)
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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Évaluations Complétées</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
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
                {filteredReviews.map((review) => (
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
                        className={
                          review.reviewer_decision === 'ACCEPTED'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog 
        open={!!selectedReview} 
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'évaluation</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedReview.title}</h3>
                <p className="text-sm text-gray-500">
                  Évalué le {new Date(selectedReview.reviewed_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Commentaires d'évaluation</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedReview.review_comments}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  asChild
                >
                  <a 
                    href={selectedReview.pdf_url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir le document
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