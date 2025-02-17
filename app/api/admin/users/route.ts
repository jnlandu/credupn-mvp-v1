// app/api/users/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'


export async function GET() {
    try {
      const supabase = await createServerSupabaseClient()
  
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role,
          institution,
          phone,
          created_at,
          publications (
            id,
            title,
            status,
            date,
            category,
            created_at,
            abstract,
            pdf_url
          )
        `)
        .in('role', ['author', 'reviewer', 'admin'])
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Error fetching users' },
          { status: 500 }
        )
      }
  
      // Transform and expand publication details
      const transformedData = data.map(user => ({
        ...user,
        publication_count: user.publications?.length || 0,
        publications: user.publications.map(pub => ({
          id: pub.id,
          title: pub.title,
          status: pub.status,
          date: pub.date,
          category: pub.category,
          created_at: pub.created_at,
          abstract: pub.abstract,
          pdf_url: pub.pdf_url
        })) || []
      }))
  
      // Debug log with expanded publications
      console.log('Fetched users with publications:', 
        // JSON.stringify(transformedData, null, 2)
      )
  
      return NextResponse.json(transformedData)
  
    } catch (error) {
      console.error('API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }