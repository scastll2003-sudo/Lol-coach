import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { FrameworkRow } from "@/components/ui/framework-row"

interface ChapterMirrorProps {
  onPrev: () => void
  onNext: () => void
}

const mirrorFramework = [
  { letter: "M", title: "Mirror Start — deducción del starting side", desc: "Si el bot lane enemigo llegó tarde a su línea → hicieron leash → el jungler empezó botside (95% certeza). Por lo tanto, tú arrancas topside con el lado contrario libre." },
  { letter: "I", title: "Intel — cada dato cuenta", desc: "Un pin de tu laner, una W vista en river, cualquier señal cuenta. Tus laners vieron algo → úsalo para actualizar la posición estimada del enemigo." },
  { letter: "R", title: "Respawn Deduction — calcula cuándo hizo el camp", desc: "Si pasas por un campamento enemigo vacío, calcula cuándo lo mató. Ahora sabes su ruta pasada y puedes predecir sus futuros movimientos." },
  { letter: "R", title: "Relative Position — el lado opuesto está seguro", desc: "Si gankeó top al 3:20 → tu botside está seguro por 30-45 segundos. Actúa. No necesitas visión — necesitas lógica." },
  { letter: "O", title: "Objective Gravity — los objetivos atraen junglers", desc: "Dragon spawna en 40 segundos → el jungler enemigo probablemente va botside. La gravedad de los objetivos predice el movimiento del enemigo." },
  { letter: "R", title: "Reset Patterns — se fue a base, predice el nuevo clear", desc: "El enemigo hizo back → empieza nuevo clear desde la base. Puedes predecir sus primeros campamentos basándote en su side de inicio habitual." },
]

const lanerBehaviors = [
  { behavior: "Juega agresivo de repente sin haber ganado trade", meaning: "Su jungler está cerca", action: "Retrocede de golpe sin recibir daño" },
  { behavior: "Deja de farmear y camina hacia river sin razón", meaning: "Va a asistir a su jungler", action: "Avisa y prepara countergank" },
  { behavior: "Push agresivo inusual en su matchup", meaning: "Va a divear contigo o ya viene su jungla", action: "Roam coordinado inminente — ping y retrocede" },
  { behavior: "Flashea agresivamente sin pelea previa", meaning: "Tiene la certeza de que su jungler está ahí", action: "Counter-gank inmediato si puedes" },
]

export function ChapterMirror({ onPrev, onNext }: ChapterMirrorProps) {
  return (
    <div>
      <ChapterHeader
        chapter={6}
        group="Sistemas"
        title={<>Sistema<br /><em className="text-primary font-serif italic">M.I.R.R.O.R.</em></>}
        tags={["Tracko sin wards", "80% de precisión", "Deducción lógica pura"]}
      />

      <AlertCard variant="destructive" className="mb-6">
        <strong>Creencia falsa:</strong> {'"'}Necesito wards para saber dónde está el enemigo.{'"'} Un jungla Challenger con 0 wards traquea mejor que uno de Plata con visión completa del mapa. La diferencia es el <strong>sistema de deducción</strong>.
      </AlertCard>

      <div className="flex flex-col gap-2">
        {mirrorFramework.map((item, i) => (
          <FrameworkRow
            key={i}
            letter={item.letter}
            title={item.title}
            description={item.desc}
            color="text-success"
          />
        ))}
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Cómo tus laners delatan al jungler enemigo
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border">
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Comportamiento del laner</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Qué significa</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-left py-2 px-3">Tu acción</th>
            </tr>
          </thead>
          <tbody>
            {lanerBehaviors.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-foreground/[0.02]">
                <td className="py-2.5 px-3 text-foreground">{row.behavior}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{row.meaning}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Framework G.A.N.K." />
    </div>
  )
}
