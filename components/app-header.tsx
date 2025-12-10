"use client"

import { Bell, Search, User, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/classes": "Classes",
  "/students": "Students",
  "/attendance": "Attendance",
  "/ai-summary": "AI Summary",
  "/teams-integration": "Teams Integration",
}

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const currentTitle = pageTitles[pathname] || "Dashboard"

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      // Implement your search logic here
      alert(`Searching for: ${searchQuery}`)
      setIsSearchOpen(false)
    }
  }

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  // Handle escape key to close search/menu
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  // Mobile menu content
  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Menu panel */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border animate-in slide-in-from-left-80">
        {/* Menu header */}
        <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-6">
          <div className="flex items-center gap-3">
            <img 
              className="h-8 w-8" 
              src="/ies.jpg" 
              alt="Site logo" 
            />
            <span className="text-lg font-semibold text-sidebar-foreground">i-eSchool</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile search in menu */}
        <div className="p-4 border-b border-sidebar-border">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>

        {/* User info in menu */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Full-screen mobile search
  const MobileSearch = () => (
    <div className="fixed inset-0 z-50 md:hidden bg-sidebar">
      {/* Search header */}
      <div className="flex items-center h-16 border-b border-sidebar-border px-4">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-md hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </form>
      </div>

      {/* Search suggestions */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-2">Recent searches</p>
        <div className="space-y-2">
          {["Mathematics", "Student attendance", "Class schedule", "AI Summary"].map((term, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(term)
                handleSearch(new Event('submit') as any)
              }}
              className="w-full text-left p-2 rounded-md hover:bg-sidebar-accent text-sm"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-4 border-b border-sidebar-border bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/80 px-4 md:left-64 md:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-md hover:bg-sidebar-accent"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title */}
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold text-sidebar-foreground truncate">
            {currentTitle}
          </h1>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search classes, students, attendance..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-sidebar-accent"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-md hover:bg-sidebar-accent" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>

          {/* User Profile - Desktop */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-sidebar-border">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Render modals */}
      {isMobileMenuOpen && <MobileMenu />}
      {isSearchOpen && <MobileSearch />}
    </>
  )
}