// app/admin/page.tsx
"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Loader2,
  RefreshCw,
  FileCheck,
  CreditCard,
  ArrowUpRight,
  UserPlus,
  CalendarRange,
  BarChart3,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NotificationsMenu } from "@/components/notifications"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Description } from '@radix-ui/react-dialog'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  customer_name: string;
  created_at: string;
  payment_method: string;
  order_number: string;
  reference_number: string; 
  customer_email: string;
  publication_id: string;

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
  author: string[] | string;
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

type PublicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'PUBLISHED' | 'REJECTED';

const statusLabels: Record<PublicationStatus, string> = {
  PENDING: 'En attente',
  UNDER_REVIEW: 'En cours d\'évaluation',
  PUBLISHED: 'Publié',
  REJECTED: 'Rejeté'
};

const statusStyles: Record<PublicationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

interface MonthlyStats {
  month: string;
  publications: number;
  users: number;
  payments: number;
  amount: number;
}

interface YearlyStats {
  year: string;
  publications: number;
  users: number;
  payments: number;
  amount: number;
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
  const [publicationPage, setPublicationPage] = useState(1)
  const [publicationsPerPage, setPublicationsPerPage] = useState(5)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null);

  const [editingUserCell, setEditingUserCell] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null);

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  

  
  // Add save funct

  const indexOfLastPublication = publicationPage * publicationsPerPage
  const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage
  const currentPublications = recentPublications.slice(indexOfFirstPublication, indexOfLastPublication)
  const totalPublicationPages = Math.ceil(recentPublications.length / publicationsPerPage)
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
          author
        `)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        // .limit(5)
  
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

      setPayments(data)
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
  
      setPayments(data)
      toast({
        title: "Succès",
        description: "Liste des paiements actualisée"
      })
    } catch (error) {
      console.error("Erreur :", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'actualiser les paiements"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveEdit = async (id: string, field: string, value: any) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('publications')
        .update({ [field]: value })
        .eq('id', id);
  
      if (error) throw error;
  
      // Update local state
      setRecentPublications(publications => 
        publications.map(pub => 
          pub.id === id ? { ...pub, [field]: value } : pub
        )
      );
  
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

  const saveUserEdit = async (id: string, field: string, value: any) => {
    const supabase = createClient();
    
    try {
      // Log the attempt
      console.log('Attempting to save edit:', { id, field, value });
  
      // If editing email, check if it already exists
      if (field === 'email') {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', value)
          .neq('id', id)
          .single();
  
        if (checkError) {
          console.error('Email check error:', {
            code: checkError.code,
            message: checkError.message,
            details: checkError.details
          });
        }
  
        if (existingUser) {
          toast({
            title: "Email déjà utilisé",
            description: "Cet email est déjà associé à un autre compte",
            variant: "default"
          });
          setEditingUserCell(null);
          return;
        }
      }
  
      // Log update attempt
      console.log('Updating user:', { id, field, value });
  
      const { data, error } = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', id)
        .select();
  
      if (error) {
        console.error('Supabase error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
  
      console.log('Update successful:', data);
  
      // Update local state
      setRecentUsers(users => 
        users.map(user => 
          user.id === id ? { ...user, [field]: value } : user
        )
      );
  
      toast({
        title: "Succès",
        description: "Modification enregistrée"
      });
    } catch (error: any) {
      // Check for unique constraint violation
      if (error?.code === '23505' || error?.message?.includes('duplicate key')) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un autre compte. Veuillez en utiliser un autre.",
          variant: "default" // Using default instead of destructive for better UX
        });
      } else {
        console.error('Error saving user edit:', {
          error,
          type: typeof error,
          message: error?.message || 'Unknown error',
          details: error?.details || {},
          stack: error?.stack
        });
    
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'enregistrer la modification"
        });
      }
    } finally {
      setEditingUserCell(null);
    }
  }


  // Add new function to fetch analytics data
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    const supabase = createClient()
    
    try {
      // This would ideally be a proper database query
      // For now, we'll simulate by processing the payments data
      
      // Fetch all required data
      const [paymentsRes, publicationsRes, usersRes] = await Promise.all([
        supabase.from('payments').select('*').order('created_at', { ascending: true }),
        supabase.from('publications').select('*'),
        supabase.from('users').select('*')
      ])
      
      if (paymentsRes.error) throw paymentsRes.error
      if (publicationsRes.error) throw publicationsRes.error
      if (usersRes.error) throw usersRes.error
      
      const allPayments = paymentsRes.data
      const allPublications = publicationsRes.data
      const allUsers = usersRes.data
      
      // Process data into monthly and yearly stats
      const monthlyData: Record<string, MonthlyStats> = {}
      const yearlyData: Record<string, YearlyStats> = {}
      
      // Process publications
      allPublications.forEach(pub => {
        const date = new Date(pub.created_at)
        const year = date.getFullYear().toString()
        const month = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        
        if (!monthlyData[month]) {
          monthlyData[month] = { 
            month, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        if (!yearlyData[year]) {
          yearlyData[year] = { 
            year, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        
        monthlyData[month].publications++
        yearlyData[year].publications++
      })
      
      // Process users
      allUsers.forEach(user => {
        const date = new Date(user.created_at)
        const year = date.getFullYear().toString()
        const month = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        
        if (!monthlyData[month]) {
          monthlyData[month] = { 
            month, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        if (!yearlyData[year]) {
          yearlyData[year] = { 
            year, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        
        monthlyData[month].users++
        yearlyData[year].users++
      })
      
      // Process payments
      allPayments.forEach(payment => {
        const date = new Date(payment.created_at)
        const year = date.getFullYear().toString()
        const month = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        
        if (!monthlyData[month]) {
          monthlyData[month] = { 
            month, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        if (!yearlyData[year]) {
          yearlyData[year] = { 
            year, 
            publications: 0, 
            users: 0, 
            payments: 0,
            amount: 0 
          }
        }
        
        monthlyData[month].payments++
        monthlyData[month].amount += payment.amount
        
        yearlyData[year].payments++
        yearlyData[year].amount += payment.amount
      })
      
      // Convert to arrays and sort
      const monthlyStatsArray = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
      const yearlyStatsArray = Object.values(yearlyData).sort((a, b) => a.year.localeCompare(b.year))
      
      setMonthlyStats(monthlyStatsArray)
      setYearlyStats(yearlyStatsArray)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données analytiques"
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }
  
  // Add fetchAnalytics to useEffect
  useEffect(() => {
    fetchStats()
    fetchPayments()
    fetchAnalytics()
    
    // Keep existing real-time subscription code
  }, [])

  // Calculate trends (percentage changes from previous period)
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return 100 // If previous was 0, consider it 100% growth
    return Math.round(((current - previous) / previous) * 100)
  }

  // Get data for current and previous month to calculate trends
  const currentMonthIndex = monthlyStats.length - 1
  const previousMonthIndex = monthlyStats.length - 2
  
  const currentMonth = currentMonthIndex >= 0 ? monthlyStats[currentMonthIndex] : null
  const previousMonth = previousMonthIndex >= 0 ? monthlyStats[previousMonthIndex] : null
  
  // Calculate monthly trends
  const publicationsTrend = currentMonth && previousMonth 
    ? calculateTrend(currentMonth.publications, previousMonth.publications)
    : 0
  
  const usersTrend = currentMonth && previousMonth
    ? calculateTrend(currentMonth.users, previousMonth.users)
    : 0
  
  const paymentsTrend = currentMonth && previousMonth
    ? calculateTrend(currentMonth.payments, previousMonth.payments)
    : 0
  
  // Format the month names for display
  const formatMonthName = (monthStr: string): string => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  // Filter monthly stats for the selected year
  const filteredMonthlyStats = monthlyStats.filter(stat => 
    stat.month.startsWith(selectedYear)
  )
  
  return (
    <div className="flex min-h-screen">
      
   
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Publications Totales</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPublications}</div>
            <p className="text-xs text-muted-foreground mt-1">Documents publiés</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Comptes actifs</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Soumissions en attente</CardTitle>
            <FileCheck className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Nécessitent une révision</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
            <CreditCard className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Transactions enregistrées</p>
          </CardContent>
        </Card>
        </div>
         {/* //  Publications Card component */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
              <CardTitle>Récentes Soummissions</CardTitle>
              <CardDescription>Double-cliquez sur une cellule pour la modifier</CardDescription>
              </div>
              <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchRecentPublications}
              disabled={isLoadingPublications}
              className="gap-2"
            >
              {isLoadingPublications ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </>
              )}
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/admin/publications">
                <ArrowUpRight className="h-4 w-4" />
                Voir tout
              </Link>
            </Button>
          </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur(e)s</TableHead>
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
                    currentPublications.map((pub: any) => (
                      <TableRow key={pub.id}>
                         <TableCell className="font-medium">{pub.id}</TableCell>
                         <TableCell 
                          className="font-medium"
                          onDoubleClick={() => setEditingCell({
                            id: pub.id,
                            field: 'title',
                            value: pub.title || ''
                          })}
                        >
                          {editingCell?.id === pub.id && editingCell?.field === 'title' ? (
                            <Input
                              autoFocus
                              value={editingCell.value}
                              onChange={(e) => setEditingCell({
                                ...editingCell,
                                value: e.target.value
                              })}
                              onBlur={() => saveEdit(pub.id, 'title', editingCell.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveEdit(pub.id, 'title', editingCell.value)
                                } else if (e.key === 'Escape') {
                                  setEditingCell(null)
                                }
                              }}
                              className="min-w-[200px]"
                            />
                          ) : (
                            pub.title
                          )}
                        </TableCell>
                        <TableCell
                        onDoubleClick={() => setEditingCell({
                          id: pub.id,
                          field: 'author',
                          value: Array.isArray(pub.author) 
                            ? pub.author.join(', ') 
                            : pub.author || ''
                        })}
                  
                      >
                        {editingCell?.id === pub.id && editingCell?.field === 'author' ? (
                          <Input
                            autoFocus
                            value={editingCell.value || ''}
                            onChange={(e) => setEditingCell({
                              ...editingCell,
                              value: e.target.value
                            })}
                            onBlur={() => saveEdit(pub.id, 'author', editingCell.value?.split(', ').filter(Boolean) || [])}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveEdit(pub.id, 'author', editingCell.value?.split(', ').filter(Boolean) || [])
                                } else if (e.key === 'Escape') {
                                  setEditingCell(null)
                                }
                              }}
                            className="min-w-[200px]"
                            placeholder="Séparez les auteurs par des virgules"
                          />
                        ) : (
                          Array.isArray(pub.author) ? pub.author.join(', ') : pub.author || ''
                        )}
                      </TableCell>
                        <TableCell>
                          {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                          <TableCell>
                          {editingCell?.id === pub.id && editingCell?.field === 'status' ? (
                            <Select
                              value={editingCell?.value as PublicationStatus}
                              onValueChange={(value: PublicationStatus) => {
                                saveEdit(pub.id, 'status', value);
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue>{statusLabels[editingCell?.value as PublicationStatus]}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">En attente</SelectItem>
                                {/* <SelectItem value="UNDER_REVIEW">En cours d'évaluation</SelectItem> */}
                                <SelectItem value="PUBLISHED">Publié</SelectItem>
                                <SelectItem value="REJECTED">Rejeté</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge 
                              className={`cursor-pointer ${statusStyles[pub.status as PublicationStatus]}`}
                              onClick={() => setEditingCell({
                                id: pub.id,
                                field: 'status',
                                value: pub.status as PublicationStatus
                              })}
                            >
                              {statusLabels[pub.status as PublicationStatus]}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
                  {/* Add pagination controls */}
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded p-1"
                        value={publicationsPerPage}
                        onChange={(e: any) => {
                          setPublicationsPerPage(Number(e.target.value))
                          setPublicationPage(1)
                        }}
                      >
                        <option value={5}>5 par page</option>
                        <option value={10}>10 par page</option>
                        <option value={20}>20 par page</option>
                      </select>
                      <span className="text-sm text-gray-600">
                        Affichage {indexOfFirstPublication + 1} à {Math.min(indexOfLastPublication, recentPublications.length)} sur {recentPublications.length}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPublicationPage(1)}
                        disabled={publicationPage === 1}
                      >
                        {"<<"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPublicationPage((prev) => Math.max(prev - 1, 1))}
                        disabled={publicationPage === 1}
                      >
                        Précédent
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPublicationPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={publicationPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPublicationPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPublicationPage((prev) => Math.min(prev + 1, totalPublicationPages))}
                        disabled={publicationPage === totalPublicationPages}
                      >
                        Suivant
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPublicationPage(totalPublicationPages)}
                        disabled={publicationPage === totalPublicationPages}
                      >
                        {">>"}
                      </Button>
                    </div>
                  </div>
            </CardContent>
          </Card>

        {/* Recent Users */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Nouveaux Utilisateurs</CardTitle>
              <CardDescription>Les derniers utilisateurs inscrits. Double cliquez une cellule pour la modifer.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchRecentUsers}
                disabled={isLoadingUsers}
                className="gap-2"
              >
                {isLoadingUsers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Actualiser
                  </>
                )}
              </Button>
              <Button asChild size="sm" className="gap-2">
                <Link href="/admin/users">
                  <UserPlus className="h-4 w-4" />
                  Gérer
                </Link>
              </Button>
            </div>
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
                        <TableCell 
                          className="font-medium"
                          onDoubleClick={() => setEditingUserCell({
                            id: user.id,
                            field: 'name',
                            value: user.name || ''
                          })}
                        >
                          {editingUserCell?.id === user.id && editingUserCell.field === 'name' ? (
                            <Input
                              autoFocus
                              value={editingUserCell.value}
                              onChange={(e) => setEditingUserCell({
                                ...editingUserCell,
                                value: e.target.value
                              })}
                              onBlur={() => saveUserEdit(user.id, 'name', editingUserCell.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveUserEdit(user.id, 'name', editingUserCell.value)
                                } else if (e.key === 'Escape') {
                                  setEditingUserCell(null)
                                }
                              }}
                            />
                          ) : (
                            user.name
                          )}
                        </TableCell>
                        <TableCell
                          onDoubleClick={() => setEditingUserCell({
                            id: user.id,
                            field: 'email',
                            value: user.email || ''
                          })}
                        >
                          {editingUserCell?.id === user.id && editingUserCell.field === 'email' ? (
                            <Input
                              autoFocus
                              type="email"
                              value={editingUserCell.value}
                              onChange={(e) => setEditingUserCell({
                                ...editingUserCell,
                                value: e.target.value
                              })}
                              onBlur={() => saveUserEdit(user.id, 'email', editingUserCell.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveUserEdit(user.id, 'email', editingUserCell.value)
                                } else if (e.key === 'Escape') {
                                  setEditingUserCell(null)
                                }
                              }}
                            />
                          ) : (
                            user.email
                          )}
                        </TableCell>
                        <TableCell
                          onDoubleClick={() => setEditingUserCell({
                            id: user.id,
                            field: 'institution',
                            value: user.institution || ''
                          })}
                        >
                          {editingUserCell?.id === user.id && editingUserCell.field === 'institution' ? (
                            <Input
                              autoFocus
                              value={editingUserCell.value}
                              onChange={(e) => setEditingUserCell({
                                ...editingUserCell,
                                value: e.target.value
                              })}
                              onBlur={() => saveUserEdit(user.id, 'institution', editingUserCell.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveUserEdit(user.id, 'institution', editingUserCell.value)
                                } else if (e.key === 'Escape') {
                                  setEditingUserCell(null)
                                }
                              }}
                            />
                          ) : (
                            user.institution || 'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {editingUserCell?.id === user.id && editingUserCell.field === 'role' ? (
                            <Select
                              value={editingUserCell.value}
                              onValueChange={(value) => saveUserEdit(user.id, 'role', value)}
                            >
                              <SelectTrigger>
                                <SelectValue>{editingUserCell.value}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="author">Auteur</SelectItem>
                                <SelectItem value="reviewer">Évaluateur</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              className={cn(
                                "bg-opacity-10 cursor-pointer",
                                user.role === 'admin' && "bg-red-500 text-red-700",
                                user.role === 'author' && "bg-blue-500 text-blue-700", 
                                user.role === 'reviewer' && "bg-purple-500 text-purple-700"
                              )}
                              onClick={() => setEditingUserCell({
                                id: user.id,
                                field: 'role',
                                value: user.role
                              })}
                            >
                              {user.role}
                            </Badge>
                          )}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Derniers Paiements</CardTitle>
              <CardDescription>Transactions récentes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshPayments}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Actualiser
                  </>
                )}
              </Button>
              <Button asChild size="sm" className="gap-2">
                <Link href="/admin/payments">
                  <ArrowUpRight className="h-4 w-4" />
                  Voir tout
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Code de reference</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>No Publication</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Méthode</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.customer_name}</TableCell>
                <TableCell>{payment.customer_email}</TableCell>
                <TableCell>{payment.reference_number}</TableCell>
                <TableCell>{payment.order_number}</TableCell>
                <TableCell>{payment.publication_id}</TableCell>
                <TableCell>
                  {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                </TableCell>
                {/* <TableCell>{payment.customer_name}</TableCell> */}
                <TableCell>{payment.amount} USD</TableCell>
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
        {/* Analytics Overview */}
<Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Analyse des Performances</CardTitle>
              <CardDescription>Évolution des publications, utilisateurs et transactions</CardDescription>
            </div>
            
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px]">
                <CalendarRange className="h-4 w-4 mr-2" />
                <SelectValue>{selectedYear}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {yearlyStats.map(stat => (
                  <SelectItem key={stat.year} value={stat.year}>{stat.year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Données Mensuelles
              </TabsTrigger>
              <TabsTrigger value="yearly" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Données Annuelles
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Graphique
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Mois</TableHead>
                      <TableHead className="font-semibold">Publications</TableHead>
                      <TableHead className="font-semibold">Utilisateurs</TableHead>
                      <TableHead className="font-semibold">Paiements</TableHead>
                      <TableHead className="font-semibold">Montant (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : filteredMonthlyStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucune donnée disponible pour l'année sélectionnée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMonthlyStats.map((stat) => (
                        <TableRow key={stat.month}>
                          <TableCell className="font-medium">{formatMonthName(stat.month)}</TableCell>
                          <TableCell>{stat.publications}</TableCell>
                          <TableCell>{stat.users}</TableCell>
                          <TableCell>{stat.payments}</TableCell>
                          <TableCell>{stat.amount.toFixed(2)} USD</TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Total row for the filtered data */}
                    {filteredMonthlyStats.length > 0 && (
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="font-bold">
                          {filteredMonthlyStats.reduce((sum, stat) => sum + stat.publications, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {filteredMonthlyStats.reduce((sum, stat) => sum + stat.users, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {filteredMonthlyStats.reduce((sum, stat) => sum + stat.payments, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {filteredMonthlyStats
                            .reduce((sum, stat) => sum + stat.amount, 0)
                            .toFixed(2)} USD
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="yearly">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Année</TableHead>
                      <TableHead className="font-semibold">Publications</TableHead>
                      <TableHead className="font-semibold">Utilisateurs</TableHead>
                      <TableHead className="font-semibold">Paiements</TableHead>
                      <TableHead className="font-semibold">Montant (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : yearlyStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucune donnée disponible
                        </TableCell>
                      </TableRow>
                    ) : (
                      yearlyStats.map((stat) => (
                        <TableRow key={stat.year}>
                          <TableCell className="font-medium">{stat.year}</TableCell>
                          <TableCell>{stat.publications}</TableCell>
                          <TableCell>{stat.users}</TableCell>
                          <TableCell>{stat.payments}</TableCell>
                          <TableCell>{stat.amount.toFixed(2)} USD</TableCell>
                        </TableRow>
                      ))
                    )}
                    
                    {/* Add Grand Total row */}
                    {yearlyStats.length > 0 && (
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total Global</TableCell>
                        <TableCell className="font-bold">
                          {yearlyStats.reduce((sum, stat) => sum + stat.publications, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {yearlyStats.reduce((sum, stat) => sum + stat.users, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {yearlyStats.reduce((sum, stat) => sum + stat.payments, 0)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {yearlyStats
                            .reduce((sum, stat) => sum + stat.amount, 0)
                            .toFixed(2)} USD
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="chart">
              {analyticsLoading ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={filteredMonthlyStats.map(stat => ({
                        ...stat,
                        month: formatMonthName(stat.month)
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="publications"
                        name="Publications"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        name="Utilisateurs"
                        stroke="#10b981"
                      />
                      <Line
                        type="monotone"
                        dataKey="payments"
                        name="Paiements"
                        stroke="#8b5cf6"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </main>
    </div>
  )
}