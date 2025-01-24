// app/admin/revenue/page.tsx
"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  averageOrderValue: number
  successRate: number
  revenueHistory: {
    date: string
    amount: number
  }[]
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchRevenueData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/revenue')
      if (!response.ok) throw new Error('Failed to fetch revenue data')
      const data: any = await response.json()
      setData(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de revenus",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenueData()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Analyse des Revenus</h1>
        <Button onClick={fetchRevenueData} disabled={isLoading}>
          Actualiser
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{data?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Mensuel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{data?.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valeur Moyenne</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{data?.averageOrderValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +2% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +1% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Évolution des Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}