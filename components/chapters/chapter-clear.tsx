"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Timer, Zap, Shield, Target, TrendingUp, Clock, RotateCcw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterClearProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

interface Camp {
  id: string
  name: string
  gold: number
  xp: number
  time: number
  side: "blue" | "red"
}

const camps: Camp[] = [
  { id: "blue", name: "Blue Buff", gold: 90, xp: 110, time: 22, side: "blue" },
  { id: "gromp", name: "Gromp", gold: 90, xp: 135, time: 18, side: "blue" },
  { id: "wolves", name: "Wolves", gold: 95, xp: 95, time: 16, side: "blue" },
  { id: "raptors", name: "Raptors", gold: 85, xp: 95, time: 18, side: "red" },
  { id: "red", name: "Red Buff", gold: 90, xp: 110, time: 22, side: "red" },
  { id: "krugs", name: "Krugs", gold: 125, xp: 160, time: 28, side: "red" },
  { id: "scuttle", name: "Scuttle", gold: 70, xp: 80, time: 10, side: "blue" },
]

const clearRoutes = [
  { 
    name: "Full Clear Blue Start", 
    route: ["blue", "gromp", "wolves", "raptors", "red", "krugs"],
    timing: "3:15",
    result: "Lvl 4 + ambos buffs",
    bestFor: ["Farming junglers", "Weak early"],
    champions: ["Diana", "Shyvana", "Karthus"]
  },
  { 
    name: "Full Clear Red Start", 
    route: ["red", "krugs", "raptors", "wolves", "blue", "gromp"],
    timing: "3:18",
    result: "Lvl 4 + ambos buffs",
    bestFor: ["Top side focus", "AD junglers"],
    champions: ["Viego", "Graves", "Kayn"]
  },
  { 
    name: "3 Camp Gank", 
    route: ["blue", "gromp", "red"],
    timing: "2:35-2:45",
    result: "Lvl 3 + gank potential",
    bestFor: ["Early gankers", "Strong lvl 3"],
    champions: ["Lee Sin", "Elise", "Xin Zhao"]
  },
  { 
    name: "5 Camp into Gank", 
    route: ["blue", "gromp", "wolves", "raptors", "red"],
    timing: "2:55-3:05",
    result: "Lvl 4 + healthy + gank",
    bestFor: ["Balanced junglers"],
    champions: ["Sylas", "Viego", "Hecarim"]
  },
  { 
    name: "3 Camp Invade", 
    route: ["red", "raptors", "enemy-gromp"],
    timing: "2:15-2:30",
    result: "Lvl 3 + enemy buff denied",
    bestFor: ["Aggressive early", "1v1 kings"],
    champions: ["Lee Sin", "Kha'Zix", "Rengar"]
  },
]

const champClearTimes: Record<string, { speed: string; health: string; tips: string }> = {
  sylas: { speed: "3:18", health: "Medium", tips: "Weave passive between abilities for fastest clear" },
  viego: { speed: "3:12", health: "High", tips: "Q passive sustain keeps you healthy. Auto-Q-Auto combo" },
  diana: { speed: "3:05", health: "Very High", tips: "Passive cleave on 3rd auto. One of the fastest clears" },
  leesin: { speed: "3:22", health: "Medium", tips: "W sustain, but mana dependent. E for AoE camps" },
  elise: { speed: "3:25", health: "Low", tips: "Human W spiders tank. Rappel resets aggro" },
  khazix: { speed: "3:30", health: "Low", tips: "Isolated Q for single target. Talisman helps AoE" },
}

