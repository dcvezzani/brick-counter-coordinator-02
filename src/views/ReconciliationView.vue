<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  allReconciliationRowsResolved,
  getSession,
  landingRouteLocation,
  markSessionComplete,
  resolveReconciliationRow,
  setPhase,
} from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const exportMessage = ref('')

const isReconciling = computed(() => session.value?.phase === 'reconciling')
const isUpdatingInventory = computed(() => session.value?.phase === 'updating_inventory')
const canOrganize = computed(() => allReconciliationRowsResolved(sessionId.value))

const chapterLabel = computed(() => {
  if (isReconciling.value) return 'Step 4: Resolve discrepancies'
  if (isUpdatingInventory.value) return 'Step 5: Export to BrickLink'
  return null
})

const stickyActionsClass =
  'sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none'

function resolveRow(rowId) {
  resolveReconciliationRow(sessionId.value, rowId)
}

function declareReadyToOrganize() {
  setPhase(sessionId.value, 'organizing')
  router.push(landingRouteLocation(sessionId.value, 'organizing'))
}

function exportXml() {
  exportMessage.value = 'Storyboard: XML export stub — no file generated.'
}

function completeSession() {
  markSessionComplete(sessionId.value)
  router.push({ name: 'home' })
}
</script>

<template>
  <Card v-if="session">
    <CardHeader>
      <div class="flex flex-wrap items-center gap-2">
        <CardTitle>Reconciliation</CardTitle>
        <Badge v-if="chapterLabel" variant="outline">{{ chapterLabel }}</Badge>
      </div>
      <CardDescription>
        {{
          isUpdatingInventory
            ? 'Export inventory and mark the session complete after BrickLink verification.'
            : 'Compare part-out lines with lot counts and resolve every discrepancy.'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-if="isUpdatingInventory"
        class="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
        role="status"
      >
        Reconciliation is complete. This chapter focuses on exporting inventory to BrickLink and
        finishing the session.
      </div>

      <template v-if="isReconciling">
        <div class="hidden overflow-x-auto rounded-md border border-border md:block">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/50 text-left">
              <tr>
                <th class="px-3 py-2 font-medium">Part</th>
                <th class="px-3 py-2 font-medium">Part-out</th>
                <th class="px-3 py-2 font-medium">Lots</th>
                <th class="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in session.reconciliationRows"
                :key="row.id"
                class="border-b border-border last:border-0"
              >
                <td class="px-3 py-2">{{ row.name }} ({{ row.color }})</td>
                <td class="px-3 py-2">{{ row.partOutQty }}</td>
                <td class="px-3 py-2">{{ row.lotQty }}</td>
                <td class="px-3 py-2">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="space-y-2 md:hidden" role="list">
          <li
            v-for="row in session.reconciliationRows"
            :key="row.id"
            class="rounded-md border border-border p-3 text-sm"
          >
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
          </li>
        </ul>
        <div :class="stickyActionsClass" class="space-y-2">
          <p v-if="!canOrganize" class="text-sm text-muted-foreground">
            Resolve all rows before organizing.
          </p>
          <Button
            class="w-full min-h-11 md:w-auto md:min-h-9"
            :disabled="!canOrganize"
            @click="declareReadyToOrganize"
          >
            Declare ready to organize
          </Button>
        </div>
      </template>

      <template v-else-if="isUpdatingInventory">
        <p class="text-sm text-muted-foreground">
          Reconciled inventory is ready for BrickLink. Export XML, verify manually, then complete
          the session.
        </p>
        <p v-if="exportMessage" class="text-sm text-muted-foreground">{{ exportMessage }}</p>
        <div :class="stickyActionsClass" class="flex flex-wrap gap-2">
          <Button
            variant="outline"
            class="min-h-11 flex-1 md:min-h-9 md:flex-none"
            @click="exportXml"
          >
            Export XML
          </Button>
          <Button class="min-h-11 flex-1 md:min-h-9 md:flex-none" @click="completeSession">
            Mark session complete
          </Button>
        </div>
      </template>

      <p v-else class="text-sm text-muted-foreground">
        Reconciliation actions appear when the session is in reconciling or updating inventory phase.
      </p>
    </CardContent>
  </Card>
</template>
