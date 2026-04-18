import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Badge } from "@/components/ui/badge"

interface ChapterPathingProps {
  onPrev: () => void
  onNext: () => void
}

const pathings = [
  {
    name: "Full Clear",
    badge: "primary",
    when: "Líneas estables, no hay jugada clara de mayor valor",
    success: "Nivel 4 antes que el enemigo + máximo oro",
    fail: "Bajo riesgo — enemigo gankea pero tú vas más farmeado"
  },
  {
    name: "3-Camp Gank",
    badge: "warning",
    when: "Una línea tiene 3/4 verde en el semáforo GANK",
    success: "Kill/flash forzado + plates + crash de ola",
    fail: "Pierdes 3 camps y oro — solo vale si el gankeo genera más valor"
  },
  {
    name: "Invade",
    badge: "purple",
    when: "Sabes dónde está y le ganas el 1v1 confirmado",
    success: "Buff robado + pathing destruido = 5 min de ventaja",
    fail: "Mueres — alto riesgo, solo con información confirmada"
  },
  {
    name: "Vertical",
    badge: "success",
    when: "Ambos junglers evitan el mismo lado",
    success: "Farmeo seguro + 1 camp extra + visión de su jungla",
    fail: "Pierdes control de un lado del mapa"
  },
]

const badgeColors: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  purple: "bg-purple/15 text-purple border-purple/25",
  success: "bg-success/15 text-success border-success/25",
}

export function ChapterPathing({ onPrev, onNext }: ChapterPathingProps) {
  return (
    <div>
      <ChapterHeader
        chapter={4}
        group="Sistemas"
        title={<>Los 4<br /><em className="text-primary font-serif italic">Pathings</em></>}
        tags={["No cuáles son", "Sino cuándo elegir cada uno"]}
      />

      <p className="mb-6 leading-relaxed">
        No es {'"'}¿cuál pathing es el mejor?{'"'} — todos son correctos en la situación adecuada. La pregunta es cuándo elegir cada uno.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Pathing</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Cuándo usarlo</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Si funciona</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Si falla</th>
            </tr>
          </thead>
          <tbody>
            {pathings.map((p) => (
              <tr key={p.name} className="border-b border-border hover:bg-foreground/[0.02] transition-colors">
                <td className="py-2.5 px-3">
                  <Badge variant="outline" className={badgeColors[p.badge]}>{p.name}</Badge>
                </td>
                <td className="py-2.5 px-3 text-foreground">{p.when}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{p.success}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{p.fail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HighlightBox className="mt-6">
        {'"'}El que invade usualmente está en elo alto. Cuando te atreves a hacer cosas distintas, obtienes resultados distintos a la media.{'"'}
      </HighlightBox>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        La regla del 3:15
      </h2>
      <p className="leading-relaxed">
        Lo que hagas en los 30 segundos después de terminar tu clear define el 60-70% de tu early game. El jungla que llega a esos 30 segundos con un plan ejecuta. El que no tiene plan reacciona. <strong>La jungla no es reacción — es pensamiento.</strong>
      </p>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Pantalla de Carga" />
    </div>
  )
}
