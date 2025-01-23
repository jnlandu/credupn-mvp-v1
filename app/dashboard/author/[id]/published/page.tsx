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


interface PageProps {
    params: Promise<{ id: string }>
  }
interface PublishedSubmission {
  id: string
  title: string
  publishedDate: string
  pdfUrl: string
}

export default function PublishedSubmissions({ params }: PageProps) {
  const [submissions, setSubmissions] = useState<PublishedSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<PublishedSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { id } = use(params)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/author/${id}/published-submissions`)
        if (!res.ok) throw new Error('Failed to fetch submissions')
        const data : any = await res.json()
        setSubmissions(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les soumissions publiées"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [id, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!submissions.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune soumission publiée</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Soumissions Publiées</h1>
      <Card>
        <CardHeader>
          <CardTitle>Soumissions en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date de soumission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(submission.publishedDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedSubmission(submission)}
                        >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                    </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">{selectedSubmission.title}</h3>
                <p className="text-sm text-gray-500">
                  Publié le {new Date(selectedSubmission.publishedDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <iframe
                  src={selectedSubmission.pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                  frameBorder="0"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}