// app/api/submissions/route.ts
import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { date } from 'zod'

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
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        to: user?.email,
        subject: 'Soumission reçue',
        html: `Votre article "${title}" a été soumis avec succès.`
      })
    })

    return NextResponse.json({ 
      success: true, 
      publicationId: publication.id,
      paymentId: payment.id 
    })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}