"use client"

import { BookOpen, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="mt-2 text-muted-foreground">Welcome to the i-eSchool Admin Panel</p>
      </div>

      {/* Developer Notes */}
      <Alert className="border-primary/50 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong className="font-semibold text-foreground">Developer Notes:</strong>
          <span className="text-muted-foreground">
            {" "}
            This frontend is for an interview exercise. Candidates should complete a minimum of{" "}
            <strong>1 of the following 3 tasks:</strong>
          </span>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-muted-foreground">
            <li>Replace mock data with a real database (PostgreSQL, MongoDB, etc.)</li>
            <li>Implement a Microsoft Teams webhook endpoint to send messages from the Teams Integration page</li>
            <li>Build real APIs for classes, students, and attendance (REST or GraphQL)</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={145} icon={Users} description="Active students" />
        <StatCard title="Total Classes" value={12} icon={BookOpen} description="Ongoing courses" />
        <StatCard title="Today's Attendance" value="87%" icon={ClipboardCheck} description="126 of 145 present" />
        <StatCard title="Avg. Performance" value="84%" icon={TrendingUp} description="This semester" />
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New student enrolled", detail: "Amina Hassan - Mathematics 101", time: "2 hours ago" },
                { action: "Attendance marked", detail: "English Literature - 30/30 present", time: "4 hours ago" },
                { action: "Class created", detail: "Advanced Physics 301", time: "1 day ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.action}</p>
                    <p className="text-muted-foreground">{item.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Mark Today's Attendance</p>
                <p className="text-sm text-muted-foreground">Record student attendance for all classes</p>
              </div>
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Generate AI Summary</p>
                <p className="text-sm text-muted-foreground">Get AI-powered insights on attendance</p>
              </div>
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Send Teams Message</p>
                <p className="text-sm text-muted-foreground">Notify staff via Microsoft Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
