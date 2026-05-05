import type { Quadrant } from '../types'

export function useQuadrantState(physicalScore: number, mentalScore: number): Quadrant {
  if (physicalScore >= 0 && mentalScore >= 0) return 'great'
  if (physicalScore < 0 && mentalScore >= 0) return 'necessary-evil'
  if (physicalScore >= 0 && mentalScore < 0) return 'ascetic'
  return 'karma-debt'
}

export function determineQuadrant(physicalScore: number, mentalScore: number): Quadrant {
  return useQuadrantState(physicalScore, mentalScore)
}
