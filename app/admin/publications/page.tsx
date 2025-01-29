// app/admin/publications/page.tsx
"use client"

import { useState, useCallback, useEffect  } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  Send,
  Loader2,
  RefreshCw,
  ExternalLink,
  AlertCircle
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from 'react-dropzone'
import { Publication,Reviewer,statusLabels,statusStyles  } from "@/data/publications"
import { useToast } from '@/hooks/use-toast'
import { Tooltip } from '@radix-ui/react-tooltip'


import { createClient } from '@/utils/supabase/client'

export default function PublicationsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPublication, setNewPublication] = useState<Partial<Publication>>({})
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)
  const [previewPub, setPreviewPub] = useState<Publication | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null)

  const [publications, setPublications] = useState<Publication[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(false)
  const [showReviewerModal, setShowReviewerModal] = useState(false)
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Add state for filtering reviewers
  const [filterTerm, setFilterTerm] = useState('')
  const { toast } = useToast()
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

    // Calculate pagination
    const totalItems = publications.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentItems = publications
    .filter(pub => 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(pub.author) 
        ? pub.author.some(author => 
            author.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : pub.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .slice(startIndex, endIndex)
  
  // Handle PDF File Selection
  const handlePdfChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPdfFile(file)
      setPdfPreview(URL.createObjectURL(file))
    }
  }

  // Handle PDF Drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setPdfFile(file)
      setPdfPreview(URL.createObjectURL(file))
    }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })


// Add refresh function
const refreshPublications = async () => {
  setIsRefreshing(true)
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setPublications(data || [])
    
    toast({
      title: "Actualisé",
      description: "Liste des publications mise à jour"
    })
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'actualiser les publications"
    })
  } finally {
    setIsRefreshing(false)
  }
}
//   Fetch publications
const fetchPublications = async () => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setPublications(data || [])
  } catch (error) {
    console.error('Error fetching publications:', error)
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger les publications"
    })
  } finally {
    setIsLoading(false)
  }
}

