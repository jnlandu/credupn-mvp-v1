// app/dashboard/reviewer/[id]/reviews/page.tsx
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
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  Download
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Review {
  id: string;
  publication_id: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  created_at: string;
  publications: {
    title: string;
    author: string[] | string;
    abstract?: string;
    pdf_url?: string;
  };
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
    // title
  }

export default function ReviewerReviews({ params }: PageProps) {
  const { id } = use(params)
  const [reviews, setReviews] = useState<ReviewedPublication []>([])
  const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<ReviewedPublication| null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const fetchReviews = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
    
      const { data: reviewPublications} = await supabase
      .from('publications')
      .select(`*`)
      .contains('reviewer_ids', [id])
      .eq('status', 'UNDER_REVIEW')
      .order('created_at', { ascending: false });

      //   if (error) throw error
      setReviews(reviewPublications || []);
  

    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les évaluations"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mes Évaluations</CardTitle>
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
                  <TableHead>Date d'assignation</TableHead>
                  <TableHead>Statut</TableHead>
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
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          review.status === 'COMPLETED'
                            ? 'bg-green-50 text-green-700'
                            : review.status === 'REJECTED'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }
                      >
                        {review.status === 'COMPLETED' && 'Complété'}
                        {review.status === 'REJECTED' && 'Rejeté'}
                        {review.status === 'PENDING' && 'En cours'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                            setSelectedDocument(review);
                            setShowPreviewModal(true);
                        }}
                        >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir le document
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
        {/* // Add preview modal component */}
        <Dialog 
        open={showPreviewModal} 
        onOpenChange={(open) => {
            setShowPreviewModal(open);
            if (!open) setSelectedDocument(null);
        }}
        >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
            </DialogHeader>
            
            {selectedDocument && (
            <div className="space-y-6">
                <h3 className="text-lg font-semibold">{selectedDocument.title}</h3>
                
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
                        href={selectedDocument.pdf_url} 
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
                    data={selectedDocument.pdf_url}
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

                <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <a 
                    href={selectedDocument.pdf_url} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    >
                    <Download className="h-4 w-4 mr-2" />
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