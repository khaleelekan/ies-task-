// app/api/search/route.ts - UPDATED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        error: 'Search query must be at least 2 characters long',
        results: []
      }, { status: 400 })
    }

    const searchPattern = `%${query}%`
    
    // Search across all tables
    const results = await sql`
      -- Search students
      SELECT 
        id,
        'student' as type,
        name as title,
        COALESCE(email, 'No email') as subtitle,
        COALESCE(class_name, 'No class assigned') as description,
        created_at
      FROM students 
      WHERE name ILIKE ${searchPattern}
         OR email ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search classes
      SELECT 
        id,
        'class' as type,
        name as title,
        teacher as subtitle,
        COALESCE(description, 'No description') as description,
        created_at
      FROM classes 
      WHERE name ILIKE ${searchPattern}
         OR teacher ILIKE ${searchPattern}
         OR description ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search attendance
      SELECT 
        id,
        'attendance' as type,
        COALESCE(student_name, 'Unknown') as title,
        TO_CHAR(date, 'Mon DD, YYYY') as subtitle,
        'Status: ' || COALESCE(status, 'Unknown') as description,
        created_at
      FROM attendance 
      WHERE student_name ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    // Format results with correct URLs to your existing pages
    const formattedResults = results.map((result: any) => {
      let icon = '🔍'
      let href = ''
      let label = ''
      
      switch (result.type) {
        case 'student':
          icon = '👤'
          href = '/students'  // Your students page
          label = 'Go to Students'
          break
        case 'class':
          icon = '📚'
          href = '/classes'   // Your classes page
          label = 'Go to Classes'
          break
        case 'attendance':
          icon = '✅'
          href = '/attendance' // Your attendance page if exists, otherwise remove this
          label = 'Go to Attendance'
          break
      }

      return {
        id: result.id,
        type: result.type,
        title: result.title,
        subtitle: result.subtitle,
        description: result.description || '',
        icon,
        href,
        label,
        createdAt: result.created_at
      }
    })

    return NextResponse.json({
      query,
      total: formattedResults.length,
      results: formattedResults
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      error: 'Failed to perform search',
      message: error instanceof Error ? error.message : 'Unknown error',
      results: []
    }, { status: 500 })
  }
}