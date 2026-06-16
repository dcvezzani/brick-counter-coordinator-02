import { describe, expect, it } from 'vitest'
import {
  COORDINATOR_STEPS,
  progressStepsForProfile,
  WORKER_STEPS,
} from '@/lib/session-progress-model.js'

describe('session-progress-model', () => {
  it('returns full coordinator steps unchanged', () => {
    expect(progressStepsForProfile('coordinator', 'counting')).toEqual(COORDINATOR_STEPS)
    expect(progressStepsForProfile('coordinator', 'organizing')).toEqual(COORDINATOR_STEPS)
  })

  it('shows only Count for worker during counting phase', () => {
    expect(progressStepsForProfile('worker', 'counting')).toEqual([
      { phase: 'counting', label: 'Count' },
    ])
  })

  it('shows Count and Organize for worker once organizing starts', () => {
    expect(progressStepsForProfile('worker', 'organizing')).toEqual([
      { phase: 'counting', label: 'Count' },
      { phase: 'organizing', label: 'Organize' },
    ])
  })

  it('includes Done for worker when session is closed', () => {
    expect(progressStepsForProfile('worker', 'closed')).toEqual(WORKER_STEPS)
  })
})
