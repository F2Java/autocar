import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props}>{children}</div>
}

export { Card, CardContent }
