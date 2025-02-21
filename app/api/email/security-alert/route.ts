// app/api/email/security-alert/route.ts
import { createServerClient } from '@supabase/ssr'
import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface SecurityAlertPayload {
  email: string
  type: 'PASSWORD_CHANGED' | 'LOGIN_ATTEMPT' | 'SUSPICIOUS_ACTIVITY'
  location: string
  timestamp: string
}

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
    const payload: SecurityAlertPayload = await request.json()
    const { email, type, location, timestamp } = payload

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name',)
      .eq('email', email)
      .single()

    if (userError) throw userError

    // Create email content based on type
    let subject = '', html = ''
    switch (type) {
      case 'PASSWORD_CHANGED':
        subject = 'Alerte de sécurité - Votre mot de passe a été modifié'
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a365d; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Centre de Recherche Interdisciplinaire</h1>
              <h2 style="color: #e2e8f0; font-size: 16px; margin-top: 5px;">Université Pédagogique Nationale</h2>
            </div>
            
            <div style="padding: 20px; background-color: #ffffff;">
              <p style="color: #4a5568;">Cher(e) ${user.name},</p>
              
              <p style="color: #4a5568; line-height: 1.6;">
                Nous vous informons que votre mot de passe a été modifié le ${new Date(timestamp).toLocaleString('fr-FR')}
                depuis ${location}.
              </p>

              <p style="color: #4a5568; line-height: 1.6;">
                Si vous n'êtes pas à l'origine de cette modification, veuillez :
              </p>

              <ol style="color: #4a5568; line-height: 1.6;">
                <li>Changer immédiatement votre mot de passe</li>
                <li>Contacter notre équipe support</li>
              </ol>

              <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #2d3748;">
                  Pour votre sécurité, nous vous recommandons d'utiliser un mot de passe fort et unique.
                </p>
              </div>
            </div>
          </div>
          <div style="
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            ">
            <div style="margin-bottom: 20px;">
                <img 
                src="https://cridupn.com/logo.png" 
                alt="CRIDUPN Logo" 
                style="width: 120px; height: auto;"
                />
            </div>

            <div style="margin-bottom: 20px; color: #64748b; font-size: 14px;">
                <p style="margin: 0 0 10px 0;">
                Centre de Recherche Interdisciplinaire<br/>
                Université Pédagogique Nationale<br/>
                Route de Matadi, Binza/UPN<br/>
                Kinshasa, RDC
                </p>
                
                <p style="margin: 0;">
                Tel: +243 XX XXX XXXX<br/>
                Email: contact@cridupn.com
                </p>
            </div>

            <div style="margin-bottom: 20px;">
                <a href="https://facebook.com/cridupn" style="
                text-decoration: none;
                margin: 0 10px;
                color: #1a365d;
                ">Facebook</a>
                <a href="https://twitter.com/cridupn" style="
                text-decoration: none;
                margin: 0 10px;
                color: #1a365d;
                ">Twitter</a>
                <a href="https://linkedin.com/company/cridupn" style="
                text-decoration: none;
                margin: 0 10px;
                color: #1a365d;
                ">LinkedIn</a>
            </div>

            <div style="
                font-size: 12px;
                color: #94a3b8;
                max-width: 400px;
                margin: 0 auto;
            ">
                <p style="margin: 0 0 10px 0;">
                Ce message a été envoyé à ${email}. Il contient des informations confidentielles et peut être soumis à des restrictions légales.
                </p>
                <p style="margin: 0;">
                © ${new Date().getFullYear()} CRIDUPN. Tous droits réservés.
                </p>
            </div>
            </div>
        `
        break;
    }

    // Send email
    await sendEmail(email, subject, html)

    // Log security event
    const { error: logError } = await supabase
      .from('security_logs')
      .insert({
        user_email: email,
        event_type: type,
        location,
        created_at: timestamp
      })

    if (logError) throw logError

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Security alert error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send security alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}