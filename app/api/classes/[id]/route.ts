import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get class with student count
    const [classItem] = await sql`
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
      WHERE c.id = ${id}
      GROUP BY c.id, c.name, c.teacher, c.description, c.created_at, c.updated_at
    `
    
    if (!classItem) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }
    
    // Parse number_of_students as integer (it might come as string)
    classItem.number_of_students = parseInt(classItem.number_of_students)
    
    return NextResponse.json(classItem)
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, teacher, description } = await request.json()
    
    if (!name || !teacher) {
      return NextResponse.json(
        { error: 'Name and teacher are required' },
        { status: 400 }
      )
    }
    
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
    
    // If name is changing, update students' class_name references
    if (name !== existingClass.name) {
      await sql`
        UPDATE students 
        SET class_name = ${name} 
        WHERE class_name = ${existingClass.name}
      `
    }
    
    // Update the class
    const [updatedClass] = await sql`
      UPDATE classes 
      SET 
        name = ${name},
        teacher = ${teacher},
        description = ${description || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    
    // Get updated class with student count
    const [updatedClassWithCount] = await sql`
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
      WHERE c.id = ${id}
      GROUP BY c.id, c.name, c.teacher, c.description, c.created_at, c.updated_at
    `
    
    if (updatedClassWithCount) {
      updatedClassWithCount.number_of_students = parseInt(updatedClassWithCount.number_of_students)
    }
    
    return NextResponse.json(updatedClassWithCount || updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First check if class exists and get its name
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
        { 
          error: 'Cannot delete class with enrolled students',
          studentCount: parseInt(hasStudents.count)
        },
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