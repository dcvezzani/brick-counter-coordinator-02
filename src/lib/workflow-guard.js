import { getSession, landingRouteLocation } from '@/lib/storyboard-session.js'

function waitReasonForRoute(to) {
  if (to.name === 'session-reconciliation') {
    return 'reconciling'
  }
  if (to.name === 'session-import' || to.name === 'session-new') {
    return 'importing'
  }
  return 'importing'
}

function isWorkerOnlyRoute(to) {
  if (to.meta?.workerOnly) {
    return true
  }
  return to.matched?.some((record) => record.meta?.workerOnly) ?? false
}

export function workflowGuard(to, effectiveProfile) {
  if (effectiveProfile === 'coordinator' && isWorkerOnlyRoute(to)) {
    const sessionId = to.params.sessionId
    const session = getSession(sessionId)
    if (!session || session.phase === 'closed') {
      return { name: 'home' }
    }
    return landingRouteLocation(sessionId, session.phase, { effectiveProfile: 'coordinator' })
  }

  if (effectiveProfile !== 'worker') {
    return true
  }

  const coordinatorOnly =
    to.name === 'session-import' ||
    to.name === 'session-new' ||
    to.name === 'session-reconciliation' ||
    (to.name === 'session-lots' && to.query.mode === 'organizer')

  if (!coordinatorOnly) {
    return true
  }

  if (to.name === 'session-new') {
    return { name: 'home' }
  }

  return {
    name: 'session-wait',
    params: to.params,
    query: { reason: waitReasonForRoute(to) },
  }
}
