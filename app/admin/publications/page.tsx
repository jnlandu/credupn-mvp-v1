"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
    Eye, 
    Download, 
    Edit, 
    Trash2, 
    Search,
    ChevronLeft,
    ChevronRight 
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


interface Publication {
  id: string
  title: string
  author: string
  date: string
  status: 'published' | 'pending' | 'rejected'
  category: string
  pdfUrl: string
}

export default function PublicationsAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

const publications: Publication[] = [
    {
        id: 'pub-1',
        title: "L'impact des Technologies Educatives",
        author: "Dr. Marie Kabongo",
        date: "2024-03-15", 
        status: 'published',
        category: 'Recherche',
        pdfUrl: '/publications/tech-education.pdf'
    },
    {
        id: 'pub-2',
        title: "Méthodes d'Enseignement Innovantes",
        author: "Prof. Jean Lutumba",
        date: "2024-03-10",
        status: 'pending', 
        category: 'Pédagogie',
        pdfUrl: '/publications/methodes-enseignement.pdf'
    },
    {
        id: 'pub-3',
        title: "Évaluation des Apprentissages à Distance",
        author: "Dr. Sarah Mukendi",
        date: "2024-03-08",
        status: 'published',
        category: 'Éducation', 
        pdfUrl: '/publications/evaluation-distance.pdf'
    },
    {
        id: 'pub-4',
        title: "Intelligence Artificielle en Éducation",
        author: "Prof. Paul Mbiya",
        date: "2024-03-05",
        status: 'rejected',
        category: 'Technologie',
        pdfUrl: '/publications/ia-education.pdf'
    },
    {
        id: 'pub-5',
        title: "Développement Professionnel des Enseignants",
        author: "Dr. Claire Musau",
        date: "2024-03-01",
        status: 'published',
        category: 'Formation',
        pdfUrl: '/publications/dev-professionnel.pdf'
    },
    {
        id: 'pub-6',
        title: "Inclusion Numérique en Éducation",
        author: "Prof. Marc Kabamba",
        date: "2024-02-28",
        status: 'pending',
        category: 'Technologie',
        pdfUrl: '/publications/inclusion-numerique.pdf'
    },
    {
        id: 'pub-7',
        title: "Apprentissage Collaboratif en Ligne",
        author: "Dr. Alice Kalonda",
        date: "2024-02-25",
        status: 'published',
        category: 'Pédagogie',
        pdfUrl: '/publications/apprentissage-collaboratif.pdf'
    },
    {
        id: 'pub-8',
        title: "Éducation Hybride: Défis et Opportunités",
        author: "Prof. Thomas Mukeba",
        date: "2024-02-20",
        status: 'pending',
        category: 'Recherche',
        pdfUrl: '/publications/education-hybride.pdf'
    },
    {
        id: 'pub-9',
        title: "Compétences Numériques des Étudiants",
        author: "Dr. Emma Tshilombo",
        date: "2024-02-15",
        status: 'published',
        category: 'Technologie',
        pdfUrl: '/publications/competences-numeriques.pdf'
    },
    {
        id: 'pub-10',
        title: "Stratégies d'Évaluation Formative",
        author: "Prof. Robert Kanda",
        date: "2024-02-10",
        status: 'rejected',
        category: 'Évaluation',
        pdfUrl: '/publications/evaluation-formative.pdf'
    },
    {
        id: 'pub-11',
        title: "Innovation Pédagogique en RDC",
        author: "Dr. Sophie Mbuyi",
        date: "2024-02-05",
        status: 'published',
        category: 'Innovation',
        pdfUrl: '/publications/innovation-pedagogique.pdf'
    }
]


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

  const statusStyles = {
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
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

        {/* Dialog for the preview  */}
      <Dialog open={!!selectedPub} onOpenChange={() => setSelectedPub(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogTitle>{selectedPub?.title}</DialogTitle>
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            {selectedPub && (
              <object
                data={selectedPub.pdfUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <p>Le PDF ne peut pas être affiché</p>
              </object>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}