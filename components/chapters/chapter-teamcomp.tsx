"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Swords, Zap, Target, Users, Brain, AlertTriangle, CheckCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterTeamCompProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

type CompStyle = "teamfight" | "pick" | "split" | "poke" | "engage"

const compStyles: Record<CompStyle, { name: string; description: string; icon: typeof Swords; color: string; jungleRole: string }> = {
  teamfight: { 
    name: "Teamfight", 
    description: "Agruparse y ganar 5v5 frontales", 
    icon: Users, 
    color: "primary",
    jungleRole: "Busca fights alrededor de objetivos. Iniciador o follow-up."
  },
  pick: { 
    name: "Pick Comp", 
    description: "Capturar enemigos fuera de posición", 
    icon: Target, 
    color: "destructive",
    jungleRole: "Wardea agresivo. Busca catches en jungla enemiga."
  },
  split: { 
    name: "Splitpush", 
    description: "Presión en múltiples lanes", 
    icon: Zap, 
    color: "warning",
    jungleRole: "Controla vision para el splitter. Countergank, no inicies."
  },
  poke: { 
    name: "Poke/Siege", 
    description: "Daño a distancia y asedio", 
    icon: Shield, 
    color: "info",
    jungleRole: "Protege a tus carries de flanks. Peel > engage."
  },
  engage: { 
    name: "Hard Engage", 
    description: "Flash engage para forzar fights", 
    icon: Swords, 
    color: "success",
    jungleRole: "Tú eres el engage. Flash R para iniciar teamfights."
  },
}

const champions = {
  sylas: { cc: 2, damage: 3, engage: 3, peel: 1, splitpush: 2 },
  viego: { cc: 1, damage: 4, engage: 2, peel: 0, splitpush: 3 },
  diana: { cc: 3, damage: 4, engage: 4, peel: 0, splitpush: 2 },
  leesin: { cc: 2, damage: 3, engage: 3, peel: 3, splitpush: 2 },
  elise: { cc: 2, damage: 3, engage: 2, peel: 1, splitpush: 1 },
  khazix: { cc: 1, damage: 5, engage: 2, peel: 0, splitpush: 3 },
}

const teamNeeds = [
  { need: "Engage/Iniciación", has: false, junglers: ["Diana", "Lee Sin", "Sylas"] },
  { need: "Peel para ADC", has: false, junglers: ["Lee Sin", "Elise"] },
  { need: "AP Damage", has: false, junglers: ["Diana", "Sylas", "Elise"] },
  { need: "AD Damage", has: false, junglers: ["Viego", "Lee Sin", "Kha'Zix"] },
  { need: "Tankiness", has: false, junglers: ["Diana (con items)", "Sylas"] },
  { need: "Splitpush", has: false, junglers: ["Viego", "Kha'Zix"] },
]

const draftRules = [
  { rule: "Si tu equipo no tiene engage, pickea Diana/Lee Sin", priority: 1, icon: Swords },
  { rule: "Si tu mid es AP assassin, pickea AD (Viego, Kha'Zix)", priority: 2, icon: Brain },
  { rule: "Si tu ADC es immobile, considera peel (Lee Sin)", priority: 3, icon: Shield },
  { rule: "Si el enemigo tiene 2+ tanks, evita Kha'Zix", priority: 4, icon: AlertTriangle },
  { rule: "Si el enemigo tiene mejores ults que tú, pickea Sylas", priority: 5, icon: CheckCircle },
]

const synergies = [
  { champ: "Diana", bestWith: ["Yasuo", "Orianna", "Miss Fortune"], reason: "AoE follow-up a tu R pull" },
  { champ: "Sylas", bestWith: ["Amumu", "Malphite", "Sejuani"], reason: "Ults robadas mejoran tu valor" },
  { champ: "Viego", bestWith: ["Carries con burst", "Lux", "Brand"], reason: "Kills = posesiones = cleanup" },
  { champ: "Lee Sin", bestWith: ["Samira", "Yasuo", "Orianna"], reason: "Insec delivery service" },
  { champ: "Kha'Zix", bestWith: ["Yone", "Zed", "Talon"], reason: "Splitpush comp — presión en múltiples lanes" },
  { champ: "Elise", bestWith: ["Early game lanes", "Renekton", "Lucian"], reason: "Snowball early antes de que ella caiga" },
]

