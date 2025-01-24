// app/admin/page.tsx
"use client"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NotificationsMenu } from "@/components/notifications"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Description } from '@radix-ui/react-dialog'
import { useToast } from '@/hooks/use-toast'





export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const { toast } = useToast()
  const stats = [
    {
      title: "Publications Totales",
      value: "245",
      icon: BookOpen,
      trend: "+12%",
    },
    {
      title: "Utilisateurs",
      value: "1,234",
      icon: Users,
      trend: "+5%",
    },
    {
      title: "Soumissions en attente",
      value: "23",
      icon: FileText,
      trend: "-2%",
    },
  ]

  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      date: "2024-03-20",
      amount: 299,
      status: "completed",
      customer: "John Doe",
      method: "Carte Bancaire",
    },
    {
      id: "PAY-002",
      date: "2024-03-21",
      amount: 159,
      status: "pending",
      customer: "Jane Doe",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-003",
      date: "2024-03-22",
      amount: 499,
      status: "failed",
      customer: "Alice Smith",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-004",
      date: "2024-03-23",
      amount: 199,
      status: "completed",
      customer: "Bob Johnson",
      method: "Carte Bancaire",
    },
    {
      id: "PAY-005",
      date: "2024-03-24",
      amount: 349,
      status: "pending",
      customer: "Charlie Brown",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-006",
      date: "2024-03-25",
      amount: 99,
      status: "failed",
      customer: "David Wilson",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-007",
      date: "2024-03-26",
      amount: 249,
      status: "completed",
      customer: "Eve Davis",
      method: "Carte Bancaire",
    },
    {
      id: "PAY-008",
      date: "2024-03-27",
      amount: 399,
      status: "pending",
      customer: "Frank Miller",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-009",
      date: "2024-03-28",
      amount: 149,
      status: "failed",
      customer: "Grace Lee",
      method: "Paiement Mobile",
    },
    {
      id: "PAY-010",
      date: "2024-03-29",
      amount: 299,
      status: "completed",
      customer: "Hank Green",
      method: "Paiement Mobile",
    }
  ])
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
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          {/* <Button variant="outline" size="icon"> */}
            <NotificationsMenu />
          {/* </Button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.trend} depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Publications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Publications Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add DataTable component here */}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Nouveaux Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add DataTable component here */}
          </CardContent>
        </Card>
        {/* Historique des paiements */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-8 mt-6">
            <CardTitle>Historique des Paiements</CardTitle>
            <Button onClick={refreshPayments} disabled={isLoading}>
              {isLoading ? "Chargement..." : "Rafraîchir"}
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
            <TableCell>{payment.customer}</TableCell>
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
            <TableCell>{payment.method}</TableCell>
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