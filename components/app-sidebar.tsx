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
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <img 
              className="h-6 w-6 text-sidebar-primary" 
              src="/ies.jpg" 
              alt="Site logo" 
            />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">i-eSchool</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
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
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Shown on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-sidebar-border bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/95">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {/* <span className="text-center truncate px-1">{item.label}</span> */}
            </Link>
          )
        })}
      </nav>
    </>
  )
}