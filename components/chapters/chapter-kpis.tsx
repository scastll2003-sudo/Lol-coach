import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { AlertCard } from "@/components/ui/alert-card"
import { TrendingUp, TrendingDown, Target, Eye, Swords, Clock } from "lucide-react"

interface ChapterKPIsProps {
  onPrev: () => void
  onNext: () => void
}

const kpisByElo = [
  {
    elo: "Plata",
    color: "bg-muted-foreground/20 text-muted-foreground",
    kpis: [
      { name: "CS/min", target: "≥5.0", icon: TrendingUp, critical: true },
      { name: "Muertes/partida", target: "≤6", icon: TrendingDown, critical: true },
      { name: "First Clear", target: "≤3:20", icon: Clock, critical: false },
      { name: "Kill Part.", target: "≥45%", icon: Swords, critical: false },
    ]
  },
  {
    elo: "Oro",
    color: "bg-warning/20 text-warning",
    kpis: [
      { name: "CS/min", target: "≥5.5", icon: TrendingUp, critical: true },
      { name: "Muertes/partida", target: "≤5", icon: TrendingDown, critical: true },
      { name: "Vision Score/min", target: "≥0.7", icon: Eye, critical: false },
      { name: "Kill Part.", target: "≥50%", icon: Swords, critical: false },
    ]
  },
  {
    elo: "Platino",
    color: "bg-info/20 text-info",
    kpis: [
      { name: "CS/min", target: "≥6.0", icon: TrendingUp, critical: true },
      { name: "Muertes/partida", target: "≤4", icon: TrendingDown, critical: true },
      { name: "Vision Score/min", target: "≥0.8", icon: Eye, critical: true },
      { name: "Objective Control", target: "≥60%", icon: Target, critical: false },
    ]
  },
  {
    elo: "Diamante+",
    color: "bg-purple/20 text-purple",
    kpis: [
      { name: "CS/min", target: "≥6.5", icon: TrendingUp, critical: true },
      { name: "Muertes/partida", target: "≤3", icon: TrendingDown, critical: true },
      { name: "Vision Score/min", target: "≥1.0", icon: Eye, critical: true },
      { name: "First Blood %", target: "≥30%", icon: Swords, critical: false },
    ]
  },
]

const proprietaryKPIs = [
  {
    name: "DQS — Decision Quality Score",
    formula: "% de decisiones correctas por partida",
    target: "≥65%",
    how: "Después de cada partida, revisa 5 momentos clave. ¿Hiciste la jugada óptima? Anota el %.",
    example: "Partida de 25 min → 5 decisiones revisadas → 3 correctas → DQS = 60%"
  },
  {
    name: "PPM — Purposeful Pathing Minutes",
    formula: "Minutos con pathing intencional / tiempo total de jungla",
    target: "≥80%",
    how: "Cada vez que caminas sin plan, pierdes PPM. Cuenta los minutos que caminaste con propósito claro.",
    example: "10 min de early → 8 min con plan claro → PPM = 80%"
  },
  {
    name: "TER — Tracking Error Rate",
    formula: "Veces que te sorprendió el jungler enemigo / apariciones totales",
    target: "≤20%",
    how: "Cada vez que el enemigo aparece y no lo esperabas, es un tracking error.",
    example: "El enemigo apareció 10 veces → 2 veces te sorprendió → TER = 20%"
  },
]

export function ChapterKPIs({ onPrev, onNext }: ChapterKPIsProps) {
  return (
    <div>
      <ChapterHeader
        chapter={9}
        group="KPIs y Métricas"
        title={<>KPIs por <em className="text-primary font-serif italic">Elo</em></>}
        tags={["Métricas que importan", "Targets por rango", "Tu nivel: Plata"]}
      />

      <p className="mb-6 leading-relaxed">
        Cada elo tiene KPIs distintos que importan. Lo que te sube de Plata a Oro no es lo mismo que de Diamante a Master. Aquí están los números exactos.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {kpisByElo.map((tier) => (
          <div key={tier.elo} className="bg-card border border-border rounded-lg p-4">
            <Badge className={tier.color}>{tier.elo}</Badge>
            <div className="mt-3 space-y-2">
              {tier.kpis.map((kpi) => (
                <div key={kpi.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <kpi.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className={kpi.critical ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {kpi.name}
                    </span>
                  </div>
                  <span className={kpi.critical ? "text-primary font-mono text-xs" : "text-muted-foreground font-mono text-xs"}>
                    {kpi.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        KPIs Propietarios — Lo que nadie mide
      </h2>

      <p className="mb-4 leading-relaxed">
        Estos KPIs no aparecen en op.gg ni en ningún tracker. Son los que realmente predicen tu mejora como jungla:
      </p>

      <div className="space-y-3">
        {proprietaryKPIs.map((kpi) => (
          <div key={kpi.name} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary">{kpi.name}</h3>
              <Badge variant="outline" className="text-success border-success/25">Target: {kpi.target}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{kpi.formula}</p>
            <p className="text-sm text-foreground mb-2">{kpi.how}</p>
            <p className="text-xs text-muted-foreground italic">{kpi.example}</p>
          </div>
        ))}
      </div>

      <AlertCard variant="accent" className="mt-6">
        <strong>Tu enfoque actual:</strong> En Plata 2, prioriza CS/min ≥5.0 y Muertes ≤6. Estos dos KPIs solos pueden subirte a Oro si los cumples consistentemente.
      </AlertCard>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Objetivos de Elo" />
    </div>
  )
}
