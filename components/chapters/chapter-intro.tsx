import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { HighlightBox } from "@/components/ui/highlight-box"

interface ChapterIntroProps {
  onNext: () => void
}

export function ChapterIntro({ onNext }: ChapterIntroProps) {
  return (
    <div>
      <ChapterHeader
        chapter={1}
        group="Fundamentos"
        title={<>El <em className="text-primary font-serif italic">Director</em><br />Invisible</>}
        tags={["Creencia falsa destruida", "Marco mental challenger", "Por qué el jungla gana partidas"]}
      />

      <AlertCard variant="destructive">
        <strong>Creencia falsa que hay que destruir:</strong> {'"'}El jungla es el que gankea.{'"'} Si le preguntas a alguien de Plata qué hace el jungla, te dice <span className="text-destructive">gankear y hacer objetivos</span>. Si le preguntas a un Challenger, te dice <span className="text-primary">controlar el flujo del juego</span>. Esa diferencia de respuesta es exactamente por qué uno está en Challenger y el otro no.
      </AlertCard>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        La definición real del rol
      </h2>
      <p className="mb-3.5 leading-relaxed">
        Mientras un toplaner reacciona al campeón que tiene enfrente, tú como jungla tomas decisiones que afectan a <strong>tres líneas simultáneamente</strong>. No reaccionas — decides. En los próximos 60 segundos tú decides quién gana su línea, qué objetivo cae, qué lado del mapa se abre.
      </p>

      <HighlightBox>
        {'"'}Un jungla que va 0/0/0 en minuto 10 puede estar ganando el juego para su equipo.{'"'}
      </HighlightBox>

      <p className="mb-3.5 leading-relaxed">
        Tomó los dos primeros dragones. Su pathing forzó al jungler enemigo a ir siempre por behind. Sus laners nunca fueron gankeados porque les avisó. Cero kills, victoria total en el tablero. <strong>Las kills son el resultado, no la causa.</strong>
      </p>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Los cuatro sistemas de aprendizaje
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Framework", desc: "una receta exacta de cómo pensar ante cada situación" },
          { title: "SOP", desc: "procedimiento paso a paso, ejecutable sin pensar" },
          { title: "KPI", desc: "número exacto que indica si vas por el camino correcto" },
          { title: "Ejemplo con dato", desc: "comprobación cuantitativa de cada afirmación" },
        ].map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-lg p-4">
            <strong>{item.title}</strong> — {item.desc}
          </div>
        ))}
      </div>

      <HighlightBox className="mt-6">
        {'"'}Un jungla de elo bajo camina 45 segundos entre campamentos sin propósito. En 10 minutos = 3-4 minutos de tiempo muerto = 600g de ventaja para el enemigo + 1-2 niveles + 2-3 gankeos que nunca tuviste. No te ganó en peleas — te ganó caminando con propósito mientras tú caminabas sin él.{'"'}
      </HighlightBox>

      <NavButtons onNext={onNext} />
    </div>
  )
}
