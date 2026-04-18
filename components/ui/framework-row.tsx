interface FrameworkRowProps {
  letter: string
  title: string
  description: string
  note?: string
  color?: string
}

export function FrameworkRow({ letter, title, description, note, color = "text-primary" }: FrameworkRowProps) {
  return (
    <div className="flex items-start gap-3.5 bg-card border border-border rounded-lg p-3.5 transition-colors hover:border-border/80">
      <span className={`font-serif text-[28px] ${color} min-w-8 leading-none mt-0.5`}>
        {letter}
      </span>
      <div>
        <div className="font-semibold text-sm text-foreground mb-1">{title}</div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
        {note && (
          <p className="text-xs text-success mt-1 italic">{note}</p>
        )}
      </div>
    </div>
  )
}
