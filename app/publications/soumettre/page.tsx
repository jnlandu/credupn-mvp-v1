"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText } from 'lucide-react'

export default function SoumissionPage() {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    file: null as File | null
  })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
      // Create a URL for the PDF preview
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Entrez le titre de votre article"
                  required
                />
              </div>

              <div>
                <Label htmlFor="authors">Auteurs</Label>
                <Input
                  id="authors"
                  value={formData.authors}
                  onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                  placeholder="Noms des auteurs (séparés par des virgules)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="abstract">Résumé</Label>
                <Textarea
                  id="abstract"
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  placeholder="Résumé de votre article"
                  className="h-32"
                  required
                />
              </div>

              <div>
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
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
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
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
    </div>
  )
}