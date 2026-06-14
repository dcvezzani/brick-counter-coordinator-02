import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetCompletionCelebrationForTests,
  buildSessionCompletionSummary,
  consumeCompletionCelebration,
  formatCelebrationMessage,
  stageCompletionCelebration,
} from './completion-celebration.js'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
} from '@/lib/storyboard-session.js'

describe('completion-celebration', () => {
  beforeEach(() => {
    __resetSessionsForTests()
    __resetCompletionCelebrationForTests()
  })

  it('buildSessionCompletionSummary returns null when session is missing', () => {
    expect(buildSessionCompletionSummary('missing')).toBeNull()
  })

  it('buildSessionCompletionSummary aggregates demo session stats', () => {
    createDemoSession()

    expect(buildSessionCompletionSummary(DEMO_SESSION_ID)).toEqual({
      setNumber: '10281',
      lotCount: 3,
      totalPieces: 21,
      avgPartOutValueUsd: 127.5,
    })
  })

  it('formatCelebrationMessage includes formatted currency', () => {
    const message = formatCelebrationMessage({
      setNumber: '10281',
      lotCount: 3,
      totalPieces: 21,
      avgPartOutValueUsd: 127.5,
    })

    expect(message).toBe(
      '🎉 Set 10281 complete! 3 lots · 21 pieces · avg part-out value $127.50',
    )
  })

  it('stage and consume celebration summary once', () => {
    const summary = {
      setNumber: '10281',
      lotCount: 3,
      totalPieces: 21,
      avgPartOutValueUsd: 127.5,
    }

    stageCompletionCelebration(summary)
    expect(consumeCompletionCelebration()).toEqual(summary)
    expect(consumeCompletionCelebration()).toBeNull()
  })
})
