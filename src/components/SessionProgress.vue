<script setup>
import { computed } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { Badge } from '@/components/ui/badge'
import { usePhaseNavigation } from '@/composables/usePhaseNavigation.js'
import { getSession, isProgressStepClickable, PHASE_ORDER } from '@/lib/storyboard-session.js'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})

const STEPS = [
  { phase: 'importing', label: 'Import' },
  { phase: 'counting', label: 'Count' },
  { phase: 'reconciling', label: 'Reconcile' },
  { phase: 'organizing', label: 'Organize' },
  { phase: 'updating_inventory', label: 'Export' },
  { phase: 'closed', label: 'Done' },
]

const sessionId = computed(() => props.sessionId)
const session = computed(() => getSession(props.sessionId))
const currentIndex = computed(() => {
  const phase = session.value?.phase
  return phase ? PHASE_ORDER.indexOf(phase) : -1
})

const {
  goBack,
  confirmOpen,
  confirmBack,
  cancelBack,
  confirmTitle,
  confirmDescription,
  pendingTargetPhase,
} = usePhaseNavigation(sessionId)

function stepState(index) {
  if (currentIndex.value < 0) return 'future'
  if (index < currentIndex.value) return 'past'
  if (index === currentIndex.value) return 'current'
  return 'future'
}

function stepTestId(phase) {
  return `progress-step-${phase.replace('_', '-')}`
}

function onStepClick(phase) {
  goBack(phase)
}
</script>

<template>
  <div
    v-if="session"
    aria-label="Session progress"
    class="border-b border-border bg-background"
  >
    <ol class="container mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 py-2 text-xs sm:text-sm">
      <li
        v-for="(step, index) in STEPS"
        :key="step.phase"
        class="flex shrink-0 items-center"
      >
        <span
          v-if="index > 0"
          class="mx-1.5 text-muted-foreground/60"
          aria-hidden="true"
        >
          →
        </span>
        <Badge
          v-if="stepState(index) === 'current'"
          variant="secondary"
          class="font-semibold"
          aria-current="step"
        >
          {{ step.label }}
        </Badge>
        <button
          v-else-if="
            stepState(index) === 'past' &&
            isProgressStepClickable(step.phase, session.phase)
          "
          type="button"
          class="min-h-11 rounded-md px-1 font-medium text-foreground underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :data-testid="stepTestId(step.phase)"
          :aria-label="`Go back to ${step.label}`"
          @click="onStepClick(step.phase)"
        >
          {{ step.label }}
        </button>
        <span
          v-else
          :class="
            stepState(index) === 'past'
              ? 'text-muted-foreground'
              : 'text-muted-foreground/60'
          "
          :aria-disabled="stepState(index) === 'future' ? 'true' : undefined"
        >
          {{ step.label }}
        </span>
      </li>
    </ol>

    <ConfirmDialog
      v-model:open="confirmOpen"
      :title="confirmTitle"
      :description="pendingTargetPhase ? confirmDescription(pendingTargetPhase) : ''"
      confirm-label="Go back"
      @confirm="confirmBack"
      @cancel="cancelBack"
    />
  </div>
</template>
