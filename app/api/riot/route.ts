import { NextRequest, NextResponse } from "next/server"

const RIOT_API_KEY = process.env.RIOT_API_KEY || ""

const REGION_TO_PLATFORM: Record<string, string> = {
  las: "la2",
  lan: "la1",
  na: "na1",
  euw: "euw1",
  eune: "eun1",
  kr: "kr",
  br: "br1",
  tr: "tr1",
  jp: "jp1",
  oce: "oc1",
}

const REGION_TO_ROUTING: Record<string, string> = {
  las: "americas",
  lan: "americas",
  na: "americas",
  br: "americas",
  euw: "europe",
  eune: "europe",
  tr: "europe",
  kr: "asia",
  jp: "asia",
  oce: "sea",
}

async function riotFetch(url: string) {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": RIOT_API_KEY },
    next: { revalidate: 120 },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Riot API ${res.status}: ${text}`)
  }
  return res.json()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")
  const gameName = searchParams.get("gameName")
  const tagLine = searchParams.get("tagLine")
  const region = searchParams.get("region") || "las"

  if (!RIOT_API_KEY) {
    return NextResponse.json(
      { error: "RIOT_API_KEY not configured. Add it in Vercel Environment Variables." },
      { status: 500 }
    )
  }

  const platform = REGION_TO_PLATFORM[region] || "la2"
  const routing = REGION_TO_ROUTING[region] || "americas"

  try {
    // === CONNECT: Get account by Riot ID ===
    if (action === "account") {
      if (!gameName || !tagLine) {
        return NextResponse.json({ error: "gameName and tagLine required" }, { status: 400 })
      }

      // 1. Get PUUID from Riot ID
      const account = await riotFetch(
        `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      )

      // 2. Get summoner data
      const summoner = await riotFetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`
      )

      // 3. Get ranked data
      const ranked = await riotFetch(
        `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`
      )

      const soloQ = ranked.find((e: any) => e.queueType === "RANKED_SOLO_5x5")

      return NextResponse.json({
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        region,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
        tier: soloQ?.tier || null,
        rank: soloQ?.rank || null,
        lp: soloQ?.leaguePoints || 0,
        wins: soloQ?.wins || 0,
        losses: soloQ?.losses || 0,
      })
    }

    // === MATCHES: Get recent match IDs ===
    if (action === "matches") {
      const puuid = searchParams.get("puuid")
      const count = searchParams.get("count") || "5"

      if (!puuid) {
        return NextResponse.json({ error: "puuid required" }, { status: 400 })
      }

      // Get match IDs (queue 420 = solo/duo ranked)
      const matchIds = await riotFetch(
        `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&count=${count}`
      )

      // Fetch each match detail
      const matches = await Promise.all(
        matchIds.map(async (matchId: string) => {
          try {
            const match = await riotFetch(
              `https://${routing}.api.riotgames.com/lol/match/v5/matches/${matchId}`
            )
            const participant = match.info.participants.find(
              (p: any) => p.puuid === puuid
            )
            if (!participant) return null

            const gameDurationMin = match.info.gameDuration / 60
            const totalCs = participant.totalMinionsKilled + participant.neutralMinionsKilled
            const csPerMin = gameDurationMin > 0 ? parseFloat((totalCs / gameDurationMin).toFixed(1)) : 0
            const totalKills = match.info.participants
              .filter((p: any) => p.teamId === participant.teamId)
              .reduce((s: number, p: any) => s + p.kills, 0)
            const kp = totalKills > 0
              ? Math.round(((participant.kills + participant.assists) / totalKills) * 100)
              : 0
            const visionPerMin = gameDurationMin > 0
              ? parseFloat((participant.visionScore / gameDurationMin).toFixed(1))
              : 0

            return {
              matchId,
              champ: participant.championName,
              result: participant.win ? "W" : "L",
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              cs: csPerMin,
              kp,
              vision: visionPerMin,
              duration: Math.round(gameDurationMin),
              enemy: match.info.participants.find(
                (p: any) => p.teamId !== participant.teamId && p.teamPosition === "JUNGLE"
              )?.championName || "—",
              date: new Date(match.info.gameCreation).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              }),
            }
          } catch {
            return null
          }
        })
      )

      return NextResponse.json({ matches: matches.filter(Boolean) })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Riot API error" },
      { status: 500 }
    )
  }
}
