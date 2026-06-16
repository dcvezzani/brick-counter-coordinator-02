import { ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getSession,
  goBackToPhase,
  needsBackwardConfirm,
  PHASE_ORDER,
} from '@/lib/storyboard-session.js'

export const PROGRESS_STEP_LABELS = {
  counting: 'Count',
  reconciling: 'Reconcile',
  organizing: 'Organize',
  updating_inventory: 'Export',
}

function phaseLabel(phase) {
  return PROGRESS_STEP_LABELS[phase] ?? phase
}

function formatSkippedLabels(labels) {
  if (labels.length === 0) {
    return ''
  }
  if (labels.length === 1) {
    return labels[0]
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`
  }
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}

function skippedStepLabels(targetPhase, currentPhase) {
  const targetIdx = PHASE_ORDER.indexOf(targetPhase)
  const currentIdx = PHASE_ORDER.indexOf(currentPhase)
  if (targetIdx < 0 || currentIdx < 0 || targetIdx >= currentIdx) {
    return []
  }

  return PHASE_ORDER.slice(targetIdx + 1, currentIdx)
    .map((phase) => PROGRESS_STEP_LABELS[phase])
    .filter(Boolean)
}

export function usePhaseNavigation(sessionIdRef) {
  const router = useRouter()
  const confirmOpen = ref(false)
  const pendingTargetPhase = ref(null)

  function sessionId() {
    return unref(sessionIdRef)
  }

  function currentPhase() {
    return getSession(sessionId())?.phase ?? null
  }

  function confirmTitle(targetPhase) {
    return `Go back to ${phaseLabel(targetPhase)}?`
  }

  function confirmDescription(targetPhase) {
    const fromPhase = currentPhase()
    const skipped = fromPhase ? skippedStepLabels(targetPhase, fromPhase) : []
    const kept = 'Your counted lots and progress so far are kept.'

    if (skipped.length === 0) {
      return kept
    }

    return `You'll skip ${formatSkippedLabels(skipped)}. ${kept}`
  }

  function confirmCancelLabel() {
    const fromPhase = currentPhase()
    return fromPhase ? `Stay on ${phaseLabel(fromPhase)}` : 'Stay here'
  }

  function confirmConfirmLabel(targetPhase) {
    return `Go to ${phaseLabel(targetPhase)}`
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
    confirmTitle,
    confirmDescription,
    confirmCancelLabel,
    confirmConfirmLabel,
  }
}
