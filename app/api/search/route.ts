import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log('Search API called')
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('Search query:', query)

    // Validate search query
    if (!query || query.length < 2) {
      console.log('Query too short')
      return NextResponse.json(
        { 
          error: 'Search query must be at least 2 characters long',
          results: []
        },
        { status: 400 }
      )
    }

    // Check if database connection is available
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return NextResponse.json(
        { 
          error: 'Database connection not configured',
          message: 'DATABASE_URL environment variable is missing'
        },
        { status: 500 }
      )
    }

    const searchPattern = `%${query}%`
    
    console.log('Executing search with pattern:', searchPattern)

    // Execute the search query - UPDATED TO MATCH YOUR SCHEMA
    const results = await sql`
      -- Search students (using your actual schema)
      SELECT 
        id,
        'student' as type,
        name as title,
        email as subtitle,
        class_name as description,
        created_at
      FROM students 
      WHERE name ILIKE ${searchPattern}
         OR email ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search classes (using your actual schema)
      SELECT 
        id,
        'class' as type,
        name as title,
        teacher as subtitle,
        description,
        created_at
      FROM classes 
      WHERE name ILIKE ${searchPattern}
         OR teacher ILIKE ${searchPattern}
         OR description ILIKE ${searchPattern}
      
      UNION ALL
      
      -- Search attendance (using your actual schema)
      SELECT 
        id,
        'attendance' as type,
        student_name || ' - ' || class_name as title,
        TO_CHAR(date, 'Mon DD, YYYY') as subtitle,
        'Status: ' || status as description,
        created_at
      FROM attendance 
      WHERE student_name ILIKE ${searchPattern}
         OR class_name ILIKE ${searchPattern}
      
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    console.log('Search returned', results.length, 'results')

    // Format results for the frontend
    const formattedResults = results.map((result: any) => {
      let icon = '🔍'
      let href = ''
      
      switch (result.type) {
        case 'student':
          icon = '👤'
          href = `/students/${result.id}`
          break
        case 'class':
          icon = '📚'
          href = `/classes/${result.id}`
          break
        case 'attendance':
          icon = '✅'
          href = `/attendance`
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
        createdAt: result.created_at
      }
    })

    return NextResponse.json({
      query,
      total: formattedResults.length,
      results: formattedResults
    })

  } catch (error) {
    console.error('Search API error details:', error)
    
    // Log specific error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to perform search',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}