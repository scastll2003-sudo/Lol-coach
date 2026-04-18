"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Target, Clock, MapPin, AlertTriangle, Shield, Swords } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterWardingProps {
  onPrev: () => void
  onNext: () => void
}

const wardSpots = {
  early: [
    { name: "River Pixel Bush", side: "Both", priority: "Critical", reason: "Trackea al jungla enemigo early", timing: "2:30-6:00" },
    { name: "Enemy Raptors", side: "Both", priority: "High", reason: "Ve si el enemigo hace full clear", timing: "2:15" },
    { name: "Tri-bush Top/Bot", side: "Both", priority: "High", reason: "Protege ganks de tu laners", timing: "3:00+" },
    { name: "Blue/Red Entrance", side: "Enemy", priority: "Medium", reason: "Track de buff timers", timing: "2:45" },
  ],
  mid: [
    { name: "Baron Pit", side: "Both", priority: "Critical", reason: "Control de baron pre-spawn", timing: "18:00+" },
    { name: "Dragon Pit", side: "Both", priority: "Critical", reason: "Control de drake/soul", timing: "Pre-drake" },
    { name: "Enemy Blue/Red Bush", side: "Enemy", priority: "High", reason: "Catch al jungla farming", timing: "Always" },
    { name: "Mid Lane Bushes", side: "Both", priority: "Medium", reason: "Roam tracking", timing: "6:00+" },
  ],
  late: [
    { name: "Baron/Elder", side: "Both", priority: "Critical", reason: "50/50 prevention", timing: "Always" },
    { name: "Enemy Jungle Entrances", side: "Enemy", priority: "High", reason: "Pick potential", timing: "Siege" },
    { name: "Choke Points", side: "Both", priority: "High", reason: "Teamfight setup", timing: "Grouped" },
    { name: "Flanking Routes", side: "Both", priority: "Medium", reason: "Anti-assassin", timing: "TF prep" },
  ],
}

const wardingMistakes = [
  { mistake: "Wardear solo y morir", fix: "Siempre pide backup o usa sweeper primero", icon: AlertTriangle },
  { mistake: "No comprar Control Wards", fix: "Mínimo 2 pinks por back — es la mejor inversión", icon: Eye },
  { mistake: "Wardear zonas muertas", fix: "Ward donde el enemigo VA a estar, no donde está", icon: Target },
  { mistake: "Olvidar sweeper después de 9", fix: "Cambia a Oracle Lens a los 9-10 min", icon: EyeOff },
  { mistake: "Ward sin propósito", fix: "Cada ward debe responder: ¿Qué información me da?", icon: MapPin },
]

const visionScore = [
  { range: "0.5-0.7", rating: "Malo", color: "destructive", tip: "Compra más pinks, usa trinket en cooldown" },
  { range: "0.8-1.0", rating: "Promedio", color: "warning", tip: "Buen inicio, pero puedes mejorar timing" },
  { range: "1.0-1.2", rating: "Bueno", color: "success", tip: "Buen vision control para tu elo" },
  { range: "1.3+", rating: "Excelente", color: "primary", tip: "Vision de nivel pro — mantén este nivel" },
]

const pinkWardPriority = [
  { location: "Drake Pit / Baron Pit", priority: 1, reason: "Objetivo activo = pink obligatorio" },
  { location: "Tu buff cuando el enemigo invade", priority: 2, reason: "Protege tu farm cuando estás atrás" },
  { location: "Pixel bush cuando gankeas", priority: 3, reason: "Reveal de wards enemigos pre-gank" },
  { location: "Enemy jungle deep", priority: 4, reason: "Tracking cuando estás adelante" },
]

export function ChapterWarding({ onPrev, onNext }: ChapterWardingProps) {
  const [phase, setPhase] = useState<"early" | "mid" | "late">("early")

  return (
    <div>
      <ChapterHeader
        chapter={16}
        group="Herramientas"
        title={<>Warding <em className="text-primary font-serif italic">Guide</em></>}
        tags={["Vision control", "Pink wards", "Sweeper timing"]}
      />

      {/* Vision Score Reference */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          Vision Score por Minuto — ¿Dónde estás?
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {visionScore.map((vs) => (
            <div 
              key={vs.range}
              className={cn(
                "p-3 rounded-lg border text-center",
                `bg-${vs.color}/5 border-${vs.color}/20`
              )}
            >
              <div className={cn("text-lg font-bold", `text-${vs.color}`)}>{vs.range}</div>
              <div className="text-xs font-medium text-foreground">{vs.rating}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{vs.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Spots by Phase */}
      <Tabs value={phase} onValueChange={(v) => setPhase(v as typeof phase)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="early" className="text-xs gap-1">
            <Clock className="w-3 h-3" />
            Early (0-14 min)
          </TabsTrigger>
          <TabsTrigger value="mid" className="text-xs gap-1">
            <Shield className="w-3 h-3" />
            Mid (14-25 min)
          </TabsTrigger>
          <TabsTrigger value="late" className="text-xs gap-1">
            <Swords className="w-3 h-3" />
            Late (25+ min)
          </TabsTrigger>
        </TabsList>

        {(["early", "mid", "late"] as const).map((p) => (
          <TabsContent key={p} value={p}>
            <div className="space-y-2">
              {wardSpots[p].map((spot, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    spot.priority === "Critical" ? "bg-primary/5 border-primary/20" :
                    spot.priority === "High" ? "bg-warning/5 border-warning/20" :
                    "bg-card border-border"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    spot.priority === "Critical" ? "bg-primary/15" :
                    spot.priority === "High" ? "bg-warning/15" :
                    "bg-secondary"
                  )}>
                    <MapPin className={cn(
                      "w-5 h-5",
                      spot.priority === "Critical" ? "text-primary" :
                      spot.priority === "High" ? "text-warning" :
                      "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-foreground">{spot.name}</span>
                      <Badge variant="outline" className="text-[10px]">{spot.side}</Badge>
                      <Badge 
                        className={cn(
                          "text-[10px]",
                          spot.priority === "Critical" ? "bg-primary/15 text-primary" :
                          spot.priority === "High" ? "bg-warning/15 text-warning" :
                          "bg-secondary text-muted-foreground"
                        )}
                      >
                        {spot.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{spot.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-primary">{spot.timing}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Pink Ward Priority */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Prioridad de Control Wards
      </h2>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="space-y-2">
          {pinkWardPriority.map((pw) => (
            <div key={pw.priority} className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                pw.priority === 1 ? "bg-primary/15 text-primary" :
                pw.priority === 2 ? "bg-warning/15 text-warning" :
                pw.priority === 3 ? "bg-success/15 text-success" :
                "bg-secondary text-muted-foreground"
              )}>
                #{pw.priority}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">{pw.location}</div>
                <div className="text-xs text-muted-foreground">{pw.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Errores Comunes de Vision
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {wardingMistakes.map((wm, i) => (
          <div key={i} className="p-3 rounded-lg bg-destructive/5 border border-destructive/15">
            <div className="flex items-center gap-2 mb-2">
              <wm.icon className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{wm.mistake}</span>
            </div>
            <p className="text-xs text-success ml-6">Fix: {wm.fix}</p>
          </div>
        ))}
      </div>

      <HighlightBox>
        <strong>Regla de oro:</strong> Un Control Ward en el objetivo activo vale más que 10 wards 
        aleatorios. Antes de cada drake/baron, pregúntate: ¿Tengo pink en el pit?
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Counter-Jungling" />
    </div>
  )
}
