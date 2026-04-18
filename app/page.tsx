"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChapterIntro } from "@/components/chapters/chapter-intro"
import { ChapterPath } from "@/components/chapters/chapter-path"
import { ChapterPyramid } from "@/components/chapters/chapter-pyramid"
import { ChapterPathing } from "@/components/chapters/chapter-pathing"
import { ChapterLoading } from "@/components/chapters/chapter-loading"
import { ChapterMirror } from "@/components/chapters/chapter-mirror"
import { ChapterGank } from "@/components/chapters/chapter-gank"
import { ChapterSmite } from "@/components/chapters/chapter-smite"
import { ChapterKPIs } from "@/components/chapters/chapter-kpis"
import { ChapterEloGoals } from "@/components/chapters/chapter-elo-goals"
import { ChapterAntiTilt } from "@/components/chapters/chapter-anti-tilt"
import { ChapterPool } from "@/components/chapters/chapter-pool"
import { ChapterEvaluator } from "@/components/chapters/chapter-evaluator"
import { ChapterMatchups } from "@/components/chapters/chapter-matchups"
import { ChapterTimers } from "@/components/chapters/chapter-timers"
import { ChapterWarding } from "@/components/chapters/chapter-warding"
import { ChapterCounterJungle } from "@/components/chapters/chapter-counterjungle"
import { ChapterTeamComp } from "@/components/chapters/chapter-teamcomp"
import { ChapterClear } from "@/components/chapters/chapter-clear"
import { ChapterTracker } from "@/components/chapters/chapter-tracker"

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 20

  const chapters = [
    { id: 0, component: <ChapterIntro onNext={() => setCurrentPage(1)} /> },
    { id: 1, component: <ChapterPath onPrev={() => setCurrentPage(0)} onNext={() => setCurrentPage(2)} /> },
    { id: 2, component: <ChapterPyramid onPrev={() => setCurrentPage(1)} onNext={() => setCurrentPage(3)} /> },
    { id: 3, component: <ChapterPathing onPrev={() => setCurrentPage(2)} onNext={() => setCurrentPage(4)} /> },
    { id: 4, component: <ChapterLoading onPrev={() => setCurrentPage(3)} onNext={() => setCurrentPage(5)} /> },
    { id: 5, component: <ChapterMirror onPrev={() => setCurrentPage(4)} onNext={() => setCurrentPage(6)} /> },
    { id: 6, component: <ChapterGank onPrev={() => setCurrentPage(5)} onNext={() => setCurrentPage(7)} /> },
    { id: 7, component: <ChapterSmite onPrev={() => setCurrentPage(6)} onNext={() => setCurrentPage(8)} /> },
    { id: 8, component: <ChapterKPIs onPrev={() => setCurrentPage(7)} onNext={() => setCurrentPage(9)} /> },
    { id: 9, component: <ChapterEloGoals onPrev={() => setCurrentPage(8)} onNext={() => setCurrentPage(10)} /> },
    { id: 10, component: <ChapterAntiTilt onPrev={() => setCurrentPage(9)} onNext={() => setCurrentPage(11)} /> },
    { id: 11, component: <ChapterPool onPrev={() => setCurrentPage(10)} onNext={() => setCurrentPage(12)} /> },
    { id: 12, component: <ChapterEvaluator onPrev={() => setCurrentPage(11)} onNext={() => setCurrentPage(13)} /> },
    { id: 13, component: <ChapterMatchups onPrev={() => setCurrentPage(12)} onNext={() => setCurrentPage(14)} /> },
    { id: 14, component: <ChapterTimers onPrev={() => setCurrentPage(13)} onNext={() => setCurrentPage(15)} /> },
    { id: 15, component: <ChapterWarding onPrev={() => setCurrentPage(14)} onNext={() => setCurrentPage(16)} /> },
    { id: 16, component: <ChapterCounterJungle onPrev={() => setCurrentPage(15)} onNext={() => setCurrentPage(17)} /> },
    { id: 17, component: <ChapterTeamComp onPrev={() => setCurrentPage(16)} onNext={() => setCurrentPage(18)} /> },
    { id: 18, component: <ChapterClear onPrev={() => setCurrentPage(17)} onNext={() => setCurrentPage(19)} /> },
    { id: 19, component: <ChapterTracker onPrev={() => setCurrentPage(18)} /> },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <main className="ml-[260px] flex-1 flex justify-center min-h-screen">
        <div className="w-full max-w-[820px] px-10 py-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {chapters[currentPage]?.component}
        </div>
      </main>
    </div>
  )
}
