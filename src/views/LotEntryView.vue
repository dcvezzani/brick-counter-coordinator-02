<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LotEntryForm from '@/components/LotEntryForm.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import { getSession, landingRouteLocation, setPhase } from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const { effectiveProfile } = useWorkflowProfile()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const frameVariant = computed(() =>
  effectiveProfile.value === 'worker' ? 'worker' : 'coordinator',
)

function compareWithPartOut() {
  setPhase(sessionId.value, 'reconciling')
  router.push(landingRouteLocation(sessionId.value, 'reconciling'))
}
</script>

<template>
  <SessionViewFrame v-if="session" :variant="frameVariant">
    <ViewHeader title="Lot entry" />

    <LotEntryForm
      v-if="session.phase === 'counting'"
      :session-id="sessionId"
      :session="session"
      data-testid="lot-entry-form-mount"
    />

    <p
      v-else
      class="text-sm text-muted-foreground"
    >
      Counting is available during the Count phase.
    </p>

    <ViewActions v-if="session.phase === 'counting'">
      <Button @click="compareWithPartOut">
        Compare with Part-Out List
      </Button>
    </ViewActions>
  </SessionViewFrame>
</template>
