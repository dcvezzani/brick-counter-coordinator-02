import { reactive } from 'vue'
import { DEMO_SESSION_ID } from '@/fixtures/demo-session.js'
import {
  createDemoWorkflowSessionSeed,
  STORYBOARD_SESSION_LIST_META,
  STORYBOARD_SESSION_SEEDS,
} from '@/fixtures/storyboard-sessions.js'

/** Route name for worker put-away list (registered in U2). */
export const SESSION_MY_LIST_ROUTE = 'session-my-list'

/** In-memory storyboard sessions for the current browser tab. */
const state = reactive({
  sessions: {},
})

export { DEMO_SESSION_ID }

export const PHASE_ORDER = [
  'importing',
  'counting',
  'reconciling',
  'organizing',
  'updating_inventory',
  'closed',
]

export function phaseIndex(phase) {
  return PHASE_ORDER.indexOf(phase)
}

export function isEarlierPhase(targetPhase, currentPhase) {
  const targetIdx = phaseIndex(targetPhase)
  const currentIdx = phaseIndex(currentPhase)
  if (targetIdx < 0 || currentIdx < 0) {
    return false
  }
  return targetIdx < currentIdx
}

export function isAllowedBackwardTarget(targetPhase, currentPhase) {
  if (currentPhase === 'closed') {
    return false
  }
  if (targetPhase === 'importing' || targetPhase === 'closed') {
    return false
  }
  return isEarlierPhase(targetPhase, currentPhase)
}

export function backwardStepDistance(targetPhase, currentPhase) {
  if (!isAllowedBackwardTarget(targetPhase, currentPhase)) {
    return 0
  }
  return phaseIndex(currentPhase) - phaseIndex(targetPhase)
}

export function needsBackwardConfirm(targetPhase, currentPhase) {
  return backwardStepDistance(targetPhase, currentPhase) > 1
}

export function navTargetPhaseForRoute(routeName, query = {}) {
  switch (routeName) {
    case 'session-lot':
      return 'counting'
    case 'session-reconciliation':
      return 'reconciling'
    case 'session-lots-organizer':
      return 'organizing'
    case 'session-lots':
      return query.mode === 'organizer' ? 'organizing' : null
    case 'session-cups':
      return null
    case SESSION_MY_LIST_ROUTE:
      return 'organizing'
    default:
      return null
  }
}

export function isProgressStepClickable(targetPhase, currentPhase) {
  return isAllowedBackwardTarget(targetPhase, currentPhase)
}

export function getSession(sessionId) {
  return state.sessions[sessionId] ?? null
}

export function createDemoSession({ setNumber = '10281' } = {}) {
  const session = createDemoWorkflowSessionSeed(setNumber)
  session.partOutLines = []
  state.sessions[DEMO_SESSION_ID] = session
  return session
}

export function setPartOutLines(sessionId, lines) {
  const session = getSession(sessionId)
  if (session) {
    session.partOutLines = lines
  }
}

export function ensureStoryboardFixtures() {
  if (!getSession(DEMO_SESSION_ID)) {
    createDemoSession()
  }

  for (const seed of STORYBOARD_SESSION_SEEDS) {
    if (!getSession(seed.id)) {
      state.sessions[seed.id] = { ...seed }
    }
  }
}

export function listStoryboardSessions() {
  ensureStoryboardFixtures()

  return STORYBOARD_SESSION_LIST_META.map((meta) => {
    const session = getSession(meta.id)
    if (!session) {
      return null
    }
    return {
      id: session.id,
      setNumber: session.setNumber,
      phase: session.phase,
      label: meta.label,
    }
  }).filter(Boolean)
}

export function registerJoinedWorker(sessionId, displayName) {
  const session = getSession(sessionId)
  if (!session) {
    return
  }

  const trimmed = displayName?.trim()
  if (!trimmed) {
    return
  }

  if (!session.joinedWorkers) {
    session.joinedWorkers = []
  }

  if (!session.joinedWorkers.includes(trimmed)) {
    session.joinedWorkers.push(trimmed)
  }
}

export function joinedWorkerDisplayNames(sessionId) {
  return getSession(sessionId)?.joinedWorkers ?? []
}

export function assignOrganizerList(sessionId, listId, displayName) {
  const session = getSession(sessionId)
  const list = session?.organizerLists.find((entry) => entry.id === listId)
  if (list) {
    list.assigneeDisplayName = displayName
  }
}

