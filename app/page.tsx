"use client"

import { BookOpen, Users, ClipboardCheck, TrendingUp, Calendar, Clock, AlertCircle, Info, Plus } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="space-y-4 p-2 md:p-4">
      {/* Header - Reduced spacing */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-5">Dashboard</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Welcome to the i-eSchool Admin Panel</p>
      </div>

      {/* Developer Notes - Compact */}
      <Alert className="border-primary/50 bg-primary/5 py-2">
        <Info className="h-3 w-3 text-primary flex-shrink-0" />
        <AlertDescription className="text-xs">
          <div>
            <strong className="font-semibold text-foreground">Developer Notes:</strong>
            <span className="text-muted-foreground">
              {" "}
              Complete <strong>1 of 3 tasks:</strong>
            </span>
            <ul className="mt-1 ml-3 list-disc space-y-0.5 text-muted-foreground">
              <li>Replace mock data with a real database</li>
              <li>Implement Microsoft Teams webhook endpoint</li>
              <li>Build real APIs for classes, students, and attendance</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Stats Grid - Reduced gap */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={145} 
          icon={Users} 
          description="Active students"
          compact={isMobile}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Total Classes" 
          value={12} 
          icon={BookOpen} 
          description="Ongoing courses"
          compact={isMobile}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard 
          title="Today's Attendance" 
          value="87%" 
          icon={ClipboardCheck} 
          description="126 of 145 present"
          compact={isMobile}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Avg. Performance" 
          value="84%" 
          icon={TrendingUp} 
          description="This semester"
          compact={isMobile}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Mobile Quick Actions */}
      {isMobile && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-1 h-auto py-2 text-xs">
              <Calendar className="h-3 w-3" />
              Mark Attendance
            </Button>
            <Button variant="outline" size="sm" className="gap-1 h-auto py-2 text-xs">
              <Plus className="h-3 w-3" />
              Add Student
            </Button>
          </div>
          <Button className="w-full gap-1 text-sm py-2">
            <AlertCircle className="h-3 w-3" />
            Generate AI Summary
          </Button>
        </div>
      )}

      {/* Main Content Grid - Reduced gap */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity Card */}
        <Card>
          <CardHeader className="px-3 sm:px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest updates from the system</CardDescription>
              </div>
              {!isMobile && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Clock className="h-2.5 w-2.5" />
                  24h
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 py-2">
            <div className="space-y-2">
              {[
                { 
                  action: "New student enrolled", 
                  detail: "Amina Hassan - Mathematics 101", 
                  time: "2 hours ago",
                  type: "success"
                },
                { 
                  action: "Attendance marked", 
                  detail: "English Literature - 30/30 present", 
                  time: "4 hours ago",
                  type: "info"
                },
                { 
                  action: "Class created", 
                  detail: "Advanced Physics 301", 
                  time: "1 day ago",
                  type: "warning"
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs sm:text-sm p-1.5 rounded hover:bg-accent/50">
                  <div className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    item.type === 'success' ? 'bg-green-500' :
                    item.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-medium text-foreground truncate text-xs">{item.action}</p>
                      {isMobile && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground truncate text-xs">{item.detail}</p>
                    {!isMobile && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!isMobile && (
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                View All Activity
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="px-3 sm:px-4 py-3">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 py-2">
            <div className="space-y-2">
              {[
                {
                  title: "Mark Today's Attendance",
                  description: "Record student attendance for all classes",
                  icon: ClipboardCheck,
                  action: "/attendance",
                  variant: "primary" as const
                },
                {
                  title: "Generate AI Summary",
                  description: "Get AI-powered insights on attendance",
                  icon: TrendingUp,
                  action: "/ai-summary",
                  variant: "secondary" as const
                },
                {
                  title: "Send Teams Message",
                  description: "Notify staff via Microsoft Teams",
                  icon: Users,
                  action: "/teams-integration",
                  variant: "outline" as const
                },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`rounded border p-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    item.variant === 'primary' 
                      ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                      : 'border-border hover:bg-accent/50'
                  }`}
                  onClick={() => window.location.href = item.action}
                >
                  <div className="flex items-start gap-2">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.variant === 'primary' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation - Smaller */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-10">
          <div className="grid grid-cols-4 gap-1">
            <Button variant="ghost" size="sm" className="flex-col h-auto py-1.5">
              <BookOpen className="h-3 w-3 mb-0.5" />
              <span className="text-[10px]">Classes</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto py-1.5">
              <Users className="h-3 w-3 mb-0.5" />
              <span className="text-[10px]">Students</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto py-1.5">
              <ClipboardCheck className="h-3 w-3 mb-0.5" />
              <span className="text-[10px]">Attendance</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto py-1.5">
              <TrendingUp className="h-3 w-3 mb-0.5" />
              <span className="text-[10px]">More</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}