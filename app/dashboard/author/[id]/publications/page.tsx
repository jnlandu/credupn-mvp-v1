// app/dashboard/author/[id]/published/page.tsx
"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Eye, Calendar } from 'lucide-react'
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
          .eq('user_id', id)
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Publications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Publications</CardTitle>
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
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {publication.status}
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
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                className="border rounded p-1"
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
              <span className="text-sm text-gray-600">
                Affichage {publications.length === 0 ? 0 : indexOfFirstItem + 1} à{' '}
                {Math.min(indexOfLastItem, publications.length)} sur {publications.length}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                {"<<"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publication Details Dialog */}
      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la publication</DialogTitle>
          </DialogHeader>
          {selectedPublication && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedPublication.title}</h3>
                <p className="text-sm text-gray-500">
                  Publié le {new Date(selectedPublication.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <iframe
                  src={selectedPublication.pdf_url}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}