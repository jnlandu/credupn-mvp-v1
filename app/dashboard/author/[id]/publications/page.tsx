// app/dashboard/author/[id]/published/page.tsx
"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Eye, Calendar, FileText, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'


interface PageProps {
    params: Promise<{ id: string }>
  }
  
interface PublishedSubmission {
  id: string
  title: string
  publishedDate: string
  pdfUrl: string
}

interface Publication {
  id: string;
  title: string;
  status: string;
  created_at: string;
  pdf_url: string;
  author: string[] | string;
  user_id: string;
}

const statusTranslations: Record<string, string> = {
  'PENDING': 'En attente',
  'PUBLISHED': 'Publié',
  'REJECTED': 'Rejeté',
  'UNDER_REVIEW': 'En cours d\'évaluation',
  'DELETED': 'Supprimé'
};

export default function PublishedSubmissions({ params }: PageProps) {
  const [publications, setPublications] = useState<Publication[]>([])
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPublications = publications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(publications.length / itemsPerPage)
  const { toast } = useToast()
  const { id } = use(params)

  useEffect(() => {
    const fetchPublications = async () => {
      const supabase = createClient()
      setIsLoading(true)

      try {
        // Get current user's publications
        const { data, error } = await supabase
        .from('publications')
        .select('*')
        .is('deleted_at', null) // Filter out soft deleted
        .neq('status', 'DELETED') // Also check status
        .order('created_at', { ascending: false })

        if (error) throw error

        setPublications(data || [])
      } catch (error) {
        console.error('Error fetching publications:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos publications"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublications()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }


  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Mes Publications</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg md:text-xl">Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date de publication</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : publications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="text-center py-8">
                        <p className="text-gray-500">Aucune publication trouvée</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPublications.map((publication) => (
                    <TableRow key={publication.id}>
                      <TableCell className="font-medium">{publication.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          publication.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800'
                            : publication.status === 'UNDER_REVIEW'
                            ? 'bg-yellow-100 text-yellow-800'
                            : publication.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {statusTranslations[publication.status] || publication.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedPublication(publication)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <select
                  className="border rounded p-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e: any) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={5}>5 par page</option>
                  <option value={10}>10 par page</option>
                  <option value={20}>20 par page</option>
                </select>
                <span className="text-xs md:text-sm text-gray-600">
                  Affichage {publications.length === 0 ? 0 : indexOfFirstItem + 1} à{' '}
                  {Math.min(indexOfLastItem, publications.length)} sur {publications.length}
                </span>
              </div>

              <div className="flex gap-1 md:gap-2 self-end md:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                >
                  <span className="md:hidden">{"<<"}</span>
                  <span className="hidden md:inline">Premier</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                >
                  <span className="md:hidden">{"<"}</span>
                  <span className="hidden md:inline">Précédent</span>
                </Button>
                <div className="hidden md:flex items-center gap-1 md:gap-2">
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="h-8 w-8 p-0 md:h-9 md:w-9"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <span className="flex items-center text-sm text-gray-600 px-2 md:hidden">
                  {currentPage}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                >
                  <span className="md:hidden">{">"}</span>
                  <span className="hidden md:inline">Suivant</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                >
                  <span className="md:hidden">{">>"}</span>
                  <span className="hidden md:inline">Dernier</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">Aucune publication trouvée</p>
          </div>
        ) : (
          currentPublications.map((publication) => (
            <Card key={publication.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium line-clamp-2">{publication.title}</h3>
                    <Badge variant="outline" className={
                      publication.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800 whitespace-nowrap text-xs'
                        : publication.status === 'UNDER_REVIEW'
                        ? 'bg-yellow-100 text-yellow-800 whitespace-nowrap text-xs'
                        : publication.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800 whitespace-nowrap text-xs'
                        : 'bg-gray-100 text-gray-800 whitespace-nowrap text-xs'
                    }>
                      {statusTranslations[publication.status] || publication.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(publication.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-8 px-2"
                      onClick={() => setSelectedPublication(publication)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Mobile Pagination */}
        <div className="flex flex-col gap-3 bg-white p-3 rounded-lg border">
          <div className="flex justify-between items-center">
            <select
              className="border rounded p-1 text-xs"
              value={itemsPerPage}
              onChange={(e: any) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value={5}>5 par page</option>
              <option value={10}>10 par page</option>
              <option value={20}>20 par page</option>
            </select>
            <span className="text-xs text-gray-600">
              {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, publications.length)}/{publications.length}
            </span>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 text-xs"
            >
              Précédent
            </Button>
            
            <span className="flex items-center text-xs px-2">
              Page {currentPage} sur {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 text-xs"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Publication Details Dialog */}
      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Détails de la publication</DialogTitle>
          </DialogHeader>
          {selectedPublication && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold line-clamp-2">{selectedPublication.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">
                  Publié le {new Date(selectedPublication.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(80vh - 120px)' }}>
                {/* PDF viewer with fallback */}
                <object
                  data={selectedPublication.pdf_url}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                    <FileText className="h-8 w-8 text-gray-400 mb-4" />
                    <p className="text-sm text-center text-gray-600 mb-4">
                      Le PDF ne peut pas être affiché dans cette fenêtre
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={selectedPublication.pdf_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Ouvrir le PDF
                      </a>
                    </Button>
                  </div>
                </object>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}