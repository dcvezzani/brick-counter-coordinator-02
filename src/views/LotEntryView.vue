<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LotEntryForm from '@/components/LotEntryForm.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import { getSession, landingRouteLocation, setPhase } from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))

function compareWithPartOut() {
  setPhase(sessionId.value, 'reconciling')
  router.push(landingRouteLocation(sessionId.value, 'reconciling'))
}
</script>

<template>
  <SessionViewFrame v-if="session">
    <div class="space-y-3">
      <ViewHeader
        title="Lot entry"
        description="Count parts into lots."
      />

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
        <Button class="min-h-11" @click="compareWithPartOut">
          Compare with Part-Out List
        </Button>
      </ViewActions>
    </div>
  </SessionViewFrame>
</template>
