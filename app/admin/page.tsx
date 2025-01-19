// app/admin/page.tsx
"use client"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Bell,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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

  return (
    <div className="flex min-h-screen">
   
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
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
        <Card>
          <CardHeader>
            <CardTitle>Nouveaux Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add DataTable component here */}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}