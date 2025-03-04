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
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { 
   PendingPublication,
   PublicationStatus, 

   statusStyles,
   statusLabels,
   Submission,
   Author,
   Reviewer,

  } from '@/data/publications'
import { fetchReviewers } from '@/utils/reviewers'
import { on } from 'events'



  interface ReviewerUserData {
    id: string;
    name: string;
    email: string;
    institution: string;
  }
  
  interface ReviewerTable {
    id: string;
    user_id: string;
    specialization: string[];
    expertise: string;
    availability: boolean;
    users: ReviewerUserData ;
  }
  interface ReviewerResponse {
    id: string;
    user_id: string;
    specialization: string[];
    expertise: string;
    availability: boolean;
    user: ReviewerUserData; // Change from users to user (singular)
  }



export default function SubmissionsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<PendingPublication | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [submissions, setSubmissions] = useState<PendingPublication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showReviewerModal, setShowReviewerModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  const [reviewerSearchTerm, setReviewerSearchTerm] = useState('')
  const [reviewers, setReviewers] = useState<ReviewerTable[]>([])
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [isSendingToReviewers, setIsSendingToReviewers] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const categories = Array.from(new Set(submissions.map(sub => sub.category)))
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null)
  
  const { toast } = useToast()



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


// In your component:
const loadReviewers = async () => {
  setIsLoadingReviewers(true);
  try {
    const data = await fetchReviewers();
    setReviewers(data);
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Impossible de charger la liste des évaluateurs"
    });
  } finally {
    setIsLoadingReviewers(false);
  }
};

useEffect(() => {
  loadReviewers();
}, []);



// Fetch submissions
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
        type: item.type,
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


