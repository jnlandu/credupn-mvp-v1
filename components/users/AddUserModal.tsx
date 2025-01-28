// components/AddUserModal.tsx
import { createClient } from '@/utils/supabase/client'
import { useState, useRef, DragEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserPlus,  Eye, EyeOff, X, FileText, Upload, Loader2} from "lucide-react"
import { z } from 'zod'



interface Publication {
  file: File
  title: string
  uploadDate: Date
}

interface AddUserModalProps {
  onRefresh?: () => void;
}
const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["author", "reviewer", "admin", "other"]),
  institution: z.string().min(2, "L'institution est requise"),
  phone: z.string().optional(),
  publications: z.array(z.object({
    file: z.instanceof(File),
    title: z.string().nonempty("Le titre de la publication est requis"),
    uploadDate: z.instanceof(Date)
  }))
})

type UserFormData = z.infer<typeof userSchema>
interface PDFPreviewProps {
  file: File
  onRemove: () => void
}

// Update PDF Preview component
const PDFPreview = ({ publication, onRemove, onTitleChange }: {
  publication: Publication
  onRemove: () => void
  onTitleChange: (title: string) => void
}) => (
  <div className="space-y-2 p-3 bg-gray-50 rounded-md">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-gray-500" />
        <span className="text-sm truncate max-w-[200px]">{publication.file.name}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRemove}
        className="hover:bg-red-100"
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
    
    <Input
      placeholder="Titre de la publication"
      value={publication.title}
      onChange={(e: any) => onTitleChange(e.target.value)}
      className="mt-2"
    />
    
    <span className="text-xs text-gray-500">
      Ajouté le {publication.uploadDate.toLocaleDateString()}
    </span>
  </div>
)


export function AddUserModal({ onRefresh }: AddUserModalProps) {
  const fileInputRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false)
  const [roleStateChange, setRoleStateChange] = useState(true)
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'author',
    password: '',
    publications: [],
    institution: '',
    phone: ''
  })

  const { toast } = useToast()
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  // Update file handling in AddUserModal
const handleFileChange = (e: any) => {
  const files : any = Array.from(e.target.files || [])
  const pdfs = files.filter((file : any) => file.type === 'application/pdf')
  
  if (pdfs.length !== files.length) {
    toast({
      title: "Erreur",
      description: "Seuls les fichiers PDF sont acceptés",
      variant: "destructive"
    })
    return
  }

  const newPublications = pdfs.map((file: any) => ({
    file,
    title: '',
    uploadDate: new Date()
  }))

  setFormData(prev => ({
    ...prev,
    publications: [...prev.publications, ...newPublications]
  }))
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      })

      if (authError) throw authError

    // 2. Upload PDFs to storage
    const publicationUploads = await Promise.all(
      formData.publications.map(async (pub) => {
        const fileExt = pub.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `publications/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('publications')
          .upload(filePath, pub.file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('publications')
          .getPublicUrl(filePath)

        return {
          title: pub.title,
          pdf_url: publicUrl,
          status: 'PENDING',
          created_at: new Date().toISOString()
        }
      })
    )
    // 3. Create user profile and publications
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user?.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        institution: formData.institution,
        created_at: new Date().toISOString(),
        phone: formData.phone
      }])

    if (profileError) throw profileError
    // 4. Create publications if any
    if (publicationUploads.length > 0) {
      const { error: pubError } = await supabase
        .from('publications')
        .insert(
          publicationUploads.map(pub => ({
            ...pub,
            author: authData.user?.id
          }))
        )

      if (pubError) throw pubError
    }
    toast({
      title: "Succès",
      description: "Utilisateur créé avec succès"
    })
  // Reset form
  setFormData({
    name: '',
    email: '',
    role: 'author',
    password: '',
    publications: [],
    institution: '',
    phone: ''
  })
  setOpen(false)
  onRefresh?.()

  } catch (error) {
  console.error('Error creating user:', error)
  toast({
    variant: "destructive",
    title: "Erreur",
    description: error instanceof Error ? error.message : "Une erreur est survenue"
  })
  } finally {
  setIsLoading(false)
  }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un Utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Nouvel Utilisateur</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <select
              id="role"
              className="w-full border rounded-md p-2"
              value={formData.role}
              onChange={(e: any) => {
                const newRole = e.target.value as 'author' | 'reviewer' | 'other';
                // Set roleStateChange based on if author is selected
                setRoleStateChange(newRole === 'author');
                // Clear publications if switching away from author
                setFormData(prev => ({
                  ...prev,
                  role: newRole,
                  publications: newRole === 'author' ? prev.publications : []
                }));
              }}
            >
              <option value="author" className='text-sm'>Auteur</option>
              <option value="reviewer" className='text-sm'>Évaluateur</option>
              <option value="other" className='text-sm'>Autre</option>
            </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            required
            value={formData.institution}
            onChange={(e: any) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="Nom de l'institution"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone (Optionnel)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''} // Ensure value is never undefined
            onChange={(e: any) => setFormData(prev => ({ 
              ...prev, 
              phone: e.target.value 
            }))}
            disabled={isLoading}
            placeholder="Entrez votre numéro de téléphone"
          />
        </div>
        {/* Pdf preview */}
        {roleStateChange && (
          <div className="space-y-2">
            <Label>Publications (PDF)</Label>
            <div className="space-y-2">
              {formData.publications.map((file, index) => (
                <PDFPreview
                  key={index}
                  publication={file}
                  onRemove={() => {
                    const newPublications = formData.publications.filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, publications: newPublications }))
                  }}
                  onTitleChange={(title) => {
                    const newPublications = [...formData.publications]
                    newPublications[index] = { ...newPublications[index], title }
                    setFormData(prev => ({ ...prev, publications: newPublications }))
                  }}
                />
              ))}
              <div className="flex justify-center p-4 border-2 border-dashed rounded-md">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter des PDFs
                </Button>
              </div>
            </div>
          </div>
        )}
          <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              'Créer'
            )}
          </Button>
        </div>
      </form>
      </div>
    </DialogContent>
    </Dialog>
  )
}