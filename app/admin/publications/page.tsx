// app/admin/publications/page.tsx
"use client"

import { useState, useCallback  } from 'react'
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
  Send
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from 'react-dropzone'
import { Publication, Publications,statusStyles  } from "@/data/publications"
import { useToast } from '@/hooks/use-toast'
import { Tooltip } from '@radix-ui/react-tooltip'

export default function PublicationsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPublication, setNewPublication] = useState<Partial<Publication>>({})
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)

  const [publications, setPublications] = useState<Publication[]>(Publications)
  const [showReviewerModal, setShowReviewerModal] = useState(false)
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([])
  // Add state for filtering reviewers
  const [filterTerm, setFilterTerm] = useState('')
  // const [selectedPub, setSelectedPub] = useState(null)
  

  const { toast } = useToast()

    // Calculate pagination
    const totalItems = publications.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentItems = publications
    .filter(pub => 
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, endIndex)

  // Mock data for reviewers
  const reviewers = [
    { id: 'rev-1', name: 'Prof. Dr Jean Paul Yawidi', specialization: 'Psychologie Analytique', institution: 'UPN' },
    { id: 'rev-2', name: 'Prof. Dr Mayala Francis', specialization: 'Informatique, Cybersécurité, Cryptographie', institution: 'UPN' },
    { id: 'rev-3', name: 'Prof. Dr Musesa', specialization: 'Mathematiques, Géométrie Différentielle', institution: 'UNIKIN' },
    { id: 'rev-4', name: 'Prof. Dr Makiese Sarah', specialization: 'Sciences Politiques, Relations Internationales', institution: 'UPN' },
    { id: 'rev-5', name: 'Prof. Dr Ngoma Pierre', specialization: 'Économie, Finance', institution: 'UNIKIN' },
    { id: 'rev-6', name: 'Prof. Dr Kabamba John', specialization: 'Sociologie, Anthropologie', institution: 'UPN' },
    { id: 'rev-7', name: 'Prof. Dr Tshienda Marie', specialization: 'Droit International', institution: 'UNIKIN' },
    { id: 'rev-8', name: 'Prof. Dr Mutombo Eric', specialization: 'Physique Quantique', institution: 'UPN' },
    { id: 'rev-9', name: 'Prof. Dr Lukusa Anne', specialization: 'Biologie Moléculaire', institution: 'UNIKIN' },
    { id: 'rev-10', name: 'Prof. Dr Mbala David', specialization: 'Chimie Organique', institution: 'UPN' },
    { id: 'rev-11', name: 'Prof. Dr Kasongo Rebecca', specialization: 'Sciences de l\'Éducation', institution: 'UPN' },
    { id: 'rev-12', name: 'Prof. Dr Mwamba Joseph', specialization: 'Linguistique, Langues Africaines', institution: 'UNIKIN' },
    { id: 'rev-13', name: 'Prof. Dr Nkulu Claire', specialization: 'Histoire, Archéologie', institution: 'UPN' },
    { id: 'rev-14', name: 'Prof. Dr Kalala Michel', specialization: 'Études Environnementales', institution: 'UNIKIN' },
    { id: 'rev-15', name: 'Prof. Dr Bokoko Alice', specialization: 'Philosophie, Éthique', institution: 'UPN' },
  ]
  
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

  // Handle Add Publication Form Submission
  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      newPublication.title &&
      newPublication.author &&
      newPublication.date &&
      newPublication.category &&
      pdfFile &&
      newPublication.status
    ) {
      const formData = new FormData();
      formData.append('title', newPublication.title);
      formData.append('author', newPublication.author);
      formData.append('date', newPublication.date);
      formData.append('category', newPublication.category);
      formData.append('status', newPublication.status as string);
      formData.append('pdf', pdfFile);
  
      console.log('Form Data Submission:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      try {
        const response = await fetch('/api/admin/publications/add', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const result: any = await response.json();
          setPublications([result.publication, ...publications]);
          setNewPublication({});
          setPdfFile(null);
          setPdfPreview(null);
          setIsAddDialogOpen(false);
          toast({
            title: "Succès",
            description: "Publication ajoutée avec succès",
          })
         
        } else {
          const error: any = await response.json();
          console.error('Error adding publication:', error);
          toast({
            title: "Erreur!",
            description: `Erreur: ${error.error}`
          })
        }
      } catch (error) {
        console.error('Error adding publication:', error);
        toast({
          title: "Erreur!",
          description: 'Une erreur est survenue lors de l\'ajout de la publication.'
        })
      }
    } else {
      toast({
        title: "Erreur!",
        description: 'Veuillez remplir tous les champs et télécharger un PDF'
      })
    }
  };

  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
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
        <TableHead className="text-gray-900 font-semibold">Catégorie</TableHead>
        <TableHead className="text-gray-900 font-semibold">Status</TableHead>
        <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
        </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems
              .filter(pub => 
                pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pub.author.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell className="font-medium">{pub.title}</TableCell>
                  <TableCell>{pub.author}</TableCell>
                  <TableCell>{pub.date}</TableCell>
                  <TableCell>{pub.category}</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[pub.status]}>
                      {pub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPub(pub)}
                      >
                        
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                      variant="ghost" 
                      size="sm" 
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
                      <Send className="h-4 w-4" />
                    </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
     <DialogContent className="max-w-2xl">
       <DialogHeader>
         <DialogTitle>Ajouter Nouvelle Publication</DialogTitle>
       </DialogHeader>
       <form onSubmit={handleAddPublication} className="space-y-4">
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
              <label className="font-medium" htmlFor="author">Auteur</label>
              <Input 
                id="author" 
                value={newPublication.author || ''} 
                onChange={(e: any) => setNewPublication({ ...newPublication, author: e.target.value })}
                required 
              />
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
               <SelectItem value="published">Publié</SelectItem>
               <SelectItem value="pending">En attente</SelectItem>
               <SelectItem value="rejected">Rejeté</SelectItem>
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
           <Button type="submit" disabled={!pdfFile}>
             Ajouter
           </Button>
         </div>
       </form>
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
            reviewer.specialization.toLowerCase().includes(filterTerm.toLowerCase()) ||
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

    </div>
  )
}