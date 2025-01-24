// app/admin/users/page.tsx
"use client"

import { useState } from 'react'
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
  Download  // Add this if you're using the Download icon 
} from 'lucide-react'
import { AddUserModal } from '@/components/users/AddUserModal'

interface User {
  id: string
  name: string
  email: string
  role: 'author' | 'reviewer' | 'admin'
  institution: string
  phone: string
  publications: {
    id: string
    title: string
    status: 'published' | 'pending' | 'rejected'
    date: string
  }[]
}

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedUserPubs, setSelectedUserPubs] = useState<User | null>(null)


  const users: User[] = [
    {
      id: 'user-1',
      name: 'Dr. Marie Kabongo',
      email: 'marie.k@upn.ac.cd',
      role: 'author',
      institution: 'UPN',
      phone: '+243 123456789',
      publications: [
        {
          id: 'pub-1',
          title: "L'impact des Technologies Educatives",
          status: 'published',
          date: '2024-03-15'
        }
      ]
    },
    // Add more users...
{
  id: 'user-2',
  name: 'Dr. John Doe',
  email: 'john.doe@example.com',
  role: 'reviewer',
  institution: 'Example University',
  phone: '+123 456789012',
  publications: [
    {
      id: 'pub-2',
      title: 'Research on AI',
      status: 'pending',
      date: '2023-11-20'
    }
  ]
},
{
  id: 'user-3',
  name: 'Dr. Jane Smith',
  email: 'jane.smith@example.com',
  role: 'admin',
  institution: 'Tech Institute',
  phone: '+123 987654321',
  publications: [
    {
      id: 'pub-3',
      title: 'Quantum Computing Advances',
      status: 'published',
      date: '2023-10-05'
    }
  ]
},
{
  id: 'user-4',
  name: 'Dr. Alice Johnson',
  email: 'alice.johnson@example.com',
  role: 'author',
  institution: 'Science Academy',
  phone: '+123 123456789',
  publications: [
    {
      id: 'pub-4',
      title: 'Nanotechnology in Medicine',
      status: 'rejected',
      date: '2023-09-15'
    }
  ]
},
{
  id: 'user-5',
  name: 'Dr. Bob Brown',
  email: 'bob.brown@example.com',
  role: 'reviewer',
  institution: 'Research Center',
  phone: '+123 456123789',
  publications: [
    {
      id: 'pub-5',
      title: 'Climate Change Effects',
      status: 'published',
      date: '2023-08-25'
    }
  ]
},
{
  id: 'user-6',
  name: 'Dr. Charlie Davis',
  email: 'charlie.davis@example.com',
  role: 'admin',
  institution: 'Innovation Hub',
  phone: '+123 789456123',
  publications: [
    {
      id: 'pub-6',
      title: 'Blockchain Technology',
      status: 'pending',
      date: '2023-07-30'
    }
  ]
},
{
  id: 'user-7',
  name: 'Dr. Emily Evans',
  email: 'emily.evans@example.com',
  role: 'author',
  institution: 'Tech University',
  phone: '+123 321654987',
  publications: [
    {
      id: 'pub-7',
      title: 'Cybersecurity Trends',
      status: 'published',
      date: '2023-06-10'
    }
  ]
},
{
  id: 'user-8',
  name: 'Dr. Frank Green',
  email: 'frank.green@example.com',
  role: 'reviewer',
  institution: 'Global Institute',
  phone: '+123 654789321',
  publications: [
    {
      id: 'pub-8',
      title: 'Renewable Energy Sources',
      status: 'rejected',
      date: '2023-05-20'
    }
  ]
},
{
  id: 'user-9',
  name: 'Dr. Grace Harris',
  email: 'grace.harris@example.com',
  role: 'admin',
  institution: 'Future Labs',
  phone: '+123 987321654',
  publications: [
    {
      id: 'pub-9',
      title: 'Artificial Intelligence Ethics',
      status: 'published',
      date: '2023-04-15'
    }
  ]
},
{
  id: 'user-10',
  name: 'Dr. Henry King',
  email: 'henry.king@example.com',
  role: 'author',
  institution: 'Tech Research Center',
  phone: '+123 456987123',
  publications: [
    {
      id: 'pub-10',
      title: 'Machine Learning Algorithms',
      status: 'pending',
      date: '2023-03-25'
    }
  ]
}
  ]


  // Add pagination calculation before return
const filteredUsers = users.filter(user => 
user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
user.email.toLowerCase().includes(searchTerm.toLowerCase())
)

const totalItems = filteredUsers.length
const totalPages = Math.ceil(totalItems / pageSize)
const startIndex = (currentPage - 1) * pageSize
const endIndex = startIndex + pageSize
const currentUsers = filteredUsers.slice(startIndex, endIndex)


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
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
           <AddUserModal />
        </div>
      </div>

      {/* <div className="overflow-x-auto rounded-lg border"> */}
      <div className="overflow-x-auto  bg-gray-600 rounded-lg shadow ">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="w-[250px] text-gray-900 font-semibold">Nom</TableHead>
                <TableHead className="w-[250px] text-gray-900 font-semibold">Email</TableHead>
                <TableHead className="w-[150px] text-gray-900 font-semibold">Rôle</TableHead>
                <TableHead className="w-[200px] text-gray-900 font-semibold">Institution</TableHead>
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
                .map((user) => (
                  <TableRow 
                    key={user.id}
                    // className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-950">{user.name}</TableCell>
                    <TableCell className="">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleStyles[user.role]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="">{user.institution}</TableCell>
                    <TableCell className="text-gray-700">
                    <div className="flex items-center gap-2">
                        <span>{user.publications.length}</span>
                        {user.publications.length > 0 && (
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

      {/*  Pagination  */}
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
                  {selectedUser.publications.map(pub => (
                    <Card key={pub.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{pub.title}</h4>
                            <p className="text-sm text-gray-500">{pub.date}</p>
                          </div>
                          <Badge className={
                            pub.status === 'published' ? 'bg-green-100 text-green-800' :
                            pub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                        pub.status === 'published' ? 'bg-green-100 text-green-800' :
                        pub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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