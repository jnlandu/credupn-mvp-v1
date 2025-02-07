// app/api/send-email/route.ts
import { type NextRequest } from 'next/server'
import { Resend } from 'resend';

// Define request body type
interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
  body: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verify connection first
    const { to, subject, html } = await request.json() as EmailRequestBody

    const data = await resend.emails.send({
      from: 'CRIDUPN <onboarding@resend.dev>', // Use Resend's default domain
      to: [to],
      subject: subject,
      html: html,
      replyTo: 'mathprog1@gmail.com' // A
    });

    if (data.error) {
      console.error('Email send error:', data.error);
      return Response.json({ 
        error: data.error 
      }, { 
        status: 500 
      });
    }

    return Response.json({ 
      success: true,
    });

  } catch (error) {
    console.error('Email send error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
}