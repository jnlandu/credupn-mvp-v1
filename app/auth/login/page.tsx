"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Users, GraduationCap, Globe, Loader2, Eye, EyeOff  } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie'
import { createClient } from '@/utils/supabase/client'
import { saveAuthData } from '@/utils/auth'
// import { createClient } from '@/lib/supabase'
// import { login, signup } from './actions'

// Define role type as union
type Role = "author" | "reviewer" | "admin"

// First define interface for form data
interface LoginFormData {
  email: string;
  password: string;
  role: Role;
  rememberMe: boolean;
}


const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["author", "reviewer","admin"] as const, {
    required_error: "Veuillez sélectionner un rôle",
  }),
  rememberMe: z.boolean().default(false),
})

export default  function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>('author')
  const router = useRouter()
  const { toast } = useToast()
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "author" as Role,
      rememberMe: false,
    },
  })


  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    const supabase = createClient()
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      // Handle specific auth errors
      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          toast({
            variant: "destructive",
            title: "Email non vérifié",
            description: (
              <div className="space-y-2">
                <p>Veuillez vérifier votre email avant de vous connecter.</p>
                <Button 
                  className='text-black'
                  size="sm" 
                  onClick={() => resendVerificationEmail(data.email)}
                >
                  Renvoyer l'email de vérification
                </Button>
              </div>
            ),
            duration: 10000,
          })
          return
        }
        
        if (authError.message.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Compte inexistant",
            description: (
              <div className="space-y-2">
                <p>Aucun compte trouvé avec cet email ou ce mot de passe.</p>
                <Link href="/auth/signup">
                  <Button  size="sm" className='text-black mt-1'>
                    Créer un compte
                  </Button>
                </Link>
              </div>
            ),
          })
          return
        }
        
        throw authError
      }
      // Get user role from profiles table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single()
  
      if (userError) throw userError
      // Verify role matches
      if (userData.role !== selectedRole) {
        throw new Error('Le rôle sélectionné ne correspond pas à votre compte')
      }
      // Save auth data with remember me option
     saveAuthData(
      authData.session?.access_token || '',
      userData.role,
      data.rememberMe
    )
      // Store session data
      Cookies.set('auth-token', authData.session?.access_token || '', {
        path: '/',
        secure: true,
        sameSite: 'strict'
      })
      
      Cookies.set('user-role', userData.role, {
        path: '/',
        secure: true,
        sameSite: 'strict'
      })
  
      toast({
        title: "Connexion réussie",
        description: data.rememberMe ? 
          "Session persistante activée" : 
          "Session temporaire"
      })
  
      // Role-based redirection
      switch (userData.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'author':
          router.push(`/dashboard/author/${authData.user.id}`)
          break
        case 'reviewer':
          router.push(`/dashboard/reviewer/${authData.user.id}`)
          break
        default:
          throw new Error('Rôle non reconnu')
      }
  
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }
//  Google login and Github login
const  handleGoogleLogin = async () => {
  const supabase =   createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback',
    }
  })
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message
    })
  }
}

const handleGithubLogin = async () => {
  const supabase =  createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback',
    }
  })
  
  if (error) {
    toast({
      variant: "destructive", 
      title: "Erreur",
      description: error.message
    })
  }
}

// Add resend verification email function
const resendVerificationEmail = async (email: string) => {
  const supabase = createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible d'envoyer l'email de vérification"
    })
    return
  }

  toast({
    title: "Email envoyé",
    description: "Veuillez vérifier votre boîte de réception"
  })
}



return (
<div className="min-h-[calc(100vh-4rem)] flex">
    {/* Left side - Image and Content */}
    <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
      <Image
        src="/images/library-research.jpg"
        alt="CRIDUPN Research Center"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/50">
        <h1 className="text-4xl font-bold text-white mb-4">
          CRIDUPN
        </h1>
        <p className="text-xl text-white/90 max-w-md mb-8">
          Centre  de Recherche Interdisciplinaire  de l'Université Pédagogique Nationale
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-white/90">
            <BookOpen className="h-6 w-6" />
            <p>Publication de recherches académiques</p>
          </div>
          
          <div className="flex items-center space-x-3 text-white/90">
            <Users className="h-6 w-6" />
            <p>Collaboration entre chercheurs</p>
          </div>
          
          <div className="flex items-center space-x-3 text-white/90">
            <GraduationCap className="h-6 w-6" />
            <p>Développement de  la Recherche scientifique et l'éducation en Afrique et en  RDC</p>
          </div>
          
          <div className="flex items-center space-x-3 text-white/90">
            <Globe className="h-6 w-6" />
            <p>Rayonnement international</p>
          </div>
        </div>

        <div className="mt-12">
          <Badge variant="outline" className="text-white border-white/30">
            Excellence académique
          </Badge>
          <Badge variant="outline" className="ml-2 text-white border-white/30">
            Innovation pédagogique
          </Badge>
          <Badge variant="outline" className="ml-2 text-white border-white/30">
            Recherche avancée
          </Badge>
        </div>
      </div>
    </div>


    {/* Right side - Login form */}
    <div className="w-full lg:w-1/2 flex flex-col">
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Icons.logo className="h-8 w-8" />
            <CardTitle className="text-2xl text-center">CRIDUPN</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={isLoading}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Type de compte</Label>
                <RadioGroup
                    value={selectedRole}
                    onValueChange={(value: Role) => {
                      setSelectedRole(value)
                      form.setValue('role', value) // Update form value
                    }}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="author"
                        id="author"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="author"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary"
                      >
                        <BookOpen className="mb-3 h-6 w-6" />
                        Auteur
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem
                        value="reviewer"
                        id="reviewer"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="reviewer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary"
                      >
                        <Users className="mb-3 h-6 w-6" />
                        Évaluateur
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem
                        value="admin"
                        id="admin"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="admin"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary"
                      >
                        <GraduationCap className="mb-3 h-6 w-6" />
                        Admin
                      </Label>
                    </div>
                  </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...form.register("rememberMe")}
                />
                <Label htmlFor="rememberMe">Se souvenir de moi</Label>
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

            {/* Add social login options after your form fields */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
              <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                >
                  <Icons.google className="h-5 w-5 mr-2" />
                  Google
                </Button>
                <Button 
                variant="outline" 
                type="button" 
                className="w-full" 
                disabled={isLoading}
                onClick={handleGithubLogin}
              >
                <Icons.github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
              </div>
          </form>
          {/* Add signup section */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Pas encore de compte?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/auth/signup" 
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-600">
          <Link
            href="/auth/forgot-password"
            className="hover:text-primary transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </CardFooter>
      </Card>
      </div>
      {/* Footer */}
        <footer className="p-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CRIDUPN. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">
              Conditions
            </Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">
              Contact
            </Link>
          </div>
        </footer>

    </div>
  </div>
  )
}