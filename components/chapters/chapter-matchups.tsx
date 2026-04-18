"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Shield, Swords, AlertTriangle, Crown, Zap, Target, Brain } from "lucide-react"

interface ChapterMatchupsProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

type ChampKey = "sylas" | "viego" | "diana"

const matchupData: Record<ChampKey, { 
  counters: { name: string; wr: string; reason: string; tip: string }[]; 
  favors: { name: string; wr: string; reason: string; tip: string }[];
  skill: { name: string; wr: string; reason: string }[];
}> = {
  sylas: {
    counters: [
      { name: "Zac", wr: "44%", reason: "Mejor teamfighter, su ult robada no es tan útil", tip: "Evítalo en teamfights, busca picks en sidelanes" },
      { name: "Shaco", wr: "45%", reason: "Te invade constantemente, impossible de trackear", tip: "Ward profunda en su jungla, nunca solo" },
      { name: "Elise", wr: "45%", reason: "Te gana el 1v1 early, mejor ganker pre-6", tip: "Farm hasta 6, no contestes invades" },
      { name: "Lillia", wr: "45%", reason: "Te kiteea infinitamente, nunca la alcanzas", tip: "Flash E para cerrar distancia, coordina CC con lanes" },
      { name: "Nidalee", wr: "46%", reason: "Agresividad early te destruye, outfarmea", tip: "Cede camps si invade, scale hasta items" },
      { name: "Kindred", wr: "46%", reason: "Marks te obligan a jugar su juego", tip: "Contesta marks con equipo, nunca solo" },
    ],
    favors: [
      { name: "Shyvana", wr: "57%", reason: "Su ult robado es S tier, la matas fácil pre-6", tip: "Invádela en su segundo clear" },
      { name: "Jax", wr: "57%", reason: "Sin movilidad real, E2 lo jala fácil", tip: "Kitealo con E1, espera su E para usar W" },
      { name: "Talon", wr: "56%", reason: "Lo outdueleas en 1v1 después de lvl 3", tip: "Guarda W para después de su burst inicial" },
      { name: "Hecarim", wr: "55%", reason: "Su ult robado (fear + carga) es brutal", tip: "Róbale ult antes de teamfight" },
      { name: "Amumu", wr: "55%", reason: "Ult robado = mejor engage del juego", tip: "Róbale ult, luego pídele que engagee primero" },
      { name: "Nocturne", wr: "54%", reason: "Su ult te da vision global + gap closer", tip: "Úsalo para countergank con R robado" },
    ],
    skill: [
      { name: "LeeSin", wr: "50%", reason: "Depende de quién aterrice su CC primero" },
      { name: "Viego", wr: "50%", reason: "Ambos escalan similar, depende de posesiones" },
      { name: "Graves", wr: "49%", reason: "Su sustain vs tu burst, timing de pelea" },
    ],
  },
  viego: {
    counters: [
      { name: "Qiyana", wr: "43%", reason: "Te outduels fácil, demasiada movilidad", tip: "Espera a que gaste habilidades antes de W" },
      { name: "Nidalee", wr: "43%", reason: "Te kiteea, outfarmea, outganks early", tip: "Farm pasivo, nunca la persigas" },
      { name: "Fizz", wr: "44%", reason: "Su E niega tu W — esquiva todo tu daño", tip: "Baita su E antes de commitear W" },
      { name: "Fiddlesticks", wr: "47%", reason: "Su fear te interrumpe todo, ult > tuya", tip: "Ward bushes, nunca facecheck" },
      { name: "Rammus", wr: "47%", reason: "Armor stack, taunt te cancela todo", tip: "Ignora y ve a otros targets" },
      { name: "Malphite", wr: "48%", reason: "Armor + ult knockup te destruye", tip: "Splitpush, evita teamfights frontales" },
    ],
    favors: [
      { name: "Gwen", wr: "57%", reason: "Lenta, sin burst, posesión muy valiosa", tip: "Posee carries, no a Gwen" },
      { name: "DrMundo", wr: "56%", reason: "Sin movilidad, fácil de stunear con W", tip: "Ignóralo y mata carries" },
      { name: "Karthus", wr: "55%", reason: "Kill fácil + posesión con R global", tip: "Invádelo early, nunca farmea seguro" },
      { name: "Shyvana", wr: "54%", reason: "Sin CC, la matas fácil", tip: "Contesta sus drakes, es su único win con" },
      { name: "Udyr", wr: "54%", reason: "Predecible, sin gap closer real", tip: "Kitealo con W stun" },
      { name: "Sejuani", wr: "53%", reason: "Lenta, posesión da CC masivo", tip: "Mata carries, posee para cleanup" },
    ],
    skill: [
      { name: "Sylas", wr: "50%", reason: "Ambos escalan, depende del draft" },
      { name: "Kayn", wr: "50%", reason: "Depende de su forma, Red > Blue para ti" },
      { name: "RekSai", wr: "49%", reason: "Early game fuerte pero tú escalas mejor" },
    ],
  },
  diana: {
    counters: [
      { name: "Volibear", wr: "42%", reason: "Tankea todo tu combo y te mata", tip: "Nunca 1v1, busca objetivos cuando esté lejos" },
      { name: "Talon", wr: "44%", reason: "Te bursts antes de completar combo", tip: "Necesitas Zhonyas antes de pelear" },
      { name: "Nocturne", wr: "46%", reason: "E bloquea tu Q — sin Q no hay E reset", tip: "Baita su E con W, luego Q" },
      { name: "Olaf", wr: "47%", reason: "R ignora tu ult pull, te corre", tip: "Espera a que gaste R antes de engagear" },
      { name: "Trundle", wr: "47%", reason: "Te roba stats, te outlasts", tip: "Ignóralo, mata a su equipo" },
      { name: "Warwick", wr: "48%", reason: "Sustain > tu burst, Q sigue tu E", tip: "Necesitas Grievous Wounds" },
    ],
    favors: [
      { name: "Shyvana", wr: "58%", reason: "Clear lento, sin CC, la nukes fácil", tip: "Invádela en 2do/3er clear" },
      { name: "Graves", wr: "56%", reason: "Tu burst > su sustain post-6", tip: "Q-E-E-R combo before he can react" },
      { name: "Karthus", wr: "55%", reason: "Inmóvil, squishy, one-shot garantizado", tip: "Invádelo constantemente" },
      { name: "Evelynn", wr: "54%", reason: "Pre-6 le ganas, post-6 rush Banshees", tip: "Track her and countergank" },
      { name: "Ivern", wr: "54%", reason: "Sin damage, lo atropellas", tip: "Invade, toma sus camps" },
      { name: "Nidalee", wr: "53%", reason: "Si cierras distancia, muere", tip: "Flash-E para cerrar gap" },
    ],
    skill: [
      { name: "Ekko", wr: "50%", reason: "Ambos AP assassins, depende del timing de Rs" },
      { name: "Elise", wr: "49%", reason: "Ella gana early, tú ganas mid-late" },
      { name: "LeeSin", wr: "49%", reason: "Su movilidad vs tu burst" },
    ],
  },
}

