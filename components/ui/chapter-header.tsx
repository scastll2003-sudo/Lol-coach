import { ReactNode } from "react"

interface ChapterHeaderProps {
  chapter: number
  group: string
  title: ReactNode
  tags?: string[]
  subtitle?: string
}

export function ChapterHeader({ chapter, group, title, tags, subtitle }: ChapterHeaderProps) {
  return (
    <div className="relative">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_top_right,oklch(0.85_0.22_115_/_0.04),transparent_70%)] pointer-events-none rounded-bl-[200px]" />
      
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary mb-3 flex items-center gap-2">
        <span className="inline-block w-5 h-px bg-primary" />
        Capítulo {chapter.toString().padStart(2, '0')} — {group}
      </div>
      
      <h1 className="font-serif text-[38px] leading-[1.15] text-foreground mb-2 tracking-tight text-balance">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-[15px] text-muted-foreground mb-9 max-w-[560px] leading-relaxed">
          {subtitle}
        </p>
      )}
      
      {tags && (
        <div className="font-mono text-[11px] text-muted-foreground flex gap-3.5 mb-9 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="before:content-['//'] before:text-primary before:mr-1.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
