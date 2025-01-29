// app/admin/users/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  BookOpen,
  Mail,
  Phone,
  Building,
  ChevronLeft,
  ChevronRight,
  Calendar, // Add this
  Download,  // Add this if you're using the Download icon 
  Loader2,
  RefreshCw
} from 'lucide-react'
import { AddUserModal } from '@/components/users/AddUserModal'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Publication, User } from '@/data/publications'





export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedUserPubs, setSelectedUserPubs] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [institutionFilter, setInstitutionFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const institutions = Array.from(new Set(users.map(user => user.institution)))
  const { toast } = useToast()


// Fetch users from Supabase
const fetchUsers = async () => {
  const supabase = createClient()
  setIsLoading(true)
  try {
    console.log('Starting users fetch...')
    
    // First fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) throw usersError

    // Then fetch publications for each user
    const usersWithPublications = await Promise.all(
      users.map(async (user) => {
        const { data: pubs, error: pubError } = await supabase
          .from('publications')
          .select(`
            id,
            title,
            status,
            date,
            category,
            pdf_url,
            abstract,
            keywords
          `)
          .eq('author_id', user.id)

        if (pubError) {
          console.error(`Error fetching publications for user ${user.id}:`, pubError)
          return { ...user, publications: [] }
        }

        return {
          ...user,
          publications: pubs || []
        }
      })
    )

    console.log('Fetch completed:', {
      totalUsers: usersWithPublications.length,
      sampleUser: usersWithPublications[0],
      totalPublications: usersWithPublications.reduce(
        (acc, user) => acc + (user.publications?.length || 0), 
        0
      )
    })

    setUsers(usersWithPublications)
  } catch (error) {
    console.error('Error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de charger les utilisateurs et leurs publications"
    })
  } finally {
    setIsLoading(false)
  }
}
// Add useEffect
useEffect(() => {
  fetchUsers()
}, [])



// Update filtered users
const filteredUsers = users.filter(user => {
  const matchesSearch = 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  
  const matchesRole = roleFilter === 'all' || user.role === roleFilter
  const matchesInstitution = institutionFilter === 'all' || user.institution === institutionFilter

  return matchesSearch && matchesRole && matchesInstitution
})

const totalItems = filteredUsers.length
const totalPages = Math.ceil(totalItems / pageSize)
const startIndex = (currentPage - 1) * pageSize
const endIndex = startIndex + pageSize
const currentUsers = filteredUsers.slice(startIndex, endIndex)

// Add refreshUsers function
const refreshUsers = async () => {
  setIsRefreshing(true)
  try {
    await fetchUsers()
    toast({
      title: "Actualisé",
      description: "Liste des utilisateurs mise à jour"
    })
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'actualiser la liste"
    })
  } finally {
    setIsRefreshing(false)
  }
}


  const roleStyles = {
    author: 'bg-blue-100 text-blue-800',
    reviewer: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className=''>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-sm text-gray-500"> Gerer les utilisateurs, ajouter un auteur, un lecteur, etc.</p>
        </div>
        <div className="flex justify-between items-center mb-8 gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshUsers}
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
         <div className="flex items-center gap-4">
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="author">Auteur</SelectItem>
              <SelectItem value="reviewer">Évaluateur</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={institutionFilter}
            onValueChange={setInstitutionFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par institution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les institutions</SelectItem>
              {institutions.map(institution => (
                <SelectItem key={institution} value={institution}>
                  {institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
           <AddUserModal onRefresh={fetchUsers} />
        </div>
      </div>

      {/* <div className="overflow-x-auto rounded-lg border"> */}
      <div className="overflow-x-auto  bg-gray-600 rounded-lg shadow ">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-[25px] text-gray-900 font-semibold">No</TableHead>
                <TableHead className="w-[250px] text-gray-900 font-semibold">Nom</TableHead>
                <TableHead className="w-[250px] text-gray-900 font-semibold">Email</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Rôle</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Institution</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Phone</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Publications</TableHead>
                <TableHead className="w-[100px] text-gray-900 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {currentUsers
                .filter(user => 
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, key) => (
                  <TableRow 
                    key={user.id}
                    // className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-950">{key+1}</TableCell>
                    <TableCell className="font-medium text-gray-950">{user.name}</TableCell>
                    <TableCell className="">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleStyles[user.role]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="">{user.institution}</TableCell>
                    <TableCell className="font-medium text-gray-950">{user.phone || "Non enregistré"}</TableCell>
                    <TableCell className="text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>{user.publications?.length ?? 0}</span>
                        {user.publications?.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => setSelectedUserPubs(user)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        )}
                    </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className=" hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className=" hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className=" hover:text-gray-900 hover:bg-gray-100"
                        >
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
      {/* // Add pagination controls after the table */}
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

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{selectedUser.institution}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Publications</h3>
                <div className="space-y-2">
                  {selectedUser.publications?.map(pub => (
                    <Card key={pub.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{pub.title}</h4>
                            <p className="text-sm text-gray-500">{pub.date}</p>
                          </div>
                          <Badge className={
                            pub.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                            pub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {pub.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Publications Dialog */}
    <Dialog open={!!selectedUserPubs} onOpenChange={() => setSelectedUserPubs(null)}>
    <DialogContent className="max-w-3xl">
        <DialogHeader>
        <DialogTitle>Publications de {selectedUserPubs?.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
            {selectedUserPubs?.publications.map((pub) => (
            <Card key={pub.id} className="p-4">
                <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold mb-2">{pub.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {pub.date}
                    </span>
                    <Badge
                        className={
                        pub.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        pub.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                        }
                    >
                        {pub.status}
                    </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Aperçu
                    </Button>
                    <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                    </Button>
                </div>
                </div>
            </Card>
            ))}
        </div>
    </ScrollArea>
    </DialogContent>
    </Dialog>
    </div>
  )
}