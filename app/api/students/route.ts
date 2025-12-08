import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    
    let students
    
    if (className) {
      // Filter by class if class parameter is provided
      students = await sql`
        SELECT * FROM students 
        WHERE class_name = ${className} 
        ORDER BY name ASC
      `
    } else {
      // Get all students
      students = await sql`
        SELECT * FROM students 
        ORDER BY created_at DESC
      `
    }
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, class_name, email, status = 'Active' } = await request.json()
    
    if (!name || !class_name) {
      return NextResponse.json(
        { error: 'Name and class are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['Active', 'Inactive']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either Active or Inactive' },
        { status: 400 }
      )
    }

    // Check if class exists
    const [classExists] = await sql`
      SELECT * FROM classes WHERE name = ${class_name}
    `
    
    if (!classExists) {
      return NextResponse.json(
        { error: 'Class does not exist' },
        { status: 400 }
      )
    }

    const [newStudent] = await sql`
      INSERT INTO students (name, class_name, email, status) 
      VALUES (${name}, ${class_name}, ${email}, ${status}) 
      RETURNING *
    `
    
    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}