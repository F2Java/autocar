import * as React from "react"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  default: "bg-blue-100 text-blue-800",
  destructive: "bg-red-100 text-red-800",
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "status"
  status?: string
}

function Badge({ className, variant = "default", status, children, ...props }: BadgeProps) {
  const statusClass = status ? statusColors[status] || "bg-gray-100 text-gray-800" : ""

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-blue-100 text-blue-800",
        variant === "outline" && "border border-gray-300 text-gray-700",
        variant === "status" && statusClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