// Refresh submissions
const refreshSubmissions = async () => {
  setIsRefreshing(true)
  try {
    await fetchSubmissions()
    toast({
      title: "Actualisé",
      description: "Liste des soumissions mise à jour"
    })
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'actualiser les soumissions"
    })
  } finally {
    setIsRefreshing(false)
  }
}
   
  // Add send to reviewer function
  const sendToReviewers = async (publicationId: string, reviewerIds: string[]) => {
    setIsSendingToReviewers(true);
    const supabase = createClient()
    try {

      const { data: publication, error: getPubError } = await supabase
        .from('publications')
        .select('*')
        .eq('id', publicationId)
        .single();

      if (getPubError) {
        console.error('Error getting publication:', getPubError);
        throw getPubError;
      }
      
     // Update publication status
     const { error: updateError } = await supabase
        .from('publications')
        .update({
          status: 'UNDER_REVIEW',
          reviewer_ids: reviewerIds,
          updated_at: new Date().toISOString()
        })
        .eq('id', publicationId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
  
      // Create notification records
    const notifications = reviewerIds.map(reviewerId => ({
      user_id: reviewerId,
      type: 'REVIEW_REQUEST',
      title: 'Nouvelle publication à évaluer',
      message: `Une nouvelle publication "${publication.title}" vous a été assignée pour évaluation.`,
      publication_id: publicationId,
      created_at: new Date().toISOString(),
      read: false,
      reference_code: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
  
     // Insert notifications with unique reference codes
     const { error: notifyError } = await supabase
     .from('notifications')
     .insert(notifications);

      if (notifyError) {
        console.error('Notification error:', notifyError);
        throw notifyError;
      }
    // Send notifications
    try {
      const response = await fetch('/api/reviewer/notify', { // Changed from /api/reviewer/notify
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'REVIEW_REQUEST',
          publicationId,
          reviewerIds,
          title: publication.title
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send notifications');
      }

      const result = await response.json();
      console.log('Notification result:', result);

    } catch (apiError: any) {
      console.error('API error:', {
        message: apiError.message,
        status: apiError.status,
        details: apiError.details
      });
      throw apiError;
    }

    toast({
      title: "Succès",
      description: "Publication envoyée aux évaluateurs"
    });
    
    setShowReviewerModal(false);
    setIsSendingToReviewers(false);
    await fetchSubmissions();

  
    } catch (error: any) {
      console.error('Error sending to reviewers:', error)
      console.error('Error sending to reviewers:', {
        name: error.name,
        message: error.message,
        code: error?.code,
        details: error?.details,
        stack: error.stack
      });
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer aux évaluateurs"
      })
      setIsSendingToReviewers(false);
    }
  }


/** On Send to Reviewers Functions  */
const onSendToReviewers = async () => {
    await sendToReviewers(selectedSubmission!.id, selectedReviewers);
    // Reset states after successful send
    setSelectedReviewers([]);
    setShowReviewerModal(false);
    // await refreshSubmissions();
  }

/**    Save Eduit function  */
const saveEdit = async (id: string, field: string, value: any) => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('publications')
      .update({ [field]: value })
      .eq('id', id)

    if (error) throw error

    // Update local state
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ))

    toast({
      title: "Succès",
      description: "Modification enregistrée"
    })
  } catch (error) {
    console.error('Error saving edit:', error)
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'enregistrer la modification"
    })
  } finally {
    setEditingCell(null)
  }
}

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nouvelles Soumissions</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshSubmissions}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Actualisation...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </>
            )}
          </Button>
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
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="text-gray-900 font-semibold">No</TableHead>
                <TableHead className="text-gray-900 font-semibold">Titre</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Auteur.e(s)</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Date</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Catégorie</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Type</TableHead>
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
                  <TableCell className="font-medium">{submission.id}</TableCell>
                   <TableCell 
                        className="font-medium"
                        onDoubleClick={() => setEditingCell({
                          id: submission.id,
                          field: 'title',
                          value: submission.title
                        })}
                      >
                        {editingCell?.id === submission.id && editingCell.field === 'title' ? (
                          <Input
                            autoFocus
                            value={editingCell.value}
                            onChange={(e) => setEditingCell({
                              ...editingCell,
                              value: e.target.value
                            })}
                            onBlur={() => saveEdit(submission.id, 'title', editingCell.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit(submission.id, 'title', editingCell.value)
                              } else if (e.key === 'Escape') {
                                setEditingCell(null)
                              }
                            }}
                            className="min-w-[200px]"
                          />
                        ) : (
                          <span>{submission.title}</span>
                        )}
                      </TableCell>
                      <TableCell 
                          className="font-medium"
                          onDoubleClick={() => setEditingCell({
                            id: submission.id,
                            field: 'author',
                            value: Array.isArray(submission.author) 
                              ? submission.author.map(auth => 
                                  typeof auth === 'string' 
                                    ? auth 
                                    : auth?.name
                                ).join(', ')
                              : typeof submission.author === 'string'
                                ? submission.author
                                : submission.author.name
                          })}
                        >
                          {editingCell?.id === submission.id && editingCell.field === 'author' ? (
                            <Input
                              autoFocus
                              value={editingCell.value}
                              onChange={(e) => setEditingCell({
                                ...editingCell,
                                value: e.target.value
                              })}
                              onBlur={() => saveEdit(submission.id, 'author', editingCell.value.split(', '))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveEdit(submission.id, 'author', editingCell.value.split(', '))
                                } else if (e.key === 'Escape') {
                                  setEditingCell(null)
                                }
                              }}
                              className="min-w-[200px]"
                            />
                          ) : (
                            <span>
                              {Array.isArray(submission.author) 
                                ? submission.author.map(auth => 
                                    typeof auth === 'string' 
                                      ? auth 
                                      : auth?.name
                                  ).join(', ')
                                : typeof submission.author === 'string'
                                  ? submission.author
                                  : submission.author.name
                              }
                            </span>
                          )}
                        </TableCell>
                    <TableCell className="font-medium">
                      {new Date(submission.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell 
                        className="font-medium"
                        onDoubleClick={() => setEditingCell({
                          id: submission.id,
                          field: 'category',
                          value: submission.category
                        })}
                      >
                        {editingCell?.id === submission.id && editingCell.field === 'category' ? (
                          <Select
                            value={editingCell.value}
                            onValueChange={(value) => {
                              saveEdit(submission.id, 'category', value)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue>{editingCell.value}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span>{submission.category}</span>
                        )}
                      </TableCell>
                      {/*  Type */}
                      <TableCell 
                        className="font-medium"
                        onDoubleClick={() => setEditingCell({
                          id: submission.id,
                          field: 'type',
                          value: submission.type
                        })}
                      >
                        {editingCell?.id === submission.id && editingCell.field === 'type' ? (
                          <Input
                            autoFocus
                            value={editingCell.value}
                            onChange={(e) => setEditingCell({
                              ...editingCell,
                              value: e.target.value
                            })}
                            onBlur={() => saveEdit(submission.id, 'type', editingCell.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit(submission.id, 'type', editingCell.value)
                              } else if (e.key === 'Escape') {
                                setEditingCell(null)
                              }
                            }}
                            className="min-w-[200px]"
                          />
                        ) : (
                          <span>{submission.type}</span>
                        )}
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
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            setShowPreviewModal(true);
                            setShowReviewerModal(false); // Close reviewer modal if open
                            setSelectedSubmission(submission);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/*  Send to Reviewers */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            setShowReviewerModal(true);
                            // setShowPreviewModal(false); // Close preview modal if open
                            setSelectedSubmission(submission);
                          }}
                        >
                          <span className="hidden sm:inline">{selectedSubmission?.id}</span>
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
<Dialog 
  open={showPreviewModal} 
  onOpenChange={(open) => {
    setShowPreviewModal(open);
    if (!open) setSelectedSubmission(null);
  }}
>
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
                ? selectedSubmission.author.map(author => author?.name).join(', ')
                : selectedSubmission.author?.name
              }
            </p>
            <p>
              <span className="font-medium text-gray-500">Email:</span>{" "}
              {Array.isArray(selectedSubmission.author) 
                ? selectedSubmission.author.map(author => author?.email).join(', ')
                : selectedSubmission.author?.email
              }
            </p>
            <p>
              <span className="font-medium text-gray-500">Institution:</span>{" "}
              {Array.isArray(selectedSubmission.author) 
                ? selectedSubmission.author.map(author => author?.institution).join(', ')
                : selectedSubmission.author?.institution
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
              data={selectedSubmission.pdf_url}
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
                  <a href={selectedSubmission.pdf_url} target="_blank" rel="noreferrer">
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
        {isLoadingReviewers ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : reviewers.length === 0 ? (
          <p className="text-center text-gray-500">Aucun évaluateur disponible</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {reviewers.map((reviewer) => (
              <div 
                key={reviewer.id} 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded border"
              >
                <input
                  type="checkbox"
                  id={reviewer.id}
                  checked={selectedReviewers.includes(reviewer.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReviewers([...selectedReviewers, reviewer.id])
                    } else {
                      setSelectedReviewers(
                        selectedReviewers.filter(id => id !== reviewer.id)
                      )
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="flex-1 text-red-400">{selectedReviewers || 'Avec nom'}</span>
                <label htmlFor={reviewer.id} className="flex-1 cursor-pointer">
                  <p className="font-medium">{reviewer.users?.name || 'Sans nom'}</p>
                  <p className="text-sm text-gray-500">
                    {reviewer.users?.institution || 'Sans institution'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {reviewer.users?.email || 'Sans email'}
                  </p>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
            disabled={selectedReviewers.length === 0 || isSendingToReviewers}
            onClick={onSendToReviewers}
          >
            {isSendingToReviewers ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              `Envoyer (${selectedReviewers.length})`
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
    </div>
  )
}
