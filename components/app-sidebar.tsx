"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Users, ClipboardCheck, Sparkles, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/classes", icon: BookOpen, label: "Classes" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { href: "/ai-summary", icon: Sparkles, label: "AI Summary" },
  { href: "/teams-integration", icon: MessageSquare, label: "Teams Integration" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        // Mobile: top bar
        "fixed inset-x-0 top-0 z-40 flex h-16 w-full items-center border-b border-sidebar-border bg-sidebar px-4 md:hidden",

        // Desktop: left sidebar
        "md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col md:border-r md:border-sidebar-border md:px-0"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 w-full items-center border-sidebar-border px-2 md:border-b md:px-6">
        <img className="h-6 w-6 text-sidebar-primary" 
      src="/ies.jpg" 
      alt="Site logo" 
    />
        <span className="ml-2 text-lg font-semibold text-sidebar-foreground">i-eSchool</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden flex-1 space-y-1 p-4 md:block">
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
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation (Horizontal) */}
      <nav className="flex w-full items-center justify-between md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs font-medium py-2 transition-colors",
                isActive
                  ? "text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
