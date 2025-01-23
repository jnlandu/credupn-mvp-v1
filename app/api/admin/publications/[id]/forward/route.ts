// app/api/publications/[id]/forward/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { reviewers } : any = await req.json()

  // Mock data - replace with actual data fetching logic
  const publication = {
    id: 'sub-1',
    title: "L'impact des Technologies Educatives",
    pdfUrl: '/pdfs/L_impact_des_Technologies_Educatives_en_RDC_with_Graphics.pdf'
  }

  // Read PDF file
  const pdfPath = path.join(process.cwd(), 'public', publication.pdfUrl)
  const pdfData = await fs.readFile(pdfPath)

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Send email to each reviewer
  for (const reviewer of reviewers) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reviewer.email,
      subject: `Nouvelle publication à évaluer: ${publication.title}`,
      text: `Bonjour ${reviewer.name},\n\nVous avez été sélectionné pour évaluer la publication suivante: ${publication.title}.\n\nVeuillez trouver le PDF en pièce jointe.\n\nCordialement,\nL'équipe de CREDUPN`,
      attachments: [
        {
          filename: `${publication.title}.pdf`,
          content: pdfData
        }
      ]
    }

    await transporter.sendMail(mailOptions)
  }

  return NextResponse.json({ success: true })
}