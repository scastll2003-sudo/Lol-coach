"use client"

import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { AlertTriangle, CheckCircle, XCircle, Zap, Shield, Target, TrendingUp, Clock } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterCounterJungleProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

const invadeChecklist = [
  { check: "Sabes dónde está el jungla enemigo", icon: Target, critical: true },
  { check: "Tu laner adyacente tiene prio", icon: Shield, critical: true },
  { check: "El jungla enemigo no tiene smite disponible", icon: Zap, critical: false },
  { check: "Tienes más HP/recursos que el enemigo", icon: TrendingUp, critical: false },
  { check: "El camp enemigo está vivo (timeado)", icon: Clock, critical: true },
  { check: "No hay más de 1 enemigo cerca", icon: AlertTriangle, critical: true },
]

const invadeTimings = [
  { 
    timing: "2:15", 
    scenario: "Invade al segundo buff", 
    conditions: "Jungla enemigo empezó en el buff opuesto",
    reward: "Buff + posible kill + timer",
    risk: "Alto si no hay prio en lanes"
  },
  { 
    timing: "3:15", 
    scenario: "Invade después de tu full clear", 
    conditions: "El enemigo tiene clear lento (Zac, Eve, Amumu)",
    reward: "Gromp/Krugs + vision profunda",
    risk: "Medio — tienes lvl 4 vs su lvl 3"
  },
  { 
    timing: "5:00", 
    scenario: "Invade durante drake spawn", 
    conditions: "El enemigo está forzado a ir a drake",
    reward: "Camp completo en lado opuesto",
    risk: "Bajo si el drake está en spawn"
  },
  { 
    timing: "Post-gank", 
    scenario: "Invade después de gank exitoso", 
    conditions: "Acabas de matar o flashear a un laner",
    reward: "Camp + posible segundo kill",
    risk: "Bajo — el enemigo no puede responder"
  },
]

const easyTargets = [
  { name: "Karthus", reason: "0 escapes, siempre farmea, low HP en clear", tip: "Invade lvl 3 con cualquier campeón" },
  { name: "Evelynn", reason: "Débil pre-6, sin CC, clear lento", tip: "Invade constantemente antes de 6" },
  { name: "Shyvana", reason: "Sin CC, predecible, necesita farm", tip: "Contesta sus drakes, invade su opuesto" },
  { name: "Fiddlesticks", reason: "Sin escapes, necesita W para sustain", tip: "Interrumpe su W con CC, fácil kill" },
  { name: "Ivern", reason: "Sin damage, no puede 1v1 a nadie", tip: "Toma todos sus camps, gratis" },
  { name: "Lillia", reason: "Squishy, depende de kite, no puede pelear si cierras", tip: "Flash-E y muere" },
]

const dangerousTargets = [
  { name: "LeeSin", reason: "Ward hop escapes, Q execute, E slow", tip: "Solo invade si gastó Q y W" },
  { name: "Elise", reason: "Rappel es unfollowable, cocoon CC", tip: "Nunca invadas sola" },
  { name: "Nidalee", reason: "Pounce escapes, healing, poke", tip: "No perseguir — te kiteará" },
  { name: "Graves", reason: "Armor stack, burst, dash", tip: "Solo con ventaja de items" },
  { name: "Khazix", reason: "Leap, isolation damage, R invisibility", tip: "Solo en grupo, nunca aislado" },
  { name: "Rengar", reason: "Bush leap, ferocity burst", tip: "Evita bushes, no facecheck" },
]

const verticalJungling = [
  { step: 1, action: "Identifica el lado fuerte de tu equipo", detail: "¿Qué lane tiene prioridad natural?" },
  { step: 2, action: "Empieza tu clear en ese lado", detail: "Si top tiene prio, empieza blue side" },
  { step: 3, action: "Full clear tu lado fuerte", detail: "3 camps + scuttle de ese lado" },
  { step: 4, action: "Cruza al lado débil enemigo", detail: "El enemigo estará en su lado fuerte" },
  { step: 5, action: "Toma camps + coloca vision", detail: "Su lado débil está desprotegido" },
  { step: 6, action: "Repite el patrón", detail: "Mantén control de un cuadrante" },
]

