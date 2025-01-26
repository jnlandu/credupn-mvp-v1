// app/auth/signup/page.tsx
"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2,
   ArrowLeft, 
   GraduationCap, 
   BookOpen, 
   Globe, 
   Users, 
   Mail, 
   Building2, 
   Lock, 
   User,
   Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Icons } from "@/components/icons"
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/utils/supabase/client'


const signupSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  institution: z.string().min(2, "Institution requise"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
  role: z.enum(["admin", "author", "reviewer", ""]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type SignupData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 3
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  })

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true)
    const supabase =  createClient()
    try {
      // 1. Create auth user in Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            institution: data.institution,
            role: data.role,
          }
        }
      })
  
      if (signUpError) throw signUpError
      // 2. Create user record immediately after signup
      if (authData.user?.id) {
        console.log('Debugging user session:', authData.session?.user)
        console.log('Debugging user:', authData.user)
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              name: data.name,        
              role: data.role,
              institution: data.institution,
              created_at: new Date().toISOString(), 
            }
          ])
  
          if (insertError) {
            console.error('Insert Error:', insertError)
            throw new Error('Failed to create user profile')
          }
      }
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      })
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
      // // Optional: Auto-login after signup
      // const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      //   email: data.email,
      //   password: data.password,
      // })
  
      // if (signInError) throw new Error(signInError.message)
  
      // // Store session
      // Cookies.set('auth-token', sessionData.session?.access_token || '', {
      //   secure: true,
      //   sameSite: 'strict'
      // })
      // Redirect based on role
      // switch (data.role) {
      //   case 'admin':
      //     router.push('/admin')
      //     break
      //   case 'author':
      //     router.push(`/dashboard/author/${authData.user?.id}`)
      //     break
      //   case 'reviewer':
      //     router.push(`/dashboard/reviewer/${authData.user?.id}`)
      //     break
      //   default:
      //     router.push('/dashboard')
      // }
  
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
      console.error('Signup Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

 // Update OAuth handlers
const handleGoogleSignup = async () => {
  const supabase = createClient()
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
  
  const handleGithubSignup = async () => {
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

  return (
    <div className="min-h-screen flex">
        {/* * Left side - Image and Content */} 
    <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
      <Image
        src="/images/library-bg.jpg"
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
          Centre de Recherche Interdisciplinaire de l'Université Pédagogique Nationale
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
            <p>Développement de la recherche scientifique</p>
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
    {/* Right side - Signup form */}
    <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-4">
            <Button
              variant="ghost"
              className="w-fit"
              asChild
            >
              <Link href="/auth/login" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>

            <Card className="border-2">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez notre communauté de chercheurs
                </CardDescription>
                <div className="flex justify-between mt-4">
                  {Array.from({length: totalSteps}).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 mx-1 rounded-full ${
                        index + 1 <= step ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="relative">
                        <Label htmlFor="name">Nom complet</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            className="pl-10"
                            {...form.register("name")}
                            disabled={isLoading}
                          />
                        </div>
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            {...form.register("email")}
                            disabled={isLoading}
                          />
                        </div>
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <Label htmlFor="institution">Institution</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="institution"
                            className="pl-10"
                            {...form.register("institution")}
                            disabled={isLoading}
                          />
                        </div>
                        {form.formState.errors.institution && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.institution.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...form.register("password")}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {form.watch("password") && (
                        <Progress 
                          value={calculatePasswordStrength(form.watch("password"))} 
                          className="h-1 mt-2"
                        />
                      )}
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          {...form.register("confirmPassword")}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      {form.watch("confirmPassword") && (
                        <div className="mt-1">
                          {form.watch("password") === form.watch("confirmPassword") ? (
                            <p className="text-sm text-green-500">Les mots de passe correspondent</p>
                          ) : (
                            <p className="text-sm text-red-500">Les mots de passe ne correspondent pas</p>
                          )}
                        </div>
                      )}
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <Label>Type de compte</Label>
                      <RadioGroup
                        defaultValue="author"
                        className="grid grid-cols-2 gap-4"
                        {...form.register("role")}
                      >
                        <div className="relative">
                          <RadioGroupItem
                            value="author"
                            id="author"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="author"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
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
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <GraduationCap className="mb-3 h-6 w-6" />
                            Évaluateur
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setStep(step - 1)}
                      >
                        Précédent
                      </Button>
                    )}
                    {step < totalSteps ? (
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => setStep(step + 1)}
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Inscription en cours...
                          </>
                        ) : (
                          "S'inscrire"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
                 {/* // Add social signup section after the form */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou s'inscrire avec
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGithubSignup}
                    disabled={isLoading}
                  >
                    <Icons.github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm text-gray-600">
                  Vous avez déjà un compte?{" "}
                  <Link 
                    href="/auth/login" 
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Se connecter
                  </Link>
                </div>
              </CardContent>
            </Card>
            
          </div>
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