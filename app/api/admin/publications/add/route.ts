// app/api/publications/add/route.ts (Next.js App Router)
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  const form = formidable({ multiples: false, uploadDir: path.join(process.cwd(), 'public', 'publications'), keepExtensions: true })

  const data: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })

  const { fields, files } = data
  const pdfFile = files.pdf as formidable.File

  if (!fields.title || !fields.author || !fields.date || !fields.category || !fields.status || !pdfFile) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
  }

  const newPub = {
    id: uuidv4(),
    title: fields.title,
    author: fields.author,
    date: fields.date,
    status: fields.status,
    category: fields.category,
    pdfUrl: `/publications/${path.basename(pdfFile.filepath)}`,
  }

  try {
    const publicationsPath = path.resolve(process.cwd(), 'data', 'publications.tsx')
    let fileContent = await fs.readFile(publicationsPath, 'utf8')

    // Find the position to insert the new publication
    const arrayEnd = fileContent.lastIndexOf(']')

    if (arrayEnd === -1) {
      return NextResponse.json({ error: 'Publications array not found.' }, { status: 500 })
    }

    const before = fileContent.substring(0, arrayEnd).trim()
    const after = fileContent.substring(arrayEnd)

    // Check if array is empty
    const isEmptyArray = before.endsWith('[')

    const newPubString = `  {
 id: '${newPub.id}',
 title: "${newPub.title}",
 author: "${newPub.author}",
 date: "${newPub.date}",
 status: '${newPub.status}',
 category: "${newPub.category}",
 pdfUrl: '${newPub.pdfUrl}'
 }`

 let updatedContent
 if (isEmptyArray) {
   updatedContent = `${before}\n${newPubString}\n${after}`
 } else {
   updatedContent = `${before},\n${newPubString}\n${after}`
 }

 await fs.writeFile(publicationsPath, updatedContent, 'utf8')

 return NextResponse.json({ message: 'Publication ajoutée avec succès.', publication: newPub }, { status: 200 })
} catch (error) {
 console.error('Error adding publication:', error)
 return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 })
}

}