export function ChapterCounterJungle({ onPrev, onNext }: ChapterCounterJungleProps) {
  return (
    <div>
      <ChapterHeader
        chapter={17}
        group="Herramientas"
        title={<>Counter<em className="text-primary font-serif italic">Jungling</em></>}
        tags={["Invades", "Vertical jungling", "Enemy tracking"]}
      />

      {/* Invade Checklist */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Checklist antes de invadir
      </h2>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          {invadeChecklist.map((item, i) => (
            <div 
              key={i}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-lg border",
                item.critical 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-secondary/50 border-border"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 flex-shrink-0",
                item.critical ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs text-foreground">{item.check}</span>
              {item.critical && (
                <Badge className="bg-primary/15 text-primary text-[9px] ml-auto">Crítico</Badge>
              )}
            </div>
          ))}
        </div>
        <HighlightBox className="mt-4">
          <strong>Regla:</strong> Si no puedes marcar al menos 3 checks (incluyendo los críticos), 
          NO invadas. Es mejor farmear tu jungla que morir invadiendo.
        </HighlightBox>
      </div>

      {/* Timing Windows */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Ventanas de Invade
      </h2>
      <div className="space-y-2 mb-6">
        {invadeTimings.map((inv, i) => (
          <div key={i} className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-8 rounded bg-primary/15 flex items-center justify-center">
                  <span className="font-mono text-sm text-primary font-bold">{inv.timing}</span>
                </div>
                <span className="font-semibold text-sm text-foreground">{inv.scenario}</span>
              </div>
              <Badge variant="outline" className={cn(
                "text-[10px]",
                inv.risk === "Alto" ? "border-destructive/50 text-destructive" :
                inv.risk === "Medio" ? "border-warning/50 text-warning" :
                "border-success/50 text-success"
              )}>
                Riesgo: {inv.risk}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs ml-[68px]">
              <div>
                <span className="text-muted-foreground">Condición: </span>
                <span className="text-foreground">{inv.conditions}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Reward: </span>
                <span className="text-success">{inv.reward}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Easy vs Dangerous Targets */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-serif text-[18px] text-foreground mb-3 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Targets Fáciles
          </h2>
          <div className="space-y-1.5">
            {easyTargets.map((t) => (
              <div key={t.name} className="p-2.5 rounded-lg bg-success/5 border border-success/15">
                <div className="flex items-center gap-2 mb-1">
                  <Image src={`${DDR}/${t.name}.png`} alt={t.name} width={22} height={22} className="rounded" />
                  <span className="text-sm font-medium text-success/90">{t.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground ml-[30px]">{t.reason}</div>
                <div className="text-[10px] text-primary/80 ml-[30px] mt-0.5">Tip: {t.tip}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-[18px] text-foreground mb-3 tracking-tight flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" />
            Targets Peligrosos
          </h2>
          <div className="space-y-1.5">
            {dangerousTargets.map((t) => (
              <div key={t.name} className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                <div className="flex items-center gap-2 mb-1">
                  <Image src={`${DDR}/${t.name}.png`} alt={t.name} width={22} height={22} className="rounded" />
                  <span className="text-sm font-medium text-destructive/90">{t.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground ml-[30px]">{t.reason}</div>
                <div className="text-[10px] text-warning/80 ml-[30px] mt-0.5">Tip: {t.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Jungling */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Vertical Jungling — El Patrón Pro
      </h2>
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="space-y-3">
          {verticalJungling.map((step) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{step.step}</span>
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">{step.action}</div>
                <div className="text-xs text-muted-foreground">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <HighlightBox>
        El vertical jungling te permite controlar la mitad del mapa mientras evitas al jungla enemigo.
        Es la estrategia más segura cuando estás detrás o contra un jungla agresivo.
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Team Comp Analyzer" />
    </div>
  )
}
