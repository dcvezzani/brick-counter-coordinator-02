import { reactive } from 'vue'
import { createDemoSessionSeed, DEMO_SESSION_ID } from '@/fixtures/demo-session.js'

/** In-memory storyboard sessions for the current browser tab. */
const state = reactive({
  sessions: {},
})

export { DEMO_SESSION_ID }

export function getSession(sessionId) {
  return state.sessions[sessionId] ?? null
}

export function createDemoSession({ setNumber = '10281' } = {}) {
  const session = createDemoSessionSeed(setNumber)
  state.sessions[DEMO_SESSION_ID] = session
  return session
}

export function setPhase(sessionId, phase) {
  const session = getSession(sessionId)
  if (session) {
    session.phase = phase
  }
}

export function returnToReconciling(sessionId) {
  setPhase(sessionId, 'reconciling')
}

export function markSessionComplete(sessionId) {
  setPhase(sessionId, 'closed')
}

export function landingRouteName(sessionId, phase) {
  const routes = {
    importing: 'session-import',
    counting: 'session-lot',
    reconciling: 'session-reconciliation',
    organizing: 'session-lots-organizer',
    updating_inventory: 'session-reconciliation',
    closed: 'home',
  }
  return routes[phase] ?? 'home'
}

export function landingRouteLocation(sessionId, phase) {
  const name = landingRouteName(sessionId, phase)
  if (name === 'home') {
    return { name: 'home' }
  }
  if (name === 'session-lots-organizer') {
    return { name: 'session-lots', params: { sessionId }, query: { mode: 'organizer' } }
  }
  return { name, params: { sessionId } }
}

export function sessionNavModel(sessionId) {
  const session = getSession(sessionId)
  if (!session || session.phase === 'closed') {
    return { showNav: false, items: [] }
  }

  const { phase } = session
  const items = [
    { key: 'home', label: 'Home', to: { name: 'home' } },
    { key: 'lot', label: 'Lot', to: { name: 'session-lot', params: { sessionId } } },
    { key: 'lots', label: 'Lots', to: { name: 'session-lots', params: { sessionId } } },
    {
      key: 'reconcile',
      label: 'Reconcile',
      to: { name: 'session-reconciliation', params: { sessionId } },
    },
    { key: 'cups', label: 'Cups', to: { name: 'session-cups', params: { sessionId } } },
  ]

  const visibleKeys =
    phase === 'importing'
      ? ['home']
      : phase === 'updating_inventory'
        ? ['home', 'lot', 'lots', 'reconcile']
        : ['home', 'lot', 'lots', 'reconcile', 'cups']

  return {
    showNav: true,
    items: items.filter((item) => visibleKeys.includes(item.key)),
  }
}

export function resolveReconciliationRow(sessionId, rowId) {
  const session = getSession(sessionId)
  const row = session?.reconciliationRows.find((entry) => entry.id === rowId)
  if (row) {
    row.resolved = true
  }
}

export function allReconciliationRowsResolved(sessionId) {
  const session = getSession(sessionId)
  return session?.reconciliationRows.every((row) => row.resolved) ?? false
}

export function toggleOrganizerLineFlag(sessionId, listId, lineId, field) {
  const session = getSession(sessionId)
  const list = session?.organizerLists.find((entry) => entry.id === listId)
  const line = list?.lines.find((entry) => entry.id === lineId)
  if (line && (field === 'moved' || field === 'needsLocation')) {
    line[field] = !line[field]
  }
}

export function hasActiveDemoSession() {
  const session = getSession(DEMO_SESSION_ID)
  return session != null && session.phase !== 'closed'
}

export function lotKey(partId, colorId, condition) {
  return `${partId}:${colorId}:${condition}`
}

export function getLot(sessionId, lotId) {
  const session = getSession(sessionId)
  return session?.lots.find((lot) => lot.id === lotId) ?? null
}

function syncReconciliationLotQty(session) {
  for (const row of session.reconciliationRows) {
    if (row.partId == null || row.colorId == null || row.condition == null) {
      continue
    }
    const key = lotKey(row.partId, row.colorId, row.condition)
    row.lotQty = session.lots
      .filter((lot) => lotKey(lot.partId, lot.colorId, lot.condition) === key)
      .reduce((sum, lot) => sum + (lot.qty ?? 0), 0)
  }
}

export function saveLot(sessionId, payload) {
  const session = getSession(sessionId)
  if (!session) {
    throw new Error(`Session not found: ${sessionId}`)
  }

  const { partId, colorId, condition, qty, id, mergeDuplicate } = payload
  const key = lotKey(partId, colorId, condition)
  const duplicateLot = session.lots.find(
    (lot) => lotKey(lot.partId, lot.colorId, lot.condition) === key && lot.id !== id,
  )

  if (duplicateLot) {
    if (mergeDuplicate) {
      duplicateLot.qty += qty
      syncReconciliationLotQty(session)
      return { lot: duplicateLot, duplicate: false, merged: true }
    }
    return { lot: duplicateLot, duplicate: true, existing: { qty: duplicateLot.qty } }
  }

  if (id) {
    const existingLot = session.lots.find((lot) => lot.id === id)
    if (existingLot) {
      existingLot.partId = partId
      existingLot.colorId = colorId
      existingLot.condition = condition
      existingLot.qty = qty
      syncReconciliationLotQty(session)
      return { lot: existingLot, duplicate: false }
    }
  }

  const newLot = {
    id: id ?? `lot-${Date.now()}`,
    partId,
    colorId,
    condition,
    qty,
  }
  session.lots.push(newLot)
  syncReconciliationLotQty(session)
  return { lot: newLot, duplicate: false }
}

export function __resetSessionsForTests() {
  state.sessions = {}
}
