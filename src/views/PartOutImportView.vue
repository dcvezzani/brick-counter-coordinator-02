<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import TableLoadingSkeleton from '@/components/TableLoadingSkeleton.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBrickLinkAuth } from '@/composables/useBrickLinkAuth.js'
import { showErrorToast, showInfoToast } from '@/lib/feedback.js'
import { fetchPartOutLines } from '@/lib/part-out-client.js'
import {
  getSession,
  landingRouteLocation,
  setPartOutLines,
  setPhase,
} from '@/lib/storyboard-session.js'

const partOutColumns = [
  { key: 'partId', header: 'Part' },
  { key: 'name', header: 'Name' },
  { key: 'color', header: 'Color' },
  { key: 'quantity', header: 'Qty' },
]

const route = useRoute()
const router = useRouter()
const { openAuth } = useBrickLinkAuth()

const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))

const status = ref('loading')
const statusAlert = ref(null)
const partOutFilter = ref('')

const filteredLines = computed(() => {
  const lines = session.value?.partOutLines ?? []
  const q = partOutFilter.value.trim().toLowerCase()
  if (!q) {
    return lines
  }
  return lines.filter((line) =>
    [line.partId, line.name, line.color].some((value) =>
      String(value).toLowerCase().includes(q),
    ),
  )
})

const partCountLabel = computed(() => {
  const count = session.value?.partOutLines?.length ?? 0
  if (status.value === 'loading' || count === 0) {
    return null
  }
  return `${count} parts loaded for set ${session.value?.setNumber}`
})

const headerDescription = computed(() => {
  const base = `Confirm the part-out list for set ${session.value?.setNumber ?? ''} before counting begins.`
  if (partCountLabel.value) {
    return `${base} ${partCountLabel.value}.`
  }
  return base
})

const confirmEnabled = computed(
  () => status.value === 'success' || status.value === 'fallback',
)

async function loadPartOut() {
  if (!session.value) {
    status.value = 'error'
    statusAlert.value = {
      variant: 'destructive',
      message: 'Session not found. Go back and create a new session.',
    }
    return
  }

  status.value = 'loading'
  statusAlert.value = null

  let result
  try {
    result = await fetchPartOutLines(session.value.setNumber)
  } catch {
    showErrorToast('Unexpected error while loading part-out list.')
    statusAlert.value = {
      variant: 'destructive',
      message: 'Unexpected error while loading part-out list.',
    }
    status.value = 'error'
    return
  }

  if (result.code === 'AUTH_REQUIRED') {
    status.value = 'auth_required'
    openAuth({
      required: true,
      showBackToHome: true,
      onSaved: () => loadPartOut(),
    })
    return
  }

  if (!result.ok) {
    showErrorToast(result.message)
    statusAlert.value = { variant: 'destructive', message: result.message }
    status.value = 'error'
    return
  }

  setPartOutLines(sessionId.value, result.lines)

  if (result.source === 'fixture') {
    statusAlert.value = {
      variant: 'default',
      message: 'Storyboard part-out — not live BrickLink.',
    }
    showInfoToast('Using storyboard part-out data.')
    status.value = 'fallback'
    return
  }

  if (result.lines.length === 0) {
    statusAlert.value = { variant: 'warning', message: 'No parts found for this set.' }
    status.value = 'empty'
    return
  }

  status.value = 'success'
}

onMounted(() => {
  loadPartOut()
})

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
    <ViewHeader title="Part-out import" :description="headerDescription">
      <template #leading>
        <Button variant="ghost" size="sm" class="-ml-2 w-fit" @click="goBack">
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
      </template>
      <template #badge>
        <Badge variant="outline">Step 1 — Part-out import</Badge>
      </template>
    </ViewHeader>

    <Alert
      v-if="statusAlert"
      :variant="statusAlert.variant === 'warning' ? 'default' : statusAlert.variant"
      :class="statusAlert.variant === 'warning' ? 'border-amber-500/50 bg-amber-500/10' : undefined"
    >
      <AlertDescription>{{ statusAlert.message }}</AlertDescription>
    </Alert>

    <div v-if="status === 'success' || status === 'fallback'" class="space-y-2">
      <Label for="part-out-filter">Filter parts</Label>
      <Input
        id="part-out-filter"
        v-model="partOutFilter"
        data-testid="part-out-filter"
        placeholder="Filter parts…"
        aria-label="Filter parts"
      />
    </div>

    <div v-if="status === 'loading'" class="space-y-3">
      <p class="text-sm text-muted-foreground">
        Loading part-out from BrickLink… Large sets (e.g. 10281) can take one to two minutes.
      </p>
      <TableLoadingSkeleton />
    </div>

    <ResponsiveDataTable
      v-else-if="filteredLines.length > 0"
      :items="filteredLines"
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
      <p v-if="!confirmEnabled" class="text-sm text-muted-foreground">
        Confirm is available after a successful part-out load.
      </p>
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button
          v-if="status === 'error'"
          type="button"
          variant="outline"
          class="w-full sm:w-auto"
          @click="loadPartOut"
        >
          Retry
        </Button>
        <Button class="w-full sm:w-auto" :disabled="!confirmEnabled" @click="confirmImport">
          Confirm and begin counting
        </Button>
      </div>
    </ViewActions>
  </SessionViewFrame>
</template>
