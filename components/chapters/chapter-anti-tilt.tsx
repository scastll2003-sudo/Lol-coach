import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { AlertCard } from "@/components/ui/alert-card"
import { HighlightBox } from "@/components/ui/highlight-box"
import { Ban, Pause, RefreshCw, Brain } from "lucide-react"

interface ChapterAntiTiltProps {
  onPrev: () => void
  onNext: () => void
}

const tiltLevels = [
  {
    level: 1,
    name: "Frustración leve",
    signs: "Suspiros, pensamiento negativo, culpar al equipo internamente",
    action: "Respira 3 veces profundo entre partidas. No queues inmediatamente.",
    icon: Pause,
    color: "warning"
  },
  {
    level: 2,
    name: "Tilt activo",
    signs: "Decisiones impulsivas, invades sin info, peleas sin ventaja",
    action: "STOP. 15 minutos de break obligatorio. Camina, estira, hidratate.",
    icon: RefreshCw,
    color: "warning"
  },
  {
    level: 3,
    name: "Tilt total",
    signs: "Flame en chat, FF votes tempranos, surrender mental",
    action: "SESIÓN TERMINADA. No más ranked hoy. Mañana fresh start.",
    icon: Ban,
    color: "destructive"
  },
]

const stopRules = [
  "2 derrotas seguidas → 10 min break",
  "3 derrotas seguidas → sesión terminada",
  "Tilt nivel 2 detectado → 15 min break",
  "Tilt nivel 3 → no más ranked hoy",
  "Después de las 12am → no ranked (decision fatigue)",
]

const mentalResets = [
  { trigger: "Antes de cada partida", action: "Di en voz alta tu plan de 3:15" },
  { trigger: "Después de un error", action: "\"Error anotado, siguiente jugada\"" },
  { trigger: "Laner tilteado", action: "Mute y enfócate en el laner que sí quiere ganar" },
  { trigger: "Partida perdida", action: "Anota 1 cosa que pudiste hacer mejor, cierra la partida" },
]

export function ChapterAntiTilt({ onPrev, onNext }: ChapterAntiTiltProps) {
  return (
    <div>
      <ChapterHeader
        chapter={11}
        group="KPIs y Métricas"
        title={<>Anti-Tilt <em className="text-primary font-serif italic">SOP</em></>}
        tags={["Protocolo de emergencia", "Reglas de stop-loss", "Mental > mecánicas"]}
      />

      <AlertCard variant="destructive" className="mb-6">
        <strong>Dato:</strong> Un jugador tilteado tiene en promedio <span className="text-destructive font-semibold">-12% WR</span> comparado con su baseline. 3 partidas tilteadas = 1 semana de climb perdido.
      </AlertCard>

      <h2 className="font-serif text-[22px] text-foreground mt-6 mb-3.5 tracking-tight flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        Niveles de Tilt — Detección
      </h2>

      <div className="space-y-3 mb-6">
        {tiltLevels.map((t) => {
          const colorClasses = t.color === "warning" 
            ? "bg-warning/5 border-warning/25" 
            : "bg-destructive/5 border-destructive/25"
          const iconBg = t.color === "warning" ? "bg-warning/10" : "bg-destructive/10"
          const iconColor = t.color === "warning" ? "text-warning" : "text-destructive"
          
          return (
            <div 
              key={t.level} 
              className={`border rounded-lg p-4 ${colorClasses}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <t.icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Nivel {t.level}: {t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.signs}</div>
                </div>
              </div>
              <div className="ml-[52px] text-sm">
                <span className="text-primary font-medium">Acción:</span> {t.action}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Reglas de Stop-Loss
      </h2>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="space-y-2">
          {stopRules.map((rule, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-serif text-[22px] text-foreground mt-8 mb-3.5 tracking-tight">
        Mental Resets Rápidos
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {mentalResets.map((reset, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">{reset.trigger}</div>
            <div className="text-sm text-foreground font-medium">{reset.action}</div>
          </div>
        ))}
      </div>

      <HighlightBox>
        {'"'}El tilt no es debilidad mental — es química cerebral. Cortisol alto = decisiones peores. El mejor jugador del mundo tilteado juega como alguien 2 divisiones abajo. No luches contra la biología: descansa.{'"'}
      </HighlightBox>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Siguiente: Tu Pool" />
    </div>
  )
}