// Add real-time subscription
useEffect(() => {
  const supabase = createClient()
  
  // Initial fetch
  fetchPublications()

  // Subscribe to changes
  const channel = supabase
    .channel('publications_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'publications'
      },
      (payload) => {
        fetchPublications() // Refresh data when changes occur
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])


  // Handle Add Publication Form Submission
  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient()
  
    if (
      !newPublication.title ||
      !newPublication.author ||
      !newPublication.date ||
      !newPublication.category ||
      !pdfFile ||
      !newPublication.status
    ) {
      toast({
        title: "Erreur!",
        description: 'Veuillez remplir tous les champs et télécharger un PDF'
      })
      return
      }
  
      try {
        setIsLoading(true)
        // Check and create bucket if not exists
          const { data: buckets, error: listError } = await supabase
          .storage
          .listBuckets()

        if (listError) {
          throw new Error(`Erreur liste buckets: ${listError.message}`)
        }
        const bucketExists = buckets.some(b => b.name === 'publications')

        if (!bucketExists) {
          const { error: createError } = await supabase
            .storage
            .createBucket('publications', {
              public: true,
              allowedMimeTypes: ['application/pdf'],
              fileSizeLimit: 10485760 // 10MB
            })
    
          if (createError) {
            throw new Error(`Erreur création bucket: ${createError.message}`)
          }
        }
        //  Check ig bucket exists:
        const { data: bucket, error: bucketError } = await supabase
        .storage
        .getBucket('publications')

        if (bucketError) {
          console.error('Bucket error:', bucketError)
          throw new Error('Erreur de configuration du stockage')
        }
  
        // 1. Upload PDF to Supabase Storage
        const fileExt = pdfFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
        .from('publications')
        .upload(filePath, pdfFile)

        if (uploadError) {
          throw new Error(`Erreur d'upload: ${uploadError.message}`)
        }

        // 2. Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
        .from('publications')
        .getPublicUrl(filePath)


        // 3. Insert publication data into database
        const { data: publication, error: dbError } = await supabase
        .from('publications')
        .insert([
          {
            title: newPublication.title,
            author: Array.isArray(newPublication.author) 
              ? newPublication.author 
              : newPublication.author.split(',').map(a => a.trim()),
            date: newPublication.date,
            type: newPublication.type,
            category: newPublication.category,
            status: newPublication.status,
            pdf_url: publicUrl,
            is_restricted: false,
            citations: 0,
            created_at: new Date().toISOString(),
            abstract: newPublication.abstract,
            keywords: newPublication.keywords
          }
        ])
        .select()
        .single()

        if (dbError) {
          // Log detailed database error
          console.error('Database Error:', {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint
          })
          throw new Error(`Erreur base de données: ${dbError.message}`)
        }
    
        if (!publication) {
          throw new Error("Données de publication non retournées")
        }
  
        // 4. Update UI state
        setPublications([publication, ...publications])
        setNewPublication({})
        setPdfFile(null)
        setPdfPreview(null)
        setIsAddDialogOpen(false)

        toast({
          title: "Succès",
          description: "Publication ajoutée avec succès"
        })
      } catch (error: any) {
        console.log('Publication Error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          context: {
            title: newPublication.title,
            fileName: pdfFile?.name
          }
        })
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: error instanceof Error ? error.message : 'Une erreur est survenue'
        })
      } finally {
        setIsLoading(false)
      }
    }
  
  //  Handle Delete 
  const handleDelete = async (publication: Publication) => {
    const supabase = createClient()
    try {
      // Delete PDF from storage first
      const fileName = publication.pdfUrl.split('/').pop()
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('publications')
          .remove([fileName])
  
        if (storageError) throw storageError
      }
  
      // Then delete from database
      const { error: dbError } = await supabase
        .from('publications')
        .delete()
        .eq('id', publication.id)
  
      if (dbError) throw dbError
      // Update UI
      setPublications(prev => prev.filter(p => p.id !== publication.id))
      setIsDeleteDialogOpen(false)
      setPublicationToDelete(null)
  
      toast({
        title: "Succès",
        description: "Publication supprimée avec succès"
      })

    } catch (error) {
      console.error('Delete error:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la publication"
      })
    }
  }

  // Fetching reviwers
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
  useEffect(() => {
    fetchReviewers()
  }, [])

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
      refreshPublications()
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
        <h1 className="text-2xl font-bold">Publications</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPublications}
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
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Publication
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto  bg-gray-600 rounded-lg shadow ">
        <div className="min-w-[60px]"> {/* Set minimum width */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
              <TableHead className="text-gray-900 font-semibold">Titre</TableHead>
              <TableHead className="text-gray-900 font-semibold">Auteur.e(s)</TableHead>
              <TableHead className="text-gray-900 font-semibold">Date</TableHead>
              <TableHead className="text-gray-900 font-semibold">Type</TableHead>
              <TableHead className="text-gray-900 font-semibold">Catégorie</TableHead>
              <TableHead className="text-gray-900 font-semibold">Status</TableHead>
              <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Chargement des publications...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : publications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucune publication trouvée
                </TableCell>
              </TableRow>
            ) : (
              publications
                .filter(pub => 
                  pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (Array.isArray(pub.author) 
                    ? pub.author.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
                    : pub.author.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )
                .slice(startIndex, endIndex)
                .map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell className="font-medium">{pub.title}</TableCell>
                    <TableCell>{Array.isArray(pub.author) ? pub.author.join(', ') : pub.author}</TableCell>
                    <TableCell>{new Date(pub.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{pub.type || 'N/D'}</TableCell>
                    <TableCell>{pub.category}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[pub.status]}>
                        {statusLabels[pub.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsPreviewLoading(true)
                            setPreviewPub(pub)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setPublicationToDelete(pub)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={async () => {
                            setShowReviewerModal(true)
                            await fetchReviewers() // Fetch fresh list when modal opens
                          }}
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
      
      {/* Pagination */}
      <div className="mt- flex items-center justify-between">
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


    {/* Add Publication Dialog */}
   <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
       <DialogHeader>
         <DialogTitle>Ajouter Nouvelle Publication</DialogTitle>
       </DialogHeader>
       <div className="flex-1 overflow-y-auto pr-2">
       <form onSubmit={handleAddPublication} className="space-y-4 px-2">
         <div className="grid gap-2">
          <label className="font-medium" htmlFor="title">Titre</label>
          <Input 
                id="title" 
                value={newPublication.title || ''} 
                onChange={(e: any) => setNewPublication({ ...newPublication, title: e.target.value })}
                required 
              />
            </div>
            <div className="grid gap-2">
              <label className="font-medium" htmlFor="author">Auteurs</label>
              <Input 
                id="author" 
                value={newPublication.author || ''} 
                onChange={(e: any) => {
                  const authors = e.target.value.split(',').map((author: string) => author.trim())
                  setNewPublication({ ...newPublication, author: e.target.value })
                }}
                placeholder="Séparez les auteurs par des virgules"
                required 
              />
              <p className="text-sm text-gray-500">
                Ex: Yawidi Jean-paul, Mayala lemba Francis
              </p>
            </div>
            {/* // Add abstract field to form (after title field) */}
            <div className="grid gap-2">
              <label className="font-medium" htmlFor="abstract">Résumé</label>
              <textarea
                  id="abstract"
                  rows={4}
                  className={`w-full p-2 border rounded-md resize-none ${
                    countWords(newPublication.abstract || '') > 150 ? 'border-red-500' : ''
                  }`}
                  value={newPublication.abstract || ''}
                  onChange={(e: any) => {
                    const wordCount = countWords(e.target.value);
                    if (wordCount <= 150) {
                      setNewPublication({ 
                        ...newPublication, 
                        abstract: e.target.value 
                      });
                    }
                  }}
                  required
                  placeholder="Entrez le résumé de la publication (250 mots maximum)..."
                />
                {countWords(newPublication.abstract || '') > 150 && (
                  <p className="text-sm text-red-500">
                    Le résumé ne doit pas dépasser 250 mots
                  </p>
                )}
                <span className={`text-sm text-end ${
                  countWords(newPublication.abstract || '') > 150 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {countWords(newPublication.abstract || '')} / 150 mots
                </span>
            </div>
            {/* Keywords  */}
              <div className="grid gap-2">
                <label className="font-medium" htmlFor="keywords">Mots-clés</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {newPublication.keywords?.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => {
                            const newKeywords = [...(newPublication.keywords || [])];
                            newKeywords.splice(index, 1);
                            setNewPublication({ ...newPublication, keywords: newKeywords });
                          }}
                          className="hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      placeholder="Ajouter un mot-clé"
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as any;
                          const keyword = input.value.trim();
                          
                          if (keyword && (!newPublication.keywords || newPublication.keywords.length < 5)) {
                            setNewPublication({
                              ...newPublication,
                              keywords: [...(newPublication.keywords || []), keyword]
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Appuyez sur Entrée pour ajouter (maximum 5 mots-clés)
                  </p>
                  {newPublication.keywords && newPublication.keywords.length >= 5 && (
                    <p className="text-sm text-amber-500">
                      Nombre maximum de mots-clés atteint
                    </p>
                  )}
                </div>
              </div>

            <div className="grid gap-2">
              <label className="font-medium" htmlFor="date">Date</label>
              <Input 
                id="date" 
                type="date" 
                value={newPublication.date || ''} 
                onChange={(e: any) => setNewPublication({ ...newPublication, date: e.target.value })}
                required 
              />
            </div>
            <div className="grid gap-2">
                <label className="font-medium" htmlFor="type">Type</label>
                <Select
                  value={newPublication.type || ''}
                  onValueChange={(value) => setNewPublication({ ...newPublication, type: value })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="These">Thèse</SelectItem>
                    <SelectItem value="Rapport">Rapport</SelectItem>
                    <SelectItem value="Livre">Livre</SelectItem>
                    <SelectItem value="Tous">Tous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            <div className="grid gap-2">
              <label className="font-medium" htmlFor="category">Catégorie</label>
              <Select
                value={newPublication.category || ''}
                onValueChange={(value) => setNewPublication({ ...newPublication, category: value })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recherche">Recherche</SelectItem>
                  <SelectItem value="Méthodologie">Méthodologie</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Technologie">Technologie</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
           <label className="font-medium" htmlFor="status">Statut</label>
           <Select
             value={newPublication.status || ''}
             onValueChange={(value: any) => setNewPublication({ ...newPublication, status: value })}
             required
           >
             <SelectTrigger className="w-full">
               <SelectValue placeholder="Sélectionner le statut" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="PUBLISHED">Publié</SelectItem>
               <SelectItem value="PENDING">En attente</SelectItem>
               <SelectItem value="REJECTED">Rejeté</SelectItem>
               <SelectItem value="REVIEW">En cours de review</SelectItem>
             </SelectContent>
           </Select>
         </div>
         {/* PDF Dropzone */}
         <div className="grid gap-2">
           <label className="font-medium">Télécharger PDF</label>
           <div 
             {...getRootProps()} 
             className={`w-full p-4 border-2 border-dashed rounded-md text-center cursor-pointer ${
               isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
             }`}
           >
             <input {...getInputProps()} />
             {
               isDragActive ?
                 <p>Déposez le fichier ici...</p> :
                 <p>Glissez-déposez un fichier PDF ici, ou cliquez pour sélectionner un fichier</p>
             }
           </div>
           {pdfPreview && (
             <div className="h-40 mt-2">
               <object
                 data={pdfPreview}
                 type="application/pdf"
                 className="w-full h-full"
               >
                 <p>Le PDF ne peut pas être affiché.</p>
               </object>
             </div>
           )}
         </div>
         <div className="flex justify-end gap-2">
           <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
             Annuler
           </Button>
           <Button type="submit" disabled={!pdfFile || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter'
            )}
          </Button>
         </div>
       </form>
       </div>
     </DialogContent>
   </Dialog>

       {/* Publication Details Dialog */}
       <Dialog open={!!selectedPub} onOpenChange={() => setSelectedPub(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la publication</DialogTitle>
          </DialogHeader>
          
          {selectedPub && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">{selectedPub.title}</h3>
                <div className="grid gap-2">
                  <p><span className="font-medium">Auteur:</span> {selectedPub.author}</p>
                  <p><span className="font-medium">Date:</span> {selectedPub.date}</p>
                  <p><span className="font-medium">Catégorie:</span> {selectedPub.category}</p>
                  <p><span className="font-medium">Statut:</span> {selectedPub.status}</p>
                </div>
              </div>

              <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <object
                  data={selectedPub.pdfUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Le PDF ne peut pas être affiché</p>
                </object>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                {/* Add more action buttons if needed */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
  {/*  Send to the reviewers */}
  <Dialog open={showReviewerModal} onOpenChange={setShowReviewerModal}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Sélectionner des évaluateurs</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <Input
        placeholder="Filtrer par spécialisation ou institution..."
        value={filterTerm}
        onChange={(e: any) => setFilterTerm(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto">
        {reviewers
          .filter(reviewer => 
            reviewer?.specialization.toLowerCase().includes(filterTerm.toLowerCase()) ||
            reviewer.institution.toLowerCase().includes(filterTerm.toLowerCase())
          )
          .map((reviewer) => (
            <div key={reviewer.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={reviewer.id}
                value={reviewer.id}
                checked={selectedReviewers.includes(reviewer.id)}
                onChange={(e) => {
                  const { checked, value } :  any= e.target
                  setSelectedReviewers((prev) =>
                    checked ? [...prev, value] : prev.filter((id) => id !== value)
                  )
                }}
              />
              <label htmlFor={reviewer.id}>
                <div>
                  <p className="font-medium">{reviewer.name}</p>
                  <p className="text-sm text-gray-500">{reviewer.specialization} - {reviewer.institution}</p>
                </div>
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
        onClick={async () => {
          try {
            const res = await fetch(`/api/publications/${selectedPub?.id}/forward`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reviewers: selectedReviewers })
            })
            if (!res.ok) throw new Error('Failed to forward publication')
            toast({
              title: "Succès",
              description: "Publication envoyée aux évaluateurs sélectionnés.",
            })
            setShowReviewerModal(false)
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible d'envoyer la publication. Veuillez réessayer.",
            })
          }
        }}
      >
        Envoyer
      </Button>
    </div>
  </DialogContent>
</Dialog>

{/* Publication preview  */}
<Dialog open={!!previewPub} onOpenChange={() => setPreviewPub(null)}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader className="sticky top-0  z-100 p-6 border-b">
      <DialogTitle>Détails de la Publication: {previewPub?.title}</DialogTitle>
    </DialogHeader>
    <div className="mt-4 space-y-4">
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold">Auteur(s): </span>
          {Array.isArray(previewPub?.author) ? previewPub?.author.join(', ') : previewPub?.author}
        </div>
        <div>
          <span className="font-semibold">Date: </span>
          {previewPub?.date && new Date(previewPub.date).toLocaleDateString('fr-FR')}
        </div>
        <div>
          <span className="font-semibold">Catégorie: </span>
          {previewPub?.category}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Statut: </span>
          <Badge>{previewPub?.status}</Badge>
        </div>
      </div>
      {previewPub?.abstract && (
        <div>
          <p className="font-semibold">Résumé:</p>
          <p className="mt-1 justify-center">{previewPub.abstract}</p>
        </div>
      )}

      {/*  pdf previewing */}
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
      data={previewPub?.pdfUrl}
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
        <p>Le PDF ne peut pas être affiché directement. </p>
        <a
          href={previewPub?.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
          onClick={(e) => {
            if (!previewPub?.pdfUrl) {
              e.preventDefault()
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "PDF non disponible"
              })
            }
          }}
        >
        <ExternalLink className="h-4 w-4 mr-2" />
        Ouvrir PDF
      </a>
      </div>
    </object>
  )}
</div>
    </div>
  </DialogContent>
</Dialog>

{/*  Delete Dialog  */}
{/* // Update reviewer selection modal */}
<Dialog open={showReviewerModal} onOpenChange={setShowReviewerModal}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Sélectionner des évaluateurs</DialogTitle>
    </DialogHeader>
    <div className="max-h-[400px] overflow-y-auto p-4">
      {isLoadingReviewers ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        reviewers.map((reviewer) => (
          <div key={reviewer.id} className="flex items-center space-x-3 py-2 border-b">
            <input
              type="checkbox"
              id={reviewer.id}
              className="h-4 w-4 rounded border-gray-300"
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
              <p className="text-sm text-gray-500">{reviewer.email}</p>
              <p className="text-xs text-gray-400">{reviewer.institution}</p>
            </label>
          </div>
        ))
      )}
    </div>
    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
      <Button variant="outline" onClick={() => setShowReviewerModal(false)}>
        Annuler
      </Button>
      <Button
        disabled={selectedReviewers.length === 0}
        onClick={() => sendToReviewers(selectedPub?.id!, selectedReviewers)}
      >
        Envoyer
      </Button>
    </div>
  </DialogContent>
</Dialog>

 </div>
  )
}