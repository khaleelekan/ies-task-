"use client"

import { User, Search, Menu, X, Bell, Loader2 } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { debounce } from "lodash"

interface SearchResult {
  id: number
  type: 'student' | 'class' | 'attendance'
  title: string
  subtitle: string
  description: string
  icon: string
  href: string
  createdAt: string
}

export function AppHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([])
        setSearchError(null)
        return
      }

      setIsSearchLoading(true)
      setSearchError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`)
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        setSearchResults(data.results || [])
      } catch (err) {
        console.error('Search error:', err)
        setSearchError(err instanceof Error ? err.message : 'Failed to search')
        setSearchResults([])
      } finally {
        setIsSearchLoading(false)
      }
    }, 300),
    []
  )

  // Trigger search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      setShowSearchDropdown(true)
    } else {
      setSearchResults([])
      setShowSearchDropdown(false)
    }

    return () => {
      performSearch.cancel()
    }
  }, [searchQuery, performSearch])

  // Handle search result click
  const handleResultClick = (href: string) => {
    router.push(href)
    setSearchResults([])
    setSearchQuery("")
    setIsSearchOpen(false)
    setShowSearchDropdown(false)
    setIsMobileMenuOpen(false)
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to first result
      handleResultClick(searchResults[0].href)
    } else if (searchQuery.trim()) {
      // If no results but there's a query, show message
      setSearchError(`No results found for "${searchQuery}"`)
    }
  }

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        showSearchDropdown
      ) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSearchDropdown])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setShowSearchDropdown(false)
  }, [router])

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileMenuOpen(false)
        setShowSearchDropdown(false)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)
    return () => window.removeEventListener('keydown', handleEscapeKey)
  }, [])

  // Desktop search dropdown
  const DesktopSearchDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      <div className="p-2">
        {isSearchLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-foreground">Searching...</span>
          </div>
        ) : searchError ? (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
            {searchError}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result.href)}
                className="w-full text-left p-2 rounded-md hover:bg-accent text-sm flex items-center gap-3 transition-colors group"
              >
                <span className="text-lg">{result.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground group-hover:text-primary">
                    {result.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {result.subtitle}
                  </p>
                  {result.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {result.description}
                    </p>
                  )}
                </div>
                <Search className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        ) : searchQuery.length >= 2 ? (
          <div className="p-3 text-center text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <>
      {/* Main Header */}
      <header className="fixed left-0 md:left-64 right-0 top-0 z-30 h-16 border-b border-border bg-card">
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          {/* Left side - Title and mobile menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-accent text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
              i-eSchool Admin Panel
            </h1>
          </div>

          {/* Center - Search bar (desktop only) with dropdown */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search students, classes, attendance..."
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchDropdown(true)
                }}
                onFocus={() => setShowSearchDropdown(true)}
              />
              {isSearchLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </form>
            
            {/* Show dropdown when search is active */}
            {showSearchDropdown && searchQuery.length >= 1 && (
              <DesktopSearchDropdown />
            )}
          </div>

          {/* Right side - Actions and user profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-accent text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button className="relative p-2 rounded-md hover:bg-accent text-foreground" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-muted-foreground">Admin</span>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Search */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-card">
          <div className="flex items-center h-16 border-b border-border px-4 bg-card">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-md hover:bg-accent text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-input bg-background py-2 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {isSearchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="p-2 text-primary hover:text-primary/80"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile search results */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)] bg-card">
            {isSearchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-foreground">Searching...</span>
              </div>
            ) : searchError ? (
              <div className="p-4 text-center text-destructive">
                {searchError}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </p>
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.href)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all flex items-center gap-3"
                  >
                    <span className="text-2xl">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">{result.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                      {result.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for</p>
                <p className="font-medium mt-1 text-foreground">"{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try searching for students, classes, or teachers
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border shadow-xl animate-in slide-in-from-left-80">
            <div className="flex items-center justify-between h-16 border-b border-border px-6 bg-card">
              <div className="flex items-center gap-3">
                <img className="h-6 w-6" src="/ies.jpg" alt="Site logo" />
                <span className="text-lg font-semibold text-foreground">i-eSchool</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-accent"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Mobile search in menu */}
            <div className="p-4 border-b border-border bg-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Quick search..."
                  className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>
            </div>

            <div className="p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}