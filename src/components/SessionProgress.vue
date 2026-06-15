<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { PHASE_ORDER, getSession } from '@/lib/storyboard-session.js'

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

const session = computed(() => getSession(props.sessionId))
const currentIndex = computed(() => {
  const phase = session.value?.phase
  return phase ? PHASE_ORDER.indexOf(phase) : -1
})

function stepState(index) {
  if (currentIndex.value < 0) return 'future'
  if (index < currentIndex.value) return 'past'
  if (index === currentIndex.value) return 'current'
  return 'future'
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
        >
          {{ step.label }}
        </Badge>
        <span
          v-else
          :class="
            stepState(index) === 'past'
              ? 'text-muted-foreground'
              : 'text-muted-foreground/60'
          "
        >
          {{ step.label }}
        </span>
      </li>
    </ol>
  </div>
</template>
