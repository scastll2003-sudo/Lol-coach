import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { Badge } from "@/components/ui/badge"

interface ChapterPyramidProps {
  onPrev: () => void
  onNext: () => void
}

const pyramidLevels = [
  { range: "Hierro → Plata", skill: "Clear eficiente + supervivencia", impact: "+15% WR", color: "success", width: "100%" },
  { range: "Plata → Oro", skill: "Pathing óptimo · estar en el lugar correcto", impact: "clave ahora", color: "primary", width: "84%" },
  { range: "Oro → Platino", skill: "Trackear al jungler enemigo", impact: "+20% WR", color: "warning", width: "68%" },
  { range: "Platino → Diamante", skill: "Impacto real en gankeos y objetivos", impact: "+25% WR", color: "warning", width: "52%" },
  { range: "Diamante → Challenger", skill: "Dirección de juego completa", impact: "+15% WR", color: "purple", width: "36%" },
]

const colorMap: Record<string, string> = {
  success: "bg-success/10 border-success/25 text-success",
  primary: "bg-primary/10 border-primary/25 text-primary",
  warning: "bg-warning/10 border-warning/25 text-warning",
  purple: "bg-purple/10 border-purple/25 text-purple",
}

export function ChapterPyramid({ onPrev, onNext }: ChapterPyramidProps) {
  return (
    <div>
      <ChapterHeader
        chapter={3}
        group="Fundamentos"
        title={<>La Pirámide<br />del <em className="text-primary font-serif italic">Jungla</em></>}
        tags={["Prioridades por elo", "Impacto en win rate", "Tu nivel actual: Plata"]}
      />

      <p className="mb-6 leading-relaxed">
        No todo tiene el mismo impacto a todos los elos. Esta pirámide te dice exactamente en qué enfocarte según dónde estás ahora.
      </p>

      <div className="flex flex-col-reverse gap-1 items-center my-5">
        {pyramidLevels.map((level) => (
          <div
            key={level.range}
            style={{ width: level.width }}
            className={`rounded-md p-2.5 text-center text-xs font-medium border transition-all ${colorMap[level.color]}`}
          >
            <strong>{level.range}</strong> · {level.skill} · <Badge variant="outline" className={colorMap[level.color]}>{level.impact}</Badge>
          </div>
        ))}
      </div>

      <AlertCard variant="accent" className="mt-5">
        <strong>Lo que esto significa para ti en Plata 2:</strong> El 80% de tu LP está en hacer un clear eficiente y tener un plan antes de que empiece la partida. No necesitas las mecánicas de un Challenger para subir de Plata a Oro — necesitas llegar al 3:15 con un plan y ejecutarlo.
      </AlertCard>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Los 4 Pathings" />
    </div>
  )
}
