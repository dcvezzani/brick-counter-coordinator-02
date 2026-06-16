export const COORDINATOR_STEPS = [
  { phase: 'importing', label: 'Import' },
  { phase: 'counting', label: 'Count' },
  { phase: 'reconciling', label: 'Reconcile' },
  { phase: 'organizing', label: 'Organize' },
  { phase: 'updating_inventory', label: 'Export' },
  { phase: 'closed', label: 'Done' },
]

export const WORKER_STEPS = [
  { phase: 'counting', label: 'Count' },
  { phase: 'organizing', label: 'Organize' },
  { phase: 'closed', label: 'Done' },
]

export function progressStepsForProfile(effectiveProfile, sessionPhase) {
  if (effectiveProfile === 'coordinator') {
    return COORDINATOR_STEPS
  }

  if (sessionPhase === 'counting') {
    return WORKER_STEPS.filter((step) => step.phase === 'counting')
  }

  return WORKER_STEPS.filter(
    (step) => step.phase !== 'closed' || sessionPhase === 'closed',
  )
}
