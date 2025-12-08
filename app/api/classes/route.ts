import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const classes = await sql`
      SELECT * FROM classes 
      ORDER BY created_at DESC
    `
    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, teacher, description } = await request.json()
    
    if (!name || !teacher) {
      return NextResponse.json(
        { error: 'Name and teacher are required' },
        { status: 400 }
      )
    }
    
    const [newClass] = await sql`
      INSERT INTO classes (name, teacher, description) 
      VALUES (${name}, ${teacher}, ${description}) 
      RETURNING *
    `
    
    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}