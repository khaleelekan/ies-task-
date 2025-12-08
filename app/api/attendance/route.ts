import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class_name')
    const date = searchParams.get('date')

    if (!className || !date) {
      return NextResponse.json(
        { error: 'Class name and date are required' },
        { status: 400 }
      )
    }

    const attendance = await sql`
      SELECT * FROM attendance 
      WHERE class_name = ${className} 
        AND date = ${date}
      ORDER BY student_name
    `
    
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { class_name, date, records } = await request.json()
    
    if (!class_name || !date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'Class name, date, and records array are required' },
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

    // Delete existing attendance for this class and date
    await sql`
      DELETE FROM attendance 
      WHERE class_name = ${class_name} 
        AND date = ${date}
    `

    // Insert new attendance records
    for (const record of records) {
      const { student_id, student_name, status } = record
      
      // Check if student exists and is in the correct class
      const [studentExists] = await sql`
        SELECT * FROM students 
        WHERE id = ${student_id} 
          AND class_name = ${class_name}
      `
      
      if (!studentExists) {
        return NextResponse.json(
          { error: `Student ${student_name} is not in class ${class_name}` },
          { status: 400 }
        )
      }

      // Validate status
      const validStatuses = ['Present', 'Absent']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status for student ${student_name}` },
          { status: 400 }
        )
      }

      await sql`
        INSERT INTO attendance (student_id, student_name, class_name, date, status)
        VALUES (${student_id}, ${student_name}, ${class_name}, ${date}, ${status})
        ON CONFLICT (student_id, date) 
        DO UPDATE SET status = EXCLUDED.status, created_at = NOW()
      `
    }

    return NextResponse.json(
      { message: 'Attendance saved successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 }
    )
  }
}