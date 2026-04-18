import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { FrameworkRow } from "@/components/ui/framework-row"

interface ChapterPathProps {
  onPrev: () => void
  onNext: () => void
}

const pathFramework = [
  {
    letter: "P",
    title: "Pathing Plan — ruta con decisión",
    desc: "Antes de que spawnen los minions ya tienes decidido tu ruta, qué campamentos harás y por qué vas hacia ese lado del mapa. No es válido \"quiero gankear\" — necesitas saber por qué esa línea merece el gank.",
    note: "La pantalla de carga es tu sala de estrategia. Úsala."
  },
  {
    letter: "A",
    title: "Assess Lanes — lee las 3 líneas",
    desc: "En los primeros 10 segundos del juego identificas: quién tiene CC, quién está en matchup perdido, quién va a pushear. Esto define qué líneas son gankeables y cuáles no.",
    note: "Si estás sesgado, probablemente lo leerás mal. Humildad primero."
  },
  {
    letter: "T",
    title: "Track Enemy — traqueo constante",
    desc: "Desde el segundo 0 estás deduciendo dónde está el jungler enemigo. Con el sistema M.I.R.R.O.R. puedes saber su posición el 80% del tiempo sin ningún ward.",
    note: "Un Challenger con 0 wards traquea mejor que un Plata con visión completa."
  },
  {
    letter: "H",
    title: "Hit Optimal Play — jugada de mayor valor",
    desc: "No es la jugada que te pide tu laner. No es la más emocionante. Es la que genera más ventaja neta para tu equipo en los próximos 60 segundos.",
    note: "El gankeo que tu top te spamea puede ser la peor jugada disponible."
  },
]

export function ChapterPath({ onPrev, onNext }: ChapterPathProps) {
  return (
    <div>
      <ChapterHeader
        chapter={2}
        group="Fundamentos"
        title={<>Framework<br /><em className="text-primary font-serif italic">P.A.T.H.</em></>}
        tags={["Receta exacta", "Pre-partida", "Anti sesgo cognitivo"]}
      />

      <p className="mb-6 leading-relaxed">
        Una receta de 4 letras que define cómo piensa un Challenger antes de que empiece la partida. No es sugerencia — es el proceso completo de pensamiento de un jungla de alto elo.
      </p>

      <div className="flex flex-col gap-2">
        {pathFramework.map((item) => (
          <FrameworkRow
            key={item.letter}
            letter={item.letter}
            title={item.title}
            description={item.desc}
            note={item.note}
          />
        ))}
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Pirámide del Jungla" />
    </div>
  )
}
