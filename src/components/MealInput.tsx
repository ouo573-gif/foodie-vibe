import { useState } from 'react'
import type { FoodAnalysisResult } from '../types'
import { getFoodAnalysis } from '../services/getFoodAnalysis'

const MOODS: { char: string; label: string }[] = [
  { char: '喜', label: '喜悅' },
  { char: '平', label: '平靜' },
  { char: '累', label: '疲累' },
  { char: '怒', label: '煩躁' },
  { char: '愁', label: '惆悵' },
]

interface MealInputProps {
  onResult: (result: FoodAnalysisResult, mood: string) => void
  lastEntryJson?: string | null
}

export default function MealInput({ onResult, lastEntryJson }: MealInputProps) {
  const [input, setInput] = useState('')
  const [selectedMood, setSelectedMood] = useState('喜')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!input.trim()) {
      setError('請輸入今日飲食')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await getFoodAnalysis(input.trim(), selectedMood, lastEntryJson)
      onResult(result, selectedMood)
      setInput('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-almanac m-4">
      <div style={{ fontSize: '15px', color: 'var(--color-inkwash)', letterSpacing: '0.12em', marginBottom: '12px', fontWeight: 600 }}>
        記錄今日飲食
      </div>

      <input
        type="text"
        value={input}
        onChange={e => { setInput(e.target.value); setError('') }}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="輸入今日飲食，例：排骨便當"
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontFamily: 'var(--font-serif)',
          fontSize: '17px',
          color: 'var(--color-ink)',
          background: 'var(--color-parchment)',
          border: '2px solid var(--color-ink)',
          borderRadius: 0,
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: '4px',
        }}
      />
      {error && (
        <div style={{ fontSize: '14px', color: 'var(--color-vermillion)', marginBottom: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', margin: '14px 0', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: 'var(--color-inkwash)', letterSpacing: '0.1em' }}>今日心情</span>
        {MOODS.map(({ char, label }) => (
          <button
            key={char}
            onClick={() => setSelectedMood(char)}
            title={label}
            style={{
              width: '36px',
              height: '36px',
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: 0,
              background: selectedMood === char ? 'var(--color-vermillion)' : 'transparent',
              color: selectedMood === char ? 'var(--color-parchment)' : 'var(--color-ink)',
              border: selectedMood === char
                ? '2px solid var(--color-vermillion)'
                : '2px solid var(--color-ink)',
              cursor: 'pointer',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {char}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          fontFamily: 'var(--font-serif)',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'var(--color-parchment)',
          background: loading ? 'var(--color-inkwash)' : 'var(--color-vermillion)',
          border: 'none',
          borderRadius: 0,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {loading ? '分析中…' : '請示轉運圖鑑'}
      </button>
    </div>
  )
}
