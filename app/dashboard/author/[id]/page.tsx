// app/dashboard/author/[id]/page.tsx
"use client"

import { use } from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ChartBar,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'

interface Publication {
  id: string
  title: string
  status: 'published' | 'pending' | 'rejected'
  submittedDate: string
}

// Add sidebar width constants
const SIDEBAR_WIDTH = 240
const COLLAPSED_WIDTH = 64


interface PageProps {
  params: {
    id: string
  }
}

export default function AuthorDashboard({ params }: {params: PageProps}) {


  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

//  try{
//   const { id } =  params

//  }catch{

//  }





  // Mock data - replace with actual data fetch
  const authorStats = {
    totalPublications: 5,
    pendingSubmissions: 2,
    acceptedPublications: 3,
    rejectedPublications: 1
  }

  const recentPublications: Publication[] = [
    {
      id: 'pub-1',
      title: "L'impact des Technologies Educatives",
      status: 'published',
      submittedDate: '2024-03-15'
    }
    // Add more publications
  ]

  const statusColors = {
    published: 'text-green-600',
    pending: 'text-yellow-600',
    rejected: 'text-red-600'
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
            
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
        <p className="text-gray-500">Gérez vos soumissions et suivez leurs statuts</p>
            <Button asChild>
              <Link href="/publications/soumettre" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouvelle soumission
              </Link>
            </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Publications totales</p>
                  <p className="text-2xl font-bold">{authorStats.totalPublications}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">En attente</p>
                  <p className="text-2xl font-bold">{authorStats.pendingSubmissions}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Acceptées</p>
                  <p className="text-2xl font-bold">{authorStats.acceptedPublications}</p>
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
                  <p className="text-2xl font-bold">{authorStats.rejectedPublications}</p>
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
            <TabsTrigger value="submissions">Mes soumissions</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Soumissions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {recentPublications.map((pub) => (
                    <div key={pub.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{pub.title}</h3>
                        <p className="text-sm text-gray-500">
                          Soumis le {new Date(pub.submittedDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`text-sm font-medium ${statusColors[pub.status]}`}>
                        {pub.status === 'published' && 'Publié'}
                        {pub.status === 'pending' && 'En attente'}
                        {pub.status === 'rejected' && 'Rejeté'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques de publication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <ChartBar className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 ml-2">Graphique des publications</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Mes soumissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {/* List of submissions */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <Card>
              <CardHeader>
                <CardTitle>Mes publications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {/* List of published papers */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}