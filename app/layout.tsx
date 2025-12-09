import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "@/components/ui/toaster"
import { SidebarToggle } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "i-eSchool Admin Panel",
  description: "Online school management system - Frontend prototype for technical interviews",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <div className="flex min-h-screen">
          {/* Desktop Sidebar - Hidden on mobile */}
          <AppSidebar />
          
          {/* Mobile Sidebar - Shown as overlay */}
          <AppSidebar mobile />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64 w-full">
            {/* Header with Mobile Toggle */}
            <AppHeader />
            
            {/* Mobile Sidebar Toggle - Only on mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-40">
              <SidebarToggle />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 mt-16 lg:mt-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}