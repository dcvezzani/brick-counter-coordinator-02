import { describe, expect, it, beforeEach } from 'vitest'
import {
  __resetSessionsForTests,
  createDemoSession,
  DEMO_SESSION_ID,
  getLot,
  getSession,
  goBackToPhase,
  isAllowedBackwardTarget,
  isEarlierPhase,
  landingRouteLocation,
  landingRouteName,
  lotKey,
  markSessionComplete,
  navTargetPhaseForRoute,
  needsBackwardConfirm,
  PHASE_ORDER,
  phaseIndex,
  resolveReconciliationRow,
  returnToReconciling,
  saveLot,
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

  describe('PHASE_ORDER helpers', () => {
    it('exports shared phase order', () => {
      expect(PHASE_ORDER).toEqual([
        'importing',
        'counting',
        'reconciling',
        'organizing',
        'updating_inventory',
        'closed',
      ])
    })

    it('phaseIndex returns index or -1 for unknown', () => {
      expect(phaseIndex('counting')).toBe(1)
      expect(phaseIndex('unknown')).toBe(-1)
    })

    it('isEarlierPhase compares indices', () => {
      expect(isEarlierPhase('counting', 'reconciling')).toBe(true)
      expect(isEarlierPhase('reconciling', 'counting')).toBe(false)
      expect(isEarlierPhase('counting', 'counting')).toBe(false)
    })

    it('isAllowedBackwardTarget rejects importing, closed, and forward', () => {
      expect(isAllowedBackwardTarget('counting', 'reconciling')).toBe(true)
      expect(isAllowedBackwardTarget('importing', 'counting')).toBe(false)
      expect(isAllowedBackwardTarget('closed', 'updating_inventory')).toBe(false)
      expect(isAllowedBackwardTarget('organizing', 'reconciling')).toBe(false)
      expect(isAllowedBackwardTarget('counting', 'closed')).toBe(false)
    })

    it('needsBackwardConfirm when skipping more than one step', () => {
      expect(needsBackwardConfirm('counting', 'updating_inventory')).toBe(true)
      expect(needsBackwardConfirm('organizing', 'updating_inventory')).toBe(false)
      expect(needsBackwardConfirm('counting', 'reconciling')).toBe(false)
    })
  })

  describe('navTargetPhaseForRoute', () => {
    it('maps unambiguous session routes', () => {
      expect(navTargetPhaseForRoute('session-lot')).toBe('counting')
      expect(navTargetPhaseForRoute('session-reconciliation')).toBe('reconciling')
      expect(navTargetPhaseForRoute('session-lots-organizer')).toBe('organizing')
    })

    it('returns null for ambiguous lots browse and cups', () => {
      expect(navTargetPhaseForRoute('session-lots')).toBeNull()
      expect(navTargetPhaseForRoute('session-lots', { mode: 'organizer' })).toBe('organizing')
      expect(navTargetPhaseForRoute('session-cups')).toBeNull()
      expect(navTargetPhaseForRoute('home')).toBeNull()
    })
  })

  describe('goBackToPhase', () => {
    it('sets counting from reconciling and returns landing route', () => {
      createDemoSession()
      setPhase(DEMO_SESSION_ID, 'reconciling')
      const result = goBackToPhase(DEMO_SESSION_ID, 'counting')
      expect(result.phase).toBe('counting')
      expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
      expect(result.location).toEqual(landingRouteLocation(DEMO_SESSION_ID, 'counting'))
    })

    it('returns null for disallowed targets', () => {
      createDemoSession()
      setPhase(DEMO_SESSION_ID, 'counting')
      expect(goBackToPhase(DEMO_SESSION_ID, 'importing')).toBeNull()
      expect(goBackToPhase(DEMO_SESSION_ID, 'reconciling')).toBeNull()
      expect(getSession(DEMO_SESSION_ID).phase).toBe('counting')
    })
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

  describe('lotKey', () => {
    it('returns a stable key for the same triple', () => {
      expect(lotKey('3001', 4, 'U')).toBe('3001:4:U')
      expect(lotKey('3001', 4, 'U')).toBe(lotKey('3001', 4, 'U'))
    })
  })

  describe('getLot', () => {
    it('returns lot by id after fixture seed', () => {
      createDemoSession()
      expect(getLot(DEMO_SESSION_ID, 'lot-1')).toEqual({
        id: 'lot-1',
        partId: '3001',
        colorId: 4,
        condition: 'U',
        qty: 10,
      })
    })

    it('returns null for unknown lot id', () => {
      createDemoSession()
      expect(getLot(DEMO_SESSION_ID, 'missing')).toBeNull()
    })
  })

  describe('saveLot', () => {
    it('creates a lot with partId, colorId, condition, and qty', () => {
      createDemoSession()
      const before = getSession(DEMO_SESSION_ID).lots.length
      const result = saveLot(DEMO_SESSION_ID, {
        partId: '3710',
        colorId: 4,
        condition: 'N',
        qty: 6,
        id: 'lot-new',
      })
      expect(result.duplicate).toBe(false)
      expect(result.lot).toEqual({
        id: 'lot-new',
        partId: '3710',
        colorId: 4,
        condition: 'N',
        qty: 6,
      })
      expect(getSession(DEMO_SESSION_ID).lots.length).toBe(before + 1)
    })

    it('detects duplicate triple', () => {
      createDemoSession()
      const result = saveLot(DEMO_SESSION_ID, {
        partId: '3001',
        colorId: 4,
        condition: 'U',
        qty: 1,
      })
      expect(result.duplicate).toBe(true)
      expect(result.existing).toEqual({ qty: 10 })
      expect(result.lot.id).toBe('lot-1')
    })

    it('merges when mergeDuplicate is true', () => {
      createDemoSession()
      const before = getSession(DEMO_SESSION_ID).lots.length
      const result = saveLot(DEMO_SESSION_ID, {
        partId: '3001',
        colorId: 4,
        condition: 'U',
        qty: 5,
        mergeDuplicate: true,
      })
      expect(result.duplicate).toBe(false)
      expect(result.merged).toBe(true)
      expect(getSession(DEMO_SESSION_ID).lots.length).toBe(before)
      expect(getLot(DEMO_SESSION_ID, 'lot-1').qty).toBe(15)
    })

    it('updates an existing lot by id', () => {
      createDemoSession()
      saveLot(DEMO_SESSION_ID, {
        id: 'lot-2',
        partId: '3023',
        colorId: 7,
        condition: 'U',
        qty: 12,
      })
      expect(getLot(DEMO_SESSION_ID, 'lot-2').qty).toBe(12)
    })

    it('syncs reconciliation lotQty after save', () => {
      createDemoSession()
      saveLot(DEMO_SESSION_ID, {
        partId: '3001',
        colorId: 4,
        condition: 'U',
        qty: 2,
        mergeDuplicate: true,
      })
      const row = getSession(DEMO_SESSION_ID).reconciliationRows.find((r) => r.id === 'rec-1')
      expect(row.lotQty).toBe(12)
    })

    it('throws when session is missing', () => {
      expect(() =>
        saveLot('missing', { partId: '3001', colorId: 4, condition: 'U', qty: 1 }),
      ).toThrow()
    })
  })
})
