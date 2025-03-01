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
  category?: string;
  abstract?: string;
  keywords?: string[];
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
      // Get current user's publications
      const { data: pubs, error } = await supabase
      .from('publications')
      .select('*')
      .is('deleted_at', null) // Filter out soft deleted
      .neq('status', 'DELETED') // Also check status
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
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      {/*  Stats overview  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold">
                {stats.totalPublications}
              </div>
              <p className="text-xs md:text-sm text-gray-500">Publications totales</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold text-yellow-700">
                {stats.pendingSubmissions}
              </div>
              <p className="text-xs md:text-sm text-gray-500">En attente</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 sm:col-span-2 md:col-span-1">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold text-green-700">
                {stats.acceptedPublications}
              </div>
              <p className="text-xs md:text-sm text-gray-500">Acceptées</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 sm:col-span-2 md:col-span-1">
          <CardContent className="pt-4 md:pt-6 px-3 md:px-6 py-3 md:py-6">
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-4xl font-bold text-red-700">
                {stats.rejectedPublications}
                </div>
              <p className="text-xs md:text-sm text-gray-500">Rejetées</p>
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
              <CardHeader className="px-4 md:px-6 py-3 md:py-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">Soumissions récentes</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6 py-0 md:py-0">
                {isLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {publications.slice(0, 5).map((pub) => (
                      <div 
                         key={pub.id} 
                         className="py-4 flex items-center justify-between"
                        >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{pub.title}</h3>
                            <span className={`text-sm font-medium ${statusColors[pub.status.toLowerCase() as keyof typeof statusColors]}`}>
                              {pub.status === 'PUBLISHED' && 'Publié'}
                              {pub.status === 'PENDING' && 'En attente'}
                              {pub.status === 'REJECTED' && 'Rejeté'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Soumis le:</span>{' '}
                              {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            
                            <div>
                              <span className="font-medium">Catégorie:</span>{' '}
                              {pub.category || 'Non spécifié'}
                            </div>
                            
                            <div>
                              <span className="font-medium">Auteur(s):</span>{' '}
                              {Array.isArray(pub.author) ? pub.author.join(', ') : pub.author}
                            </div>
                          </div>
                          
                          {pub.abstract && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {pub.abstract}
                              </p>
                            </div>
                          )}
                          
                          {pub.keywords && (
                            <div className="flex gap-2 mt-2">
                              {pub.keywords.map((keyword: string, index: number) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
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