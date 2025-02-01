// app/api/submissions/route.ts
import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { date } from 'zod'





const getBaseUrl = async  () => {
  const headersList =  await headers()
  const host = headersList.get('host') || process.env.VERCEL_URL || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocol}://${host}`
}

export async function POST(req: Request) {
    const cookieStore = await  cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.set({ name, value: '', ...options })
            },
          },
        }
      )
    
  
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const abstract = formData.get('abstract') as string
    const keywords = formData.get('keywords') as string
    const author = formData.get('author') as string

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    // Upload file
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('publications')
      .upload(fileName, file)
    if (uploadError) throw uploadError

    // Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from('publications')
      .getPublicUrl(fileName)

    // Create publication
    const { data: publication, error: pubError } = await supabase
      .from('publications')
      .insert({
        title,
        user_id: user?.id,
        pdf_url: publicUrl,
        abstract,
        author,
        keywords: keywords.split(',').map(k => k.trim()),
        status: 'PENDING',
        date    : new Date().toISOString()
      })
      .select()
      .single()
    if (pubError) throw pubError

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user?.id,
        publication_id: publication.id,
        amount: 50, // Default amount
        status: 'PENDING',
        details: 'Paiement du frais de publication',
        payment_method: 'Mobile',
        created_at  : new Date().toISOString(),
        customer_email: user?.email,
        reference_code: Math.floor(Math.random() * 100).toString()
      })
      .select()
      .single()

    if (paymentError) {
        console.error('Payment creation error:', {
          code: paymentError.code,
          message: paymentError.message,
          details: paymentError.details
        })
        throw paymentError
      }

    // Send email notification
    const baseUrl =  await getBaseUrl()
    // console.log('Debug user email:', user?.email)
    const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user?.email,
        subject: 'Confirmation de soumission',
        html: `
          <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <title>Confirmation de Soumission</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          margin: 0;
                          padding: 20px;
                      }
                      .container {
                          background-color: #ffffff;
                          padding: 20px;
                          border-radius: 8px;
                          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                          max-width: 600px;
                          margin: auto;
                      }
                      h1 {
                          color: #2c3e50;
                      }
                      p {
                          color: #34495e;
                          font-size: 16px;
                          line-height: 1.6;
                      }
                      .btn {
                          display: inline-block;
                          padding: 12px 20px;
                          margin: 20px 0;
                          font-size: 16px;
                          color: #ffffff;
                          background-color: #27ae60;
                          text-decoration: none;
                          border-radius: 5px;
                      }
                      .footer {
                          font-size: 14px;
                          color: #7f8c8d;
                          text-align: center;
                          margin-top: 20px;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>📜 Confirmation de Soumission</h1>
                      <p>Cher(e) autheur(e),</p>

                      <p>Nous vous remercions d’avoir soumis votre article <strong>« ${publication?.title} »</strong> pour publication dans notre revue CRIDUPN.</p>

                      <p>Votre soumission a bien été reçue et est en attente de validation. Afin de compléter le processus et de soumettre officiellement votre article pour examen, un paiement est requis.</p>

                      <h2>📝 Détails de la soumission :</h2>
                      <ul>
                          <li><strong>Titre :</strong> ${publication.title}</li>
                          <li><strong>Résumé :</strong> ${publication.abstract}</li>
                          <li><strong>Date de soumission :</strong> ${publication.date}</li>
                          <li><strong>Frais de soumission à payer :</strong> <strong>${payment.amount} USD</strong></li>
                      </ul>

                      <p>Merci d'effectuer votre paiement dès que possible afin d’éviter tout retard dans l’évaluation de votre article.</p>

                      <p>Si vous avez des questions, n’hésitez pas à nous contacter.</p>

                      <p>Merci de votre confiance.</p>
                      <div class="footer" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px;">Cordialement,</p>
                        <p style="color: #444; font-size: 14px; font-weight: bold;">L'équipe CRIDUPN</p>
                        
                        <div style="margin-top: 15px; color: #666; font-size: 12px;">
                          <p>Route de Matadi N°97, Binza/UPN</p>
                          <p>Kinshasa - République Démocratique du Congo</p>
                          <p>Email: contact@cridupn.org</p>
                          <p>Tél: +243 81 090 1443</p>
                        </div>

                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 11px;">
                          <p>Ce message est automatique. Merci de ne pas y répondre directement.</p>
                          <p>Pour toute question, veuillez nous contacter à support@cridupn.org</p>
                          <p>© ${new Date().getFullYear()} CRIDUPN - Centre de Recherche Interdisciplinaire de l'UPN. Tous droits réservés.</p>
                        </div>
                      </div>
                  </div>
              </body>
              </html>

        `
      })
    })

    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text())
    }
  
    return new Response(
      JSON.stringify({ 
        publicationId: publication.id, 
        paymentId: payment.id 
      }), 
      { status: 200 }
    )
  
  } catch (error) {
    console.error('Submission error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
  }
}