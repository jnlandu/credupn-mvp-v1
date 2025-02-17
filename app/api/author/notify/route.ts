// app/api/notify/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  
  try {
    const payload = await request.json()
    const { type, publicationId, paymentId, reference_code }: any = payload

    // Get publication details with author info
    const { data: publication, error: pubError } = await supabase
      .from('publications')
      .select(`
        title,
        user_id,
        users!publications_user_id_fkey (
          name,
          email
        )
      `)
      .eq('id', publicationId)
      .single()

    if (pubError) throw pubError

    // Get admin users
    const { data: authors, error: authError } = await supabase
      .from('users')
      .select('id, role')
      .eq('role', 'author')

    if (authError) throw authError

    // Create notifications array for both admins and author
    const notifications = authors.map(author => ({
        user_id: author.id,
        type,
        title: 'Soumission confirmée',
        message: `Votre article "${publication.title}" a été soumis et payé avec succès. Référence de paiement: ${reference_code}`,
        publication_id: publicationId,
        payment_id: paymentId,
        read: false,
        created_at: new Date().toISOString(),
        reference_code,
        to: author.role
      }))
    

    // Insert all notifications
    const { error: notifyError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (notifyError) throw notifyError

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create notification',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}