// app/auth/signup/page.tsx
"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, GraduationCap, BookOpen, Globe, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

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
  role: z.enum(["author", "reviewer"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type SignupData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      password: "",
      confirmPassword: "",
      role: "author",
    },
  })

  const onSubmit = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Inscription échouée')
      }

      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter.",
      })

      router.push('/auth/login')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
        {/* * Left side - Image and Content */} 
    <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
      <Image
        src="/images/library-bg.jpg"
        alt="CREDUPN Research Center"
        fill
        className="object-cover opacity-60"
        priority
      />
      <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/50">
        <h1 className="text-4xl font-bold text-white mb-4">
          CREDUPN
        </h1>
        <p className="text-xl text-white/90 max-w-md mb-8">
          Centre de Recherche pour le Développement de l'Université Pédagogique Nationale
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

    {/*  Right side Signup form  */}
    <div className="w-full lg:w-1/2 flex flex-col">
    <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8">
        <Button
          variant="ghost"
          className="w-fit mb-8"
          asChild
        >
          <Link href="/auth/login" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    {...form.register("institution")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.institution && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.institution.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Type de compte</Label>
                  <RadioGroup
                    defaultValue="author"
                    className="flex space-x-4 mt-2"
                    {...form.register("role")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="author" id="author" />
                      <Label htmlFor="author">Auteur</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reviewer" id="reviewer" />
                      <Label htmlFor="reviewer">Évaluateur</Label>
                    </div>
                  </RadioGroup>
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
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Vous avez déjà un compte?{" "}
                <Link 
                href="/auth/login" 
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                Se connecter
                </Link>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
      </div>
    </div>
  )
}