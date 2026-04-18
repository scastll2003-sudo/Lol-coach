"use client"

import { useState, useEffect, useCallback } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Zap, Shield, Swords, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterTimersProps {
  onPrev: () => void
  onNext: () => void
}

interface Timer {
  id: string
  name: string
  icon: typeof Clock
  respawn: number
  color: string
  priority: "critical" | "high" | "medium"
  goldValue: string
  tip: string
}

const timers: Timer[] = [
  { id: "baron", name: "Baron Nashor", icon: Crown, respawn: 360, color: "purple", priority: "critical", goldValue: "1500g + buff", tip: "Spawnea a los 20:00. Control de vision 1 min antes." },
  { id: "dragon", name: "Dragón", icon: Zap, respawn: 300, color: "primary", priority: "critical", goldValue: "25-100g + stack", tip: "Primer dragón a 5:00. 4 stacks = alma." },
  { id: "rift", name: "Heraldo", icon: Shield, respawn: 360, color: "warning", goldValue: "100g + charge", priority: "high", tip: "Spawnea a 14:00. Útil para first tower." },
  { id: "blue", name: "Blue Buff", icon: Eye, respawn: 300, color: "info", priority: "medium", goldValue: "90g + mana regen", tip: "Dale a tu midlaner después del primer clear." },
  { id: "red", name: "Red Buff", icon: Swords, respawn: 300, color: "destructive", priority: "medium", goldValue: "90g + slow", tip: "Mantén para ti en early, ADC en late." },
  { id: "gromp", name: "Gromp", icon: Clock, respawn: 135, color: "success", priority: "medium", goldValue: "90g", tip: "Alta XP, prioriza después de buffs." },
  { id: "wolves", name: "Wolves", icon: Clock, respawn: 135, color: "muted-foreground", priority: "medium", goldValue: "95g", tip: "Fácil clear, bueno para pathing." },
  { id: "raptors", name: "Raptors", icon: Clock, respawn: 135, color: "muted-foreground", priority: "medium", goldValue: "85g", tip: "Más gold que wolves, más difícil." },
  { id: "krugs", name: "Krugs", icon: Clock, respawn: 135, color: "muted-foreground", priority: "medium", goldValue: "125g", tip: "Mayor gold, mayor tiempo de clear." },
  { id: "scuttle", name: "Scuttle", icon: Eye, respawn: 150, color: "info", priority: "high", goldValue: "70g + vision", tip: "Contesta solo si tienes prio en lane." },
]

import { Crown } from "lucide-react"

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function ChapterTimers({ onPrev, onNext }: ChapterTimersProps) {
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({})
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [gameTime, setGameTime] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)

  // Game clock
  useEffect(() => {
    if (!gameRunning) return
    const interval = setInterval(() => {
      setGameTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [gameRunning])

  // Timer countdowns
  useEffect(() => {
    if (!gameRunning) return
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 1
            // Sound alert at 30 seconds
            if (updated[key] === 30 && soundEnabled) {
              try {
                const audio = new Audio("/alert.mp3")
                audio.volume = 0.5
                audio.play().catch(() => {})
              } catch {
                // Audio not available
              }
            }
          } else {
            delete updated[key]
          }
        })
        return updated
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameRunning, soundEnabled])

  const startTimer = useCallback((timer: Timer) => {
    setActiveTimers(prev => ({
      ...prev,
      [timer.id]: timer.respawn
    }))
  }, [])

  const resetTimer = useCallback((id: string) => {
    setActiveTimers(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }, [])

  const resetAll = useCallback(() => {
    setActiveTimers({})
    setGameTime(0)
    setGameRunning(false)
  }, [])

  const objectiveTimers = timers.filter(t => t.priority === "critical" || t.priority === "high")
  const campTimers = timers.filter(t => t.priority === "medium")

  return (
    <div>
      <ChapterHeader
        chapter={15}
        group="Herramientas"
        title={<>Jungle <em className="text-primary font-serif italic">Timers</em></>}
        tags={["Objetivos", "Camps", "Respawn tracking"]}
      />

      {/* Game Clock */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Tiempo de juego</div>
              <div className="font-mono text-3xl font-bold text-foreground">{formatTime(gameTime)}</div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={gameRunning ? "outline" : "default"}
                onClick={() => setGameRunning(!gameRunning)}
                className="gap-2"
              >
                {gameRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {gameRunning ? "Pausar" : "Iniciar"}
              </Button>
              <Button size="sm" variant="outline" onClick={resetAll} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="gap-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? "Sonido On" : "Sonido Off"}
          </Button>
        </div>
      </div>

      {/* Objective Timers */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Objetivos Principales
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {objectiveTimers.map((timer) => {
          const isActive = activeTimers[timer.id] !== undefined
          const timeLeft = activeTimers[timer.id] || 0
          const isWarning = timeLeft > 0 && timeLeft <= 30

          return (
            <div
              key={timer.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                isActive
                  ? isWarning
                    ? "bg-warning/10 border-warning/40 animate-pulse"
                    : "bg-primary/5 border-primary/25"
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    timer.priority === "critical" ? "bg-purple/15" : "bg-warning/15"
                  )}>
                    <timer.icon className={cn(
                      "w-4 h-4",
                      timer.priority === "critical" ? "text-purple" : "text-warning"
                    )} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{timer.name}</div>
                    <div className="text-[10px] text-muted-foreground">{timer.goldValue}</div>
                  </div>
                </div>
                <Badge variant={timer.priority === "critical" ? "default" : "outline"} className="text-[10px]">
                  {formatTime(timer.respawn)}
                </Badge>
              </div>

              {isActive ? (
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "font-mono text-2xl font-bold",
                    isWarning ? "text-warning" : "text-primary"
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => resetTimer(timer.id)}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => startTimer(timer)}
                  disabled={!gameRunning}
                >
                  Iniciar Timer
                </Button>
              )}
              <p className="text-[10px] text-muted-foreground mt-2 italic">{timer.tip}</p>
            </div>
          )
        })}
      </div>

      {/* Camp Timers */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Camps de Jungla
      </h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {campTimers.map((timer) => {
          const isActive = activeTimers[timer.id] !== undefined
          const timeLeft = activeTimers[timer.id] || 0

          return (
            <button
              key={timer.id}
              onClick={() => isActive ? resetTimer(timer.id) : startTimer(timer)}
              disabled={!gameRunning && !isActive}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                isActive
                  ? "bg-success/10 border-success/30"
                  : "bg-card border-border hover:bg-secondary/50",
                (!gameRunning && !isActive) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{timer.name}</span>
                {isActive && (
                  <span className="font-mono text-xs text-success">{formatTime(timeLeft)}</span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">{timer.goldValue}</div>
            </button>
          )
        })}
      </div>

      {/* Quick Reference */}
      <HighlightBox>
        <strong>Prioridad de objetivos:</strong> Soul Point Dragon &gt; Baron &gt; Heraldo &gt; Drake regular. 
        Siempre coloca vision 1 minuto antes del respawn de objetivos principales.
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Warding Guide" />
    </div>
  )
}
