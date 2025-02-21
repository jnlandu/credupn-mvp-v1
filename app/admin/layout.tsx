// app/admin/layout.tsx
"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

import {
  BookOpen,
  Users,
  FileText,
  Settings,
  DollarSign,
  Loader2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EuroIcon, LogOut, User  } from "lucide-react"
import { NotificationsMenu } from '@/components/notifications'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/utils/supabase/client'




interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAuth = async () => {
      const supabase = createClient();
      
      try {
        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }
        // Get user details including role
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, email, name, role')
          .eq('id', user.id)
          .single();
  
        if (error) throw error;
  
        // Check if user is admin
        if (userData.role !== 'admin') {
          router.push('/unauthorized');
          return;
        }
  
        setAdminUser(userData);
        
      } catch (error) {
        console.error('Admin auth error:', error);
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkAdminAuth();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      router.push('/auth/login')
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!"
      })
      
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter"
      })
    } finally {
      setIsSigningOut(false)
    }
  }
  return (
    <div className="flex min-h-screen">
      {/* Your sidebar code */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white p-6 space-y-6 transition-all duration-300 flex flex-col relative`}>
        <div className="mb-8 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
              <Link href="/admin">Espace Administrateur</Link>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -right-3 top-6 bg-black text-white rounded-full p-1 hover:bg-gray-800"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        
          <nav className="space-y-2 flex-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
            >
              <BookOpen className="h-4 w-4" />
              {isSidebarOpen && 
              <Link  
              href="/admin/publications/" 
              className="ml-2"
              >
                Publications
              </Link>
              }
            </Button>
            
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
            >
              <Users className="h-4 w-4" />
              {isSidebarOpen && 
              <Link href="/admin/users" className="ml-2">
                Utilisateurs
              </Link>
              }
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
            >
              <FileText className="h-4 w-4" />
              {isSidebarOpen &&
              <Link  
              href="/admin/submissions/" 
              className="ml-2"
              >
              Soumissions
            </Link>
              }
            </Button>
            <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
                >
                  <EuroIcon className="h-4 w-4" />
                  {isSidebarOpen && 
                    <Link  
                      href="/admin/payments/" 
                      className="ml-2"
                    >
                      Paiements
                    </Link>
                  }
             </Button>   
          </nav>
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-white ${!isSidebarOpen && 'justify-center'}`}
          >
            <Settings className="h-4 w-4" />
            {isSidebarOpen && 
            <Link  
            href="/admin/settings/" 
            className="ml-2"
            >
            Paramètres
           </Link>
            }
          </Button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-b pb-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Bienvenue, {adminUser?.name}</h1>
              <p className="text-sm text-muted-foreground">
                Gerer les publications, les utilisateurs et les paiements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationsMenu />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/admin.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                      {adminUser?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                      {adminUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link  
                      href="/admin/settings/" 
                      className="ml-2"
                      >
                      Paramètres
                    </Link>
                    {/* <span>Paramètres</span> */}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 cursor-pointer"
                    onClick={()=> handleSignOut()}
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {children}
      </div>
        </main>
      <Toaster />
    </div>
  )
}