// app/api/authors/[id]/published-submissions/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Mock data - replace with actual data fetching logic
  const publishedSubmissions = [
    {
      id: 'sub-1',
      title: "L'impact des Technologies Educatives",
      publishedDate: '2024-03-15',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
      id: 'sub-2',
      title: "Développement Durable en Afrique",
      publishedDate: '2024-03-13',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
      id: 'sub-3',
      title: "Innovation Pédagogique en RDC",
      publishedDate: '2024-03-10',
      pdfUrl: '/pdfs/Innovation_Pedagogique_en_RDC.pdf'
    },
    {
      id: 'sub-4',
      title: "Méthodes d'Enseignement Modernes",
      publishedDate: '2024-03-08',
      pdfUrl: '/pdfs/Methodes_Enseignement_Modernes.pdf'
    },
    {
      id: 'sub-5',
      title: "L'éducation Numérique en Afrique",
      publishedDate: '2024-03-05',
      pdfUrl: '/pdfs/Education_Numerique_en_Afrique.pdf'
    }
  ]

  return NextResponse.json(publishedSubmissions)
}