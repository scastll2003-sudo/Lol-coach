"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Calendar, TrendingUp, ChevronRight, Star, Flame, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterEloGoalsProps {
  onPrev: () => void
  onNext: () => void
}

const eloRanks = [
  { name: "Iron", lp: 0, color: "bg-muted-foreground" },
  { name: "Bronze", lp: 400, color: "bg-[#8B4513]" },
  { name: "Silver", lp: 800, color: "bg-muted-foreground" },
  { name: "Gold", lp: 1200, color: "bg-warning" },
  { name: "Platinum", lp: 1600, color: "bg-info" },
  { name: "Emerald", lp: 2000, color: "bg-success" },
  { name: "Diamond", lp: 2400, color: "bg-info" },
  { name: "Master", lp: 2800, color: "bg-purple" },
  { name: "Grandmaster", lp: 3200, color: "bg-destructive" },
  { name: "Challenger", lp: 3600, color: "bg-primary" },
]

const weeklyMilestones = [
  { week: 1, goal: "Silver 1", focus: "Clear speed + zero invades", games: 30 },
  { week: 2, goal: "Gold 4", focus: "Framework P.A.T.H. en cada partida", games: 35 },
  { week: 3, goal: "Gold 2", focus: "Sistema M.I.R.R.O.R. activo", games: 35 },
  { week: 4, goal: "Gold 1", focus: "Framework G.A.N.K. calibrado", games: 40 },
  { week: 5, goal: "Platinum 4", focus: "DQS ≥65% consistente", games: 40 },
  { week: 6, goal: "Platinum 2", focus: "Objective control prioritario", games: 45 },
]

const dailyTasks = [
  { task: "VOD review de 1 partida (15 min)", icon: Target },
  { task: "Warm-up: 1 partida en practice tool", icon: Flame },
  { task: "3-5 partidas ranked con foco en 1 KPI", icon: Zap },
  { task: "Logging de KPIs post-sesión", icon: TrendingUp },
]

export function ChapterEloGoals({ onPrev, onNext }: ChapterEloGoalsProps) {
  const [currentLp] = useState(875) // Silver 2 ~75 LP
  const [targetLp] = useState(1600) // Platinum 4
  const progress = (currentLp / targetLp) * 100

  return (
    <div>
      <ChapterHeader
        chapter={10}
        group="KPIs y Métricas"
        title={<>Objetivos de <em className="text-primary font-serif italic">Elo</em></>}
        tags={["Plan de 6 semanas", "Milestones semanales", "De Plata a Platino"]}
      />

      {/* Current Progress Card */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Tu progreso actual</div>
            <div className="flex items-center gap-3">
              <Badge className="bg-muted-foreground/20 text-muted-foreground">Silver 2</Badge>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Badge className="bg-info/20 text-info">Platinum 4</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground">{currentLp} / {targetLp} LP equiv.</div>
          </div>
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2">
            {eloRanks.slice(2, 6).map((rank) => (
              <div key={rank.name} className="flex flex-col items-center">
                <div className={cn("w-2 h-2 rounded-full", rank.color)} />
                <span className="text-[10px] text-muted-foreground mt-1">{rank.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Milestones */}
      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Plan de 6 Semanas
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {weeklyMilestones.map((m, idx) => (
          <div 
            key={m.week} 
            className={cn(
              "bg-card border rounded-lg p-4 transition-all",
              idx === 0 ? "border-primary/50 bg-primary/5" : "border-border"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={idx === 0 ? "border-primary text-primary" : ""}>
                Semana {m.week}
              </Badge>
              <span className="text-xs text-muted-foreground">{m.games} partidas</span>
            </div>
            <div className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-warning" />
              {m.goal}
            </div>
            <p className="text-xs text-muted-foreground">{m.focus}</p>
          </div>
        ))}
      </div>

      {/* Daily Tasks */}
      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        Rutina Diaria
      </h2>

      <div className="space-y-2 mb-6">
        {dailyTasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <task.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{task.task}</span>
          </div>
        ))}
      </div>

      {/* LP Calculation */}
      <AlertCard variant="accent">
        <strong className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4" />
          Matemáticas del Climb
        </strong>
        <p className="text-sm mb-2">
          Con 52% WR y 5 partidas/día = <span className="text-primary font-semibold">+10 LP neto/día</span> (promedio)
        </p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">70 LP</div>
            <div className="text-xs text-muted-foreground">por semana</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">280 LP</div>
            <div className="text-xs text-muted-foreground">por mes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">≈2 divisiones</div>
            <div className="text-xs text-muted-foreground">por mes</div>
          </div>
        </div>
      </AlertCard>

      <AlertCard variant="warning" className="mt-3">
        <strong>Regla de oro:</strong> Si tu WR baja de 48% en 20+ partidas, algo está mal en tu proceso. Revisa los capítulos anteriores antes de seguir spammeando.
      </AlertCard>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Anti-Tilt SOP" />
    </div>
  )
}
