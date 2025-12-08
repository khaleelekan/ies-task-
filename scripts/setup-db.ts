import { neon } from '@neondatabase/serverless'
import 'dotenv/config' 

const sql = neon(process.env.DATABASE_URL!)

async function setupDatabase() {
  try {
    console.log('Creating tables...')

    // Create classes table
    await sql`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        number_of_students INTEGER DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Classes table created')

    // Create students table
    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class_name VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(50) CHECK (status IN ('Active', 'Inactive')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Students table created')

    // Create attendance table
    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        student_name VARCHAR(255),
        class_name VARCHAR(255),
        date DATE NOT NULL,
        status VARCHAR(50) CHECK (status IN ('Present', 'Absent')),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(student_id, date)
      )
    `
    console.log('✅ Attendance table created')

    console.log('✅ Database setup complete!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()