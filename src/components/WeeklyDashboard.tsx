import type { MealEntry, Quadrant } from '../types'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  ReferenceLine, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const QUADRANT_LABELS: Record<Quadrant, string> = {
  'great': '大吉大利',
  'necessary-evil': '必要之惡',
  'ascetic': '苦行僧',
  'karma-debt': '業障深重',
}

const QUADRANT_COLORS: Record<Quadrant, string> = {
  'great': '#2d5a27',
  'necessary-evil': '#8e706d',
  'ascetic': '#5f5e5e',
  'karma-debt': '#b22222',
}

const QUADRANT_SHORT: Record<Quadrant, string> = {
  'great': '大吉',
  'necessary-evil': '必要',
  'ascetic': '苦行',
  'karma-debt': '業障',
}

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

interface WeeklyDashboardProps {
  entries: MealEntry[]
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function getDominantQuadrant(dayEntries: MealEntry[]): Quadrant | null {
  if (dayEntries.length === 0) return null
  const freq: Partial<Record<Quadrant, number>> = {}
  for (const e of dayEntries) {
    freq[e.result.quadrant] = (freq[e.result.quadrant] ?? 0) + 1
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] as Quadrant
}

export default function WeeklyDashboard({ entries }: WeeklyDashboardProps) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekEntries = entries.filter(e => e.timestamp >= sevenDaysAgo)

  // Build 7-day drama grid: today in slot 3 (0-indexed), ±3 days
  const today = new Date()
  const todayKey = getDayKey(today)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 3 + i)
    return d
  })

  const entryMap: Record<string, MealEntry[]> = {}
  for (const e of entries) {
    const k = getDayKey(new Date(e.timestamp))
    if (!entryMap[k]) entryMap[k] = []
    entryMap[k].push(e)
  }

  const scatterData = weekEntries.map(e => ({
    x: e.result.physicalScore,
    y: e.result.mentalScore,
    quadrant: e.result.quadrant,
    label: e.rawInput,
  }))

  return (
    <div style={{ padding: '16px' }}>
      {/* 七日食戲連演 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '12px', textAlign: 'center' }}>
          ── 七日食戲連演 ──
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {days.map((d, i) => {
            const key = getDayKey(d)
            const isToday = key === todayKey
            const isPast = d < today && !isToday
            const isFuture = d > today
            const dayEntries = entryMap[key] ?? []
            const dominant = getDominantQuadrant(dayEntries)
            const hasEntries = dayEntries.length > 0

            let theme = '─'
            let status = '【預告】'
            let statusColor = 'var(--color-outline)'
            let cardBg = 'transparent'
            let cardBorder = '1px solid var(--color-outline)'
            let textColor = 'var(--color-ink)'

            if (isToday) {
              if (hasEntries && dominant) {
                theme = QUADRANT_SHORT[dominant]
                status = '【今日】'
              } else {
                theme = '待定'
                status = '【今日】'
              }
              cardBg = 'var(--color-vermillion)'
              cardBorder = '3px double var(--color-parchment)'
              textColor = 'var(--color-parchment)'
              statusColor = 'rgba(255,248,247,0.8)'
            } else if (isPast) {
              if (hasEntries && dominant) {
                theme = QUADRANT_SHORT[dominant]
                status = '【有演】'
                statusColor = QUADRANT_COLORS[dominant]
              } else {
                theme = '無'
                status = '【休演】'
                statusColor = 'var(--color-outline)'
                cardBorder = '1px solid var(--color-outline)'
                textColor = 'var(--color-outline)'
              }
            } else {
              // future
              textColor = 'var(--color-outline)'
            }

            return (
              <div
                key={i}
                style={{
                  background: cardBg,
                  border: cardBorder,
                  padding: '6px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: isToday ? 'rgba(255,248,247,0.7)' : 'var(--color-inkwash)', letterSpacing: '0.05em' }}>
                  {DAY_NAMES[d.getDay()]}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textColor, fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
                  {theme}
                </div>
                <div style={{ fontSize: '10px', color: statusColor, letterSpacing: '0.05em' }}>
                  {status}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {weekEntries.length === 0 ? (
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--color-inkwash)', lineHeight: 1.8, letterSpacing: '0.1em' }}>
            本週尚無紀錄<br />請開始記錄您的飲食轉運之路
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '15px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
            ── 本週運勢報告 ──
          </div>

          <div className="card-almanac" style={{ marginBottom: '16px', padding: '12px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, fontSize: '12px', color: '#2d5a27', zIndex: 1, letterSpacing: '0.05em' }}>大吉大利</div>
              <div style={{ position: 'absolute', top: 8, left: 8, fontSize: '12px', color: 'var(--color-inkwash)', zIndex: 1, letterSpacing: '0.05em' }}>苦行僧</div>
              <div style={{ position: 'absolute', bottom: 24, right: 8, fontSize: '12px', color: 'var(--color-inkwash)', zIndex: 1, letterSpacing: '0.05em' }}>必要之惡</div>
              <div style={{ position: 'absolute', bottom: 24, left: 8, fontSize: '12px', color: '#b22222', zIndex: 1, letterSpacing: '0.05em' }}>業障深重</div>

              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--color-outline)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[-100, 100]}
                    tick={{ fontSize: 10, fontFamily: 'var(--font-serif)', fill: 'var(--color-inkwash)' }}
                    label={{ value: '生理財富值', position: 'insideBottom', offset: -8, fontSize: 10, fill: 'var(--color-inkwash)', fontFamily: 'var(--font-serif)' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[-100, 100]}
                    tick={{ fontSize: 10, fontFamily: 'var(--font-serif)', fill: 'var(--color-inkwash)' }}
                    label={{ value: '心理功德值', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--color-inkwash)', fontFamily: 'var(--font-serif)' }}
                  />
                  <ReferenceLine x={0} stroke="var(--color-ink)" strokeWidth={1.5} />
                  <ReferenceLine y={0} stroke="var(--color-ink)" strokeWidth={1.5} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null
                      const d = payload[0]?.payload
                      return (
                        <div style={{ background: 'var(--color-parchment)', border: '2px solid var(--color-ink)', padding: '6px 10px', fontFamily: 'var(--font-serif)', fontSize: '11px' }}>
                          <div style={{ fontWeight: 700 }}>{d.label}</div>
                          <div style={{ color: 'var(--color-inkwash)' }}>{QUADRANT_LABELS[d.quadrant as Quadrant]}</div>
                        </div>
                      )
                    }}
                  />
                  <Scatter data={scatterData} r={6}>
                    {scatterData.map((entry, i) => (
                      <Cell key={i} fill={QUADRANT_COLORS[entry.quadrant as Quadrant]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-almanac" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-ink)' }}>{weekEntries.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.1em' }}>本週紀錄</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: weekEntries.filter(e => e.result.quadrant === 'karma-debt').length > 0 ? 'var(--color-vermillion)' : 'var(--color-fortune-green)' }}>
                {weekEntries.filter(e => e.result.quadrant === 'karma-debt').length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.1em' }}>業障深重</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-fortune-green)' }}>
                {weekEntries.filter(e => e.result.quadrant === 'great').length}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.1em' }}>大吉大利</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
