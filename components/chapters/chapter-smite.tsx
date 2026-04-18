import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { HighlightBox } from "@/components/ui/highlight-box"

interface ChapterSmiteProps {
  onPrev: () => void
  onNext: () => void
}

const smiteDamage = [
  { level: "1-5", damage: "600", note: "Early dragons" },
  { level: "6-10", damage: "900", note: "Rift Herald" },
  { level: "11-15", damage: "1200", note: "Mid game dragons" },
  { level: "16-18", damage: "1500", note: "Baron, Elder" },
]

export function ChapterSmite({ onPrev, onNext }: ChapterSmiteProps) {
  return (
    <div>
      <ChapterHeader
        chapter={8}
        group="Sistemas"
        title={<>Sistema<br /><em className="text-primary font-serif italic">SMITE</em></>}
        tags={["Timing exacto", "Combo por campeón", "50/50 eliminado"]}
      />

      <p className="mb-6 leading-relaxed">
        El smite no es un 50/50 si lo ejecutas correctamente. Es un cálculo preciso de daño + timing que elimina la suerte de la ecuación.
      </p>

      <h2 className="font-serif text-[22px] text-foreground mt-6 mb-3.5 tracking-tight">
        Daño de Smite por nivel
      </h2>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {smiteDamage.map((s) => (
          <div key={s.level} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="font-mono text-xs text-muted-foreground mb-1">Nivel {s.level}</div>
            <div className="text-xl font-bold text-primary">{s.damage}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{s.note}</div>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Combos de Smite por campeón
      </h2>

      <div className="space-y-3">
        <AlertCard variant="accent">
          <strong className="text-primary">Sylas</strong>: E2 + Smite (el pull + smite es casi instantáneo). Si tienes ult de ejecución robada (Cho, Urgot), úsala como seguro.
        </AlertCard>

        <AlertCard variant="accent">
          <strong className="text-primary">Viego</strong>: Q (rápido) + Smite. Si el objetivo está bajo, R + Smite para el burst combo. La R tiene daño de ejecución.
        </AlertCard>

        <AlertCard variant="accent">
          <strong className="text-primary">Diana</strong>: Q + E + Smite mientras caes. El burst de Diana + Smite es difícil de contestar si lo ejecutas en el aire.
        </AlertCard>
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        La regla del +100
      </h2>

      <p className="mb-4 leading-relaxed">
        Siempre apunta al objetivo cuando está a <strong>Smite + 100-200 HP extra</strong>. Esto te da margen para el delay de red y evita que te roben con un auto extra del enemigo.
      </p>

      <HighlightBox>
        {'"'}El jungla que pierde 50/50s consistentemente no tiene mala suerte — tiene mal timing. El Smite es mecánica pura: daño conocido + HP visible = ejecución exacta.{'"'}
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: KPIs por Elo" />
    </div>
  )
}
