"use client"

import { useState } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterLoadingProps {
  onPrev: () => void
  onNext: () => void
}

const checklistItems = [
  {
    label: "1 · Identifica al jungler enemigo",
    sub: "¿Es farmer o ganker? ¿Te gana el 1v1? ¿Dónde es fuerte, dónde es débil? ¿Qué ult tiene? (clave para Sylas)"
  },
  {
    label: "2 · Lee las 3 líneas",
    sub: "¿Quién tiene CC aliado? ¿Quién va a perder el matchup? ¿Quién va a pushear rápido? Marca la línea más gankeable."
  },
  {
    label: "3 · Verifica summoners enemigos",
    sub: "¿El ADC/mid/top tiene Flash? Sin flash = gank prioritario. ¿Tienen Teleport? Cambia el valor de gankear top."
  },
  {
    label: "4 · Define tu starting side",
    sub: "¿Botside o topside? ¿Enemigo arrancó botside? (Sistema Mirror → tú arrancas topside). ¿Dragon próximo? → botside."
  },
  {
    label: "5 · Formula la frase del plan",
    sub: '"Juego [campeón]. Arranco [side]. Al 3:15 voy a [acción] porque [razón]. Plan B si cambia: [acción]."'
  },
]

export function ChapterLoading({ onPrev, onNext }: ChapterLoadingProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(checklistItems.length).fill(false))

  const toggleCheck = (index: number) => {
    const newChecked = [...checked]
    newChecked[index] = !newChecked[index]
    setChecked(newChecked)
  }

  const allChecked = checked.every(Boolean)

  return (
    <div>
      <ChapterHeader
        chapter={5}
        group="Sistemas"
        title={<>SOP:<br /><em className="text-primary font-serif italic">Pantalla de Carga</em></>}
        tags={["40-50 segundos de trabajo", "Plan A + Plan B", "El 80% de la partida se decide aquí"]}
      />

      <p className="mb-6 leading-relaxed">
        Este es tu SOP (Standard Operating Procedure) completo para los 40-50 segundos que tienes en pantalla de carga. Hazlo en orden, cada vez, hasta que sea automático.
      </p>

      <div className="flex flex-col gap-2">
        {checklistItems.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleCheck(index)}
            className={cn(
              "flex items-start gap-2.5 p-2.5 bg-card border rounded-lg cursor-pointer transition-all",
              checked[index] 
                ? "border-primary/30 bg-primary/[0.04]" 
                : "border-border hover:border-border/80"
            )}
          >
            <div className={cn(
              "w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-[1.5px] transition-all",
              checked[index] 
                ? "bg-primary border-primary" 
                : "border-border"
            )}>
              {checked[index] && <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[2.5]" />}
            </div>
            <div>
              <div className="text-[13px] font-medium text-foreground mb-0.5">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {allChecked && (
        <AlertCard variant="accent" className="mt-4 animate-in fade-in slide-in-from-bottom-2">
          <strong>Plan completo.</strong> Entras al juego con propósito, no a ver qué pasa. El 80% del trabajo ya está hecho.
        </AlertCard>
      )}

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Sistema M.I.R.R.O.R." />
    </div>
  )
}
