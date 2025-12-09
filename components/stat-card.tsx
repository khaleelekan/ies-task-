import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  compact?: boolean
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  compact = false,
  trend 
}: StatCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      compact && "hover:scale-[1.02]"
    )}>
      <CardContent className={cn(
        "p-4 sm:p-6",
        compact && "p-3"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium text-muted-foreground",
              compact ? "text-xs" : "text-sm"
            )}>
              {title}
            </p>
            <p className={cn(
              "mt-1 font-bold text-foreground truncate",
              compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            )}>
              {value}
            </p>
            {description && (
              <p className={cn(
                "mt-1 text-muted-foreground truncate",
                compact ? "text-xs" : "text-sm"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-full bg-primary/10 flex-shrink-0 ml-4",
            compact ? "p-2" : "p-3"
          )}>
            <Icon className={cn(
              "text-primary",
              compact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-6 w-6"
            )} />
          </div>
        </div>
        
        {/* Trend Indicator */}
        {trend && !compact && (
          <div className="mt-3 flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        )}
        
        {/* Mobile-only trend indicator */}
        {trend && compact && (
          <div className="mt-2">
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}