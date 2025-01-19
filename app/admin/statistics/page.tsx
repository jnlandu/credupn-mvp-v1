// app/admin/statistics/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react'

const monthlyData = [
  { month: 'Jan', submissions: 12, publications: 8 },
  { month: 'Fév', submissions: 19, publications: 12 },
  { month: 'Mar', submissions: 15, publications: 10 },
  // Add more months...
]

const quarterlyData = [
  { quarter: 'Q1', submissions: 46, publications: 30 },
  { quarter: 'Q2', submissions: 55, publications: 40 },
  { quarter: 'Q3', submissions: 60, publications: 45 },
  { quarter: 'Q4', submissions: 70, publications: 50 },
]

const yearlyData = [
  { year: '2023', submissions: 231, publications: 150 },
  { year: '2024', submissions: 250, publications: 160 },
]

const categoryData = [
  { name: 'Recherche', value: 35 },
  { name: 'Méthodologie', value: 25 },
  { name: 'Innovation', value: 20 },
  { name: 'Technologie', value: 20 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('year')

  const getData = () => {
    switch (selectedPeriod) {
      case 'month':
        return monthlyData
      case 'quarter':
        return quarterlyData
      case 'year':
      default:
        return yearlyData
    }
  }

  const data = getData()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <Select 
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Publications Totales</p>
                <h3 className="text-2xl font-bold">245</h3>
                <p className="text-sm text-green-600">+12% depuis le mois dernier</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Auteurs Actifs</p>
                <h3 className="text-2xl font-bold">123</h3>
                <p className="text-sm text-green-600">+5% depuis le mois dernier</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Soumissions en Cours</p>
                <h3 className="text-2xl font-bold">18</h3>
                <p className="text-sm text-yellow-600">En attente de révision</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux d'Acceptation</p>
                <h3 className="text-2xl font-bold">76%</h3>
                <p className="text-sm text-green-600">+2% depuis le mois dernier</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Soumissions & Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={selectedPeriod === 'year' ? 'year' : selectedPeriod === 'quarter' ? 'quarter' : 'month'} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#8884d8" name="Soumissions" />
                  <Bar dataKey="publications" fill="#82ca9d" name="Publications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}