import { useState } from 'react'
import type { ActiveTab, FoodAnalysisResult, MealEntry } from './types'
import ThreeColumnLayout from './components/ThreeColumnLayout'
import AlmanacHeader from './components/AlmanacHeader'
import TabNav from './components/TabNav'
import MealInput from './components/MealInput'
import AlmanacCard from './components/AlmanacCard'
import HistoryFeed from './components/HistoryFeed'
import FortuneCharm from './components/FortuneCharm'
import WeeklyDashboard from './components/WeeklyDashboard'
import { useMealHistory } from './hooks/useMealHistory'

function generateId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('journal')
  const [latestResult, setLatestResult] = useState<FoodAnalysisResult | null>(null)
  const [charmVisible, setCharmVisible] = useState(false)
  const { entries, addEntry, getLastEntryJson } = useMealHistory()

  function handleResult(result: FoodAnalysisResult, mood: string) {
    const newEntry: MealEntry = {
      id: generateId(),
      timestamp: Date.now(),
      rawInput: result.rawInput,
      mood,
      result,
    }
    addEntry(newEntry)
    setLatestResult(result)

    if (result.quadrant === 'karma-debt') {
      const charmKey = `charm-shown-${newEntry.id}`
      const alreadyShown = localStorage.getItem(charmKey)
      if (!alreadyShown) {
        setCharmVisible(true)
        localStorage.setItem(charmKey, '1')
      }
    }
  }

  const mainContent = activeTab === 'journal' ? (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <MealInput onResult={handleResult} lastEntryJson={getLastEntryJson()} />
      {latestResult && <AlmanacCard result={latestResult} />}
    </div>
  ) : (
    <WeeklyDashboard entries={entries} />
  )

  return (
    <>
      <ThreeColumnLayout
        left={<AlmanacHeader entries={entries} />}
        main={mainContent}
        right={<HistoryFeed entries={entries} />}
        bottom={<TabNav activeTab={activeTab} onTabChange={setActiveTab} />}
      />

      {latestResult && (
        <FortuneCharm
          charm={latestResult.charm}
          visible={charmVisible}
          onDismiss={() => setCharmVisible(false)}
        />
      )}
    </>
  )
}
