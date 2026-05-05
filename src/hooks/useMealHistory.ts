import { useState, useEffect } from 'react'
import type { MealEntry } from '../types'
import { MOCK_HISTORY } from '../data/mockData'

const STORAGE_KEY = 'foodie-vibe-entries'

const EMOJI_TO_MOOD: Record<string, string> = {
  '😊': '喜', '😐': '平', '😫': '累', '😤': '怒', '🥲': '愁',
}

function migrateMoods(entries: MealEntry[]): MealEntry[] {
  return entries.map(e => ({
    ...e,
    mood: EMOJI_TO_MOOD[e.mood] ?? e.mood,
  }))
}

export function useMealHistory() {
  const [entries, setEntries] = useState<MealEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as MealEntry[]
        if (Array.isArray(parsed) && parsed.length > 0) return migrateMoods(parsed)
      }
    } catch {
      // ignore
    }
    return MOCK_HISTORY
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // ignore storage errors
    }
  }, [entries])

  function addEntry(entry: MealEntry) {
    setEntries(prev => [entry, ...prev])
  }

  function getLastEntryJson(): string | null {
    if (entries.length === 0) return null
    return JSON.stringify(entries[0])
  }

  return { entries, addEntry, getLastEntryJson }
}
