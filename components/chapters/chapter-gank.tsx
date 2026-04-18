import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { HighlightBox } from "@/components/ui/highlight-box"
import { FrameworkRow } from "@/components/ui/framework-row"

interface ChapterGankProps {
  onPrev: () => void
  onNext: () => void
}

const gankFramework = [
  { letter: "G", title: "Gap closer — ¿puedes llegar al enemigo?", desc: "¿Tienes dash, CC, slow, flash? Si el enemigo tiene escape y tú no tienes gap closer, el gank falla. No gankees sin respuesta a: \"¿cómo llego a él?\"" },
  { letter: "A", title: "Allied CC — ¿tu laner tiene CC?", desc: "Si tu laner no tiene CC, necesitas más condiciones verdes para compensar. Sylas sin ult necesita CC aliado. Viego necesita W cargado + laner con CC." },
  { letter: "N", title: "No enemies nearby — ¿es 2v1 confirmado?", desc: "¿Dónde está el jungler enemigo? ¿El mid puede rotar? Si no es 2v1 confirmado, baja un nivel la evaluación del gank." },
  { letter: "K", title: "Kill potential — ¿hay daño suficiente?", desc: "¿El enemigo está bajo de vida? ¿No tiene flash? ¿Tu laner tiene daño? Si el enemigo está full HP con flash, necesitas todo verde para compensar." },
]

export function ChapterGank({ onPrev, onNext }: ChapterGankProps) {
  return (
    <div>
      <ChapterHeader
        chapter={7}
        group="Sistemas"
        title={<>Framework<br /><em className="text-primary font-serif italic">G.A.N.K.</em></>}
        tags={["Semáforo de 4 luces", "Calibrado por campeón", "Elimina gankeos perdidos"]}
      />

      <p className="mb-6 leading-relaxed">
        Antes de cada gankeo, evalúas 4 factores. Si 3-4 están en verde, ejecutas. Si 2 están en verde, es riesgoso. Si menos de 2, <strong>no gankees</strong>.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {gankFramework.map((item) => (
          <FrameworkRow
            key={item.letter}
            letter={item.letter}
            title={item.title}
            description={item.desc}
          />
        ))}
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Semáforo visual
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-success/10 border border-success/25 rounded-lg p-4 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-success shadow-[0_0_8px] shadow-success/50" />
            ))}
          </div>
          <div className="text-success font-semibold text-sm">4/4 Verde</div>
          <div className="text-xs text-muted-foreground mt-1">Kill altamente probable. Ejecuta sin dudar.</div>
        </div>

        <div className="bg-warning/10 border border-warning/25 rounded-lg p-4 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-success shadow-[0_0_8px] shadow-success/50" />
            ))}
            <div className="w-5 h-5 rounded-full bg-secondary border border-border" />
          </div>
          <div className="text-warning font-semibold text-sm">3/4 Verde</div>
          <div className="text-xs text-muted-foreground mt-1">Flash forzado probable. Vale la pena.</div>
        </div>

        <div className="bg-destructive/10 border border-destructive/25 rounded-lg p-4 text-center">
          <div className="flex justify-center gap-2 mb-2">
            {[1,2].map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-success shadow-[0_0_8px] shadow-success/50" />
            ))}
            {[1,2].map(i => (
              <div key={`off-${i}`} className="w-5 h-5 rounded-full bg-destructive shadow-[0_0_8px] shadow-destructive/50" />
            ))}
          </div>
          <div className="text-destructive font-semibold text-sm">≤2/4 Verde</div>
          <div className="text-xs text-muted-foreground mt-1">No gankees. Farmea o busca otra línea.</div>
        </div>
      </div>

      <HighlightBox>
        {'"'}El gankeo que no ejecutas porque no cumplía los requisitos no es un gankeo perdido — es un gankeo fallido que evitaste. Los LP se ganan más por lo que no haces mal que por lo que haces bien.{'"'}
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Sistema SMITE" />
    </div>
  )
}