const ultTiers = [
  { name: "Amumu", tier: "S+", reason: "AoE stun masivo — Sylas se convierte en el mejor iniciador" },
  { name: "Malphite", tier: "S+", reason: "Engage perfecto — dash + AoE knockup" },
  { name: "JarvanIV", tier: "S", reason: "Cataclysm encierra — perfecto para AoE de tu equipo" },
  { name: "Sejuani", tier: "S", reason: "AoE stun gigante en teamfight" },
  { name: "Hecarim", tier: "S", reason: "Fear + carga — engage agresivo" },
  { name: "Neeko", tier: "A+", reason: "AoE stun, camufla entrada" },
  { name: "Orianna", tier: "A+", reason: "Shockwave sin necesitar bola" },
  { name: "Alistar", tier: "A", reason: "Knockup combo para peeling" },
  { name: "Nocturne", tier: "A", reason: "Vision denial + gap closer global" },
  { name: "Shyvana", tier: "A", reason: "Dragon form = AP nuke masivo" },
]

const earlyGameTips = [
  { champ: "LeeSin", icon: Zap, tip: "Invade lvl 3 después de tu red buff — él estará en gromp", timing: "2:45" },
  { champ: "Karthus", icon: Target, tip: "Invade cada vez que lo veas en el mapa — 0 escapes", timing: "Any" },
  { champ: "Evelynn", icon: Shield, tip: "Invade pre-6 y coloca pinks en su jungla", timing: "Pre-6" },
  { champ: "Shyvana", icon: Swords, tip: "Contest drake a los 5 minutos — es su única condición de victoria", timing: "5:00" },
  { champ: "Graves", icon: Brain, tip: "No intentes 1v1 con su passive stack — engage cuando no tenga stacks", timing: "Fights" },
]

