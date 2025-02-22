// app/admin/settings/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Lock,
  Bell,
  Mail,
  Globe,
  Save
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'



interface AdminUser {
  id?: string;
  email: string;
  name: string;
  role?: string;
  phone: string;
  institution: string;
}
const profileSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  institution: z.string().min(2, "Institution requise"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(1, "Confirmation requise")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      institution: ''
    }
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = passwordForm;

  // Update form when adminUser data is loaded
  useEffect(() => {
    if (adminUser) {
      form.reset({
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        institution: adminUser.institution
      })
    }
  }, [adminUser, form])

   // Update form when adminUser data is loaded
   useEffect(() => {
    if (adminUser) {
      form.reset({
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        institution: adminUser.institution
      })
    }
  }, [adminUser, form])

  // Check admin auth
  useEffect(() => {
    const checkAdminAuth = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('id, email, name, role, phone, institution')
          .eq('id', user.id)
          .single()

        if (error) throw error

        if (userData.role !== 'admin') {
          router.push('/unauthorized')
          return
        }

        setAdminUser(userData)
      } catch (error) {
        console.error('Admin auth error:', error)
        router.push('/auth/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAuth()
  }, [router])

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true)
    try {
      // TODO: Implement API call
      toast({
        title: "Paramètres mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminUser?.email || '',
        password: data.currentPassword
      });

      if (signInError) {
        throw new Error("Mot de passe actuel incorrect");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Mot de passe mis à jour avec succès"
      });

      resetPassword();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Paramètres</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Profil</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    {...form.register("name")} 
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...form.register("email")} 
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    {...form.register("phone")} 
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input 
                    id="institution" 
                    {...form.register("institution")} 
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    "Enregistrement..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
                {/* <SubmitButton /> */}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={handlePasswordSubmit(onPasswordSubmit)} 
          className="space-y-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input 
              id="currentPassword" 
              type="password"
              {...registerPassword("currentPassword")}
              disabled={isLoading}
            />
            {passwordErrors.currentPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input 
              id="newPassword" 
              type="password"
              {...registerPassword("newPassword")}
              disabled={isLoading}
            />
            {passwordErrors.newPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              {...registerPassword("confirmPassword")}
              disabled={isLoading}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-red-500">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Modification en cours..." : "Changer le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-gray-500">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notifications système</Label>
                  <p className="text-sm text-gray-500">
                    Afficher les notifications dans le système
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}