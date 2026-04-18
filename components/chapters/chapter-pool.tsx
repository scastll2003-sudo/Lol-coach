"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterPoolProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img"

const champions = {
  sylas: {
    name: "Sylas",
    role: "AP Bruiser / Robo de Ults",
    tier: "S",
    difficulty: "Media",
    abilities: [
      { key: "P", name: "Petricita Burst", desc: "Cada habilidad recarga un AA potenciado AoE. Úsalo entre cada habilidad.", tip: "Weaving perfecto = 40% más daño en 1v1" },
      { key: "Q", name: "Chain Lash", desc: "Daño AoE + slow. Poke principal en lane, clear en jungla.", tip: "El segundo hit explota — intenta aterrizar ambas partes" },
      { key: "W", name: "Kingslayer", desc: "Dash + heal aumentado si estás bajo. Tu sustain y outplay.", tip: "Nunca lo uses primero — guárdalo para cuando estés bajo" },
      { key: "E", name: "Abscond/Abduct", desc: "E1 dash, E2 pull + stun. Tu gap closer principal.", tip: "E2 es tu única CC — no lo falles" },
      { key: "R", name: "Hijack", desc: "Roba la ult del enemigo. Define el valor de Sylas en cada partida.", tip: "En pantalla de carga, identifica la ult más valiosa" },
    ]
  },
  viego: {
    name: "Viego",
    role: "Skirmisher / Reset King",
    tier: "S",
    difficulty: "Alta",
    abilities: [
      { key: "P", name: "Sovereign's Domination", desc: "Posee campeones eliminados, heredando su kit + items.", tip: "Prioriza poseer carries — su daño es tu daño" },
      { key: "Q", name: "Blade of the Ruined King", desc: "Ataque rápido + pasivo de % HP. Tu daño base.", tip: "Auto-Q-Auto es tu combo básico de trade" },
      { key: "W", name: "Spectral Maw", desc: "Stun cargado + dash. Tu único CC hard.", tip: "Cárgalo antes de gankear — no entres sin W listo" },
      { key: "E", name: "Harrowed Path", desc: "Niebla que da camuflaje + AS. Flankeo y emboscadas.", tip: "Usa E en paredes para ganks desde ángulos inesperados" },
      { key: "R", name: "Heartbreaker", desc: "Dash + ejecución basada en HP perdido. Reset en kill/posesión.", tip: "Guárdalo para ejecutar — no lo uses para iniciar" },
    ]
  },
  diana: {
    name: "Diana",
    role: "AP Assassin / Teamfight",
    tier: "A+",
    difficulty: "Baja",
    abilities: [
      { key: "P", name: "Moonsilver Blade", desc: "Cada 3 AAs = cleave AoE. Define tu clear speed.", tip: "El cleave es clave para clear rápido — no canceles autos" },
      { key: "Q", name: "Crescent Strike", desc: "Skillshot curvo que marca al enemigo. Habilita E.", tip: "Sin Q marcada, no hay E. Practica el arco de Q" },
      { key: "W", name: "Pale Cascade", desc: "3 orbes + escudo. Daño AoE y sustain.", tip: "Actívalo antes de entrar para absorber daño inicial" },
      { key: "E", name: "Lunar Rush", desc: "Dash al enemigo marcado. Reset si Q marcó.", tip: "Q marca → E → E reset es tu combo de entrada" },
      { key: "R", name: "Moonfall", desc: "Pull AoE masivo + daño basado en enemigos. Tu teamfight.", tip: "Espera a que el equipo se agrupe — R en 3+ = teamfight ganada" },
    ]
  },
}

type ChampionKey = keyof typeof champions

export function ChapterPool({ onPrev, onNext }: ChapterPoolProps) {
  const [selected, setSelected] = useState<ChampionKey>("sylas")
  const champ = champions[selected]

  return (
    <div>
      <ChapterHeader
        chapter={12}
        group="Tu Pool"
        title={<>Sylas · Viego · <em className="text-primary font-serif italic">Diana</em></>}
        tags={["3 campeones óptimos", "Guías de habilidades", "Tips por habilidad"]}
      />

      {/* Champion Tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(champions) as ChampionKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all",
              selected === key
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-transparent text-muted-foreground border-border hover:border-border/80 hover:text-foreground"
            )}
          >
            <Image
              src={`${DDR}/champion/${champions[key].name}.png`}
              alt={champions[key].name}
              width={20}
              height={20}
              className="rounded"
            />
            {champions[key].name}
          </button>
        ))}
      </div>

      {/* Champion Info */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={`${DDR}/champion/${champ.name}.png`}
            alt={champ.name}
            width={64}
            height={64}
            className="rounded-lg border border-border"
          />
          <div>
            <h3 className="font-serif text-2xl text-foreground">{champ.name}</h3>
            <p className="text-sm text-muted-foreground">{champ.role}</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-primary/15 text-primary border-primary/25">Tier {champ.tier}</Badge>
              <Badge variant="outline">Dificultad: {champ.difficulty}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Abilities */}
      <h2 className="font-serif text-[22px] text-foreground mt-6 mb-3.5 tracking-tight">
        Habilidades y Tips
      </h2>

      <div className="space-y-2">
        {champ.abilities.map((ability) => (
          <div 
            key={ability.key}
            className="flex items-start gap-3 py-3 border-b border-border last:border-b-0 hover:bg-foreground/[0.01] transition-colors relative group"
          >
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-medium flex-shrink-0 border",
              ability.key === "P" ? "bg-purple/15 text-purple border-purple/25" :
              ability.key === "Q" ? "bg-success/15 text-success border-success/25" :
              ability.key === "W" ? "bg-info/15 text-info border-info/25" :
              ability.key === "E" ? "bg-warning/15 text-warning border-warning/25" :
              "bg-destructive/15 text-destructive border-destructive/25"
            )}>
              {ability.key}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-foreground mb-0.5">{ability.name}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ability.desc}</p>
              <p className="text-xs text-primary mt-1 italic">{ability.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Evaluador de Gankeo" />
    </div>
  )
}
