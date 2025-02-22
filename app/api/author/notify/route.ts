// app/api/notify/route.ts
import { createServerClient } from '@supabase/ssr'
import axios from 'axios';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface PublicationWithUser {
  title: string;
  users: UserData;
}

interface NotificationPayload {
  type: string;
  publicationId: string;
  paymentId: string;
  reference_code: string;
  status: 'success' | 'failed';
}


const generateUniqueNotificationRef = async (supabase: any): Promise<string> => {
  const prefix = 'NOTIF';
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const notificationRef = `${prefix}_${timestamp}_${random}`;

  // Check if reference exists
  const { data } = await supabase
    .from('notifications')
    .select('reference_code')
    .eq('reference_code', notificationRef)
    .single();

  if (data) {
    // If exists, try again
    return generateUniqueNotificationRef(supabase);
  }

  return notificationRef;
};

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
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      }
    }
  );

  try {
    const { type, publicationId, paymentId, reference_code, status } = await request.json() as NotificationPayload;

    if (!status) {
      throw new Error('Payment status is required');
    }

    const { data: publication } = await supabase
      .from('publications')
      .select(`
        title,
        users!publications_user_id_fkey (
          name,
          phone
        )
      `)
      .eq('id', publicationId)
      .single() as { data: PublicationWithUser };

    if (!publication) {
      throw new Error('Publication not found');
    }

    const { data: authors, error: authError } = await supabase
    .from('users')
    .select('id, role')
    .eq('role', 'author');
  
  if (authError) throw authError;
  // Create notification based on status
    const notificationTitle = status === 'success' 
    ? 'Paiement confirmé' 
    : 'Échec du paiement';

    const notificationMessage = status === 'success'
    ? `Votre article "${publication.title}" a été soumis et payé avec succès. Référence de paiement: ${reference_code}`
    : `Le paiement pour votre article "${publication.title}" a échoué. Référence: ${reference_code}`;


  // Create notifications for authors
const notifications = await Promise.all(authors.map(async (author) => {
  const uniqueRef = await generateUniqueNotificationRef(supabase);
  
  return {
    user_id: author.id,
    type,
    title: notificationTitle,
    message: notificationMessage,
    publication_id: publicationId,
    payment_id: paymentId,
    read: false,
    created_at: new Date().toISOString(),
    reference_code: uniqueRef, // Use unique reference
    to: author.role,
    payment_status: status
  };
}));
    
// Insert notifications with unique references
const { error: notifyError } = await supabase
  .from('notifications')
  .insert(notifications);

  if (notifyError) throw notifyError;

    const authorPhone = publication.users.phone;
    const authorName = publication.users.name;
    const message = status === 'success'
      ? `CRIDUPN -- Bonjour  Mr/Mme ${authorName}, le paiement pour votre publication "${publication.title}" a été confirmé. Référence: ${reference_code}`
      : `CRIDUPN -- Bonjour Mr/Mme ${authorName}, le paiement pour votre publication "${publication.title}" a échoué. Référence: ${reference_code}`;

      const smsResponse  = await sendSMS(authorPhone, message);

      if (smsResponse instanceof Response) {
        // Error occurred, return the response
        return smsResponse;
      }
  
      return NextResponse.json({ success: true });

  }catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send SMS',
        message: 'Une erreur est survenue, veuillez réessayer plus tard'
      },
      { status: 500 }
    );
  }
}