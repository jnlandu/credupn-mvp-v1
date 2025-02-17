"use client"

import { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from "@/components/ui/card"
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
  Calendar,
  Download, 
  Loader2,
  RefreshCw,
  User2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { AddUserModal } from '@/components/users/AddUserModal'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

/* ------------------------------------------
   TYPES & INTERFACES
---------------------------------------------*/

type UserRole = 'author' | 'reviewer' | 'admin'
const roleTranslations: Record<UserRole, string> = {
  'author': 'Auteur',
  'reviewer': 'Évaluateur',
  'admin': 'Administrateur'
};
const roleStyles: Record<UserRole, string> = {
  author: 'bg-blue-100 text-blue-800',
  reviewer: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800'
}

// Publication statuses & categories (adjust to match your actual data)
type PublicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'PUBLISHED' | 'REJECTED';
type PublicationCategory = 'RESEARCH' | 'METHODOLOGY' | 'REVIEW' | 'OTHER';

// Interface for individual publication (from JSON column)
interface Publication {
  id: number;
  title: string;
  status: PublicationStatus | string;  // if DB uses single letters, adjust as needed
  date: string;
  category: PublicationCategory | string;
  created_at?: string;
  abstract?: string;
  pdf_url?: string;
}

// Match the columns in your `users` table
interface UserWithPublications {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  phone: string | null;
  publication_count: number; // Make this required, not optional
  publications: Publication[] | null;
  created_at?: string;
}

/* ------------------------------------------
   COMPONENT
---------------------------------------------*/

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserWithPublications| null>(null)
  const [selectedUserPubs, setSelectedUserPubs] = useState<UserWithPublications| null>(null)
  const [users, setUsers] = useState<UserWithPublications[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [institutionFilter, setInstitutionFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // const [editingCell, setEditingCell] = useState<{
  //   id: string;
  //   field: string;
  //   value: any;
  // } | null>(null);
  

  // Editing
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null);

  // For the Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<UserWithPublications | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { toast } = useToast()

  // Distinct institutions for the filter dropdown
  const institutions = Array.from(new Set(users.map(user => user.institution)))

  /* ------------------------------------------
     HELPER FUNCTIONS
  ---------------------------------------------*/

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Save an inline edit (double-click cell) to Supabase
  const saveEdit = async (id: string, field: string, value: any) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', id);
  
      if (error) throw error;
  
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, [field]: value } : user
      ));
  
      toast({
        title: "Succès",
        description: "Modification enregistrée"
      });
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la modification"
      });
    } finally {
      setEditingCell(null);
    }
  };

  // Fetch users from Supabase (including publication_count, last_publication_date, etc.)
  const fetchUsersWithPublications = async () => {
    setIsLoading(true);
    
    try {

      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Network response was not ok')
      const data: UserWithPublications[] = await response.json()
      // console.log('Users with publications:', data)
  
      setUsers( data);
  
    } catch (error: any) {
      console.error('Error fetching users:', {
        error,
        type: typeof error,
        message: error?.message || 'Unknown error',
        details: error?.details || {},
        stack: error?.stack
      });
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error?.message || "Impossible de charger les utilisateurs"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh button
  const refreshUsers = async () => {
    setIsRefreshing(true)
    try {
      await fetchUsersWithPublications()
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

  // Handle the Edit User form in the modal
  const getCurrentUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userToEdit) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      // Check if current user has admin rights (if your logic requires)
      const currentUser = await getCurrentUser()
      console.log('Current user:', currentUser)

      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      // Perform update
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          name: userToEdit.name,
          email: userToEdit.email,
          role: userToEdit.role,
          institution: userToEdit.institution,
          phone: userToEdit.phone,
        })
        .eq('id', userToEdit.id)
        .select('*')
        .single()

      if (updateError) {
        console.error('Update error details:', updateError)
        throw new Error(updateError.message || 'Failed to update user')
      }

      if (!updatedUser) {
        throw new Error('No data returned after update')
      }

      console.log('Update successful:', updatedUser)

      // Update local state
      setUsers(prev => 
        prev.map(u => u.id === userToEdit.id ? updatedUser : u)
      )
      setIsEditModalOpen(false)
      setUserToEdit(null)
      await fetchUsersWithPublications()

      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès"
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Update failed:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de mettre à jour l'utilisateur: ${errorMessage}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* ------------------------------------------
     LIFECYCLE
  ---------------------------------------------*/

  useEffect(() => {
    fetchUsersWithPublications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ------------------------------------------
     FILTERING & PAGINATION
  ---------------------------------------------*/

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = (roleFilter === 'all') || (user.role === roleFilter)
    const matchesInstitution = (institutionFilter === 'all') || (user.institution === institutionFilter)

    return matchesSearch && matchesRole && matchesInstitution
  })

  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  /* ------------------------------------------
     RENDER
  ---------------------------------------------*/

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-sm text-gray-500">Gérer les utilisateurs, ajouter un auteur, un lecteur, etc.</p>
        </div>
        <div className="flex items-center gap-4">
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
            {/* Role filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="author">Auteur</SelectItem>
                <SelectItem value="reviewer">Évaluateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>

            {/* Institution filter */}
            <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
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

            {/* Search */}
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

          {/* Add User Button */}
          <AddUserModal onRefresh={fetchUsersWithPublications} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
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
              ) : currentUsers.map((user, index) => (
                <TableRow key={user.id}>
                  {/* Index */}
                  <TableCell className="font-medium text-gray-950">
                    {startIndex + index + 1}
                  </TableCell>

                  {/* Name (inline editing) */}
                  <TableCell 
                    className="font-medium"
                    onDoubleClick={() => setEditingCell({
                      id: user.id,
                      field: 'name',
                      value: user.name
                    })}
                  >
                    {editingCell?.id === user.id && editingCell.field === 'name' ? (
                      <Input
                        autoFocus
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({
                          ...editingCell,
                          value: e.target.value
                        })}
                        onBlur={() => saveEdit(user.id, 'name', editingCell.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit(user.id, 'name', editingCell.value)
                          } else if (e.key === 'Escape') {
                            setEditingCell(null)
                          }
                        }}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>

                  {/* Email (inline editing) */}
                  <TableCell
                    onDoubleClick={() => setEditingCell({
                      id: user.id,
                      field: 'email',
                      value: user.email
                    })}
                  >
                    {editingCell?.id === user.id && editingCell.field === 'email' ? (
                      <Input
                        type="email"
                        autoFocus
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({
                          ...editingCell,
                          value: e.target.value
                        })}
                        onBlur={() => saveEdit(user.id, 'email', editingCell.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit(user.id, 'email', editingCell.value)
                          } else if (e.key === 'Escape') {
                            setEditingCell(null)
                          }
                        }}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>

                  {/* Role (inline editing) */}
                  <TableCell>
                    {editingCell?.id === user.id && editingCell.field === 'role' ? (
                      <Select
                        value={editingCell.value}
                        onValueChange={(value) => saveEdit(user.id, 'role', value)}
                      >
                        <SelectTrigger>
                          <SelectValue>{editingCell.value}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="author">Auteur</SelectItem>
                          <SelectItem value="reviewer">Évaluateur</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge 
                        className={roleStyles[user.role]}
                        onClick={() => setEditingCell({
                          id: user.id,
                          field: 'role',
                          value: user.role
                        })}
                      >
                       {roleTranslations[user.role]}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Institution (inline editing) */}
                  <TableCell
                    onDoubleClick={() => setEditingCell({
                      id: user.id,
                      field: 'institution',
                      value: user.institution
                    })}
                  >
                    {editingCell?.id === user.id && editingCell.field === 'institution' ? (
                      <Input
                        autoFocus
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({
                          ...editingCell,
                          value: e.target.value
                        })}
                        onBlur={() => saveEdit(user.id, 'institution', editingCell.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit(user.id, 'institution', editingCell.value)
                          } else if (e.key === 'Escape') {
                            setEditingCell(null)
                          }
                        }}
                      />
                    ) : (
                      user.institution
                    )}
                  </TableCell>

                  {/* Phone (inline editing) */}
                  <TableCell
                    onDoubleClick={() => setEditingCell({
                      id: user.id,
                      field: 'phone',
                      value: user.phone || ''
                    })}
                  >
                    {editingCell?.id === user.id && editingCell.field === 'phone' ? (
                      <Input
                        autoFocus
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({
                          ...editingCell,
                          value: e.target.value
                        })}
                        onBlur={() => saveEdit(user.id, 'phone', editingCell.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit(user.id, 'phone', editingCell.value)
                          } else if (e.key === 'Escape') {
                            setEditingCell(null)
                          }
                        }}
                      />
                    ) : (
                      user.phone || "Non enregistré"
                    )}
                  </TableCell>

                  {/* Publications count + quick view */}
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

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* View full details */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Edit user */}
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

                      {/* Delete user (not implemented) */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-gray-900 hover:bg-gray-100"
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

      {/* Pagination */}
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
                          {pub.date ? formatDate(pub.date) : '—'}
                        </span>
                        <Badge
                          className={
                            pub.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : pub.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
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

      {/* Edit User Dialog */}
<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Modifier l'utilisateur</DialogTitle>
    </DialogHeader>

    {userToEdit && (
      <form onSubmit={handleEditUser} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={userToEdit.name}
              onChange={(e) => setUserToEdit({
                ...userToEdit,
                name: e.target.value
              })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userToEdit.email}
              onChange={(e) => setUserToEdit({
                ...userToEdit,
                email: e.target.value
              })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={userToEdit.role}
              onValueChange={(value: UserRole) => setUserToEdit({
                ...userToEdit,
                role: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="author">Auteur</SelectItem>
                <SelectItem value="reviewer">Évaluateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={userToEdit.institution}
              onChange={(e) => setUserToEdit({
                ...userToEdit,
                institution: e.target.value
              })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={userToEdit.phone || ''}
              onChange={(e) => setUserToEdit({
                ...userToEdit,
                phone: e.target.value
              })}
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

      {/* View User Details Dialog */}
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
                      <Badge className={roleStyles[selectedUser.role]}>
                      {roleTranslations[selectedUser.role]}
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

                    {/* created_at, if you have it */}
                    {selectedUser.created_at && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Date d'inscription</p>
                        <p>{formatDate(selectedUser.created_at)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publications */}
                {Array.isArray(selectedUser.publications) && selectedUser.publications.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">
                      Publications ({selectedUser.publications.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedUser.publications.map((pub) => (
                        <div key={pub.id} className="p-4 rounded-lg border">
                          <div className="space-y-2">
                            <h5 className="font-medium">{pub.title}</h5>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {pub.date && <p>{formatDate(pub.date)}</p>}
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
