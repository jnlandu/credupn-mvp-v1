// app/api/notify/route.ts
import { createServerClient } from '@supabase/ssr'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface ReviewerData {
  id: string
  name: string
  email: string
}

interface NotificationPayload {
  type: 'REVIEW_REQUEST'
  publicationId: string
  reviewerIds: string[]
  title: string
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

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/email`, {
      email: [to],
      subject,
      body: html
    });
    return response.data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const cookieStore =  await cookies();
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
  );

  try {
    const { type, publicationId, reviewerIds, title } = await request.json() as NotificationPayload;

    // Get reviewers details
    const { data: reviewers, error: reviewersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', reviewerIds);

    if (reviewersError) throw reviewersError;

    // Create notifications for each reviewer
    const notifications = await Promise.all(reviewers.map(async (reviewer) => {
      const reference_code = await generateUniqueNotificationRef(supabase);
      
      return {
        user_id: reviewer.id,
        type: 'REVIEW_REQUEST',
        title: 'Nouvelle publication à évaluer',
        message: `Une nouvelle publication "${title}" vous a été assignée pour évaluation.`,
        publication_id: publicationId,
        created_at: new Date().toISOString(),
        read: false,
        reference_code,
        to: 'reviewer'
      };
    }));

    // Insert notifications
    const { error: notifyError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notifyError) throw notifyError;

    const dashboardUrl = process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/auth/login/`
    : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login/`;

    // Send emails to reviewers
    await Promise.all(reviewers.map(reviewer => 
      sendEmail(
        reviewer.email,
        'Centre de Recherche Interdisciplinaire UPN - Nouvelle publication à évaluer',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a365d; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Centre de Recherche Interdisciplinaire</h1>
        <h2 style="color: #e2e8f0; font-size: 16px; margin-top: 5px;">Université Pédagogique Nationale</h2>
      </div>
      
      <div style="padding: 20px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #2d3748;">Cher(e) Dr. ${reviewer.name},</p>
        
        <p style="font-size: 16px; color: #2d3748; line-height: 1.6;">
          Nous espérons que ce message vous trouve bien. Une nouvelle publication intitulée 
          <strong>"${title}"</strong> vient de vous être assignée pour évaluation.
        </p>

        <p style="font-size: 16px; color: #2d3748; line-height: 1.6;">
          En tant qu'expert dans ce domaine, votre évaluation est essentielle pour maintenir 
          l'excellence académique de notre revue.
        </p>

        <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #2d3748;">Pour commencer votre évaluation :</p>
          <ol style="margin: 10px 0;">
            <li>Connectez-vous à votre espace évaluateur</li>
            <li>Accédez à la section "Publications à évaluer"</li>
            <li>Sélectionnez la publication mentionnée ci-dessus</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background-color: #4299e1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Accéder à mon espace évaluateur
          </a>
        </div>

        <p style="font-size: 16px; color: #2d3748;">
          Nous vous remercions de bien vouloir soumettre votre évaluation dans un délai de 30 jours.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

        <p style="color: #2d3748;">Bien cordialement,</p>
        <p style="color: #2d3748; font-weight: bold;">L'équipe éditoriale CRIDUPN</p>
      </div>
      
      <div style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
        <p>Ce message est automatique, merci de ne pas y répondre directement.</p>
        <p>Pour toute question, contactez-nous à : support@cridupn.cd</p>
      </div>
    </div>
        `
      )
    ));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}



