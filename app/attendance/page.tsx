"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Class {
  id: number
  name: string
  teacher: string
}

interface Student {
  id: number
  name: string
  class_name: string
  status: 'Active' | 'Inactive'
}

interface AttendanceRecord {
  id?: number
  student_id: number
  student_name: string
  class_name: string
  date: string
  status: 'Present' | 'Absent'
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses()
  }, [])

  // Fetch students and attendance when class or date changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsForClass()
      fetchExistingAttendance()
    } else {
      setStudents([])
      setAttendanceRecords([])
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/classes')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudentsForClass = async () => {
    if (!selectedClass) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/students?class=${encodeURIComponent(selectedClass)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // Filter only active students
      const activeStudents = data.filter((s: Student) => s.status === 'Active')
      setStudents(activeStudents)
      
      // Initialize attendance records
      const newRecords: AttendanceRecord[] = activeStudents.map((student: Student) => ({
        student_id: student.id,
        student_name: student.name,
        class_name: selectedClass,
        date: selectedDate,
        status: 'Present' // Default status
      }))
      
      setAttendanceRecords(newRecords)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExistingAttendance = async () => {
    if (!selectedClass || !selectedDate) return

    try {
      const response = await fetch(
        `/api/attendance?class_name=${encodeURIComponent(selectedClass)}&date=${selectedDate}`
      )
      
      if (!response.ok) {
        // If no attendance exists yet, that's okay - we'll create new records
        return
      }
      
      const data = await response.json()
      
      if (data.length > 0) {
        // Update records with existing attendance
        setAttendanceRecords((current) =>
          current.map((record) => {
            const existing = data.find((a: AttendanceRecord) => a.student_id === record.student_id)
            return existing ? { ...record, status: existing.status } : record
          })
        )
        
        toast({
          title: "Info",
          description: `Loaded existing attendance for ${selectedDate}`,
        })
      }
    } catch (error) {
      console.error('Failed to fetch existing attendance:', error)
      // Silently fail - it's okay if we can't load existing attendance
    }
  }

  const toggleAttendance = (studentId: number) => {
    setAttendanceRecords((current) =>
      current.map((record) =>
        record.student_id === studentId 
          ? { 
              ...record, 
              status: record.status === 'Present' ? 'Absent' : 'Present' 
            } 
          : record
      )
    )
  }

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      toast({
        title: "Validation Error",
        description: "Please select a class first.",
        variant: "destructive",
      })
      return
    }

    if (attendanceRecords.length === 0) {
      toast({
        title: "Validation Error",
        description: "No attendance records to save. Please load students first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_name: selectedClass,
          date: selectedDate,
          records: attendanceRecords,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to save attendance')
      }

      const presentCount = attendanceRecords.filter(a => a.status === 'Present').length
      const totalCount = attendanceRecords.length
      const percentage = Math.round((presentCount / totalCount) * 100)

      toast({
        title: "Success",
        description: `Attendance saved! ${presentCount} of ${totalCount} students present (${percentage}%)`,
      })
    } catch (error) {
      console.error('Failed to save attendance:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    // Attendance records will update automatically via useEffect
  }

  const presentCount = attendanceRecords.filter(a => a.status === 'Present').length
  const totalCount = attendanceRecords.length
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Attendance</h2>
        <p className="mt-2 text-muted-foreground">Mark student attendance for classes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
          <CardDescription>Choose a class and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="class-select">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-select">Date</Label>
              <input
                id="date-select"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={fetchStudentsForClass} 
                disabled={!selectedClass || isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Load Students"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : attendanceRecords.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance for {selectedDate}</CardTitle>
            <CardDescription>
              Class: {selectedClass} • {totalCount} student{totalCount !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.student_id}>
                    <TableCell className="font-medium">{record.student_name}</TableCell>
                    <TableCell>
                      <Button
                        variant={record.status === 'Present' ? 'default' : 'destructive'}
                        size="sm"
                        onClick={() => toggleAttendance(record.student_id)}
                        className="w-24"
                      >
                        {record.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{presentCount}</span>
                {" of "}
                <span className="font-medium">{totalCount}</span>
                {" present • "}
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <Button 
                onClick={handleSaveAttendance} 
                size="lg"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : selectedClass ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No active students found in {selectedClass}. Add students first.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}