"use client"

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, AlertCircle, List, HelpCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { requirements } from '@/data/publications'




interface SubmissionProps {
    params: Promise<{ id: string }>
}

export default function SoumissionPage( {params }: SubmissionProps) {
    
  const router = useRouter()
  const [showSchema, setShowSchema] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    file: null as File | null
  })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const ABSTRACT_WORD_LIMIT = 250;
  const { id } = use(params) 

  // Add word count state
  const [wordCount, setWordCount] = useState(0);
  // Add word count calculation function
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  
  // Update useEffect with toast
useEffect(() => {
  toast({
    title: "Directives de soumission",
    description: (
      <div className="flex items-start space-x-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <p>Veuillez consulter le schéma de publication avant de soumettre votre article.</p>
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal text-primary hover:text-primary/80"
            onClick={() => setShowSchema(true)}
          >
            Voir le schéma de publication →
          </Button>
        </div>
      </div>
    ),
    duration: 10500,
  })
}, [toast])

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0]
    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF"
      });
      return;
    }
    if (file) {
      setFormData({ ...formData, file })
      // Create a URL for the PDF preview
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
    }
    
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

  // Redirect to payment page
    router.push(`/dashboard/author/${id}/payment`)
    // TODO: Implement submission logic
    console.log('Form submitted:', formData)
  }

  return (
    <div className="container mx-auto py-12 px-24">
      <div className="md:flex gap-8">
        <Card className="flex-1 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Soumettre un Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Titre de l'article</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Entrez le titre de votre article"
                  required
                />
              </div>

              <div>
                <Label htmlFor="authors">Auteurs</Label>
                <Input
                  id="authors"
                  value={formData.authors}
                  onChange={(e: any) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="Noms des auteurs (séparés par des virgules)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="abstract">Résumé</Label>
                <div className="relative">
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e: any) => {
                      const newText = e.target.value;
                      const words = countWords(newText);
                      if (words <= ABSTRACT_WORD_LIMIT) {
                        setFormData({ ...formData, abstract: newText });
                        setWordCount(words);
                      }
                    }}
                    className="min-h-[100px]"
                    placeholder="Entrez le résumé de votre article..."
                  />
                  <div className={`text-sm mt-1 flex justify-end ${
                    wordCount > ABSTRACT_WORD_LIMIT ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {wordCount}/{ABSTRACT_WORD_LIMIT} mots
                  </div>
                </div>
                {wordCount > ABSTRACT_WORD_LIMIT && (
                  <p className="text-sm text-red-500 mt-1">
                    Le résumé ne doit pas dépasser {ABSTRACT_WORD_LIMIT} mots
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e: any) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="Mots-clés (séparés par des virgules)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="file">Document (PDF)</Label>
                <div className="mt-2">
                  <label htmlFor="file" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary transition-colors">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {formData.file ? formData.file.name : "Cliquez pour sélectionner votre article (PDF)"}
                      </span>
                    </div>
                    <input
                      type="file"
                      id="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Annuler
                </Button>
                <Button type="submit">
                  Soumettre l'article
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* PDF Preview */}
        <div className="flex-1 max-w-xl">
          {pdfUrl ? (
            <div className="sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Aperçu du document</h3>
              <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>L'aperçu du PDF apparaîtra ici</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={showSchema} onOpenChange={setShowSchema}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Directives de Publication
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Important</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Avant de soumettre votre article, veuillez vous assurer que votre manuscrit 
                  respecte toutes les directives suivantes.
                </p>
              </CardContent>
            </Card>
            {requirements.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <FileText className="h-5 w-5 text-primary" />
                    ) : index === 1 ? (
                      <List className="h-5 w-5 text-primary" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}