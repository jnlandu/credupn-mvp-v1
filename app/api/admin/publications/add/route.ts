import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable, { File } from 'formidable';
import { Fields, Files } from 'formidable'
import { IncomingMessage } from 'http';



interface ParseResult {
  fields: formidable.Fields;
  files: formidable.Files;
}
export const config = {
  api: {
    bodyParser: false,
  },
};



// Helper: Convert `Request` to `IncomingMessage` for formidable
async function toNodeReadable(req: Request): Promise<IncomingMessage> {
  const { Readable } = require('stream');
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(Buffer.from(await req.arrayBuffer())); // Add request body
  readable.push(null); // End of stream
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  });
}

export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'publications');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    const nodeReq = await toNodeReadable(req);

     // Update Promise with correct types
     const { fields, files } = await new Promise<ParseResult>((resolve, reject) => {
      form.parse(nodeReq, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const pdfFile = (files.pdf as File[])[0];

    if (!pdfFile || !pdfFile.filepath) {
      return NextResponse.json({ error: 'Le fichier PDF est requis.' }, { status: 400 });
    }

    const newPub = {
      id: uuidv4(),
      title: (fields.title as string[])[0],
      author: (fields.author as string[])[0],
      date: (fields.date as string[])[0],
      status: (fields.status as string[])[0],
      category: (fields.category as string[])[0],
      pdfUrl: `/publications/${path.basename(pdfFile.filepath)}`,
    };

    const publicationsPath = path.resolve(process.cwd(), 'data', 'publications.tsx');
    let fileContent = await fs.readFile(publicationsPath, 'utf8');

    const arrayEnd = fileContent.lastIndexOf(']');
    if (arrayEnd === -1) {
      return NextResponse.json({ error: 'Publications array not found.' }, { status: 500 });
    }

    const before = fileContent.substring(0, arrayEnd).trim();
    const after = fileContent.substring(arrayEnd);
    const isEmptyArray = before.endsWith('[');

    const newPubString = `  {
      id: '${newPub.id}',
      title: "${newPub.title}",
      author: "${newPub.author}",
      date: "${newPub.date}",
      status: '${newPub.status}',
      category: "${newPub.category}",
      pdfUrl: '${newPub.pdfUrl}'
    }`;

    const updatedContent = isEmptyArray
      ? `${before}\n${newPubString}\n${after}`
      : `${before},\n${newPubString}\n${after}`;

    await fs.writeFile(publicationsPath, updatedContent, 'utf8');

    return NextResponse.json(
      { message: 'Publication ajoutée avec succès.', publication: newPub },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding publication:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
