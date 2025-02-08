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
  RefreshCw,
  User2
} from 'lucide-react'
import { AddUserModal } from '@/components/users/AddUserModal'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { editedUser, Publication, User, usersWithPubs } from '@/data/publications'
import { Label } from '@/components/ui/label'


type UserRole = 'author' | 'reviewer' | 'admin'
const roleStyles: Record<UserRole, string> = {
  'author': 'bg-blue-100 text-blue-800',
  'reviewer': 'bg-purple-100 text-purple-800',
  'admin': 'bg-red-100 text-red-800'
}

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<usersWithPubs| null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedUserPubs, setSelectedUserPubs] = useState<usersWithPubs | null>(null)
  const [users, setUsers] = useState<usersWithPubs[]>([])
  // const [user, setUser] = useState<User| null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [institutionFilter, setInstitutionFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<usersWithPubs | null>(null)

  const institutions = Array.from(new Set(users.map(user => user.institution)))
  const { toast } = useToast()


// Fetch users from Supabase
const fetchUsers = async () => {
  const supabase = createClient()
  setIsLoading(true)
  try {
    console.log('Starting users fetch...')
    // First try to fetch just users to verify access
    const { error: usersError } = await supabase
    .from('users')
    .select('*')
    .in('role', ['admin', 'author', 'reviewer']) // Filter for all 3 user types
    .order('role', { ascending: true }) // Optional: sort by role
    

    if (usersError) {
      console.error('Users fetch error:', {
        code: usersError.code,
        message: usersError.message,
        details: usersError.details,
        hint: usersError.hint
      })
      throw usersError
    }

    // Then fetch publications separately with author join
    const { data: usersWithPubs, error: pubsError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        institution,
        phone,
        created_at,
        publications!publications_author_id_fkey (
          id,
          title,
          status,
          date,
          category,
          pdf_url,
          abstract,
          keywords
        )
      `)
      .order('created_at', { ascending: false })

    if (pubsError) {
      console.error('Publications join error:', {
        code: pubsError.code,
        message: pubsError.message,
        details: pubsError.details,
        hint: pubsError.hint
      })
      throw pubsError
    }

    setUsers(usersWithPubs || [])
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

// Edit action handler
const getCurrentUser = async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Update handleEditUser function
const handleEditUser = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!userToEdit) return

  const supabase = createClient()
  setIsLoading(true)

  try {
    // Check if current user has admin rights
    const currentUser = await getCurrentUser()
    console.log('Current user:', currentUser)

    if (!currentUser) {
      throw new Error('Not authenticated')
    }

    // Log the update attempt
    console.log('Attempting update with:', {
      userId: userToEdit.id,
      updateData: {
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        institution: userToEdit.institution,
        phone: userToEdit.phone
      },
      currentUserRole: currentUser.role
    })

    // Perform update with error catching
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        institution: userToEdit.institution,
        phone: userToEdit.phone,
        // updated_at: new Date().toISOString()
      })
      .eq('id', userToEdit.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Update error details:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      })
      throw new Error(updateError.message || 'Failed to update user')
    }

    if (!updatedUser) {
      throw new Error('No data returned after update')
    }

    console.log('Update successful:', updatedUser)

    setUsers(prev => 
      prev.map(u => u.id === userToEdit.id ? updatedUser : u)
    )
    setIsEditModalOpen(false)
    setUserToEdit(null)
    await fetchUsers()

    toast({
      title: "Succès",
      description: "Utilisateur mis à jour avec succès"
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Update failed:', {
      error,
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: `Impossible de mettre à jour l'utilisateur: ${errorMessage}`
    })
  } finally {
    setIsLoading(false)
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-gray-500">
                        Chargement des utilisateurs depuis la base de données...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentUsers
                .filter(user => 
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, key) => (
                  <TableRow 
                    key={user.id}
                  >
                    <TableCell className="font-medium text-gray-950">{key+1}</TableCell>
                    <TableCell className="font-medium text-gray-950">{user.name}</TableCell>
                    <TableCell className="">{user.email}</TableCell>
                    <TableCell>
                    <Badge className={roleStyles[user.role as UserRole]}>
                      {user.role}
                    </Badge>
                    </TableCell>
                    <TableCell className="">{user.institution}</TableCell>
                    <TableCell className="font-medium text-gray-950">{user.phone || "Non enregistré"}</TableCell>
                    <TableCell className="text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>
                      {Array.isArray(user.publications) ? user.publications.length : 0}
                      </span>
                      {Array.isArray(user.publications) && user.publications.length > 0 && (
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
                            className="hover:text-gray-900 hover:bg-gray-100"
                            onClick={() => {
                              setUserToEdit(user)
                              setIsEditModalOpen(true)
                            }}
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

      {/* Publications Dialog */}
    <Dialog open={!!selectedUserPubs} onOpenChange={() => setSelectedUserPubs(null)}>
    <DialogContent className="max-w-3xl">
        <DialogHeader>
        <DialogTitle>Publications de {selectedUserPubs?.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
            {selectedUserPubs?.publications?.map((pub) => (
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

  {/*  Edit Users dialog */}
  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Modifier l'utilisateur</DialogTitle>
    </DialogHeader>
    {userToEdit && (
      <form onSubmit={handleEditUser} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              value={userToEdit.name}
              onChange={(e: any) => setUserToEdit({ ...userToEdit, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={userToEdit.email}
              onChange={(e: any) => setUserToEdit({ ...userToEdit, email: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-role">Rôle</Label>
            <Select
              value={userToEdit.role}
              onValueChange={(value: any) => setUserToEdit({ ...userToEdit, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="author">Auteur</SelectItem>
                <SelectItem value="reviewer">Évaluateur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-institution">Institution</Label>
            <Input
              id="edit-institution"
              value={userToEdit.institution}
              onChange={(e: any) => setUserToEdit({ ...userToEdit, institution: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Téléphone</Label>
            <Input
              id="edit-phone"
              value={userToEdit.phone || ''}
              onChange={(e: any) => setUserToEdit({ ...userToEdit, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              'Mettre à jour'
            )}
          </Button>
        </div>
      </form>
    )}
  </DialogContent>
</Dialog>

{/* View all the details for the users */}
<Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
  <DialogContent className="max-w-3xl max-h-[90vh]">
    <DialogHeader>
      <DialogTitle>Détails de l'Utilisateur</DialogTitle>
    </DialogHeader>
    
    {selectedUser && (
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Rôle</p>
                <Badge className={roleStyles[selectedUser.role as UserRole]}>
                  {selectedUser.role}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Téléphone</p>
                <p>{selectedUser.phone || "Non renseigné"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500">Institution</p>
                <p>{selectedUser.institution}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500">Date d'inscription</p>
                <p>{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {/* Publications */}
          {Array.isArray(selectedUser.publications) && selectedUser.publications.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Publications ({selectedUser.publications.length})</h4>
              <div className="space-y-4">
                {selectedUser.publications.map((pub) => (
                  <div key={pub.id} className="p-4 rounded-lg border">
                    <div className="space-y-2">
                      <h5 className="font-medium">{pub.title}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <p>{new Date(pub.date).toLocaleDateString('fr-FR')}</p>
                        <Badge variant="outline">{pub.status}</Badge>
                        <Badge variant="secondary">{pub.category}</Badge>
                      </div>
                      {pub.abstract && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {pub.abstract}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    )}
  </DialogContent>
</Dialog>

</div>
  )
}