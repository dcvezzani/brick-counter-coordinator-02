function waitReasonForRoute(to) {
  if (to.name === 'session-reconciliation') {
    return 'reconciling'
  }
  if (to.name === 'session-import' || to.name === 'session-new') {
    return 'importing'
  }
  return 'importing'
}

export function workflowGuard(to, effectiveProfile) {
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
