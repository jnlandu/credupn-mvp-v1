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
import { BookOpen, Users, GraduationCap, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["author", "admin"], {
    required_error: "Veuillez sélectionner un rôle",
  }),
  rememberMe: z.boolean().default(false),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "author",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      // TODO: Implement login logic based on role
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
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
    {/* <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8">  */}
    <div className="w-full lg:w-1/2 flex flex-col">
    <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Icons.logo className="h-8 w-8" />
            <CardTitle className="text-2xl text-center">CREDUPN</CardTitle>
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
              
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.password.message}
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
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Administrateur</Label>
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
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Se connecter
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
                <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
                  <Icons.google className="h-5 w-5 mr-2" />
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
                  <Icons.github className="h-5 w-5 mr-2" />
                  GitHub
                </Button>
              </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-600">
          <Link
            href="/auth/forgot-password"
            className="hover:text-primary transition-colors"
          >
            Mot de passe oublié ?
          </Link>
          <div>
            Pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="font-semibold hover:text-primary transition-colors"
            >
              S'inscrire
            </Link>
          </div>
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