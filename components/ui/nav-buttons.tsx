"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavButtonsProps {
  onPrev?: () => void
  onNext?: () => void
  nextLabel?: string
  prevLabel?: string
}

export function NavButtons({ onPrev, onNext, nextLabel = "Siguiente", prevLabel = "Anterior" }: NavButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={!onPrev}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        {prevLabel}
      </Button>
      
      {onNext && (
        <Button
          onClick={onNext}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
