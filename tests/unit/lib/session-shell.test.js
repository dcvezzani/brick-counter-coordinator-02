import { describe, expect, it } from 'vitest'
import {
  SESSION_SHELL,
  isCoordinatorShell,
  isWorkerShell,
  resolveSessionShell,
} from '@/lib/session-shell.js'

describe('session-shell', () => {
  it('defaults to coordinator when meta is empty', () => {
    expect(resolveSessionShell({})).toBe(SESSION_SHELL.COORDINATOR)
  })

  it('returns worker when sessionShell is worker', () => {
    expect(resolveSessionShell({ sessionShell: 'worker' })).toBe(SESSION_SHELL.WORKER)
  })

  it('returns import when hideSessionNav is true', () => {
    expect(resolveSessionShell({ hideSessionNav: true })).toBe(SESSION_SHELL.IMPORT)
  })

  it('prefers import over explicit sessionShell when nav is hidden', () => {
    expect(
      resolveSessionShell({ hideSessionNav: true, sessionShell: 'coordinator' }),
    ).toBe(SESSION_SHELL.IMPORT)
  })

  it('uses worker shell on coordinator meta when effective profile is worker', () => {
    expect(
      resolveSessionShell({ sessionShell: 'coordinator' }, { effectiveProfile: 'worker' }),
    ).toBe(SESSION_SHELL.WORKER)
  })

  it('keeps coordinator shell when effective profile is coordinator', () => {
    expect(
      resolveSessionShell({ sessionShell: 'coordinator' }, { effectiveProfile: 'coordinator' }),
    ).toBe(SESSION_SHELL.COORDINATOR)
  })

  it('identifies worker and coordinator shells', () => {
    expect(isWorkerShell(SESSION_SHELL.WORKER)).toBe(true)
    expect(isWorkerShell(SESSION_SHELL.COORDINATOR)).toBe(false)
    expect(isCoordinatorShell(SESSION_SHELL.COORDINATOR)).toBe(true)
    expect(isCoordinatorShell(SESSION_SHELL.WORKER)).toBe(false)
  })
})
