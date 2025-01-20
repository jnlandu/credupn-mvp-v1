// app/dashboard/reviewer/[id]/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  ChartBar,
  UserCheck 
} from 'lucide-react'

interface Review {
  id: string
  title: string
  author: string
  submittedDate: string
  status: 'pending' | 'reviewed' | 'rejected'
}

export default function ReviewerDashboard({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const reviewerStats = {
    totalReviews: 15,
    pendingReviews: 3,
    completedReviews: 10,
    rejectedReviews: 2
  }

  const pendingReviews: Review[] = [
    {
      id: 'rev-1',
      title: "L'impact des Technologies Educatives",
      author: "Dr. Marie Kabongo",
      submittedDate: '2024-03-15',
      status: 'pending'
    }
  ]

  const statusColors = {
    pending: 'text-yellow-600',
    reviewed: 'text-green-600',
    rejected: 'text-red-600'
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord Évaluateur</h1>
            <p className="text-gray-500">Gérez vos évaluations et suivez leurs statuts</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total des évaluations</p>
                  <p className="text-2xl font-bold">{reviewerStats.totalReviews}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">En attente</p>
                  <p className="text-2xl font-bold">{reviewerStats.pendingReviews}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Complétées</p>
                  <p className="text-2xl font-bold">{reviewerStats.completedReviews}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejetées</p>
                  <p className="text-2xl font-bold">{reviewerStats.rejectedReviews}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="pending">À évaluer</TabsTrigger>
            <TabsTrigger value="completed">Complétées</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{review.title}</h3>
                        <p className="text-sm text-gray-500">
                          Par {review.author} • Soumis le {new Date(review.submittedDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Évaluer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques d'évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <ChartBar className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 ml-2">Graphique des évaluations</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Publications à évaluer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="py-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{review.title}</h3>
                          <p className="text-sm text-gray-500">
                            Par {review.author} • Soumis le {new Date(review.submittedDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant="outline">En attente</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Voir le document
                        </Button>
                        <Button size="sm">
                          Commencer l'évaluation
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations complétées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  Historique des évaluations
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}