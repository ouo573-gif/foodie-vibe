import type { ActiveTab } from '../types'

interface TabNavProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div
      style={{
        borderTop: '3px double var(--color-ink)',
        display: 'flex',
        fontFamily: 'var(--font-serif)',
        backgroundColor: 'var(--color-parchment)',
      }}
    >
      {(['journal', 'dashboard'] as ActiveTab[]).map(tab => {
        const label = tab === 'journal' ? '日記' : '本週報告'
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              fontWeight: isActive ? 700 : 400,
              color: isActive ? 'var(--color-vermillion)' : 'var(--color-inkwash)',
              background: 'none',
              border: 'none',
              borderTop: isActive ? '3px solid var(--color-vermillion)' : '3px solid transparent',
              marginTop: '-3px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
