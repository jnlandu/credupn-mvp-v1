// app/api/notify/route.ts
import { createServerClient } from '@supabase/ssr'
import axios from 'axios';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'




async function sendSMS(phone: string, message: string) {
  console.log('Sending SMS to:', phone);
  console.log('SMS message:', message);

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/sms`, {
      phone,
      message
    });

    console.log('SMS response:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('SMS error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 500) {
      // For API routes, return error response
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'Une erreur est survenue lors de l\'envoi du SMS'
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Handle other status codes
    if (error.response?.status === 400) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Numéro de téléphone invalide'
        }), 
        { status: 400 }
      );
    }

    // Default error response
    throw error;
  }
}

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
    const { type, publicationId, paymentId, reference_code }: any = payload

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
      created_at: new Date().toISOString(),
      reference_code: reference_code
    }))

    console.log("debugging notifications:", notifications)

    const { error: notifyError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (notifyError) throw notifyError

    // console.log("Notifications with success flag")
    // console.log("debugging final res: ", NextResponse.json)
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