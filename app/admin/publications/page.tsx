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
  Plus
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from 'react-dropzone'
import { Publications,statusStyles  } from "@/data/publications"

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

  // Handle PDF File Selection
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPublication.title && newPublication.author && newPublication.date && newPublication.category && pdfFile) {
      const newPub: Publication = {
        id: `pub-${publications.length + 1}`,
        title: newPublication.title,
        author: newPublication.author,
        date: newPublication.date,
        status: newPublication.status as 'published' | 'pending' | 'rejected',
        category: newPublication.category,
        pdfUrl: pdfPreview || ''
      }
      setPublications([newPub, ...publications])
      // Reset form
      setNewPublication({})
      setPdfFile(null)
      setPdfPreview(null)
      setIsAddDialogOpen(false)
    }
  }

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
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <TableHead className="text-gray-900 font-semibold">Auteur</TableHead>
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
                onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                required 
              />
            </div>
            <div className="grid gap-2">
              <label className="font-medium" htmlFor="author">Auteur</label>
              <Input 
                id="author" 
                value={newPublication.author || ''} 
                onChange={(e) => setNewPublication({ ...newPublication, author: e.target.value })}
                required 
              />
            </div>
            <div className="grid gap-2">
              <label className="font-medium" htmlFor="date">Date</label>
              <Input 
                id="date" 
                type="date" 
                value={newPublication.date || ''} 
                onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })}
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
            </div>
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

    </div>
  )
}