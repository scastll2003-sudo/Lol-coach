import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface HighlightBoxProps {
  children: ReactNode
  className?: string
}

export function HighlightBox({ children, className }: HighlightBoxProps) {
  return (
    <blockquote className={cn(
      "border-l-[3px] border-l-primary bg-primary/[0.04] py-3.5 px-[18px] rounded-r-lg my-4 text-sm italic text-foreground",
      className
    )}>
      {children}
    </blockquote>
  )
}
