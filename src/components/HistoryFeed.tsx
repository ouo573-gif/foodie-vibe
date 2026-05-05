import type { MealEntry, Quadrant } from '../types'

const QUADRANT_LABELS: Record<Quadrant, string> = {
  'great': '大吉大利',
  'necessary-evil': '必要之惡',
  'ascetic': '苦行僧',
  'karma-debt': '業障深重',
}

const MOOD_COLORS: Record<string, string> = {
  '喜': 'var(--color-fortune-green)',
  '平': 'var(--color-inkwash)',
  '累': 'var(--color-inkwash)',
  '怒': 'var(--color-vermillion)',
  '愁': 'var(--color-vermillion-light)',
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface HistoryFeedProps {
  entries: MealEntry[]
}

export default function HistoryFeed({ entries }: HistoryFeedProps) {
  if (entries.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-inkwash)', fontSize: '13px' }}>
        尚無記錄
      </div>
    )
  }

  return (
    <div style={{ padding: '0 12px 12px' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '6px', borderBottom: '1px solid var(--color-outline)', paddingBottom: '5px' }}>
        ── 記錄歷史 ──
      </div>
      {entries.map(entry => (
        <div
          key={entry.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 0',
            borderBottom: '1px solid var(--color-outline)',
            fontSize: '14px',
          }}
        >
          <span style={{
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: '13px',
            fontWeight: 700,
            border: `2px solid ${MOOD_COLORS[entry.mood] ?? 'var(--color-inkwash)'}`,
            color: MOOD_COLORS[entry.mood] ?? 'var(--color-inkwash)',
            flexShrink: 0,
          }}>{entry.mood}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px' }}>
              {entry.rawInput}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-inkwash)' }}>{formatTime(entry.timestamp)}</div>
          </div>
          <span className={`badge-${entry.result.quadrant}`} style={{ flexShrink: 0, fontSize: '11px' }}>
            {QUADRANT_LABELS[entry.result.quadrant]}
          </span>
        </div>
      ))}
    </div>
  )
}
