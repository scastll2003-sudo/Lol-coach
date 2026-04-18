"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
}

const chapters = [
  { group: "Fundamentos", items: [
    { num: "01", title: "El Director Invisible" },
    { num: "02", title: "Framework P.A.T.H." },
    { num: "03", title: "Pirámide del Jungla" },
  ]},
  { group: "Sistemas", items: [
    { num: "04", title: "Los 4 Pathings" },
    { num: "05", title: "Pantalla de Carga" },
    { num: "06", title: "Sistema M.I.R.R.O.R." },
    { num: "07", title: "Framework G.A.N.K." },
    { num: "08", title: "Sistema SMITE" },
  ]},
  { group: "KPIs y Métricas", items: [
    { num: "09", title: "KPIs por Elo" },
    { num: "10", title: "Objetivos de Elo" },
    { num: "11", title: "Anti-Tilt SOP" },
  ]},
  { group: "Tu Pool", items: [
    { num: "12", title: "Sylas · Viego · Diana" },
    { num: "13", title: "Evaluador de Gankeo" },
    { num: "14", title: "Matchups Expandidos" },
  ]},
  { group: "Herramientas", items: [
    { num: "15", title: "Jungle Timers" },
    { num: "16", title: "Warding Guide" },
    { num: "17", title: "Counter-Jungling" },
    { num: "18", title: "Team Comp Analyzer" },
    { num: "19", title: "Clear Calculator" },
    { num: "20", title: "KPI Tracker" },
  ]},
]

const champions = ["Sylas", "Viego", "Diana"]
const DDR = "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion"

export function Sidebar({ currentPage, setCurrentPage, totalPages }: SidebarProps) {
  let pageIndex = 0
  const progress = ((currentPage + 1) / totalPages) * 100

  return (
    <nav className="fixed top-0 left-0 w-[260px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-10 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary to-transparent opacity-30" />
        <h1 className="font-serif text-base text-primary tracking-tight">
          Sistema Operativo del Jungla
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
          Patch 16.8 · Titans x Claude
        </p>
        {/* Champion portraits */}
        <div className="flex gap-1.5 mt-3">
          {champions.map((champ) => (
            <div key={champ} className="relative group">
              <Image
                src={`${DDR}/${champ}.png`}
                alt={champ}
                width={32}
                height={32}
                className="rounded-md border border-border/50 transition-all duration-200 group-hover:border-primary group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chapter List */}
      <div className="flex-1 py-3">
        {chapters.map((group) => (
          <div key={group.group}>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground px-5 py-3">
              {group.group}
            </div>
            {group.items.map((item) => {
              const index = pageIndex++
              return (
                <button
                  key={item.num}
                  onClick={() => setCurrentPage(index)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-5 py-2 text-left transition-all duration-150 border-l-2",
                    currentPage === index
                      ? "text-primary bg-primary/5 border-l-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02] border-l-transparent"
                  )}
                >
                  <span className="font-mono text-[10px] opacity-60 min-w-[18px]">
                    {item.num}
                  </span>
                  <span className="text-[13px] font-medium truncate">
                    {item.title}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
          <span>Progreso</span>
          <span>{currentPage + 1}/{totalPages}</span>
        </div>
        <div className="h-[3px] bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </nav>
  )
}
