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
import { Search, Eye, FileText, Calendar } from 'lucide-react'


interface PageProps {
    params: Promise<{ id: string }>
  }

interface PendingReview {
  id: string
  title: string
  author: string
  submittedDate: string
  category: string
  abstract: string
}

export default function PendingReviews({ params }: PageProps) {
   const { id } = use(params) // Unwrap params using React.use()
  const [searchTerm, setSearchTerm] = useState('')
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const { toast } = useToast()

  // Mock data - replace with API call
  const pendingReviews: PendingReview[] = [
    {
      id: 'rev-1',
      title: "L'impact des Technologies Educatives",
      author: "Dr. Marie Kabongo",
      submittedDate: '2024-03-15',
      category: 'Recherche',
      abstract: 'Cette étude examine...'
    }
  ]

  useEffect(() => {
    // Fetch reviews assigned to this reviewer
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviewer/${id}/pending-reviews`)
        if (!res.ok) throw new Error('Failed to fetch reviews')
        const data : any = await res.json()
        setReviews(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les évaluations"
        })
      }
    }

    fetchReviews()
  }, [id])


  const filteredReviews = pendingReviews.filter(review => 
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              {filteredReviews.map((review) => (
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button size="sm">
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
    </div>
  )
}