import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const classes = await sql`
      SELECT 
        c.id,
        c.name,
        c.teacher,
        c.description,
        c.created_at,
        c.updated_at,
        COUNT(s.id) as number_of_students
      FROM classes c
      LEFT JOIN students s ON c.name = s.class_name
      GROUP BY c.id, c.name, c.teacher, c.description, c.created_at, c.updated_at
      ORDER BY c.created_at DESC
    `
    
    // Parse all number_of_students to integers
    const parsedClasses = classes.map(cls => ({
      ...cls,
      number_of_students: parseInt(cls.number_of_students) || 0
    }))
    
    return NextResponse.json(parsedClasses)
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
    
    // Check if class with same name already exists
    const [existingClass] = await sql`
      SELECT * FROM classes WHERE name = ${name}
    `
    
    if (existingClass) {
      return NextResponse.json(
        { error: 'Class with this name already exists' },
        { status: 409 }
      )
    }
    
    const [newClass] = await sql`
      INSERT INTO classes (name, teacher, description) 
      VALUES (${name}, ${teacher}, ${description || null}) 
      RETURNING *
    `
    
    // Return with number_of_students = 0 for new class
    const newClassWithCount = {
      ...newClass,
      number_of_students: 0
    }
    
    return NextResponse.json(newClassWithCount, { status: 201 })
  } catch (error) {
    console.error('Error creating class:', error)
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    )
  }
}