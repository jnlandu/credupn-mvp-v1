import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PublicationsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Publications</h1>
        <Button asChild>
          <Link href="/publications/soumettre">Soumettre un article</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Titre de la publication académique {index + 1}
              </h2>
              <p className="text-sm text-gray-500">
                Auteurs: Dr. John Doe, Dr. Jane Smith
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="mt-4">
                <Button variant="outline">Lire plus</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}