export const SESSION_SHELL = {
  COORDINATOR: 'coordinator',
  WORKER: 'worker',
  IMPORT: 'import',
}

export function resolveSessionShell(routeMeta = {}) {
  if (routeMeta.hideSessionNav === true) {
    return SESSION_SHELL.IMPORT
  }
  return routeMeta.sessionShell ?? SESSION_SHELL.COORDINATOR
}

export function isWorkerShell(shell) {
  return shell === SESSION_SHELL.WORKER
}

export function isCoordinatorShell(shell) {
  return shell === SESSION_SHELL.COORDINATOR
}
