import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "@/components/ui/toaster"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "i-eSchool Admin Panel",
  description: "Online school management system - Frontend prototype for technical interviews",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <div className="min-h-screen">
          {/* Sidebar renders both desktop and mobile versions */}
          <AppSidebar />
          
          {/* Main content area */}
          <div className="md:pl-64">
            {/* Header */}
            <AppHeader />
            
            {/* Main content with proper spacing for mobile bottom nav */}
            <main className="pt-16 pb-16 md:pb-0 px-4 md:px-8 min-h-screen">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}