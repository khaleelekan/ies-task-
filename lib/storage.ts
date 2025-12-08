import type { Class, Student, AttendanceRecord } from "./types"

// In-memory data stores
let classes: Class[] = [
  {
    id: "1",
    name: "Mathematics 101",
    teacher: "Dr. Johnson",
    numberOfStudents: 25,
    description: "Introduction to Calculus",
  },
]

let students: Student[] = [
  {
    id: "1",
    name: "John Doe",
    className: "Mathematics 101",
    email: "john@example.com",
    status: "Active",
  },
]

let attendance: AttendanceRecord[] = []

export const storage = {
  // Classes
  getAllClasses: () => classes,
  
  getClassById: (id: string) => classes.find((c) => c.id === id),
  
  createClass: (classData: Omit<Class, "id">) => {
    const newClass = { 
      ...classData, 
      id: Date.now().toString() 
    }
    classes.push(newClass)
    return newClass
  },
  
  deleteClass: (id: string) => {
    const initialLength = classes.length
    classes = classes.filter((c) => c.id !== id)
    return initialLength !== classes.length
  },

  // Students
  getAllStudents: () => students,
  
  getStudentById: (id: string) => students.find((s) => s.id === id),
  
  createStudent: (studentData: Omit<Student, "id">) => {
    const newStudent = { 
      ...studentData, 
      id: Date.now().toString() 
    }
    students.push(newStudent)
    
    // Update class student count
    const studentClass = classes.find((c) => c.name === studentData.className)
    if (studentClass) {
      studentClass.numberOfStudents++
    }
    
    return newStudent
  },
  
  deleteStudent: (id: string) => {
    const student = students.find((s) => s.id === id)
    if (student) {
      const studentClass = classes.find((c) => c.name === student.className)
      if (studentClass) {
        studentClass.numberOfStudents--
      }
    }
    const initialLength = students.length
    students = students.filter((s) => s.id !== id)
    return initialLength !== students.length
  },

  // Attendance
  getAttendance: (filters?: { className?: string; date?: string }) => {
    let results = attendance
    if (filters?.className) {
      results = results.filter((a) => a.className === filters.className)
    }
    if (filters?.date) {
      results = results.filter((a) => a.date === filters.date)
    }
    return results
  },
  
  saveAttendance: (records: Omit<AttendanceRecord, "id">[]) => {
    const newRecords = records.map((r) => ({
      ...r,
      id: `${Date.now()}-${Math.random()}`,
    }))
    attendance.push(...newRecords)
    return newRecords
  },
}