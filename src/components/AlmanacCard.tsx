import type { FoodAnalysisResult, Quadrant } from '../types'

const QUADRANT_LABELS: Record<Quadrant, string> = {
  'great': '大吉大利',
  'necessary-evil': '必要之惡',
  'ascetic': '苦行僧',
  'karma-debt': '業障深重',
}

interface AlmanacCardProps {
  result: FoodAnalysisResult
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const pct = Math.round(((score + 100) / 200) * 100)
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-inkwash)', marginBottom: '4px' }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{score >= 0 ? '+' : ''}{score}</span>
      </div>
      <div style={{ height: '7px', background: 'var(--color-outline)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--color-inkwash)' }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: score >= 0 ? '50%' : `${pct}%`,
            width: score >= 0 ? `${pct - 50}%` : `${50 - pct}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}

export default function AlmanacCard({ result }: AlmanacCardProps) {
  return (
    <div className="card-almanac" style={{ margin: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 食物名稱 + 象限 badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-outline)', paddingBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', marginBottom: '4px' }}>今日飲食</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)' }}>{result.rawInput}</div>
        </div>
        <span className={`badge-${result.quadrant}`}>
          {QUADRANT_LABELS[result.quadrant]}
        </span>
      </div>

      {/* Layer 1：食物化學拆解（Annotation）*/}
      <div>
        <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', marginBottom: '8px' }}>
          ── 食物成分解析 ──
        </div>
        {result.components.map((comp, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-ink)' }}>{comp.name}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
              {comp.chemicals.map(chem => (
                <span
                  key={chem}
                  style={{
                    fontSize: '12px',
                    padding: '2px 7px',
                    background: 'var(--color-parchment-dim)',
                    color: 'var(--color-inkwash)',
                    border: '1px solid var(--color-outline)',
                  }}
                >
                  {chem}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Layer 2：分數條 + 相剋警示 */}
      <div>
        <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', marginBottom: '8px' }}>
          ── 生理財富 ＆ 心理功德 ──
        </div>
        <ScoreBar label="生理財富值" score={result.physicalScore} color={result.physicalScore >= 0 ? 'var(--color-fortune-green)' : 'var(--color-vermillion)'} />
        <ScoreBar label="心理功德值" score={result.mentalScore} color={result.mentalScore >= 0 ? 'var(--color-fortune-green)' : 'var(--color-vermillion)'} />

        {result.clashWarning ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '10px', padding: '10px', border: '1px solid var(--color-vermillion-light)', background: 'rgba(178,34,34,0.04)' }}>
            <span className="label-ji">忌</span>
            <span style={{ fontSize: '14px', color: 'var(--color-vermillion)', lineHeight: 1.6 }}>{result.clashWarning}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px', padding: '10px', border: '1px solid var(--color-fortune-green)', background: 'rgba(45,90,39,0.04)' }}>
            <span className="label-yi">宜</span>
            <span style={{ fontSize: '14px', color: 'var(--color-fortune-green)' }}>無相剋食物，平安過關</span>
          </div>
        )}
      </div>

      {/* Layer 3：轉運籤詩 + 轉運建議 */}
      <div style={{ borderTop: '1px solid var(--color-outline)', paddingTop: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--color-inkwash)', letterSpacing: '0.15em', marginBottom: '8px' }}>
          ── 今日轉運籤詩 ──
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-vermillion)', letterSpacing: '0.1em', marginBottom: '10px' }}>
          {result.charm.title}
        </div>
        <div style={{ fontSize: '15px', lineHeight: 2, color: 'var(--color-ink)', whiteSpace: 'pre-line', marginBottom: '12px', letterSpacing: '0.05em' }}>
          {result.charm.poem}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--color-inkwash)', lineHeight: 1.9, letterSpacing: '0.05em' }}>
          {result.charm.remediation.split(' · ').map((item, i) => (
            <div key={i}>・{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
