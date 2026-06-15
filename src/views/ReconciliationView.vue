<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePhaseNavigation } from '@/composables/usePhaseNavigation.js'
import {
  buildSessionCompletionSummary,
  stageCompletionCelebration,
} from '@/lib/completion-celebration.js'
import { EXPORT_STUB_TOAST_MESSAGE, showInfoToast } from '@/lib/feedback.js'
import {
  allReconciliationRowsResolved,
  getSession,
  landingRouteLocation,
  markSessionComplete,
  resolveReconciliationRow,
  setPhase,
} from '@/lib/storyboard-session.js'

const reconciliationColumns = [
  {
    key: 'part',
    header: 'Part',
    accessor: (row) => `${row.name} (${row.color})`,
  },
  { key: 'partOutQty', header: 'Part-out' },
  { key: 'lotQty', header: 'Lots' },
  { key: 'status', header: 'Status' },
]

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const confirmCompleteOpen = ref(false)

const {
  goBack,
  backButtonLabel,
  confirmOpen: confirmBackOpen,
  confirmBack,
  cancelBack,
  confirmTitle,
  confirmDescription,
  pendingTargetPhase,
} = usePhaseNavigation(sessionId)

const isReconciling = computed(() => session.value?.phase === 'reconciling')
const isUpdatingInventory = computed(() => session.value?.phase === 'updating_inventory')
const canOrganize = computed(() => allReconciliationRowsResolved(sessionId.value))

const chapterLabel = computed(() => {
  if (isReconciling.value) return 'Step 4: Resolve discrepancies'
  if (isUpdatingInventory.value) return 'Step 5: Export to BrickLink'
  return null
})

function resolveRow(rowId) {
  resolveReconciliationRow(sessionId.value, rowId)
}

function declareReadyToOrganize() {
  setPhase(sessionId.value, 'organizing')
  router.push(landingRouteLocation(sessionId.value, 'organizing'))
}

function exportXml() {
  showInfoToast(EXPORT_STUB_TOAST_MESSAGE)
}

function openCompleteConfirm() {
  confirmCompleteOpen.value = true
}

function confirmCompleteSession() {
  const summary = buildSessionCompletionSummary(sessionId.value)
  if (summary) {
    stageCompletionCelebration(summary)
  }
  markSessionComplete(sessionId.value)
  confirmCompleteOpen.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <SessionViewFrame v-if="session">
    <ViewHeader
      title="Reconciliation"
      :description="
        isUpdatingInventory
          ? 'Export inventory and mark the session complete after BrickLink verification.'
          : 'Compare part-out lines with lot counts and resolve every discrepancy.'
      "
    >
      <template v-if="chapterLabel" #badge>
        <Badge variant="outline">{{ chapterLabel }}</Badge>
      </template>
    </ViewHeader>

    <div
      v-if="isUpdatingInventory"
      class="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
      role="status"
    >
      Reconciliation is complete. This chapter focuses on exporting inventory to BrickLink and
      finishing the session.
    </div>

    <template v-if="isReconciling">
      <ResponsiveDataTable
        :items="session.reconciliationRows"
        :columns="reconciliationColumns"
      >
        <template #cell-status="{ item: row }">
          <Badge v-if="row.resolved" variant="secondary">Resolved</Badge>
          <Button
            v-else
            size="sm"
            variant="outline"
            class="min-h-11 md:min-h-9"
            @click="resolveRow(row.id)"
          >
            Resolve
          </Button>
        </template>
        <template #mobile="{ item: row }">
          <p class="font-medium leading-snug">{{ row.name }} ({{ row.color }})</p>
          <div class="mt-2 flex items-center justify-between gap-3 text-muted-foreground">
            <span>
              Part-out
              <span class="font-medium tabular-nums text-foreground">{{ row.partOutQty }}</span>
            </span>
            <span>
              Lots
              <span class="font-medium tabular-nums text-foreground">{{ row.lotQty }}</span>
            </span>
          </div>
          <div class="mt-3">
            <Badge v-if="row.resolved" variant="secondary">Resolved</Badge>
            <Button
              v-else
              variant="outline"
              class="min-h-11 w-full"
              @click="resolveRow(row.id)"
            >
              Resolve
            </Button>
          </div>
        </template>
      </ResponsiveDataTable>

      <ViewActions>
        <template v-if="!canOrganize" #hint>
          <p class="text-sm text-muted-foreground">Resolve all rows before organizing.</p>
        </template>
        <Button
          variant="outline"
          class="min-h-11 md:min-h-9"
          data-testid="back-to-counting"
          @click="goBack('counting')"
        >
          {{ backButtonLabel('counting') }}
        </Button>
        <Button
          class="w-full min-h-11 md:w-auto md:min-h-9"
          :disabled="!canOrganize"
          @click="declareReadyToOrganize"
        >
          Declare ready to organize
        </Button>
      </ViewActions>
    </template>

    <template v-else-if="isUpdatingInventory">
      <p class="text-sm text-muted-foreground">
        Reconciled inventory is ready for BrickLink. Export XML, verify manually, then complete
        the session.
      </p>

      <ViewActions>
        <Button
          variant="outline"
          class="min-h-11 flex-1 md:min-h-9 md:flex-none"
          data-testid="back-to-organizing"
          @click="goBack('organizing')"
        >
          {{ backButtonLabel('organizing') }}
        </Button>
        <Button
          variant="outline"
          class="min-h-11 flex-1 md:min-h-9 md:flex-none"
          data-testid="back-to-reconciling"
          @click="goBack('reconciling')"
        >
          {{ backButtonLabel('reconciling') }}
        </Button>
        <Button
          variant="outline"
          class="min-h-11 flex-1 md:min-h-9 md:flex-none"
          @click="exportXml"
        >
          Export XML
        </Button>
        <Button class="min-h-11 flex-1 md:min-h-9 md:flex-none" @click="openCompleteConfirm">
          Mark session complete
        </Button>
      </ViewActions>

      <ConfirmDialog
        v-model:open="confirmBackOpen"
        :title="confirmTitle"
        :description="pendingTargetPhase ? confirmDescription(pendingTargetPhase) : ''"
        confirm-label="Go back"
        @confirm="confirmBack"
        @cancel="cancelBack"
      />

      <ConfirmDialog
        v-model:open="confirmCompleteOpen"
        title="Are you sure?"
        description="You are about to finish this session. Once you do, the session will be closed."
        cancel-label="Not yet"
        confirm-label="Complete session"
        @confirm="confirmCompleteSession"
      />
    </template>

    <p v-else class="text-sm text-muted-foreground">
      Reconciliation actions appear when the session is in reconciling or updating inventory phase.
    </p>
  </SessionViewFrame>
</template>
