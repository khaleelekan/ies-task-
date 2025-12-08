import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    // Await the params to get the actual values
    const { id } = await params
    
    // First check if class exists
    const [existingClass] = await sql`
      SELECT * FROM classes WHERE id = ${id}
    `
    
    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    // Check if class has students
    const [hasStudents] = await sql`
      SELECT COUNT(*) as count FROM students 
      WHERE class_name = ${existingClass.name}
    `
    
    if (parseInt(hasStudents.count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with enrolled students' },
        { status: 400 }
      )
    }
    
    // Delete the class
    await sql`DELETE FROM classes WHERE id = ${id}`
    
    return NextResponse.json(
      { message: 'Class deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    )
  }
}

// Add GET method to fetch a single class (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const [classItem] = await sql`
      SELECT * FROM classes WHERE id = ${id}
    `
    
    if (!classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(classItem)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    )
  }
}

// Add PUT method to update a class (optional)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, teacher, description } = await request.json()
    
    // Check if class exists
    const [existingClass] = await sql`
      SELECT * FROM classes WHERE id = ${id}
    `
    
    if (!existingClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    // Update the class
    const [updatedClass] = await sql`
      UPDATE classes 
      SET 
        name = COALESCE(${name}, name),
        teacher = COALESCE(${teacher}, teacher),
        description = COALESCE(${description}, description),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    
    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}