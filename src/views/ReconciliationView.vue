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
      <CardTitle>Reconciliation</CardTitle>
      <CardDescription>
        {{
          isUpdatingInventory
            ? 'Export inventory and mark the session complete after BrickLink verification.'
            : 'Compare part-out lines with lot counts and resolve every discrepancy.'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <template v-if="isReconciling">
        <div class="overflow-x-auto rounded-md border border-border">
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
                  <Button v-else size="xs" variant="outline" @click="resolveRow(row.id)">
                    Resolve
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button :disabled="!canOrganize" @click="declareReadyToOrganize">
          Declare ready to organize
        </Button>
        <p v-if="!canOrganize" class="text-sm text-muted-foreground">
          Resolve all rows before organizing.
        </p>
      </template>

      <template v-else-if="isUpdatingInventory">
        <p class="text-sm text-muted-foreground">
          Reconciled inventory is ready for BrickLink. Export XML, verify manually, then complete
          the session.
        </p>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" @click="exportXml">Export XML</Button>
          <Button @click="completeSession">Mark session complete</Button>
        </div>
        <p v-if="exportMessage" class="text-sm text-muted-foreground">{{ exportMessage }}</p>
      </template>

      <p v-else class="text-sm text-muted-foreground">
        Reconciliation actions appear when the session is in reconciling or updating inventory phase.
      </p>
    </CardContent>
  </Card>
</template>
