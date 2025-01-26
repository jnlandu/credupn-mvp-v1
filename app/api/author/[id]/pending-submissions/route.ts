// app/api/authors/[id]/pending-submissions/route.ts
import { NextResponse } from 'next/server'

export async function GET(
   req: Request, 
   context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
  // Mock data - replace with actual data fetching logic
  const pendingSubmissions = [
    {
      id: 'sub-1',
      title: "L'impact des Technologies Educatives",
      submittedDate: '2024-03-15',
      status: 'pending',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    },
    {
      id: 'sub-2',
      title: "Développement Durable en Afrique",
      submittedDate: '2024-03-13',
      status: 'pending',
      pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
    }
  ]

  return NextResponse.json(pendingSubmissions)
}catch(error){
  console.error('Error fetching pending submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending submissions' },
      { status: 500 }
    )
}
}