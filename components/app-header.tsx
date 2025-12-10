"use client"

import { User, Menu, Search, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function AppHeader() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Dispatch event for sidebar to listen to
    const event = new CustomEvent('toggle-sidebar', { detail: !sidebarOpen })
    window.dispatchEvent(event)
  }

  return (
    <header className="fixed left-0 lg:left-64 right-0 top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden h-8 w-8"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Logo/Title - Different on mobile */}
          {isMobile ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-sm font-semibold text-foreground">i-eSchool</h1>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          ) : (
            <h1 className="text-lg lg:text-xl font-semibold text-foreground truncate">
              i-eSchool Admin Panel
            </h1>
          )}

          {/* Search Bar - Desktop/Tablet */}
          {!isMobile && (
            <div className="hidden md:flex ml-4 lg:ml-8">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students, classes..."
                  className="pl-9 w-full bg-background"
                />
              </div>
            </div>
          )}

          {/* Mobile Search Toggle */}
          {isMobile && !isSearchOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="ml-auto h-8 w-8"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Search Input */}
          {isMobile && isSearchOpen && (
            <div className="absolute left-0 right-0 top-0 h-16 bg-card px-4 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-full bg-background"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Right Section - Desktop/Tablet */}
        {!isSearchOpen && (
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Notifications - Hidden on mobile when search is open */}
            {!isSearchOpen && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications (3)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-auto">
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">New student enrolled</p>
                        <p className="text-xs text-muted-foreground">John Doe joined Mathematics 101</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Attendance reminder</p>
                        <p className="text-xs text-muted-foreground">Mark attendance for Science class</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">System update</p>
                        <p className="text-xs text-muted-foreground">New features available</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-center justify-center">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Profile - Desktop/Tablet */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@ieschool.com</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 p-0 hover:bg-transparent">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile User Profile */}
            {isMobile && !isSearchOpen && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {isMobile && isSearchOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  )
}