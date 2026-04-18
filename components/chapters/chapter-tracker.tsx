"use client"

import { useState, useEffect } from "react"
import { ChapterHeader } from "@/components/ui/chapter-header"
import { NavButtons } from "@/components/ui/nav-buttons"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Target, Eye, Swords, Trash2, Plus, Save, Link2, Unlink, RefreshCw, Trophy, Gamepad2, Clock, ExternalLink, CheckCircle2, AlertCircle, Download } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChapterTrackerProps { onPrev: () => void }

interface Game {
  id: number; date: string; champ: string; result: "W" | "L"; enemy: string
  cs: number; deaths: number; kp: number; vision: number; duration: number
  dqs: number; notes: string; fromApi?: boolean; kills?: number; assists?: number
}

interface RiotAccount {
  gameName: string; tagLine: string; region: string; puuid?: string
  summonerLevel?: number; profileIconId?: number; rank?: string
  tier?: string; lp?: number; wins?: number; losses?: number
}

const STORAGE_KEY = "lol_kpi_games"
const ACCOUNT_KEY = "lol_riot_account"

function ddrImg(type: string, name: string) {
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/${type}/${name}.png`
}

const regions = [
  { value: "las", label: "LAS" }, { value: "lan", label: "LAN" },
  { value: "na", label: "NA" }, { value: "euw", label: "EUW" },
  { value: "eune", label: "EUNE" }, { value: "kr", label: "KR" }, { value: "br", label: "BR" },
]

const dqsLabels = ["Plan en 3:15", "Trackeo enemigo", "Gank 3+ verde", "Objetivo sin contest", "0 muertes evitables"]

const kpiDef: Record<string, { t: number; l: string; icon: any; inv?: boolean }> = {
  cs: { t: 5.5, l: "CS/min", icon: TrendingUp },
  deaths: { t: 5, l: "Muertes", icon: TrendingDown, inv: true },
  kp: { t: 50, l: "Kill Part.", icon: Swords },
  vision: { t: 0.8, l: "Vision/m", icon: Eye },
  dqs: { t: 65, l: "DQS", icon: Target },
}

function kCol(v: number, t: number, inv = false) {
  if (inv) return v <= t ? "text-emerald-400" : v <= t * 1.4 ? "text-yellow-400" : "text-red-400"
  return v >= t ? "text-emerald-400" : v >= t * 0.7 ? "text-yellow-400" : "text-red-400"
}

function rankCol(tier: string) {
  const c: Record<string, string> = {
    IRON: "text-neutral-400", BRONZE: "text-amber-600", SILVER: "text-slate-400",
    GOLD: "text-yellow-500", PLATINUM: "text-cyan-400", EMERALD: "text-emerald-400",
    DIAMOND: "text-blue-400", MASTER: "text-purple-400", GRANDMASTER: "text-red-400", CHALLENGER: "text-amber-300",
  }
  return c[tier] || "text-foreground"
}

export function ChapterTracker({ onPrev }: ChapterTrackerProps) {
  const [games, setGames] = useState<Game[]>([])
  const [showForm, setShowForm] = useState(false)
  const [fb, setFb] = useState<{ t: "s" | "e"; m: string } | null>(null)
  const [acct, setAcct] = useState<RiotAccount | null>(null)
  const [gn, setGn] = useState(""); const [tl, setTl] = useState(""); const [rg, setRg] = useState("las")
  const [busy, setBusy] = useState(false); const [importing, setImporting] = useState(false)
  const [champ, setChamp] = useState("Sylas"); const [result, setResult] = useState<"W" | "L">("W")
  const [enemy, setEnemy] = useState(""); const [cs, setCs] = useState(""); const [deaths, setDeaths] = useState("")
  const [kp, setKp] = useState(""); const [vision, setVision] = useState(""); const [dur, setDur] = useState("")
  const [notes, setNotes] = useState(""); const [dqs, setDqs] = useState<boolean[]>(new Array(5).fill(false))

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY); if (s) setGames(JSON.parse(s))
      const a = localStorage.getItem(ACCOUNT_KEY); if (a) setAcct(JSON.parse(a))
    } catch {}
  }, [])

  function flash(t: "s" | "e", m: string) { setFb({ t, m }); setTimeout(() => setFb(null), 4000) }

  async function connect() {
    if (!gn.trim() || !tl.trim()) { flash("e", "Ingresa nombre#tag"); return }
    setBusy(true)
    try {
      const r = await fetch(`/api/riot?action=account&gameName=${encodeURIComponent(gn.trim())}&tagLine=${encodeURIComponent(tl.trim())}&region=${rg}`)
      const d = await r.json()
      if (!r.ok || d.error) throw new Error(d.error || "Error de Riot API")
      setAcct(d); localStorage.setItem(ACCOUNT_KEY, JSON.stringify(d))
      flash("s", `Conectado: ${d.gameName}#${d.tagLine}`)
    } catch (e: any) { flash("e", e.message) } finally { setBusy(false) }
  }

  function disconnect() { setAcct(null); localStorage.removeItem(ACCOUNT_KEY); setGn(""); setTl(""); flash("s", "Desconectado") }

  async function refresh() {
    if (!acct) return; setBusy(true)
    try {
      const r = await fetch(`/api/riot?action=account&gameName=${encodeURIComponent(acct.gameName)}&tagLine=${encodeURIComponent(acct.tagLine)}&region=${acct.region}`)
      const d = await r.json(); if (!r.ok || d.error) throw new Error(d.error)
      setAcct(d); localStorage.setItem(ACCOUNT_KEY, JSON.stringify(d)); flash("s", "Actualizado")
    } catch (e: any) { flash("e", e.message) } finally { setBusy(false) }
  }

  async function importGames() {
    if (!acct?.puuid) return; setImporting(true)
    try {
      const r = await fetch(`/api/riot?action=matches&puuid=${acct.puuid}&region=${acct.region}&count=5`)
      const d = await r.json(); if (!r.ok || d.error) throw new Error(d.error)
      const imp: Game[] = (d.matches || []).map((m: any) => ({
        id: Date.now() + Math.random() * 10000, date: m.date, champ: m.champ, result: m.result,
        enemy: m.enemy, cs: m.cs, deaths: m.deaths, kp: m.kp, vision: m.vision, duration: m.duration,
        dqs: 0, notes: `${m.kills}/${m.deaths}/${m.assists}`, fromApi: true, kills: m.kills, assists: m.assists,
      }))
      const existing = new Set(games.map(g => `${g.date}-${g.champ}-${g.cs}`))
      const fresh = imp.filter(g => !existing.has(`${g.date}-${g.champ}-${g.cs}`))
      if (!fresh.length) { flash("e", "No hay partidas nuevas"); setImporting(false); return }
      const all = [...fresh, ...games]; setGames(all); localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
      flash("s", `${fresh.length} partidas importadas`)
    } catch (e: any) { flash("e", e.message) } finally { setImporting(false) }
  }

  function save() {
    const cv = parseFloat(cs), dv = parseInt(deaths), kv = parseInt(kp), vv = parseFloat(vision)
    if (isNaN(cv) || isNaN(dv) || isNaN(kv) || isNaN(vv)) { flash("e", "Llena los campos obligatorios"); return }
    const dqsVal = Math.round((dqs.filter(Boolean).length / 5) * 100)
    const g: Game = { id: Date.now(), date: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" }),
      champ, result, enemy: enemy || "—", cs: cv, deaths: dv, kp: kv, vision: vv, duration: parseInt(dur) || 0, dqs: dqsVal, notes }
    const ng = [g, ...games]; setGames(ng); localStorage.setItem(STORAGE_KEY, JSON.stringify(ng))
    setCs(""); setDeaths(""); setKp(""); setVision(""); setDur(""); setEnemy(""); setNotes(""); setDqs(new Array(5).fill(false))
    setShowForm(false); flash("s", `${champ} ${result} guardada`)
  }

  function del(id: number) { const ng = games.filter(g => g.id !== id); setGames(ng); localStorage.setItem(STORAGE_KEY, JSON.stringify(ng)) }

  function exp() {
    const b = new Blob([JSON.stringify(games, null, 2)], { type: "application/json" })
    const u = URL.createObjectURL(b); const a = document.createElement("a")
    a.href = u; a.download = `lol_kpi_${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(u)
  }

  const n = games.length, wins = games.filter(g => g.result === "W").length
  const wr = n > 0 ? Math.round((wins / n) * 100) : 0
  const avg = (k: string) => {
    if (n === 0) return 0
    if (k === "cs") return games.reduce((s, g) => s + g.cs, 0) / n
    if (k === "deaths") return games.reduce((s, g) => s + g.deaths, 0) / n
    if (k === "kp") return Math.round(games.reduce((s, g) => s + g.kp, 0) / n)
    if (k === "vision") return games.reduce((s, g) => s + g.vision, 0) / n
    const mg = games.filter(g => !g.fromApi); return mg.length > 0 ? Math.round(mg.reduce((s, g) => s + g.dqs, 0) / mg.length) : 0
  }

  return (
    <div>
      <ChapterHeader chapter={20} group="Herramientas" title={<>KPI <em className="text-primary font-serif italic">Tracker</em></>}
        tags={["Cuenta Riot", "Auto-import", "Tracking offline"]} />

      {fb && (
        <div className={cn("mb-4 p-3 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 flex items-center gap-2",
          fb.t === "s" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-red-500/10 border-red-500/25 text-red-400")}>
          {fb.t === "s" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {fb.m}
        </div>
      )}

      {/* CONNECTION */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Gamepad2 className="w-5 h-5 text-primary" /></div>
            <div><h3 className="font-semibold">Conexión Riot Games</h3><p className="text-xs text-muted-foreground">Importa partidas automáticamente</p></div>
          </div>
          {acct && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"><CheckCircle2 className="w-3 h-3 mr-1" />Conectado</Badge>}
        </div>

        {!acct ? (
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_80px_100px] gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                <Input value={gn} onChange={e => setGn(e.target.value)} placeholder="TuNombre" className="bg-secondary" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Tag</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">#</span>
                  <Input value={tl} onChange={e => setTl(e.target.value)} placeholder="LAS" className="pl-7 bg-secondary" /></div></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Región</label>
                <Select value={rg} onValueChange={setRg}><SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                  <SelectContent>{regions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <Button onClick={connect} disabled={busy} className="w-full gap-2">
              {busy ? <><RefreshCw className="w-4 h-4 animate-spin" />Conectando...</> : <><Link2 className="w-4 h-4" />Conectar cuenta</>}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">Necesitas RIOT_API_KEY en Vercel env vars. Saca una en developer.riotgames.com</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <Image src={ddrImg("profileicon", String(acct.profileIconId || 1))} alt="icon" width={56} height={56} className="rounded-lg border-2 border-primary/30" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-semibold">{acct.gameName}</span><span className="text-muted-foreground">#{acct.tagLine}</span>
                  <Badge variant="outline" className="text-[9px]">{acct.region.toUpperCase()}</Badge></div>
                {acct.tier && <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1"><Trophy className={cn("w-4 h-4", rankCol(acct.tier))} />
                    <span className={cn("font-semibold text-sm", rankCol(acct.tier))}>{acct.tier} {acct.rank}</span>
                    <span className="text-xs text-muted-foreground">{acct.lp} LP</span></div>
                  <span className="text-xs"><span className="text-emerald-400">{acct.wins}W</span> / <span className="text-red-400">{acct.losses}L</span></span>
                </div>}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={refresh} disabled={busy} className="gap-1"><RefreshCw className={cn("w-3 h-3", busy && "animate-spin")} />Actualizar</Button>
                <Button variant="ghost" size="sm" onClick={disconnect} className="gap-1 text-muted-foreground hover:text-red-400"><Unlink className="w-3 h-3" />Desconectar</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={importGames} disabled={importing} className="flex-1 gap-2">
                {importing ? <><RefreshCw className="w-4 h-4 animate-spin" />Importando...</> : <><Clock className="w-4 h-4" />Importar últimas 5 ranked</>}
              </Button>
              <Button variant="outline" asChild className="gap-2"><a href={`https://www.op.gg/summoners/${acct.region}/${acct.gameName}-${acct.tagLine}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />OP.GG</a></Button>
            </div>
          </div>
        )}
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {[{ l: "Partidas", v: n, c: "text-foreground" }, { l: "WR", v: n > 0 ? `${wr}%` : "—", c: n > 0 ? (wr >= 52 ? "text-emerald-400" : wr >= 48 ? "text-yellow-400" : "text-red-400") : "text-foreground" },
          { l: "CS/m", v: n > 0 ? avg("cs").toFixed(1) : "—", c: n > 0 ? kCol(avg("cs"), 5.5) : "text-foreground" },
          { l: "Deaths", v: n > 0 ? avg("deaths").toFixed(1) : "—", c: n > 0 ? kCol(avg("deaths"), 5, true) : "text-foreground" },
          { l: "KP", v: n > 0 ? `${avg("kp")}%` : "—", c: n > 0 ? kCol(avg("kp"), 50) : "text-foreground" },
          { l: "DQS", v: games.filter(g => !g.fromApi).length > 0 ? `${avg("dqs")}%` : "—", c: games.filter(g => !g.fromApi).length > 0 ? kCol(avg("dqs"), 65) : "text-foreground" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">{s.l}</div><div className={cn("text-xl font-bold", s.c)}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* KPI BARS */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-sm mb-3">Progreso vs targets</h3>
        <div className="space-y-3">
          {Object.entries(kpiDef).map(([k, d]) => {
            const v = avg(k), inv = d.inv || false
            const pct = n === 0 ? 0 : inv ? Math.max(0, Math.min(100, v <= d.t ? 100 : 100 - ((v - d.t) / d.t) * 100)) : Math.min(100, (v / d.t) * 100)
            return (<div key={k} className="flex items-center gap-3">
              <d.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground w-20">{d.l}</span>
              <Progress value={pct} className="flex-1 h-2" />
              <span className={cn("text-xs font-mono w-12 text-right", n > 0 ? kCol(v, d.t, inv) : "text-muted-foreground")}>
                {n > 0 ? (k === "kp" || k === "dqs" ? `${Math.round(v)}%` : v.toFixed(1)) : "—"}</span>
              <span className="text-[10px] text-muted-foreground w-14">{inv ? "<" : ">"}{d.t}{k === "kp" || k === "dqs" ? "%" : ""}</span>
            </div>)
          })}
        </div>
      </div>

      {/* ADD GAME */}
      {!showForm ? <Button onClick={() => setShowForm(true)} className="w-full mb-6 gap-2"><Plus className="w-4 h-4" />Registrar partida</Button> : (
        <div className="bg-card border border-border rounded-lg p-5 mb-6 animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold mb-4">Nueva partida</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div><label className="text-xs text-muted-foreground mb-1 block">Campeón</label>
              <Select value={champ} onValueChange={setChamp}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Sylas", "Viego", "Diana"].map(c => <SelectItem key={c} value={c}><div className="flex items-center gap-2"><Image src={ddrImg("champion", c)} alt={c} width={20} height={20} className="rounded" />{c}</div></SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Resultado</label>
              <Select value={result} onValueChange={v => setResult(v as "W" | "L")}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="W">Victoria</SelectItem><SelectItem value="L">Derrota</SelectItem></SelectContent></Select></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Jungla enemigo</label>
              <Input value={enemy} onChange={e => setEnemy(e.target.value)} placeholder="Lee Sin" /></div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{ l: "CS/min", v: cs, s: setCs, p: "5.5", st: "0.1" }, { l: "Muertes", v: deaths, s: setDeaths, p: "4" },
              { l: "KP %", v: kp, s: setKp, p: "55" }, { l: "Vision/m", v: vision, s: setVision, p: "0.8", st: "0.1" }].map((f, i) => (
              <div key={i}><label className="text-xs text-muted-foreground mb-1 block">{f.l} *</label>
                <Input type="number" step={f.st || "1"} value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} /></div>
            ))}
          </div>
          <div className="mb-4"><label className="text-xs text-muted-foreground mb-2 block">DQS</label>
            <div className="grid grid-cols-5 gap-2">{dqsLabels.map((l, i) => (
              <button key={i} onClick={() => { const c = [...dqs]; c[i] = !c[i]; setDqs(c) }}
                className={cn("p-2 rounded-lg border text-xs text-center transition-all",
                  dqs[i] ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-secondary border-border text-muted-foreground")}>{l}</button>
            ))}</div></div>
          <div className="mb-4"><label className="text-xs text-muted-foreground mb-1 block">Notas</label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="¿Qué aprendiste?" rows={2} /></div>
          <div className="flex gap-2"><Button onClick={save} className="gap-2 flex-1"><Save className="w-4 h-4" />Guardar</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button></div>
        </div>
      )}

      {/* HISTORY */}
      <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Historial</h3>
        {games.length > 0 && <Button variant="ghost" size="sm" onClick={exp} className="gap-1 text-xs"><Download className="w-3 h-3" />JSON</Button>}</div>
      {games.length === 0 ? <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">Sin partidas registradas.</div> : (
        <div className="space-y-2 mb-6">{games.slice(0, 20).map(g => (
          <div key={g.id} className={cn("flex items-center gap-3 p-3 rounded-lg border", g.result === "W" ? "bg-emerald-500/[0.03] border-emerald-500/20" : "bg-red-500/[0.03] border-red-500/20")}>
            <Image src={ddrImg("champion", g.champ)} alt={g.champ} width={32} height={32} className="rounded-lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge className={g.result === "W" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}>{g.result}</Badge>
                <span className="text-sm font-medium truncate">vs {g.enemy}</span><span className="text-xs text-muted-foreground">{g.date}</span>
                {g.fromApi && <Badge variant="outline" className="text-[9px] px-1">API</Badge>}</div>
              <div className="flex gap-4 mt-1 text-xs">
                <span className={kCol(g.cs, 5.5)}>CS:{g.cs}</span><span className={kCol(g.deaths, 5, true)}>{g.deaths}d</span>
                <span className={kCol(g.kp, 50)}>KP:{g.kp}%</span><span className={kCol(g.vision, 0.8)}>V:{g.vision}</span>
                {!g.fromApi && <span className={kCol(g.dqs, 65)}>DQS:{g.dqs}%</span>}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => del(g.id)} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}</div>
      )}
      <NavButtons onPrev={onPrev} />
    </div>
  )
}
