"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertTriangle, Save, Menu, Mail, User, School } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({ 
    name: "", 
    className: "", 
    email: "", 
    status: "Active" as "Active" | "Inactive" 
  })
  const [editStudent, setEditStudent] = useState({ 
    name: "", 
    className: "", 
    email: "", 
    status: "Active" as "Active" | "Inactive" 
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchClasses()
    
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
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

  const handleEditClick = (student: Student) => {
    setStudentToEdit(student)
    setEditStudent({
      name: student.name,
      className: student.class_name,
      email: student.email || "",
      status: student.status
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateStudent = async () => {
    if (!studentToEdit) return

    if (!editStudent.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Student name is required.",
        variant: "destructive",
      })
      return
    }

    if (!editStudent.className) {
      toast({
        title: "Validation Error",
        description: "Please select a class.",
        variant: "destructive",
      })
      return
    }

    if (editStudent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editStudent.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/students/${studentToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editStudent.name.trim(),
          class_name: editStudent.className,
          email: editStudent.email.trim() || null,
          status: editStudent.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to update student')
      }

      setIsEditDialogOpen(false)
      await fetchStudents()
      
      toast({
        title: "Success",
        description: "Student updated successfully.",
      })
    } catch (error) {
      console.error('Failed to update student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update student. Please try again.",
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

  // Filter students based on active tab
  const filteredStudents = students.filter(student => {
    if (activeTab === "all") return true
    return student.status === activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  })

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )

  // Mobile card view
  const MobileStudentCard = ({ student }: { student: Student }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{student.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <School className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{student.class_name}</span>
              </div>
            </div>
          </div>
          <Badge variant={student.status === "Active" ? "default" : "secondary"} className="text-xs">
            {student.status}
          </Badge>
        </div>
        
        {student.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{student.email}</span>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(student)}
            className="h-8 px-2"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(student)}
            className="h-8 px-2 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Tablet card view
  const TabletStudentCard = ({ student }: { student: Student }) => (
    <Card className="mb-4">
      <CardContent className="p-5">
        <div className="grid grid-cols-3 gap-4 items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <School className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{student.class_name}</span>
              </div>
            </div>
          </div>
          
          <div>
            {student.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="truncate">{student.email}</span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <Badge variant={student.status === "Active" ? "default" : "secondary"}>
              {student.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditClick(student)}
            className="gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(student)}
            className="gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Students</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            Manage all enrolled students
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Student</span>
                  <span className="inline sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
          
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {!isMobile && students.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All ({students.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({students.filter(s => s.status === 'Active').length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({students.filter(s => s.status === 'Inactive').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Add Student Modal - UPDATED WITH PROPER PADDING */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-lg">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg sm:text-xl">Add New Student</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Enroll a new student in a class
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-sm sm:text-base">Student Name *</Label>
              <Input
                id="student-name"
                placeholder="e.g., John Doe"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class" className="text-sm sm:text-base">Class *</Label>
              <Select
                value={newStudent.className}
                onValueChange={(value) => setNewStudent({ ...newStudent, className: value })}
              >
                <SelectTrigger id="class" className="text-sm sm:text-base">
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
              <Label htmlFor="email" className="text-sm sm:text-base">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
              <Select
                value={newStudent.status}
                onValueChange={(value: "Active" | "Inactive") => 
                  setNewStudent({ ...newStudent, status: value })
                }
              >
                <SelectTrigger id="status" className="text-sm sm:text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-sm sm:text-base">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-sm sm:text-base">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStudent}
              disabled={!newStudent.name.trim() || !newStudent.className}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal - UPDATED WITH PROPER PADDING */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-lg">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg sm:text-xl">Edit Student</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update student information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-student-name" className="text-sm sm:text-base">Student Name *</Label>
              <Input
                id="edit-student-name"
                placeholder="e.g., John Doe"
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-class" className="text-sm sm:text-base">Class *</Label>
              <Select
                value={editStudent.className}
                onValueChange={(value) => setEditStudent({ ...editStudent, className: value })}
              >
                <SelectTrigger id="edit-class" className="text-sm sm:text-base">
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
              <Label htmlFor="edit-email" className="text-sm sm:text-base">Email (Optional)</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="student@example.com"
                value={editStudent.email}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-sm sm:text-base">Status</Label>
              <Select
                value={editStudent.status}
                onValueChange={(value: "Active" | "Inactive") => 
                  setEditStudent({ ...editStudent, status: value })
                }
              >
                <SelectTrigger id="edit-status" className="text-sm sm:text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-sm sm:text-base">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-sm sm:text-base">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStudent}
              disabled={!editStudent.name.trim() || !editStudent.className}
              className="w-full sm:w-auto order-1 sm:order-2 gap-1"
            >
              <Save className="h-4 w-4" />
              Update Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal - UPDATED WITH PROPER PADDING */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <AlertDialogHeader className="px-6 pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle className="text-lg sm:text-xl">Delete Student</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription className="px-6 pt-3 sm:pt-4 text-sm sm:text-base">
            <div className="space-y-2">
              <div className="text-base">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">{studentToDelete?.name}</span>?
              </div>
              <div className="mt-3 sm:mt-4 rounded-md bg-muted p-3">
                <div className="text-xs sm:text-sm space-y-1">
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
          <AlertDialogFooter className="px-6 pb-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel 
              onClick={() => setStudentToDelete(null)}
              className="w-full sm:w-auto order-2 sm:order-1 mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="w-full sm:w-auto order-1 sm:order-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">All Students</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {isLoading ? "Loading..." : `${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''} found`}
              </CardDescription>
            </div>
            
            {isMobile && (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Student
                </Button>
              </div>
            )}
            
            {/* Mobile Filter */}
            {isMobile && students.length > 0 && (
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students ({students.length})</SelectItem>
                  <SelectItem value="active">Active ({students.filter(s => s.status === 'Active').length})</SelectItem>
                  <SelectItem value="inactive">Inactive ({students.filter(s => s.status === 'Inactive').length})</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="px-3 sm:px-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="rounded-full bg-muted p-3 sm:p-4 mb-3 sm:mb-4">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                {activeTab === "all" 
                  ? "No students found." 
                  : `No ${activeTab} students found.`
                }
              </p>
              <Button 
                variant="outline" 
                className="mt-3 sm:mt-4 gap-1"
                onClick={() => {
                  setIsDialogOpen(true)
                  setActiveTab("all")
                }}
              >
                <Plus className="h-4 w-4" />
                Add Your First Student
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile && (
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <MobileStudentCard key={student.id} student={student} />
                  ))}
                </div>
              )}

              {/* Tablet View */}
              {isTablet && (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <TabletStudentCard key={student.id} student={student} />
                  ))}
                </div>
              )}

              {/* Desktop View */}
              {!isMobile && !isTablet && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Name</TableHead>
                        <TableHead className="min-w-[120px]">Class</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              {student.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <School className="h-3.5 w-3.5 text-muted-foreground" />
                              {student.class_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.email ? (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                {student.email}
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditClick(student)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteClick(student)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}