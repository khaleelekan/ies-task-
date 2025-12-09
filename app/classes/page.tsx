"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertTriangle, Save, X, Menu, Filter } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Class {
  id: number
  name: string
  teacher: string
  number_of_students: number
  description: string | null
  created_at: string
  updated_at: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<Class | null>(null)
  const [classToEdit, setClassToEdit] = useState<Class | null>(null)
  const [newClass, setNewClass] = useState({ name: "", teacher: "", description: "" })
  const [editClass, setEditClass] = useState({ name: "", teacher: "", description: "" })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
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

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/classes")
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to fetch classes: ${error}`)
      }
      
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error("Failed to fetch classes:", error)
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClass = async () => {
    if (!newClass.name.trim() || !newClass.teacher.trim()) {
      toast({
        title: "Validation Error",
        description: "Class name and teacher are required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClass.name.trim(),
          teacher: newClass.teacher.trim(),
          description: newClass.description.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to create class")
      }

      setNewClass({ name: "", teacher: "", description: "" })
      setIsDialogOpen(false)
      await fetchClasses()
      
      toast({
        title: "Success",
        description: "Class added successfully.",
      })
    } catch (error) {
      console.error("Failed to create class:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create class. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (classItem: Class) => {
    setClassToEdit(classItem)
    setEditClass({
      name: classItem.name,
      teacher: classItem.teacher,
      description: classItem.description || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateClass = async () => {
    if (!classToEdit) return

    if (!editClass.name.trim() || !editClass.teacher.trim()) {
      toast({
        title: "Validation Error",
        description: "Class name and teacher are required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/classes/${classToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editClass.name.trim(),
          teacher: editClass.teacher.trim(),
          description: editClass.description.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to update class")
      }

      setIsEditDialogOpen(false)
      await fetchClasses()
      
      toast({
        title: "Success",
        description: "Class updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update class:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update class. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteClass = async () => {
    if (!classToDelete) return

    try {
      const response = await fetch(`/api/classes/${classToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to delete class")
      }

      await fetchClasses()
      toast({
        title: "Success",
        description: `${classToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Failed to delete class:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete class. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setClassToDelete(null)
    }
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )

  // Mobile card view
  const MobileClassCard = ({ classItem }: { classItem: Class }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-base">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{classItem.teacher}</p>
          </div>
          <Badge variant="secondary" className="ml-2">
            {classItem.number_of_students} students
          </Badge>
        </div>
        
        {classItem.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {classItem.description}
          </p>
        )}
        
        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(classItem)}
            className="h-8 px-2"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(classItem)}
            className="h-8 px-2 text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Tablet card view
  const TabletClassCard = ({ classItem }: { classItem: Class }) => (
    <Card className="mb-4">
      <CardContent className="p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground">Teacher: {classItem.teacher}</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-sm">
              {classItem.number_of_students} students
            </Badge>
          </div>
        </div>
        
        {classItem.description && (
          <p className="text-sm text-muted-foreground mt-3">
            {classItem.description}
          </p>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditClick(classItem)}
            className="gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteClick(classItem)}
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Classes</h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
            Manage all classes and courses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Class</span>
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
                  Add Class
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add New Class</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Create a new class with teacher and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Class Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics 101"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher" className="text-sm sm:text-base">Teacher Name *</Label>
              <Input
                id="teacher"
                placeholder="e.g., Dr. Sarah Johnson"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class"
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                className="text-sm sm:text-base min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClass}
              disabled={!newClass.name.trim() || !newClass.teacher.trim()}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Class</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update class information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm sm:text-base">Class Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Mathematics 101"
                value={editClass.name}
                onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-teacher" className="text-sm sm:text-base">Teacher Name *</Label>
              <Input
                id="edit-teacher"
                placeholder="e.g., Dr. Sarah Johnson"
                value={editClass.teacher}
                onChange={(e) => setEditClass({ ...editClass, teacher: e.target.value })}
                className="text-sm sm:text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm sm:text-base">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the class"
                value={editClass.description}
                onChange={(e) => setEditClass({ ...editClass, description: e.target.value })}
                className="text-sm sm:text-base min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClass}
              disabled={!editClass.name.trim() || !editClass.teacher.trim()}
              className="w-full sm:w-auto order-1 sm:order-2 gap-1"
            >
              <Save className="h-4 w-4" />
              Update Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md rounded-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle className="text-lg sm:text-xl">Delete Class</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-3 sm:pt-4 text-sm sm:text-base">
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">{classToDelete?.name}</span>?
                </p>
                <div className="mt-3 sm:mt-4 rounded-md bg-muted p-3">
                  <div className="text-xs sm:text-sm space-y-1">
                    <p>This action cannot be undone.</p>
                    <p>
                      This will permanently delete the class
                      {classToDelete?.number_of_students ? (
                        <> and remove {classToDelete.number_of_students} enrolled student{classToDelete.number_of_students > 1 ? "s" : ""}</>
                      ) : null}
                      .
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel 
              onClick={() => setClassToDelete(null)}
              className="w-full sm:w-auto order-2 sm:order-1 mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="w-full sm:w-auto order-1 sm:order-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">All Classes</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {isLoading ? "Loading..." : `${classes.length} class${classes.length !== 1 ? 'es' : ''} found`}
              </CardDescription>
            </div>
            {isMobile && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Class
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="rounded-full bg-muted p-3 sm:p-4 mb-3 sm:mb-4">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">No classes found.</p>
              <Button 
                variant="outline" 
                className="mt-3 sm:mt-4 gap-1"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Your First Class
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile && (
                <div className="space-y-3">
                  {classes.map((classItem) => (
                    <MobileClassCard key={classItem.id} classItem={classItem} />
                  ))}
                </div>
              )}

              {/* Tablet View */}
              {isTablet && (
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <TabletClassCard key={classItem.id} classItem={classItem} />
                  ))}
                </div>
              )}

              {/* Desktop View */}
              {!isMobile && !isTablet && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Class Name</TableHead>
                        <TableHead className="min-w-[120px]">Teacher</TableHead>
                        <TableHead className="min-w-[100px]">Students</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead className="min-w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell className="font-medium">{classItem.name}</TableCell>
                          <TableCell>{classItem.teacher}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {classItem.number_of_students}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="line-clamp-2">
                              {classItem.description || "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditClick(classItem)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteClick(classItem)}
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