// app/admin/submissions/page.tsx
"use client"

import { useState } from 'react'
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
} from 'lucide-react'

interface Submission {
  id: string
  title: string
  author: {
    name: string
    email: string
    institution: string
  }
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submittedDate: string
  category: string
  reviewer?: string
  pdfUrl: string
}

export default function SubmissionsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const submissions: Submission[] = [
    {
      id: 'sub-1',
      title: "L'impact des Technologies Educatives en RDC",
      author: {
        name: "Dr. Marie Kabongo",
        email: "marie.k@upn.ac.cd",
        institution: "UPN"
      },
      status: 'pending',
      submittedDate: '2024-03-15',
      category: 'Recherche',
      pdfUrl: '/submissions/tech-education.pdf'
    },
    // Add more submissions...
{
  id: 'sub-2',
  title: "L'enseignement à distance en Afrique",
  author: {
    name: "Prof. Jean Mukendi",
    email: "jean.m@unikin.ac.cd",
    institution: "UNIKIN"
  },
  status: 'under_review',
  submittedDate: '2024-03-10',
  category: 'Education',
  pdfUrl: '/submissions/distance-learning.pdf'
},
{
  id: 'sub-3',
  title: "L'impact des réseaux sociaux sur les jeunes",
  author: {
    name: "Mme. Chantal Mbala",
    email: "chantal.m@unikin.ac.cd",
    institution: "UNIKIN"
  },
  status: 'approved',
  submittedDate: '2024-02-25',
  category: 'Sociologie',
  pdfUrl: '/submissions/social-media-impact.pdf'
},
{
  id: 'sub-4',
  title: "Les énergies renouvelables en Afrique",
  author: {
    name: "Dr. Patrick Ilunga",
    email: "patrick.i@upn.ac.cd",
    institution: "UPN"
  },
  status: 'rejected',
  submittedDate: '2024-01-30',
  category: 'Environnement',
  pdfUrl: '/submissions/renewable-energy.pdf'
},
{
    id: 'sub-5',
    title: "L'impact de l'intelligence artificielle sur l'éducation",
    author: {
        name: "Dr. Alain Kabasele",
        email: "alain.k@upn.ac.cd",
        institution: "UPN"
    },
    status: 'under_review',
    submittedDate: '2024-03-20',
    category: 'Technologie',
    pdfUrl: '/submissions/ai-education.pdf'
},
{
    id: 'sub-6',
    title: "Les défis de la santé publique en Afrique",
    author: {
        name: "Dr. Sophie Mbala",
        email: "sophie.m@unikin.ac.cd",
        institution: "UNIKIN"
    },
    status: 'approved',
    submittedDate: '2024-02-18',
    category: 'Santé',
    pdfUrl: '/submissions/public-health.pdf'
},
{
    id: 'sub-7',
    title: "L'impact des politiques économiques sur le développement",
    author: {
        name: "Prof. Jean-Pierre Kanku",
        email: "jean-pierre.k@upn.ac.cd",
        institution: "UPN"
    },
    status: 'rejected',
    submittedDate: '2024-01-25',
    category: 'Économie',
    pdfUrl: '/submissions/economic-policies.pdf'
},
{
    id: 'sub-8',
    title: "L'importance de la biodiversité en Afrique",
    author: {
        name: "Dr. Claire Tshibangu",
        email: "claire.t@unikin.ac.cd",
        institution: "UNIKIN"
    },
    status: 'pending',
    submittedDate: '2024-03-22',
    category: 'Environnement',
    pdfUrl: '/submissions/biodiversity.pdf'
},
{
    id: 'sub-9',
    title: "Les nouvelles technologies dans l'agriculture",
    author: {
        name: "Dr. Joseph Kabila",
        email: "joseph.k@upn.ac.cd",
        institution: "UPN"
    },
    status: 'under_review',
    submittedDate: '2024-03-12',
    category: 'Agriculture',
    pdfUrl: '/submissions/agriculture-tech.pdf'
},
{
    id: 'sub-10',
    title: "L'impact des changements climatiques sur les ressources en eau",
    author: {
        name: "Dr. Aline Mukendi",
        email: "aline.m@unikin.ac.cd",
        institution: "UNIKIN"
    },
    status: 'approved',
    submittedDate: '2024-02-28',
    category: 'Environnement',
    pdfUrl: '/submissions/climate-change-water.pdf'
},
{
    id: 'sub-11',
    title: "Les défis de l'urbanisation en Afrique",
    author: {
        name: "Prof. Michel Kabasele",
        email: "michel.k@upn.ac.cd",
        institution: "UPN"
    },
    status: 'rejected',
    submittedDate: '2024-01-15',
    category: 'Urbanisme',
    pdfUrl: '/submissions/urbanization.pdf'
},
{
    id: 'sub-12',
    title: "L'impact des médias sur la société",
    author: {
        name: "Mme. Nadine Tshibangu",
        email: "nadine.t@unikin.ac.cd",
        institution: "UNIKIN"
    },
    status: 'pending',
    submittedDate: '2024-03-18',
    category: 'Sociologie',
    pdfUrl: '/submissions/media-impact.pdf'
},
{
    id: 'sub-13',
    title: "Les innovations dans le secteur de l'énergie",
    author: {
        name: "Dr. Patrick Ilunga",
        email: "patrick.i@upn.ac.cd",
        institution: "UPN"
    },
    status: 'under_review',
    submittedDate: '2024-03-05',
    category: 'Technologie',
    pdfUrl: '/submissions/energy-innovations.pdf'
},
{
    id: 'sub-14',
    title: "L'impact des politiques de santé sur le bien-être",
    author: {
        name: "Dr. Sophie Mbala",
        email: "sophie.m@unikin.ac.cd",
        institution: "UNIKIN"
    },
    status: 'approved',
    submittedDate: '2024-02-10',
    category: 'Santé',
    pdfUrl: '/submissions/health-policies.pdf'
}
  ]

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: 'En attente',
    under_review: 'En cours d\'évaluation',
    approved: 'Approuvé',
    rejected: 'Rejeté'
  }

  const filteredSubmissions = submissions.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = filteredSubmissions.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex)

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-[300px] text-gray-900 font-semibold">Titre</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Auteur</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Date</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Catégorie</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Statut</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions.map((submission) => (
                <TableRow 
                  key={submission.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900">{submission.title}</TableCell>
                  <TableCell className="text-gray-700">{submission.author.name}</TableCell>
                  <TableCell className="text-gray-700">{submission.submittedDate}</TableCell>
                  <TableCell className="text-gray-700">{submission.category}</TableCell>
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
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {submission.status === 'pending' && (
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
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">{selectedSubmission.title}</h3>
                <div className="grid gap-2">
                  <p><span className="font-medium">Auteur:</span> {selectedSubmission.author.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedSubmission.author.email}</p>
                  <p><span className="font-medium">Institution:</span> {selectedSubmission.author.institution}</p>
                  <p><span className="font-medium">Date de soumission:</span> {selectedSubmission.submittedDate}</p>
                  <p><span className="font-medium">Catégorie:</span> {selectedSubmission.category}</p>
                </div>
              </div>

              <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <object
                  data={selectedSubmission.pdfUrl}
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
                {selectedSubmission.status === 'pending' && (
                  <>
                    <Button variant="destructive">
                      <X className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                    <Button>
                      <Check className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}