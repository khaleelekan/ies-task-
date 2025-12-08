"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Student {
  id: number
  name: string
  class_name: string
  email: string | null
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
}

interface Class {
  id: number
  name: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({ 
    name: "", 
    className: "", 
    email: "", 
    status: "Active" as "Active" | "Inactive" 
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/students')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setStudents(data)
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

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast({
        title: "Warning",
        description: "Failed to load classes. You can still add students manually.",
        variant: "default",
      })
    }
  }

  const handleAddStudent = async () => {
    // Validate input
    if (!newStudent.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Student name is required.",
        variant: "destructive",
      })
      return
    }

    if (!newStudent.className) {
      toast({
        title: "Validation Error",
        description: "Please select a class.",
        variant: "destructive",
      })
      return
    }

    // Validate email format if provided
    if (newStudent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudent.name.trim(),
          class_name: newStudent.className,
          email: newStudent.email.trim() || null,
          status: newStudent.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to create student')
      }

      // Reset form and refresh list
      setNewStudent({ 
        name: "", 
        className: "", 
        email: "", 
        status: "Active" 
      })
      setIsDialogOpen(false)
      await fetchStudents()
      
      toast({
        title: "Success",
        description: "Student added successfully.",
      })
    } catch (error) {
      console.error('Failed to create student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add student. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return

    try {
      const response = await fetch(`/api/students/${studentToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to delete student')
      }

      await fetchStudents()
      toast({
        title: "Success",
        description: `${studentToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error('Failed to delete student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  const handleEditStudent = (id: number) => {
    toast({
      title: "Info",
      description: "Edit functionality coming soon.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Students</h2>
          <p className="mt-2 text-muted-foreground">Manage all enrolled students</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enroll a new student in a class</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name *</Label>
                <Input
                  id="student-name"
                  placeholder="e.g., John Doe"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={newStudent.className}
                  onValueChange={(value) => setNewStudent({ ...newStudent, className: value })}
                >
                  <SelectTrigger id="class">
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
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newStudent.status}
                  onValueChange={(value: "Active" | "Inactive") => 
                    setNewStudent({ ...newStudent, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddStudent}
                disabled={!newStudent.name.trim() || !newStudent.className}
              >
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">{studentToDelete?.name}</span>?
                </p>
                <div className="mt-4 rounded-md bg-muted p-3">
                  <div className="text-sm space-y-1">
                    <p>This action cannot be undone.</p>
                    <p>
                      This will permanently delete the student and all their attendance records.
                    </p>
                    {studentToDelete && (
                      <div className="pt-2">
                        <p className="font-medium">Student details:</p>
                        <ul className="text-xs space-y-1 mt-1">
                          <li>Class: {studentToDelete.class_name}</li>
                          {studentToDelete.email && <li>Email: {studentToDelete.email}</li>}
                          <li>Status: {studentToDelete.status}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${students.length} student${students.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No students found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell>{student.email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditStudent(student.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(student)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}