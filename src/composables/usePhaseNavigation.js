import { ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { getSession, goBackToPhase, needsBackwardConfirm } from '@/lib/storyboard-session.js'

const PROGRESS_STEP_LABELS = {
  counting: 'Count',
  reconciling: 'Reconcile',
  organizing: 'Organize',
  updating_inventory: 'Export',
}

export function usePhaseNavigation(sessionIdRef) {
  const router = useRouter()
  const confirmOpen = ref(false)
  const pendingTargetPhase = ref(null)

  function sessionId() {
    return unref(sessionIdRef)
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

  return {
    goBack,
    confirmOpen,
    pendingTargetPhase,
    confirmBack,
    cancelBack,
    confirmTitle: 'Go back to an earlier step?',
    confirmDescription,
  }
}
