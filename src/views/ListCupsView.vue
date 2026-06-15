<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { usePhaseNavigation } from '@/composables/usePhaseNavigation.js'
import { getSession } from '@/lib/storyboard-session.js'

const route = useRoute()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))

const {
  goBack,
  confirmOpen,
  confirmBack,
  cancelBack,
  confirmTitle,
  confirmDescription,
  pendingTargetPhase,
} = usePhaseNavigation(sessionId)

function returnToLotEntry() {
  goBack('counting')
}
</script>

<template>
  <SessionViewFrame v-if="session">
    <ViewHeader
      title="List cups"
      description="Physical sort containers used while counting and organizing."
    />

    <ul class="space-y-3">
      <li
        v-for="cup in session.cups"
        :key="cup.id"
        class="flex items-center justify-between rounded-md border border-border px-3 py-2"
      >
        <span>{{ cup.label }}</span>
        <Badge variant="secondary">{{ cup.partCount }} parts</Badge>
      </li>
    </ul>

    <ViewActions>
      <Button data-testid="back-to-counting" @click="returnToLotEntry">Return to lot entry</Button>
    </ViewActions>

    <ConfirmDialog
      v-model:open="confirmOpen"
      :title="confirmTitle"
      :description="pendingTargetPhase ? confirmDescription(pendingTargetPhase) : ''"
      confirm-label="Go back"
      @confirm="confirmBack"
      @cancel="cancelBack"
    />
  </SessionViewFrame>
</template>
