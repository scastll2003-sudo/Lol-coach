"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterEvaluatorProps {
  onPrev: () => void
  onNext: () => void
}

const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

type ChampKey = "sylas" | "viego" | "diana"

const gankFactors: Record<ChampKey, { key: string; label: string; sub: string }[]> = {
  sylas: [
    { key: "g", label: "G — ¿Puedes jalar con E2?", sub: "¿El enemigo está en rango de tu cadena E2?" },
    { key: "a", label: "A — ¿Tu laner tiene CC?", sub: "Sylas no tiene CC propio — depende del laner" },
    { key: "n", label: "N — ¿2v1 confirmado?", sub: "¿Enemigo trackeado lejos? ¿Segundo enemigo fuera?" },
    { key: "k", label: "K — ¿Enemigo <60% o sin flash?", sub: "Sin ult el burst de Sylas es moderado en early" },
  ],
  viego: [
    { key: "g", label: "G — ¿W cargada disponible?", sub: "El stun de W es tu único gap closer + CC" },
    { key: "a", label: "A — ¿Enemigo bajo HP o aislado?", sub: "HP bajo = posesión posible — prioridad máxima" },
    { key: "n", label: "N — ¿2v1 o puedes 1v1?", sub: "Viego 1v1 pre-items es débil" },
    { key: "k", label: "K — ¿Es un carry que puedes poseer?", sub: "Si la posesión genera valor extra, baja el threshold" },
  ],
  diana: [
    { key: "g", label: "G — ¿Puedes aterrizarle la Q?", sub: "Sin Q marcada no hay E. ¿El enemigo está quieto o slow?" },
    { key: "a", label: "A — ¿Tienes nivel 6 (R2)?", sub: "Post-6: autosuficiente vs squishies. Pre-6: necesita CC aliado." },
    { key: "n", label: "N — ¿El enemigo no tiene movilidad?", sub: "Yasuo, Zed, Irelia con E activo = escape del combo" },
    { key: "k", label: "K — ¿Es squishy o sin flash?", sub: "El combo Q→E→R2 mata squishies en <3 segundos" },
  ],
}

type FactorState = "neutral" | "yes" | "no"

export function ChapterEvaluator({ onPrev, onNext }: ChapterEvaluatorProps) {
  const [champ, setChamp] = useState<ChampKey>("sylas")
  const [factors, setFactors] = useState<Record<string, FactorState>>({})

  const toggleFactor = (key: string) => {
    setFactors(prev => {
      const current = prev[key] || "neutral"
      const next: FactorState = current === "neutral" ? "yes" : current === "yes" ? "no" : "neutral"
      return { ...prev, [key]: next }
    })
  }

  const resetFactors = () => setFactors({})

  const currentFactors = gankFactors[champ]
  const values = currentFactors.map(f => factors[f.key] || "neutral")
  const filled = values.filter(v => v !== "neutral").length
  const yesCount = values.filter(v => v === "yes").length

  const getVerdict = () => {
    if (filled < 4) {
      return { class: "bg-card border-border text-muted-foreground", text: `${filled}/4 evaluados — click = verde, doble click = rojo, triple = resetea.` }
    }
    if (champ === "diana" && factors["a"] === "no") {
      return { class: "bg-destructive/10 border-destructive/30 text-destructive", text: "Pre-6 → NO gankees. Haz full clear hacia nivel 6. Diana sin R2 es muy difícil de cerrar." }
    }
    if (yesCount >= 4) {
      return { class: "bg-success/10 border-success/30 text-success", text: "4/4 verde — Kill altamente probable. Ejecútalo sin dudar. No hay razón para no entrar." }
    }
    if (yesCount === 3) {
      return { class: "bg-success/10 border-success/30 text-success", text: "3/4 verde — Flash forzado + presión + crash de ola. Vale la pena. Entra." }
    }
    if (yesCount === 2) {
      return { class: "bg-warning/10 border-warning/30 text-warning", text: "2/4 verde — Riesgo alto. Solo si el factor que falla es compensable con el CC de tu laner." }
    }
    return { class: "bg-destructive/10 border-destructive/30 text-destructive", text: "Menos de 2/4 verde — NO gankees. Farmea, busca otra línea o prepara countergank." }
  }

  const verdict = getVerdict()

  return (
    <div>
      <ChapterHeader
        chapter={13}
        group="Tu Pool"
        title={<><em className="text-primary font-serif italic">Evaluador</em><br />de Gankeo</>}
        tags={["Interactivo", "Calibrado por campeón", "Úsalo en pantalla de carga"]}
      />

      {/* Champion Tabs */}
      <div className="flex gap-2 mb-6">
        {(["sylas", "viego", "diana"] as ChampKey[]).map((c) => (
          <button
            key={c}
            onClick={() => { setChamp(c); resetFactors(); }}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all",
              champ === c
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <Image
              src={`${DDR}/${c.charAt(0).toUpperCase() + c.slice(1)}.png`}
              alt={c}
              width={20}
              height={20}
              className="rounded"
            />
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Gank Factors Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {currentFactors.map((factor) => {
          const state = factors[factor.key] || "neutral"
          return (
            <button
              key={factor.key}
              onClick={() => toggleFactor(factor.key)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                state === "yes" ? "border-success/40 bg-success/5" :
                state === "no" ? "border-destructive/40 bg-destructive/5" :
                "border-border bg-card hover:border-border/80"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full border transition-all",
                  state === "yes" ? "bg-success border-success" :
                  state === "no" ? "bg-destructive border-destructive" :
                  "border-border"
                )} />
                <span className="text-sm font-semibold text-foreground">{factor.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{factor.sub}</p>
            </button>
          )
        })}
      </div>

      {/* Verdict */}
      <div className={cn(
        "rounded-lg p-4 text-sm font-medium border transition-all",
        verdict.class
      )}>
        {verdict.text}
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Matchups y Composiciones" />
    </div>
  )
}
