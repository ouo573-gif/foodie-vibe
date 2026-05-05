export type Quadrant = 'great' | 'necessary-evil' | 'ascetic' | 'karma-debt'

export interface FoodComponent {
  name: string
  chemicals: string[]
}

export interface FoodCharm {
  title: string
  poem: string
  remediation: string
}

export interface FoodAnalysisResult {
  rawInput: string
  components: FoodComponent[]
  physicalScore: number
  mentalScore: number
  clashWarning?: string
  quadrant: Quadrant
  charm: FoodCharm
}

export interface MealEntry {
  id: string
  timestamp: number
  rawInput: string
  mood: string
  result: FoodAnalysisResult
}

export type ActiveTab = 'journal' | 'dashboard'
