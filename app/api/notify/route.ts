// app/api/notify/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore =  await cookies()
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
    // console.log("Starts notifications to the admins")
    const payload = await request.json()
    const { type, publicationId, paymentId }: any = payload

    // console.log("debugging payload:", type, publicationId, paymentId)

    // console.log("debugging payload 2:",payload)
    // Get publication details with explicit relationship
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
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    console.log("Debugging admin user: ", admins)

    if (adminError) throw adminError

    // Create notifications
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type,
      title: type === 'PAYMENT_COMPLETED' ? 'Nouveau paiement reçu' : 'Nouvelle soumission',
      message: `L'article "${publication.title}" a été soumis et payé et soumis.`,
      publication_id: publicationId,
      payment_id: paymentId,
      read: false,
      created_at: new Date().toISOString()
    }))

    console.log("debugging notifications:", notifications)

    const { error: notifyError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (notifyError) throw notifyError

    console.log("Notifications with success flag")
    console.log("debugging final res: ", NextResponse.json)
    return NextResponse.json({ success: true })


  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification',
        details: error instanceof Error ? error.message : 'Unknown error' 
       },
      { status: 500 }
    )
  }
}