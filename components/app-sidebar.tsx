"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Sparkles, 
  MessageSquare, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AppSidebarProps {
  mobile?: boolean
}

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/classes", icon: BookOpen, label: "Classes" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { href: "/ai-summary", icon: Sparkles, label: "AI Summary" },
  { href: "/teams-integration", icon: MessageSquare, label: "Teams Integration" },
]

export function AppSidebar({ mobile = false }: AppSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobile && isMobileOpen) {
      setIsMobileOpen(false)
      document.body.classList.remove('sidebar-open')
    }
  }, [pathname, mobile, isMobileOpen])

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
    document.body.classList.toggle('sidebar-open')
  }

  const sidebarContent = (
    <>
      {/* Logo & Header */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border px-4 sm:px-6",
        mobile ? "h-16 justify-between" : "h-16",
        !mobile && isCollapsed ? "justify-center" : "justify-between"
      )}>
        {(!mobile || !isCollapsed) && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                 <img
              src="/ies.jpg" // or "/logo.svg", "/logo.jpg", "/school-logo.png", etc.
              alt="i-eSchool Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            </div>
            {(!isCollapsed || mobile) && (
              <span className="text-lg font-semibold text-sidebar-foreground">i-eSchool</span>
            )}
          </div>
        )}
        
        {/* Mobile Close Button */}
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        {/* Desktop Collapse Button */}
        {!mobile && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className={cn(
          "p-3 sm:p-4 space-y-1",
          mobile && "p-3"
        )}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  mobile && "py-3",
                  !mobile && isCollapsed && "justify-center px-2"
                )}
                onClick={() => mobile && toggleMobileSidebar()}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  !mobile && isCollapsed && "mx-auto"
                )} />
                {(!isCollapsed || mobile) && (
                  <span className={cn(
                    "truncate",
                    !mobile && isCollapsed && "hidden"
                  )}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer Section */}
      {(!isCollapsed || mobile) && (
        <div className={cn(
          "border-t border-sidebar-border p-4",
          mobile && "p-3"
        )}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@ieschool.com</p>
            </div>
          </div>

          {/* Settings Link */}
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-2",
              pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={() => mobile && toggleMobileSidebar()}
          >
            <Settings className="h-5 w-5" />
            {(!isCollapsed || mobile) && "Settings"}
          </Link>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            {(!isCollapsed || mobile) && "Logout"}
          </Button>
        </div>
      )}
    </>
  )

  // Mobile Sidebar
  if (mobile) {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        <div className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )} 
        onClick={toggleMobileSidebar} 
        aria-hidden="true"
        />
        
        {/* Mobile Sidebar */}
        <aside className={cn(
          "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-full flex flex-col">
            {sidebarContent}
          </div>
        </aside>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-30 transition-all duration-300 hidden lg:block",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="h-full flex flex-col">
        {sidebarContent}
        
        {/* Desktop Collapse Toggle */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full border shadow-sm bg-background"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}

// Mobile Toggle Button Component (to use in header)
export function SidebarToggle() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.mobile-sidebar')
    if (sidebar) {
      sidebar.classList.toggle('open')
      document.body.classList.toggle('sidebar-open')
    }
  }

  if (!isMobile) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="lg:hidden h-10 w-10"
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}