export function ChapterMatchups({ onPrev, onNext }: ChapterMatchupsProps) {
  const [champ, setChamp] = useState<ChampKey>("sylas")
  const data = matchupData[champ]

  return (
    <div>
      <ChapterHeader
        chapter={14}
        group="Tu Pool"
        title={<><em className="text-primary font-serif italic">Matchups</em> y<br />Composiciones</>}
        tags={["Patch 16.8 · Lolalytics Esmeralda+", "3 campeones", "Counters detallados"]}
      />

      {/* Champion Tabs - Only 3 champions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["sylas", "viego", "diana"] as ChampKey[]).map((c) => {
          const displayName = c.charAt(0).toUpperCase() + c.slice(1)
          return (
            <button
              key={c}
              onClick={() => setChamp(c)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                champ === c
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              )}
            >
              <Image
                src={`${DDR}/${displayName}.png`}
                alt={displayName}
                width={20}
                height={20}
                className="rounded"
              />
              {displayName}
            </button>
          )
        })}
      </div>

      <Tabs defaultValue="counters" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="counters" className="text-xs">Counters & Favorables</TabsTrigger>
          <TabsTrigger value="skill" className="text-xs">Skill Matchups</TabsTrigger>
          <TabsTrigger value="tips" className="text-xs">Tips por Matchup</TabsTrigger>
        </TabsList>

        <TabsContent value="counters">
          <div className="grid grid-cols-2 gap-4">
            {/* Counters */}
            <div>
              <div className="flex items-center gap-2 text-[11px] text-destructive mb-2 font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                Counters — evita pickear
              </div>
              <div className="space-y-1.5">
                {data.counters.map((m) => (
                  <div key={m.name} className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/15 hover:bg-destructive/10 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Image src={`${DDR}/${m.name}.png`} alt={m.name} width={24} height={24} className="rounded" />
                        <span className="text-sm font-medium text-destructive/90">{m.name.replace("DrMundo", "Dr. Mundo")}</span>
                      </div>
                      <span className="font-mono text-xs text-destructive">{m.wr}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground ml-8">{m.reason}</div>
                    <div className="text-[10px] text-primary/80 ml-8 mt-0.5 italic">Tip: {m.tip}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorable */}
            <div>
              <div className="flex items-center gap-2 text-[11px] text-success mb-2 font-semibold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                Favorables — pickea con confianza
              </div>
              <div className="space-y-1.5">
                {data.favors.map((m) => (
                  <div key={m.name} className="p-2.5 rounded-lg bg-success/5 border border-success/15 hover:bg-success/10 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Image src={`${DDR}/${m.name}.png`} alt={m.name} width={24} height={24} className="rounded" />
                        <span className="text-sm font-medium text-success/90">{m.name.replace("DrMundo", "Dr. Mundo")}</span>
                      </div>
                      <span className="font-mono text-xs text-success">{m.wr}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground ml-8">{m.reason}</div>
                    <div className="text-[10px] text-primary/80 ml-8 mt-0.5 italic">Tip: {m.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skill">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-[11px] text-warning mb-3 font-semibold uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5" />
              Skill Matchups — depende de tu ejecución
            </div>
            <div className="grid grid-cols-3 gap-3">
              {data.skill.map((m) => (
                <div key={m.name} className="p-3 rounded-lg bg-warning/5 border border-warning/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Image src={`${DDR}/${m.name}.png`} alt={m.name} width={28} height={28} className="rounded" />
                    <div>
                      <div className="text-sm font-medium text-warning/90">{m.name.replace("LeeSin", "Lee Sin").replace("RekSai", "Rek'Sai")}</div>
                      <div className="font-mono text-xs text-warning">{m.wr}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{m.reason}</div>
                </div>
              ))}
            </div>
            <HighlightBox className="mt-4">
              En skill matchups, la victoria depende de: timing de habilidades, vision control, y tracking del enemigo. Practica estos matchups en normals antes de rankeds.
            </HighlightBox>
          </div>
        </TabsContent>

        <TabsContent value="tips">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">Tips de Early Game por Enemigo</h3>
            <div className="space-y-2">
              {earlyGameTips.map((tip) => (
                <div key={tip.champ} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Image src={`${DDR}/${tip.champ}.png`} alt={tip.champ} width={18} height={18} className="rounded" />
                      <span className="font-medium text-sm text-foreground">{tip.champ.replace("LeeSin", "Lee Sin")}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5">{tip.timing}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sylas Ult Tier List - only show when Sylas selected */}
      {champ === "sylas" && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            Tier List de Ults para Sylas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ultTiers.map((ult) => (
              <div key={ult.name} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <Image src={`${DDR}/${ult.name}.png`} alt={ult.name} width={28} height={28} className="rounded" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{ult.name.replace("JarvanIV", "Jarvan IV")}</span>
                    <Badge className={cn(
                      "text-[9px] px-1.5",
                      ult.tier === "S+" ? "bg-primary/20 text-primary" :
                      ult.tier === "S" ? "bg-success/20 text-success" :
                      "bg-warning/20 text-warning"
                    )}>
                      {ult.tier}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{ult.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </div>
  )
}
