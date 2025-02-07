// app/dashboard/author/[id]/page.tsx
"use client"

import { use, useEffect } from 'react'
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
  UserCheck,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'

interface Publication {
  id: string;
  title: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  created_at: string;
  author: string[] | string;
  user_id: string;
}

interface AuthorStats {
  totalPublications: number;
  pendingSubmissions: number;
  acceptedPublications: number;
  rejectedPublications: number;
}

const statusColors = {
  pending: "text-yellow-600",
  published: "text-green-600",
  rejected: "text-red-600"
} as const;

// Add sidebar width constants
const SIDEBAR_WIDTH = 240
const COLLAPSED_WIDTH = 64


interface PageProps {
  params: Promise<{ id: string }>
}

export default function AuthorDashboard({ params }: PageProps) {

    const { id } = use(params)
    const [isLoading, setIsLoading] = useState(true)
    const [publications, setPublications] = useState<Publication[]>([])
    const [stats, setStats] = useState<AuthorStats>({
      totalPublications: 0,
      pendingSubmissions: 0,
      acceptedPublications: 0,
      rejectedPublications: 0
    })
    const { toast } = useToast()
  

  // Fetch publications and calculate stats
  const fetchPublicationsAndStats = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Fetch user's publications
      const { data: pubs, error } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPublications(pubs)
      // Calculate stats
      const stats = {
        totalPublications: pubs.length,
        pendingSubmissions: pubs.filter((p: any) => p.status === 'PENDING').length,
        acceptedPublications: pubs.filter((p: any) => p.status === 'PUBLISHED').length,
        rejectedPublications: pubs.filter((p: any) => p.status === 'REJECTED').length
      }

      setStats(stats)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos données"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Set up real-time subscription
  useEffect(() => {
    fetchPublicationsAndStats()

    const supabase = createClient()
    const channel = supabase
      .channel('publications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'publications',
          filter: `user_id=eq.${id}`
        },
        () => {
          fetchPublicationsAndStats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])
  
  
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex justify-between items-center mb-8">
        <p className="text-gray-500">Gérez vos soumissions et suivez leurs statuts</p>
            <Button asChild>
              <Link href={`../author/${id}/soumettre`} className="flex items-center">
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
                  <p className="text-2xl font-bold">
                    {isLoading ? '-' : stats.totalPublications}
                  </p>
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
                  <p className="text-2xl font-bold">{stats.pendingSubmissions}</p>
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
                  <p className="text-2xl font-bold">{stats.acceptedPublications}</p>
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
                  <p className="text-2xl font-bold">{stats.rejectedPublications}</p>
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
            {/* <TabsTrigger value="submissions">Mes soumissions</TabsTrigger> */}
            {/* <TabsTrigger value="publications">Publications</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
          <Card>
              <CardHeader>
                <CardTitle>Soumissions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="divide-y">
                    {publications.slice(0, 5).map((pub) => (
                      <div key={pub.id} className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{pub.title}</h3>
                          <p className="text-sm text-gray-500">
                            Soumis le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`text-sm font-medium ${statusColors[pub.status.toLowerCase() as keyof typeof statusColors]}`}>
                          {pub.status === 'PUBLISHED' && 'Publié'}
                          {pub.status === 'PENDING' && 'En attente'}
                          {pub.status === 'REJECTED' && 'Rejeté'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                  List of submissions
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}