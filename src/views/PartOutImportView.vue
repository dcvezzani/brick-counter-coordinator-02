<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import { getSession, landingRouteLocation, setPhase } from '@/lib/storyboard-session.js'

const partOutColumns = [
  { key: 'partId', header: 'Part' },
  { key: 'name', header: 'Name' },
  { key: 'color', header: 'Color' },
  { key: 'quantity', header: 'Qty' },
]

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))

function goBack() {
  router.push({ name: 'home' })
}

function confirmImport() {
  setPhase(sessionId.value, 'counting')
  router.push(landingRouteLocation(sessionId.value, 'counting'))
}
</script>

<template>
  <SessionViewFrame v-if="session">
    <ViewHeader
      title="Part-out import"
      :description="`Confirm the part-out list for set ${session.setNumber} before counting begins.`"
    >
      <template #leading>
        <Button variant="ghost" size="sm" class="-ml-2 w-fit" @click="goBack">
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
      </template>
    </ViewHeader>

    <ResponsiveDataTable
      :items="session.partOutLines"
      :columns="partOutColumns"
    >
      <template #mobile="{ item: line }">
        <div class="flex items-start justify-between gap-3">
          <p class="font-medium leading-snug">{{ line.name }}</p>
          <span class="shrink-0 font-medium tabular-nums">×{{ line.quantity }}</span>
        </div>
        <p class="mt-1 text-muted-foreground">
          <span>{{ line.partId }}</span>
          <span aria-hidden="true"> · </span>
          <span>{{ line.color }}</span>
        </p>
      </template>
    </ResponsiveDataTable>

    <ViewActions>
      <Button @click="confirmImport">Confirm and begin counting</Button>
    </ViewActions>
  </SessionViewFrame>
</template>
