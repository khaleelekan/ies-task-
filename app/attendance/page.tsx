"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Users, Check, X, Save, Loader2 } from "lucide-react"

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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const { toast } = useToast()

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
        
        if (!isMobile) {
          toast({
            title: "Info",
            description: `Loaded existing attendance for ${selectedDate}`,
          })
        }
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
  }

  const presentCount = attendanceRecords.filter(a => a.status === 'Present').length
  const totalCount = attendanceRecords.length
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Mobile student card
  const MobileStudentCard = ({ record }: { record: AttendanceRecord }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          record.status === 'Present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {record.status === 'Present' ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">{record.student_name}</p>
          <p className="text-xs text-muted-foreground">ID: {record.student_id}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant={record.status === 'Present' ? "default" : "destructive"}
        onClick={() => toggleAttendance(record.student_id)}
        className="h-8 px-3"
      >
        {isMobile ? (record.status === 'Present' ? '✓' : '✗') : record.status}
      </Button>
    </div>
  )

  // Tablet student card
  const TabletStudentCard = ({ record }: { record: AttendanceRecord }) => (
    <div className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg mb-3">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          record.status === 'Present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {record.status === 'Present' ? (
            <Check className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-medium">{record.student_name}</p>
          <p className="text-sm text-muted-foreground">Student ID: {record.student_id}</p>
        </div>
      </div>
      
      <div className="text-center">
        <Badge variant={record.status === 'Present' ? "default" : "destructive"}>
          {record.status}
        </Badge>
      </div>
      
      <Button
        variant="outline"
        onClick={() => toggleAttendance(record.student_id)}
        className="justify-self-end"
      >
        Toggle Status
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Attendance</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Mark student attendance for classes</p>
      </div>

      {/* Selection Card */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Select Class and Date</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Choose a class and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="grid gap-4">
            {/* Desktop/Tablet Grid */}
            {!isMobile ? (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="class-select" className="text-sm sm:text-base">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select" className="text-sm sm:text-base">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.name} className="text-sm sm:text-base">
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-select" className="text-sm sm:text-base">Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <input
                      id="date-select"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={fetchStudentsForClass} 
                    disabled={!selectedClass || isLoading}
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    {isLoading ? "Loading..." : "Load Students"}
                  </Button>
                </div>
              </div>
            ) : (
              /* Mobile Stack */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="class-select-mobile" className="text-sm">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select-mobile" className="text-sm">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.name} className="text-sm">
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-select-mobile" className="text-sm">Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <input
                      id="date-select-mobile"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <Button 
                  onClick={fetchStudentsForClass} 
                  disabled={!selectedClass || isLoading}
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  {isLoading ? "Loading..." : "Load Students"}
                </Button>
              </div>
            )}

            {/* Stats Summary */}
            {attendanceRecords.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Present: {presentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Absent: {totalCount - presentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total: {totalCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Attendance Rate: {percentage}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : attendanceRecords.length > 0 ? (
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  Attendance for {selectedDate}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Class: {selectedClass} • {totalCount} student{totalCount !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              
              {isMobile && (
                <div className="text-right">
                  <div className="text-lg font-bold">{percentage}%</div>
                  <div className="text-xs text-muted-foreground">Attendance Rate</div>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6">
            {/* Mobile View */}
            {isMobile && (
              <div className="space-y-2">
                {attendanceRecords.map((record) => (
                  <MobileStudentCard key={record.student_id} record={record} />
                ))}
              </div>
            )}

            {/* Tablet View */}
            {isTablet && (
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <TabletStudentCard key={record.student_id} record={record} />
                ))}
              </div>
            )}

            {/* Desktop View */}
            {!isMobile && !isTablet && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Student Name</TableHead>
                      <TableHead className="min-w-[100px]">Student ID</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px] text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.student_id}>
                        <TableCell className="font-medium">{record.student_name}</TableCell>
                        <TableCell className="text-muted-foreground">{record.student_id}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === 'Present' ? "default" : "destructive"}
                            className="gap-1"
                          >
                            {record.status === 'Present' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAttendance(record.student_id)}
                          >
                            Toggle Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Save Button Section */}
            {attendanceRecords.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto text-center sm:text-left">
                    <div className="text-2xl font-bold text-primary">{percentage}%</div>
                    <div className="text-sm text-muted-foreground">
                      {presentCount} of {totalCount} students present
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveAttendance} 
                    size={isMobile ? "lg" : "default"}
                    disabled={isSaving}
                    className="w-full sm:w-auto gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isMobile ? "Save" : "Save Attendance"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : selectedClass ? (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Users className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm sm:text-base">
                  No active students found in {selectedClass}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add students first or check student status
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm sm:text-base">
                Select a class and date to begin marking attendance
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}