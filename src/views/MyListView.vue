<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVirtualList } from '@vueuse/core'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDisplayName } from '@/composables/useDisplayName.js'
import {
  acknowledgeOrganizePrompt,
  getAssignedOrganizerList,
  getSession,
  toggleOrganizerLineFlag,
} from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const { displayName } = useDisplayName()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const assignedList = computed(() =>
  getAssignedOrganizerList(sessionId.value, displayName.value),
)
const lines = computed(() => assignedList.value?.lines ?? [])

const { list, containerProps, wrapperProps } = useVirtualList(lines, {
  itemHeight: 56,
})

onMounted(() => {
  acknowledgeOrganizePrompt(sessionId.value)
})

function goBackToLot() {
  router.push({ name: 'session-lot', params: { sessionId: sessionId.value } })
}

function toggleFlag(lineId, field) {
  if (!assignedList.value) {
    return
  }
  toggleOrganizerLineFlag(sessionId.value, assignedList.value.id, lineId, field)
}
</script>

<template>
  <SessionViewFrame v-if="session" variant="worker">
    <ViewHeader
      :title="assignedList?.title ?? 'My list'"
      description="Assigned put-away list for this session."
    >
      <template v-if="assignedList && displayName.trim()" #badge>
        <Badge variant="outline">{{ displayName.trim() }}</Badge>
      </template>
    </ViewHeader>

    <Alert v-if="!assignedList">
      <AlertTitle>No list assigned yet</AlertTitle>
      <AlertDescription class="space-y-3">
        <p>Ask the coordinator to assign a pick list, or wait for auto-assign when organizing starts.</p>
        <Button variant="outline" class="min-h-11" @click="goBackToLot">Back to lot entry</Button>
      </AlertDescription>
    </Alert>

    <div
      v-else
      v-bind="containerProps"
      class="h-96 max-h-[min(60vh,32rem)] overflow-auto rounded-md border border-border"
      data-testid="my-list-virtual-scroll"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="{ data: line } in list"
          :key="line.id"
          class="flex min-h-14 flex-col justify-center border-b border-border px-3 py-2 last:border-b-0"
          data-testid="my-list-row"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium leading-snug">{{ line.partId }}</p>
              <p class="mt-0.5 text-sm text-muted-foreground">
                {{ line.name }} ({{ line.color }})
              </p>
            </div>
            <span class="shrink-0 font-medium tabular-nums">×{{ line.quantity }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <Button
              size="sm"
              class="min-h-11"
              :variant="line.moved ? 'default' : 'outline'"
              @click="toggleFlag(line.id, 'moved')"
            >
              Moved
            </Button>
            <Button
              size="sm"
              class="min-h-11"
              :variant="line.needsLocation ? 'secondary' : 'outline'"
              @click="toggleFlag(line.id, 'needsLocation')"
            >
              Needs location
            </Button>
          </div>
        </div>
      </div>
    </div>
  </SessionViewFrame>
</template>
