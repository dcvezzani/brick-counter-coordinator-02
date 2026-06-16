export const SESSION_SHELL = {
  COORDINATOR: 'coordinator',
  WORKER: 'worker',
  IMPORT: 'import',
}

export function resolveSessionShell(routeMeta = {}, options = {}) {
  const { effectiveProfile } = options
  if (routeMeta.hideSessionNav === true) {
    return SESSION_SHELL.IMPORT
  }
  const base = routeMeta.sessionShell ?? SESSION_SHELL.COORDINATOR
  if (base === SESSION_SHELL.COORDINATOR && effectiveProfile === 'worker') {
    return SESSION_SHELL.WORKER
  }
  return base
}

export function isWorkerShell(shell) {
  return shell === SESSION_SHELL.WORKER
}

export function isCoordinatorShell(shell) {
  return shell === SESSION_SHELL.COORDINATOR
}
