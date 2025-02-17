// app/api/email/route.ts
import { NextRequest } from 'next/server';
import axios from 'axios';

interface EmailRequestBody {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json() as EmailRequestBody;

    // Call FastAPI endpoint
    const response = await axios.post(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/email`, {
      email: [to],  // FastAPI expects an array of emails
      subject: subject,
      body: html,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      console.error('Email send error:', response.data);
      return Response.json({ 
        error: 'Failed to send email' 
      }, { 
        status: 500 
      });
    }

    return Response.json({
      message: 'Email sent successfully',
      data: response.data
    }, {
      status: 200
    });

  } catch (error: any) {
    console.error('Email error:', error);
    return Response.json({ 
      error: error.message || 'Failed to send email'
    }, { 
      status: 500 
    });
  }
}