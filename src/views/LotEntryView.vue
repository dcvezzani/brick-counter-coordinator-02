<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import { getSession, landingRouteLocation, setPhase } from '@/lib/storyboard-session.js'

const lotColumns = [
  { key: 'label', header: 'Lot' },
  { key: 'partId', header: 'Part' },
  { key: 'color', header: 'Color' },
  { key: 'quantity', header: 'Qty' },
]

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
    <ViewHeader
      title="Lot entry"
      description="Record counted parts into lots during the counting phase."
    />

    <ResponsiveDataTable
      :items="session.lots"
      :columns="lotColumns"
    >
      <template #mobile="{ item: lot }">
        <div class="flex items-start justify-between gap-3">
          <p class="font-medium leading-snug">{{ lot.label }}</p>
          <span class="shrink-0 font-medium tabular-nums">×{{ lot.qty }}</span>
        </div>
        <p class="mt-1 text-muted-foreground">
          <span>{{ lot.partId }}</span>
          <span aria-hidden="true"> · </span>
          <span>{{ lot.color }}</span>
        </p>
      </template>
    </ResponsiveDataTable>

    <p class="text-sm text-muted-foreground">
      Storyboard: sample lots shown. Production will add lot entry forms here.
    </p>

    <ViewActions v-if="session.phase === 'counting'">
      <Button @click="compareWithPartOut">Compare with Part-Out List</Button>
    </ViewActions>
  </SessionViewFrame>
</template>
