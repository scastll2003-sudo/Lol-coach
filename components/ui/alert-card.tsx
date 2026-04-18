import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface AlertCardProps {
  variant?: "default" | "accent" | "destructive" | "warning" | "purple"
  children: ReactNode
  className?: string
}

const variants = {
  default: "bg-card border-border",
  accent: "bg-primary/[0.04] border-primary/25",
  destructive: "bg-destructive/[0.04] border-destructive/25",
  warning: "bg-warning/[0.04] border-warning/25",
  purple: "bg-purple/[0.04] border-purple/25",
}

export function AlertCard({ variant = "default", children, className }: AlertCardProps) {
  return (
    <div className={cn(
      "border rounded-lg p-[18px_20px] mb-3",
      variants[variant],
      className
    )}>
      {children}
    </div>
  )
}
