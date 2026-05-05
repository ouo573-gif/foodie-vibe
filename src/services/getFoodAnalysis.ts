import type { FoodAnalysisResult } from '../types'
import { MOCK_FOOD_DB } from '../data/mockData'
import { determineQuadrant } from '../hooks/useQuadrantState'

const MOOD_SCORES: Record<string, number> = {
  '喜': 40,
  '平': 0,
  '累': -40,
  '怒': -30,
  '愁': -20,
}

const CLASH_RULES: { trigger: string[]; with: string[]; warning: string }[] = [
  {
    trigger: ['單寧酸', '鞣酸'],
    with: ['鐵質', '非血基質鐵'],
    warning: '單寧酸與鐵質相剋，植物性鐵質吸收率降低70%',
  },
  {
    trigger: ['酒精殘留', '酒精'],
    with: ['動物脂肪', '精製澱粉'],
    warning: '酒精加上油脂深夜代謝，肝臟負擔倍增，明日恐有水腫',
  },
  {
    trigger: ['咖啡因'],
    with: ['鐵質', '非血基質鐵'],
    warning: '咖啡因抑制鐵質吸收，建議間隔2小時以上',
  },
]

function isLateNight(): boolean {
  const hour = new Date().getHours()
  return hour >= 22 || hour < 5
}

function detectClash(currentChemicals: string[], lastEntryJson: string | null): string | undefined {
  if (!lastEntryJson) return undefined

  try {
    const lastEntry = JSON.parse(lastEntryJson)
    const lastTimestamp: number = lastEntry.timestamp
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    if (lastTimestamp < twoHoursAgo) return undefined

    const lastChemicals: string[] = lastEntry.result?.components?.flatMap(
      (c: { chemicals: string[] }) => c.chemicals
    ) ?? []

    for (const rule of CLASH_RULES) {
      const triggerInLast = rule.trigger.some(t => lastChemicals.includes(t))
      const targetInCurrent = rule.with.some(w => currentChemicals.includes(w))
      if (triggerInLast && targetInCurrent) return rule.warning

      const triggerInCurrent = rule.trigger.some(t => currentChemicals.includes(t))
      const targetInLast = rule.with.some(w => lastChemicals.includes(w))
      if (triggerInCurrent && targetInLast) return rule.warning
    }
  } catch {
    // ignore parse errors
  }
  return undefined
}

export async function getFoodAnalysis(
  input: string,
  moodEmoji: string,
  lastEntryJson?: string | null
): Promise<FoodAnalysisResult> {
  const delay = 300 + Math.random() * 500
  await new Promise(resolve => setTimeout(resolve, delay))

  const normalizedInput = input.trim()
  const mockEntry = MOCK_FOOD_DB[normalizedInput]
  const emojiScore = MOOD_SCORES[moodEmoji] ?? 0

  if (!mockEntry) {
    const mentalScore = Math.max(-100, Math.min(100, emojiScore))
    const physicalScore = 0
    return {
      rawInput: normalizedInput,
      components: [{ name: normalizedInput, chemicals: ['成分未知'] }],
      physicalScore,
      mentalScore,
      quadrant: determineQuadrant(physicalScore, mentalScore),
      charm: {
        title: '神祕之食，待解之謎',
        poem: '神祕之食難辨吉凶\n心情決定今日功德\n萬物皆可為良藥\n關鍵在乎食用之心',
        remediation: '建議記錄食材細節 · 下次嘗試輸入具體食物名稱',
      },
    }
  }

  const basePhysical = mockEntry.components.reduce((sum, c) => sum + c.physicalImpact, 0)
  const lateNightPenalty = isLateNight() ? -20 : 0
  const physicalScore = Math.max(-100, Math.min(100, basePhysical + lateNightPenalty))
  const mentalScore = Math.max(-100, Math.min(100, emojiScore + mockEntry.mentalModifier))
  const quadrant = determineQuadrant(physicalScore, mentalScore)

  const allChemicals = mockEntry.components.flatMap(c => c.chemicals)
  const clashWarning = detectClash(allChemicals, lastEntryJson ?? null)

  return {
    rawInput: normalizedInput,
    components: mockEntry.components.map(c => ({ name: c.name, chemicals: c.chemicals })),
    physicalScore,
    mentalScore,
    clashWarning,
    quadrant,
    charm: mockEntry.charm,
  }
}
