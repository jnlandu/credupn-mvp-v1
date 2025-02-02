// app/admin/page.tsx
"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Loader2,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NotificationsMenu } from "@/components/notifications"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Description } from '@radix-ui/react-dialog'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'


interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  customer_name: string;
  payment_method: string;
}

interface Stats {
  totalPublications: number;
  totalUsers: number;
  pendingSubmissions: number;
}

interface Publication {
  id: string;
  title: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

interface DatabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'reviewer';
  created_at: string;
  institution?: string;
}



export default function AdminDashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<Stats>({
    totalPublications: 0,
    totalUsers: 0,
    pendingSubmissions: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [recentPublications, setRecentPublications] = useState<Publication[]>([])
  const [isLoadingPublications, setIsLoadingPublications] = useState(true)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const { toast } = useToast()

  // Fetch statistics
  const fetchStats = async () => {
    const supabase = createClient()

    try {
      // Get total publications
      const { count: publicationsCount } = await supabase
        .from('publications')
        .select('*', { count: 'exact' })

      // Get total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      // Get pending submissions
      const { count: pendingCount } = await supabase
        .from('publications')
        .select('*', { count: 'exact' })
        .eq('status', 'PENDING')

      setStats({
        totalPublications: publicationsCount || 0,
        totalUsers: usersCount || 0,
        pendingSubmissions: pendingCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques"
      })
    }
  }

  // Add fetch function
  const fetchRecentPublications = async () => {
    const supabase = createClient()
    setIsLoadingPublications(true)
    
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          id,
          title,
          status,
          created_at,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
  
      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
  
      console.log('Fetched publications:', data)
      setRecentPublications(data)
  
    } catch (error) {
      const err = error as DatabaseError
      console.error('Error fetching publications:', {
        code: err.code,
        message: err.message,
        details: err.details,
        hint: err.hint
      })
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de charger les publications récentes"
      })
    } finally {
      setIsLoadingPublications(false)
    }
  }

const fetchRecentUsers = async () => {
    const supabase = createClient()
    setIsLoadingUsers(true)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
  
      if (error) throw error
      setRecentUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les nouveaux utilisateurs"
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }
  
  // Add to useEffect
  useEffect(() => {
    fetchRecentUsers()
  }, [])

// Add to useEffect
useEffect(() => {
  fetchRecentPublications()
}, [])

  // Fetch payments
const fetchPayments = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          users (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPayments = data.map(payment => ({
        id: payment.id,
        date: payment.created_at,
        amount: payment.amount,
        status: payment.status,
        customer_name: payment.users?.name || 'Unknown',
        payment_method: payment.payment_method
      }))

      setPayments(formattedPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paiements"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchStats()
    fetchPayments()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        () => {
          fetchPayments()
          fetchStats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(payments.length / itemsPerPage)


  const refreshPayments = async () => {
    setIsLoading(true)
    try {
      // Appeler votre API pour récupérer les paiements
      const response = await fetch("localhost:8000/payment")
      if (!response.ok) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des paiements"
      })
        throw new Error("Erreur lors de la récupération des paiements")
      }
      const data: any = await response.json()
      setPayments(data)
    } catch (error) {
      console.error("Erreur :", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des paiements"
    })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex min-h-screen">
   
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
            <div className='flex flex-col gap-1'>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className='text-sm text-muted-foreground'>Gerer les publications, les utilisateurs et les paiements</p>
            </div>
            <NotificationsMenu />
          {/* </Button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Publications Totales</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPublications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soumissions en attente</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
            </CardContent>
          </Card>
        </div>

        {/* //  Publications Card component */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Publications Récentes</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchRecentPublications}
                disabled={isLoadingPublications}
              >
                {isLoadingPublications ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Actualiser"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPublications ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : recentPublications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucune publication récente
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentPublications.map((pub: any) => (
                      <TableRow key={pub.id}>
                        <TableCell className="font-medium">{pub.title}</TableCell>
                        <TableCell>{pub.users?.name}</TableCell>
                        <TableCell>
                          {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "bg-opacity-10",
                              pub.status === 'PENDING' && "bg-yellow-500 text-yellow-700",
                              pub.status === 'PUBLISHED' && "bg-green-500 text-green-700",
                              pub.status === 'REJECTED' && "bg-red-500 text-red-700"
                            )}
                          >
                            {pub.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        {/* Recent Users */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Nouveaux Utilisateurs</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchRecentUsers}
              disabled={isLoadingUsers}
            >
              {isLoadingUsers ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Actualiser"
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : recentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucun nouvel utilisateur
                    </TableCell>
                  </TableRow>
                ) : (
                  recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.institution || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "bg-opacity-10",
                            user.role === 'admin' && "bg-red-500 text-red-700",
                            user.role === 'author' && "bg-blue-500 text-blue-700",
                            user.role === 'reviewer' && "bg-purple-500 text-purple-700"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>


        {/* Historique des paiements */}
        <Card>
          <CardHeader>
          <div className="flex justify-between items-center mb-8 mt-6">
              <CardTitle>Historique des Paiements</CardTitle>
              <Button onClick={fetchPayments} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Rafraîchir"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Méthode</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>{payment.customer_name}</TableCell>
                <TableCell>€{payment.amount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

    <div className="flex items-center justify-between px-4 py-4">
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
            Affichage {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, payments.length)} sur {payments.length}
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
      </main>
    </div>
  )
}