export function ChapterTeamComp({ onPrev, onNext }: ChapterTeamCompProps) {
  const [selectedStyle, setSelectedStyle] = useState<CompStyle>("teamfight")
  const [selectedJungler, setSelectedJungler] = useState<string>("diana")

  const style = compStyles[selectedStyle]

  return (
    <div>
      <ChapterHeader
        chapter={18}
        group="Herramientas"
        title={<>Team Comp <em className="text-primary font-serif italic">Analyzer</em></>}
        tags={["Draft", "Synergies", "Rol del jungla"]}
      />

      {/* Comp Style Selector */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        ¿Qué estilo juega tu equipo?
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(compStyles) as CompStyle[]).map((key) => {
          const s = compStyles[key]
          return (
            <Button
              key={key}
              variant={selectedStyle === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStyle(key)}
              className="gap-2"
            >
              <s.icon className="w-4 h-4" />
              {s.name}
            </Button>
          )
        })}
      </div>

      <div className={cn(
        "p-4 rounded-lg border mb-6",
        `bg-${style.color}/5 border-${style.color}/20`
      )}>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${style.color}/15`)}>
            <style.icon className={cn("w-5 h-5", `text-${style.color}`)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{style.name}</h3>
            <p className="text-xs text-muted-foreground">{style.description}</p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded bg-background/50">
          <div className="text-xs text-muted-foreground mb-1">Tu rol como jungla:</div>
          <div className="text-sm text-foreground">{style.jungleRole}</div>
        </div>
      </div>

      {/* Draft Rules */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Reglas de Draft para Junglas
      </h2>
      <div className="space-y-2 mb-6">
        {draftRules.map((rule) => (
          <div key={rule.priority} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <rule.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-foreground">{rule.rule}</span>
            </div>
            <Badge variant="outline" className="text-[10px]">Prioridad {rule.priority}</Badge>
          </div>
        ))}
      </div>

      {/* Champion Synergies */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        Sinergias de Campeones
      </h2>
      <div className="mb-4">
        <Select value={selectedJungler} onValueChange={setSelectedJungler}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecciona jungla" />
          </SelectTrigger>
          <SelectContent>
            {synergies.map((s) => (
              <SelectItem key={s.champ.toLowerCase()} value={s.champ.toLowerCase()}>
                <div className="flex items-center gap-2">
                  <Image 
                    src={`${DDR}/${s.champ.replace("'", "").replace(" ", "")}.png`} 
                    alt={s.champ} 
                    width={20} 
                    height={20} 
                    className="rounded" 
                  />
                  {s.champ}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {synergies.filter(s => s.champ.toLowerCase() === selectedJungler).map((syn) => (
        <div key={syn.champ} className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Image 
              src={`${DDR}/${syn.champ.replace("'", "").replace(" ", "")}.png`} 
              alt={syn.champ} 
              width={40} 
              height={40} 
              className="rounded-lg" 
            />
            <div>
              <h3 className="font-semibold text-foreground">{syn.champ}</h3>
              <p className="text-xs text-muted-foreground">{syn.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mejor con:</span>
            {syn.bestWith.map((champ) => (
              <Badge key={champ} variant="outline" className="text-xs">
                {champ}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      {/* Team Needs Checklist */}
      <h2 className="font-serif text-[22px] text-foreground mb-3.5 tracking-tight">
        ¿Qué necesita tu equipo?
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {teamNeeds.map((need) => (
          <div key={need.need} className="p-3 rounded-lg bg-card border border-border">
            <div className="font-medium text-sm text-foreground mb-2">{need.need}</div>
            <div className="flex flex-wrap gap-1">
              {need.junglers.map((j) => (
                <Badge key={j} className="bg-primary/15 text-primary text-[10px]">{j}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <HighlightBox>
        <strong>Tip de draft:</strong> Nunca pickees tu main si no tiene sentido en la comp. 
        Es mejor jugar un campeón que complemente al equipo que forzar tu comfort pick.
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Calculadora de Clear" />
    </div>
  )
}