export function autoAssignOrganizerLists(sessionId) {
  const session = getSession(sessionId)
  if (!session) {
    return
  }

  const workers = session.joinedWorkers ?? []
  const lists = session.organizerLists ?? []
  const assignedWorkers = new Set(
    lists
      .filter((list) => list.assigneeDisplayName)
      .map((list) => list.assigneeDisplayName),
  )
  const unassignedWorkers = workers.filter((name) => !assignedWorkers.has(name))
  const unassignedLists = lists.filter((list) => !list.assigneeDisplayName)

  let workerIndex = 0
  for (const list of unassignedLists) {
    if (workerIndex >= unassignedWorkers.length) {
      break
    }
    list.assigneeDisplayName = unassignedWorkers[workerIndex]
    assignedWorkers.add(unassignedWorkers[workerIndex])
    workerIndex += 1
  }
}

export function getAssignedOrganizerList(sessionId, displayName) {
  const session = getSession(sessionId)
  if (!session || !displayName) {
    return null
  }

  const trimmed = displayName.trim()
  return session.organizerLists?.find((list) => list.assigneeDisplayName === trimmed) ?? null
}

export function acknowledgeOrganizePrompt(sessionId) {
  const session = getSession(sessionId)
  if (session) {
    session.organizePromptAcknowledged = true
  }
}

export function shouldShowOrganizePrompt(sessionId, effectiveProfile) {
  const session = getSession(sessionId)
  if (!session || effectiveProfile !== 'worker') {
    return false
  }
  if (session.phase !== 'organizing') {
    return false
  }
  if (session.organizePromptAcknowledged) {
    return false
  }

  const hasAssignedList = session.organizerLists?.some((list) => list.assigneeDisplayName) ?? false
  return hasAssignedList
}

export function setPhase(sessionId, phase) {
  const session = getSession(sessionId)
  if (session) {
    session.phase = phase
    if (phase === 'organizing') {
      session.organizePromptAcknowledged = false
      autoAssignOrganizerLists(sessionId)
    }
  }
}

/**
 * @deprecated Use {@link goBackToPhase} with `'reconciling'` instead.
 */
export function returnToReconciling(sessionId) {
  goBackToPhase(sessionId, 'reconciling')
}

export function goBackToPhase(sessionId, targetPhase) {
  const session = getSession(sessionId)
  if (!session || !isAllowedBackwardTarget(targetPhase, session.phase)) {
    return null
  }
  setPhase(sessionId, targetPhase)
  return {
    phase: targetPhase,
    location: landingRouteLocation(sessionId, targetPhase),
  }
}

export function markSessionComplete(sessionId) {
  setPhase(sessionId, 'closed')
}

export function landingRouteName(sessionId, phase, options = {}) {
  const { effectiveProfile } = options
  if (phase === 'organizing' && effectiveProfile === 'worker') {
    return SESSION_MY_LIST_ROUTE
  }

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

export function landingRouteLocation(sessionId, phase, options = {}) {
  const name = landingRouteName(sessionId, phase, options)
  if (name === 'home') {
    return { name: 'home' }
  }
  if (name === 'session-lots-organizer') {
    return { name: 'session-lots', params: { sessionId }, query: { mode: 'organizer' } }
  }
  return { name, params: { sessionId } }
}

export function sessionNavModel(sessionId, options = {}) {
  const { effectiveProfile = 'coordinator' } = options
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
      key: 'my-list',
      label: 'My list',
      to: { name: SESSION_MY_LIST_ROUTE, params: { sessionId } },
    },
    {
      key: 'reconcile',
      label: 'Reconcile',
      to: { name: 'session-reconciliation', params: { sessionId } },
    },
    { key: 'cups', label: 'Cups', to: { name: 'session-cups', params: { sessionId } } },
  ]

  if (effectiveProfile === 'worker') {
    const visibleKeys =
      phase === 'importing'
        ? ['home']
        : phase === 'organizing' || phase === 'updating_inventory'
          ? ['home', 'lot', 'my-list']
          : ['home', 'lot', 'lots', 'cups']

    return {
      showNav: true,
      items: items.filter((item) => visibleKeys.includes(item.key)),
    }
  }

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
