import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function ActualitesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Actualités</h1>
      
      <div className="grid gap-8">
        {[1, 2, 3].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <h2 className="text-2xl font-semibold">
                Événement ou actualité {index + 1}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR')}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}