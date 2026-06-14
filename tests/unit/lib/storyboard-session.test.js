import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  landingRouteLocation,
  landingRouteName,
  markSessionComplete,
  resolveReconciliationRow,
  returnToReconciling,
  sessionNavModel,
  setPhase,
  toggleOrganizerLineFlag,
} from '@/lib/storyboard-session.js'

describe('storyboard-session', () => {
  beforeEach(() => {
    __resetSessionsForTests()
  })

  it('creates demo session at importing phase', () => {
    const session = createDemoSession({ setNumber: '12345' })
    expect(session.id).toBe(DEMO_SESSION_ID)
    expect(session.phase).toBe('importing')
    expect(session.setNumber).toBe('12345')
    expect(getSession(DEMO_SESSION_ID)?.setNumber).toBe('12345')
  })

  it('maps phases to landing routes', () => {
    expect(landingRouteName(DEMO_SESSION_ID, 'counting')).toBe('session-lot')
    expect(landingRouteName(DEMO_SESSION_ID, 'organizing')).toBe('session-lots-organizer')
    expect(landingRouteLocation(DEMO_SESSION_ID, 'organizing')).toEqual({
      name: 'session-lots',
      params: { sessionId: DEMO_SESSION_ID },
      query: { mode: 'organizer' },
    })
  })

  it('hides Cups nav in updating_inventory', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'updating_inventory')
    const nav = sessionNavModel(DEMO_SESSION_ID)
    expect(nav.items.map((item) => item.key)).toEqual(['home', 'lot', 'lots', 'reconcile'])
  })

  it('shows Cups nav during counting', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'counting')
    const nav = sessionNavModel(DEMO_SESSION_ID)
    expect(nav.items.map((item) => item.key)).toContain('cups')
  })

  it('returnToReconciling preserves organizer fixture state', () => {
    createDemoSession()
    setPhase(DEMO_SESSION_ID, 'organizing')
    toggleOrganizerLineFlag(DEMO_SESSION_ID, 'org-1', 'ol-1', 'moved')
    returnToReconciling(DEMO_SESSION_ID)
    const session = getSession(DEMO_SESSION_ID)
    expect(session.phase).toBe('reconciling')
    expect(session.organizerLists[0].lines[0].moved).toBe(true)
  })

  it('marks session closed', () => {
    createDemoSession()
    markSessionComplete(DEMO_SESSION_ID)
    expect(getSession(DEMO_SESSION_ID).phase).toBe('closed')
  })

  it('resolves reconciliation rows', () => {
    createDemoSession()
    resolveReconciliationRow(DEMO_SESSION_ID, 'rec-1')
    expect(getSession(DEMO_SESSION_ID).reconciliationRows[0].resolved).toBe(true)
  })
})
