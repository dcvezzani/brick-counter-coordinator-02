import { getSession } from '@/lib/storyboard-session.js'

export const COMPLETION_TOAST_DURATION_MS = 8000

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

let pendingCelebration = null

export function buildSessionCompletionSummary(sessionId) {
  const session = getSession(sessionId)
  if (!session) {
    return null
  }

  const lots = session.lots ?? []
  const totalPieces = lots.reduce((sum, lot) => sum + (lot.quantity ?? 0), 0)

  return {
    setNumber: session.setNumber,
    lotCount: lots.length,
    totalPieces,
    avgPartOutValueUsd: session.avgPartOutValueUsd ?? 0,
  }
}

export function formatCelebrationMessage(summary) {
  const formattedValue = currencyFormatter.format(summary.avgPartOutValueUsd)
  return `🎉 Set ${summary.setNumber} complete! ${summary.lotCount} lots · ${summary.totalPieces} pieces · avg part-out value ${formattedValue}`
}

export function stageCompletionCelebration(summary) {
  pendingCelebration = summary
}

export function consumeCompletionCelebration() {
  const summary = pendingCelebration
  pendingCelebration = null
  return summary
}

export function __resetCompletionCelebrationForTests() {
  pendingCelebration = null
}
