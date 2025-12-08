import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fix here too
) {
  try {
    // Await the params
    const { id } = await params
    
    // Check if student exists
    const [existingStudent] = await sql`
      SELECT * FROM students WHERE id = ${id}
    `
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    
    // Delete the student (this will cascade to attendance records)
    await sql`DELETE FROM students WHERE id = ${id}`
    
    return NextResponse.json(
      { message: 'Student deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}

// Optional: Add PUT/PATCH for updating students
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Fix here too
) {
  try {
    const { id } = await params
    const { name, class_name, email, status } = await request.json()
    
    // Check if student exists
    const [existingStudent] = await sql`
      SELECT * FROM students WHERE id = ${id}
    `
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    
    // If changing class, check if new class exists
    if (class_name && class_name !== existingStudent.class_name) {
      const [classExists] = await sql`
        SELECT * FROM classes WHERE name = ${class_name}
      `
      
      if (!classExists) {
        return NextResponse.json(
          { error: 'Class does not exist' },
          { status: 400 }
        )
      }
    }
    
    // Update student
    const [updatedStudent] = await sql`
      UPDATE students 
      SET 
        name = COALESCE(${name}, name),
        class_name = COALESCE(${class_name}, class_name),
        email = COALESCE(${email}, email),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}