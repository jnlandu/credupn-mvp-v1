"use client"

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User, Mail, Building2, Lock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AuthorSettings({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const { toast } = useToast()
  const router = useRouter()
  const { id } = use(params)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: any = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // ... rest of the submit logic remains the same
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Paramètres du Profil</h1>
        <Button type="submit" form="settings-form" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="settings-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Lock className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
