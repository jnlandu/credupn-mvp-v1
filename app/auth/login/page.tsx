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
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Connexion CREDUPN</CardTitle>
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
  )
}