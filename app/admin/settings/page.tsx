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
  Save,
  UserPlus,
  Plus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'



interface AdminUser {
  id?: string;
  email: string;
  name: string;
  role?: string;
  phone: string;
  institution: string;
}
interface NewAdminUser {
  email: string;
  name: string;
  phone: string;
  institution: string;
}
const newAdminSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  institution: z.string().min(2, "Institution requise"),
})
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
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

const newAdminForm = useForm<z.infer<typeof newAdminSchema>>({
  resolver: zodResolver(newAdminSchema),
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

  const onAddAdmin = async (data: z.infer<typeof newAdminSchema>) => {
    setIsLoading(true)
    const supabase = createClient()
  
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: generateTemporaryPassword(), // You'll need to implement this
        email_confirm: true
      })
  
      if (authError) throw authError
  
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          institution: data.institution,
          role: 'admin'
        })
  
      if (profileError) throw profileError
  
      toast({
        title: "Administrateur ajouté",
        description: "Un email avec les identifiants a été envoyé."
      })
  
      setIsDialogOpen(false)
      newAdminForm.reset()
      // Refresh admin list
      fetchAdmins()
  
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }
  const fetchAdmins = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
  
    if (!error && data) {
      setAdmins(data)
    }
  }
  
  // Add useEffect to load admins
  useEffect(() => {
    fetchAdmins()
  }, [])

  function generateTemporaryPassword() {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

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
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Administrateurs
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
    <TabsContent value="admins">
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Administrateurs</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un administrateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un administrateur</DialogTitle>
              </DialogHeader>
              <form onSubmit={newAdminForm.handleSubmit(onAddAdmin)} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    {...newAdminForm.register("name")} 
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...newAdminForm.register("email")} 
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    {...newAdminForm.register("phone")} 
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input 
                    id="institution" 
                    {...newAdminForm.register("institution")} 
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Création..." : "Ajouter l'administrateur"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Institution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.phone}</TableCell>
                <TableCell>{admin.institution}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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