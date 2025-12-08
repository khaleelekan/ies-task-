"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, AlertTriangle, Save, X } from "lucide-react"
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

  useEffect(() => {
    fetchClasses()
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
    // Validate input
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

      // Reset form and refresh list
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

    // Validate input
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

      await fetchClasses() // Refresh list
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Classes</h2>
          <p className="mt-2 text-muted-foreground">Manage all classes and courses</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new class with teacher and description</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics 101"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher Name *</Label>
                <Input
                  id="teacher"
                  placeholder="e.g., Dr. Sarah Johnson"
                  value={newClass.teacher}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the class"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddClass}
                disabled={!newClass.name.trim() || !newClass.teacher.trim()}
              >
                Add Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Class Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>Update class information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Class Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Mathematics 101"
                value={editClass.name}
                onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-teacher">Teacher Name *</Label>
              <Input
                id="edit-teacher"
                placeholder="e.g., Dr. Sarah Johnson"
                value={editClass.teacher}
                onChange={(e) => setEditClass({ ...editClass, teacher: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of the class"
                value={editClass.description}
                onChange={(e) => setEditClass({ ...editClass, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateClass}
              disabled={!editClass.name.trim() || !editClass.teacher.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Update Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Delete Class</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">{classToDelete?.name}</span>?
                </p>
                <div className="mt-4 rounded-md bg-muted p-3">
                  <div className="text-sm space-y-1">
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
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClassToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${classes.length} class${classes.length !== 1 ? 'es' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading classes...</p>
              </div>
            </div>
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No classes found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Class
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>{classItem.teacher}</TableCell>
                    <TableCell>{classItem.number_of_students}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {classItem.description || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(classItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(classItem)}
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