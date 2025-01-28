// app/admin/submissions/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  UserCheck,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { 
   PendingPublication,
   PublicationStatus, 
   Reviewer, 
   statusStyles,
   statusLabels,
   Submission,
   Author,

  } from '@/data/publications'

// interface Submission {
//   id: string
//   title: string
//   author: {
//     name: string
//     email: string
//     institution: string
//   }
//   status: 'PENDING' | 'REVI' | 'approved' | 'rejected'
//   submittedDate: string
//   category: string
//   reviewer?: string
//   pdfUrl: string
// }

export default function SubmissionsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [submissions, setSubmissions] = useState<PendingPublication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showReviewerModal, setShowReviewerModal] = useState(false)
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  const [reviewerSearchTerm, setReviewerSearchTerm] = useState('')
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [pdfError, setPdfError] = useState(false)

  
  const { toast } = useToast()

  // const reviewers = [
  //   { id: 'rev-1', name: 'Prof. Mayala Francis', specialization: 'Informatique', institution: 'UPN' },
  //   { id: 'rev-2', name: 'Prof. Musesa', specialization: 'Mathematiques', institution: 'UNIKIN' },
  //   { id: 'rev-3', name: 'Prof. Kabambi', specialization: 'Sciences Politiques', institution: 'UNIKIN' },
  //   { id: 'rev-4', name: 'Dr. Nguyen', specialization: 'Economie', institution: 'UPN' },
  //   { id: 'rev-5', name: 'Prof. Santos', specialization: 'Sciences Sociales', institution: 'UNIKIN' },
  //   { id: 'rev-6', name: 'Dr. Mukendi', specialization: 'Droit', institution: 'UPN' },
  //   { id: 'rev-7', name: 'Prof. Ibrahim', specialization: 'Histoire', institution: 'UNIKIN' },
  //   { id: 'rev-8', name: 'Dr. Kalala', specialization: 'Philosophie', institution: 'UPN' },
  //   { id: 'rev-9', name: 'Prof. Martinez', specialization: 'Littérature', institution: 'UNIKIN' },
  //   { id: 'rev-10', name: 'Dr. Lukusa', specialization: 'Psychologie', institution: 'UPN' },
  //   // Add more reviewers
  // ]


  const filteredSubmissions = submissions.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(sub.author) 
      ? sub.author.some((auth: string | Author) => 
          typeof auth === 'string'
            ? auth.toLowerCase().includes(searchTerm.toLowerCase())
            : auth.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : typeof sub.author === 'string'
        ? (sub.author as string).toLowerCase().includes(searchTerm.toLowerCase())
        : (sub.author as Author).name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  const totalItems = filteredSubmissions.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  const fetchReviewers = async () => {
    const supabase = createClient()
    setIsLoadingReviewers(true)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, institution')
        .eq('role', 'REVIEWER')
        .order('name', { ascending: true })
  
      if (error) throw error
  
      setReviewers(data || [])
    } catch (error) {
      console.error('Error fetching reviewers:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des évaluateurs"
      })
    } finally {
      setIsLoadingReviewers(false)
    }
  }
  
  // Add useEffect to fetch reviewers
  useEffect(() => {
    fetchReviewers()
  }, [])

  const fetchSubmissions = async () => {
    const supabase = createClient()
    try {
      console.log('Fetching submissions...')
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
  
      console.log('Fetched data:', data)
  
      const mappedData: PendingPublication[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        author: Array.isArray(item.author) ? item.author : [item.author],
        status: item.status,
        date: item.created_at,
        category: item.category,
        pdf_url: item.pdf_url,
        reviewer: item.reviewer,
        abstract: item.abstract || '',
        keywords: item.keywords || []
      }))
  
      console.log('Mapped data:', mappedData)
      setSubmissions(mappedData)
  
    } catch (error) {
      console.error('Error details:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les soumissions en attente"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])
// Add refresh function
    const refreshSubmissions = async () => {
      setIsRefreshing(true)
      await fetchSubmissions()
      setIsRefreshing(false)
    }
   
  // Add send to reviewer function
const sendToReviewers = async (publicationId: string, reviewerIds: string[]) => {
  const supabase = createClient()
  try {
    // Update publication status
    const { error: statusError } = await supabase
      .from('publications')
      .update({ 
        status: 'UNDER_REVIEW',
        reviewers: reviewerIds 
      })
      .eq('id', publicationId)

    if (statusError) throw statusError

    // Notify reviewers (implement notification system)
    toast({
      title: "Succès",
      description: "Publication envoyée aux évaluateurs"
    })
    
    setShowReviewerModal(false)
    refreshSubmissions()
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'envoyer aux évaluateurs"
    })
  }
}

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Soumissions</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="text-gray-900 font-semibold">Titre</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Auteur.e(s)</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Date</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Catégorie</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Statut</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucune soumission trouvée
                  </TableCell>
                </TableRow>
              ) : (
                currentSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id}
                    className="border-b"
                  >
                    <TableCell className="font-medium">
                      {submission.title}
                    </TableCell>
                    <TableCell className="font-medium">
                      {Array.isArray(submission.author) 
                        ? submission.author.map(auth => 
                            typeof auth === 'string' 
                              ? auth 
                              : auth.name
                          ).join(', ')
                        : typeof submission.author === 'string'
                          ? submission.author
                          : submission.author.name
                      }
                    </TableCell>
                    <TableCell className="font-medium">
                      {new Date(submission.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.category}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[submission.status]}>
                        {statusLabels[submission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const mappedSubmission: Submission = {
                              id: submission.id,
                              title: submission.title,
                              author: Array.isArray(submission.author)
                                ? submission.author.map(element => ({
                                    name: element.name,
                                    email: element.email,
                                    institution: element.institution
                                  }))
                                : {
                                    name: submission.author.name,
                                    email: submission.author.email,
                                    institution: submission.author.institution
                                  },
                              status: submission.status,
                              abstract: submission.abstract,
                              submittedDate: submission.date,
                              category: submission.category,
                              pdfUrl: submission.pdf_url,
                              keywords: submission.keywords || []
                            };
                            setSelectedSubmission(mappedSubmission);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {submission.status.toLowerCase() === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"  
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {/*  Send to Reviewers */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReviewerModal(true)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
{/*  Publication preview and details */}
<Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader className="sticky top-0  z-10 pb-4 border-b">
      <DialogTitle>Détails de la soumission</DialogTitle>
    </DialogHeader>
    
    {selectedSubmission && (
      <div className="space-y-6 p-6">
        {/* Basic Info */}
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-gray-500">{selectedSubmission.title}</h3>
          
          <div className="grid gap-2">
            <p>
              <span className="font-medium text-gray-500">Auteur.e(s):</span>{" "}
              {Array.isArray(selectedSubmission.author) 
                ? selectedSubmission.author.map(author => author.name).join(', ')
                : selectedSubmission.author.name
              }
            </p>
            <p>
              <span className="font-medium text-gray-500">Email:</span>{" "}
              {Array.isArray(selectedSubmission.author) 
                ? selectedSubmission.author.map(author => author.email).join(', ')
                : selectedSubmission.author.email
              }
            </p>
            <p>
              <span className="font-medium text-gray-500">Institution:</span>{" "}
              {Array.isArray(selectedSubmission.author) 
                ? selectedSubmission.author.map(author => author.institution).join(', ')
                : selectedSubmission.author.institution
              }
            </p>
          </div>

          {/* Type and Keywords */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Type:</p>
              <p>{selectedSubmission.type || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Mots-clés:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSubmission.keywords?.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Abstract */}
          {selectedSubmission?.abstract && (
            <div>
              <p className="font-semibold text-gray-500">Résumé:</p>
              <p className="mt-1 text-justify text-sm">{selectedSubmission.abstract}</p>
            </div>
          )}
          {/* <div>
            <p className="font-medium mb-2">Résumé:</p>
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedSubmission.abstract || 'Aucun résumé disponible'}
            </p>
          </div> */}
        </div>

        {/* PDF Preview */}
        <div className="h-[60vh] border rounded-lg overflow-hidden">
          {isPreviewLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pdfError ? (
            <div className="h-full flex items-center justify-center flex-col gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p>Impossible de charger le PDF</p>
            </div>
          ) : (
            <object
              data={selectedSubmission.pdfUrl}
              type="application/pdf"
              className="w-full h-full"
              onLoad={() => {
                setIsPreviewLoading(false)
                setPdfError(false)
              }}
              onError={() => {
                setIsPreviewLoading(false)
                setPdfError(true)
              }}
            >
              <div className="h-full flex items-center justify-center flex-col gap-2">
                <p>Le PDF ne peut pas être affiché directement.</p>
                <Button 
                  variant="outline" 
                >
                  <a href={selectedSubmission.pdfUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir dans un nouvel onglet
                  </a>
                </Button>
              </div>
            </object>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          {selectedSubmission.status === 'PENDING' && (
            <>
              <Button variant="destructive" onClick={() => setSelectedSubmission(null)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={() => setShowReviewerModal(true)}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer aux évaluateurs
              </Button>
            </>
          )}
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

 {/* / Update reviewer modal content */}
    <Dialog open={showReviewerModal} onOpenChange={setShowReviewerModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner les Évaluateurs</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Rechercher un évaluateur..."
            value={reviewerSearchTerm}
            onChange={(e: any) => setReviewerSearchTerm(e.target.value)}
          />
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isLoadingReviewers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : reviewers
              .filter(reviewer => 
                reviewer.name.toLowerCase().includes(reviewerSearchTerm.toLowerCase()) ||
                reviewer.institution.toLowerCase().includes(reviewerSearchTerm.toLowerCase())
              )
              .map(reviewer => (
                <div key={reviewer.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    id={reviewer.id}
                    checked={selectedReviewers.includes(reviewer.id)}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        setSelectedReviewers([...selectedReviewers, reviewer.id])
                      } else {
                        setSelectedReviewers(selectedReviewers.filter(id => id !== reviewer.id))
                      }
                    }}
                  />
                  <label htmlFor={reviewer.id} className="flex-1">
                    <p className="font-medium">{reviewer.name}</p>
                    <p className="text-sm text-gray-500">{reviewer.institution}</p>
                    <p className="text-xs text-gray-400">{reviewer.email}</p>
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowReviewerModal(false)}>
            Annuler
          </Button>
          <Button
            disabled={selectedReviewers.length === 0 || isLoadingReviewers}
            onClick={() => sendToReviewers(selectedSubmission?.id!, selectedReviewers)}
          >
            Envoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
