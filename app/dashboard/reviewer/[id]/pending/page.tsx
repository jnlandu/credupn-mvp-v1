// app/dashboard/reviewer/[id]/pending/page.tsx
"use client"

import { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'
import { 
    Search, 
    Eye, 
    FileText, 
    Calendar, 
    ChevronLeft, 
    ChevronRight } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'






interface PageProps {
    params: Promise<{ id: string }>
  }

interface PendingReview {
  id: string
  title: string
  author: string
  submittedDate: string
  category?: string
  abstract: string
  status?: string,
  pdfUrl: string
}

export default function PendingReviews({ params }: PageProps) {
  const { id } = use(params) // Unwrap params using React.use()
  const [searchTerm, setSearchTerm] = useState('')
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null)
  const { toast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)


  

  // Mock data - replace with API call
  const pendingReviews: PendingReview[] = [
    {
      id: 'rev-1',
      title: "L'impact des Technologies Educatives",
      author: "Dr. Marie Kabongo",
      submittedDate: '2024-03-15',
      category: 'Recherche',
      abstract: 'Cette étude examine...',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-2',
        title: "Méthodes Innovantes en Pédagogie",
        author: "Prof. Jean Dupont",
        submittedDate: '2024-03-14',
        category: 'Education',
        abstract: 'Une analyse des...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'

    },
    {
        id: 'rev-3',
        title: "Développement Durable en Afrique",
        author: "Dr. Ahmed Diallo",
        submittedDate: '2024-03-13',
        category: 'Environnement',
        abstract: 'Cette recherche explore...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-4',
        title: "Intelligence Artificielle en Santé",
        author: "Dr. Sarah Kouassi",
        submittedDate: '2024-03-12',
        category: 'Technologie',
        abstract: 'Étude sur...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-5',
        title: "Économie Circulaire",
        author: "Prof. Marc Traoré",
        submittedDate: '2024-03-11',
        category: 'Économie',
        abstract: 'Analyse des modèles...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-6',
        title: "Biodiversité du Congo",
        author: "Dr. Claire Mbala",
        submittedDate: '2024-03-10',
        category: 'Sciences',
        abstract: 'Exploration de la...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-7',
        title: "Énergies Renouvelables",
        author: "Prof. Alice Kamara",
        submittedDate: '2024-03-09',
        category: 'Énergie',
        abstract: 'Recherche sur les...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-8',
        title: "Urbanisation Durable",
        author: "Dr. Paul N'Diaye",
        submittedDate: '2024-03-08',
        category: 'Urbanisme',
        abstract: 'Étude comparative...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-9',
        title: "Sécurité Alimentaire",
        author: "Prof. Emma Sankara",
        submittedDate: '2024-03-07',
        category: 'Agriculture',
        abstract: 'Analyse des stratégies...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
        id: 'rev-10',
        title: "Innovation Sociale",
        author: "Dr. Thomas Mensah",
        submittedDate: '2024-03-06',
        category: 'Sociologie',
        abstract: 'Recherche sur les...',
        pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    }
  ]

//   useEffect(() => {
//     // Fetch reviews assigned to this reviewer
//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(`/api/reviewer/${id}/pending-reviews`)
//         if (!res.ok) throw new Error('Failed to fetch reviews')
//         const data : any = await res.json()
//         setReviews(data)
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Erreur",
//           description: "Impossible de charger les évaluations"
//         })
//       }
//     }

//     fetchReviews()
//   }, [id])


  const filteredReviews = pendingReviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
    const totalItems = filteredReviews.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentItems = filteredReviews.slice(startIndex, endIndex)
    const [showEvaluationDialog, setShowEvaluationDialog] = useState(false)
const [selectedForEvaluation, setSelectedForEvaluation] = useState<PendingReview | null>(null)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Publications à évaluer</h1>
          <p className="text-gray-500">Évaluez les soumissions en attente</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e:any) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Date de soumission</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.title}</TableCell>
                  <TableCell>{review.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(review.submittedDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {review.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                            setSelectedForEvaluation(review)
                            setShowEvaluationDialog(true)
                        }}
                        >
                        <FileText className="h-4 w-4 mr-2" />
                        Évaluer
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/*  Pagination */}
    <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Lignes par page:</span>
        <Select
        value={pageSize.toString()}
        onValueChange={(value) => {
            setPageSize(Number(value))
            setCurrentPage(1)
        }}
        >
        <SelectTrigger className="w-[70px]">
            <SelectValue>{pageSize}</SelectValue>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
        </SelectContent>
        </Select>
    </div>

    <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
        {startIndex + 1}-{Math.min(endIndex, totalItems)} sur {totalItems}
        </span>
        <div className="flex items-center gap-1">
        <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
        >
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
        >
            <ChevronRight className="h-4 w-4" />
        </Button>
        </div>
    </div>
    </div>
    {/* Preview pdf  */}
<Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
  <DialogContent className="max-w-4xl h-[90vh]">
    <DialogHeader>
      <DialogTitle>Détails de la publication</DialogTitle>
    </DialogHeader>
    
    {selectedReview && (
      <div className="space-y-6 overflow-y-auto">
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedReview.title}</h3>
            <p className="text-sm text-gray-500">
              Par {selectedReview.author} • Soumis le {new Date(selectedReview.submittedDate).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Résumé</h4>
            <p className="text-gray-700">{selectedReview.abstract}</p>
          </div>

          <div className="rounded-lg border">
            <div className="h-[500px]">
              <object
                data={selectedReview.pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <p>Le PDF ne peut pas être affiché</p>
              </object>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Fermer
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Commencer l'évaluation
            </Button>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

{/* // Add evaluation dialog component */}
<Dialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Évaluation de la publication</DialogTitle>
    </DialogHeader>
    
    {selectedForEvaluation && (
      <form className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedForEvaluation.title}</h3>
          <p className="text-sm text-gray-500">
            Par {selectedForEvaluation.author}
          </p>
        </div>

        {/* Evaluation Criteria */}
        <div className="space-y-4">
          <div>
            <Label>Originalité et Innovation</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score} - {
                      score === 1 ? "Faible" :
                      score === 2 ? "Passable" :
                      score === 3 ? "Moyen" :
                      score === 4 ? "Bon" :
                      "Excellent"
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Méthodologie</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Qualité de la rédaction</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Commentaires généraux</Label>
            <Textarea 
              placeholder="Vos commentaires et suggestions..." 
              className="h-32"
            />
          </div>

          <div>
            <Label>Commentaires pour les auteurs</Label>
            <Textarea 
              placeholder="Commentaires qui seront partagés avec les auteurs..." 
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label>Décision</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accept" id="accept" />
                <Label htmlFor="accept">Accepter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="revise" id="revise" />
                <Label htmlFor="revise">Demander des révisions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject">Rejeter</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowEvaluationDialog(false)}
            type="button"
          >
            Annuler
          </Button>
          <Button type="submit">
            Soumettre l'évaluation
          </Button>
        </div>
      </form>
    )}
  </DialogContent>
</Dialog>


</div>
  )
}