export function ChapterClear({ onPrev, onNext }: ChapterClearProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [selectedCamps, setSelectedCamps] = useState<string[]>([])
  const [selectedChamp, setSelectedChamp] = useState<string>("diana")

  const totalGold = selectedCamps.reduce((sum, id) => {
    const camp = camps.find(c => c.id === id)
    return sum + (camp?.gold || 0)
  }, 0)

  const totalXp = selectedCamps.reduce((sum, id) => {
    const camp = camps.find(c => c.id === id)
    return sum + (camp?.xp || 0)
  }, 0)

  const totalTime = selectedCamps.reduce((sum, id) => {
    const camp = camps.find(c => c.id === id)
    return sum + (camp?.time || 0)
  }, 0)

  const toggleCamp = (id: string) => {
    setSelectedCamps(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <div>
      <ChapterHeader
        chapter={19}
        group="Herramientas"
        title={<>Clear <em className="text-primary font-serif italic">Calculator</em></>}
        tags={["Rutas", "Timing", "Gold/XP"]}
      />

      {/* Champion Clear Times */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Tiempos de Clear por Campeón
      </h2>
      <div className="flex gap-2 mb-4">
        {Object.keys(champClearTimes).map((c) => {
          const displayName = c === "leesin" ? "Lee Sin" : c === "khazix" ? "Kha'Zix" : c.charAt(0).toUpperCase() + c.slice(1)
          const imgName = c === "leesin" ? "LeeSin" : c === "khazix" ? "Khazix" : c.charAt(0).toUpperCase() + c.slice(1)
          return (
            <Button
              key={c}
              variant={selectedChamp === c ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedChamp(c)}
              className="gap-2"
            >
              <Image src={`${DDR}/${imgName}.png`} alt={displayName} width={20} height={20} className="rounded" />
              {displayName}
            </Button>
          )
        })}
      </div>

      {selectedChamp && champClearTimes[selectedChamp] && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Full Clear</div>
              <div className="text-xl font-mono font-bold text-primary">{champClearTimes[selectedChamp].speed}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">HP al final</div>
              <div className={cn(
                "text-xl font-bold",
                champClearTimes[selectedChamp].health === "Very High" ? "text-success" :
                champClearTimes[selectedChamp].health === "High" ? "text-success" :
                champClearTimes[selectedChamp].health === "Medium" ? "text-warning" :
                "text-destructive"
              )}>
                {champClearTimes[selectedChamp].health}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Resultado</div>
              <div className="text-sm font-medium text-foreground">Lvl 4 + buffs</div>
            </div>
          </div>
          <div className="p-3 rounded bg-secondary/50">
            <div className="text-xs text-muted-foreground mb-1">Tip de clear:</div>
            <div className="text-sm text-foreground">{champClearTimes[selectedChamp].tips}</div>
          </div>
        </div>
      )}

      {/* Clear Routes */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Rutas de Clear Populares
      </h2>
      <div className="space-y-2 mb-6">
        {clearRoutes.map((route) => (
          <div 
            key={route.name}
            onClick={() => setSelectedRoute(selectedRoute === route.name ? null : route.name)}
            className={cn(
              "p-4 rounded-lg border cursor-pointer transition-all",
              selectedRoute === route.name 
                ? "bg-primary/5 border-primary/30" 
                : "bg-card border-border hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{route.name}</div>
                  <div className="text-xs text-muted-foreground">{route.result}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg text-primary font-bold">{route.timing}</div>
              </div>
            </div>
            
            {selectedRoute === route.name && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Ruta:</span>
                  {route.route.map((camp, i) => (
                    <span key={i} className="text-xs">
                      <Badge variant="outline" className="text-[10px]">{camp}</Badge>
                      {i < route.route.length - 1 && <span className="text-muted-foreground mx-1">→</span>}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Best for:</span>
                  {route.bestFor.map((bf) => (
                    <Badge key={bf} className="bg-success/15 text-success text-[10px]">{bf}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Champions:</span>
                  {route.champions.map((c) => (
                    <Image 
                      key={c} 
                      src={`${DDR}/${c.replace("'", "").replace(" ", "")}.png`} 
                      alt={c} 
                      width={24} 
                      height={24} 
                      className="rounded" 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Calculator */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Calculadora de Ruta Custom
      </h2>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Blue Side</div>
            <div className="space-y-2">
              {camps.filter(c => c.side === "blue").map((camp) => (
                <label 
                  key={camp.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all",
                    selectedCamps.includes(camp.id) 
                      ? "bg-info/10 border-info/30" 
                      : "bg-secondary/30 border-border hover:bg-secondary/50"
                  )}
                >
                  <Checkbox 
                    checked={selectedCamps.includes(camp.id)}
                    onCheckedChange={() => toggleCamp(camp.id)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{camp.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {camp.gold}g · {camp.xp}xp · ~{camp.time}s
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Red Side</div>
            <div className="space-y-2">
              {camps.filter(c => c.side === "red").map((camp) => (
                <label 
                  key={camp.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all",
                    selectedCamps.includes(camp.id) 
                      ? "bg-destructive/10 border-destructive/30" 
                      : "bg-secondary/30 border-border hover:bg-secondary/50"
                  )}
                >
                  <Checkbox 
                    checked={selectedCamps.includes(camp.id)}
                    onCheckedChange={() => toggleCamp(camp.id)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{camp.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {camp.gold}g · {camp.xp}xp · ~{camp.time}s
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-secondary/50">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Gold Total</div>
            <div className="text-xl font-mono font-bold text-warning">{totalGold}g</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">XP Total</div>
            <div className="text-xl font-mono font-bold text-info">{totalXp}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Tiempo Aprox</div>
            <div className="text-xl font-mono font-bold text-primary">
              {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 w-full gap-2"
          onClick={() => setSelectedCamps([])}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <HighlightBox>
        <strong>Tip:</strong> El timing de tu primer clear determina tus opciones de gankeo. 
        Practica tu clear óptimo en tool mode hasta que sea muscle memory.
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: KPI Tracker" />
    </div>
  )
}
