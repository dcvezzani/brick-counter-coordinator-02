import { ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getSession,
  goBackToPhase,
  isAllowedBackwardTarget,
  navTargetPhaseForRoute,
  needsBackwardConfirm,
} from '@/lib/storyboard-session.js'

const PROGRESS_STEP_LABELS = {
  counting: 'Count',
  reconciling: 'Reconcile',
  organizing: 'Organize',
  updating_inventory: 'Export',
}

const BACK_BUTTON_LABELS = {
  counting: 'Back to counting',
  reconciling: 'Back to reconciling',
  organizing: 'Back to organizing',
}

export function usePhaseNavigation(sessionIdRef) {
  const router = useRouter()
  const confirmOpen = ref(false)
  const pendingTargetPhase = ref(null)

  function sessionId() {
    return unref(sessionIdRef)
  }

  function backButtonLabel(targetPhase) {
    return BACK_BUTTON_LABELS[targetPhase] ?? `Back to ${targetPhase}`
  }

  function confirmDescription(targetPhase) {
    const label = PROGRESS_STEP_LABELS[targetPhase] ?? targetPhase
    return `You'll return to ${label}. Your counted lots and progress so far are kept.`
  }

  function completeBack(targetPhase) {
    const result = goBackToPhase(sessionId(), targetPhase)
    if (result) {
      router.push(result.location)
    }
    confirmOpen.value = false
    pendingTargetPhase.value = null
  }

  function goBack(targetPhase) {
    const session = getSession(sessionId())
    if (!session) {
      return
    }

    if (needsBackwardConfirm(targetPhase, session.phase)) {
      pendingTargetPhase.value = targetPhase
      confirmOpen.value = true
      return
    }

    completeBack(targetPhase)
  }

  function confirmBack() {
    if (pendingTargetPhase.value) {
      completeBack(pendingTargetPhase.value)
    }
  }

  function cancelBack() {
    confirmOpen.value = false
    pendingTargetPhase.value = null
  }

  function navigateWithPhaseSync(to) {
    const routeName = to?.name ?? null
    const query = to?.query ?? {}
    const targetPhase = routeName ? navTargetPhaseForRoute(routeName, query) : null

    if (targetPhase) {
      const session = getSession(sessionId())
      if (session && isAllowedBackwardTarget(targetPhase, session.phase)) {
        goBack(targetPhase)
        return
      }
    }

    router.push(to)
  }

  return {
    goBack,
    navigateWithPhaseSync,
    confirmOpen,
    pendingTargetPhase,
    confirmBack,
    cancelBack,
    backButtonLabel,
    confirmTitle: 'Go back to an earlier step?',
    confirmDescription,
  }
}
