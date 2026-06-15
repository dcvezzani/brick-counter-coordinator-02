<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ResponsiveDataTable from '@/components/ResponsiveDataTable.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { usePhaseNavigation } from '@/composables/usePhaseNavigation.js'
import { colorNameForId, formatLotCondition } from '@/lib/lot-display.js'
import {
  getSession,
  landingRouteLocation,
  setPhase,
  toggleOrganizerLineFlag,
} from '@/lib/storyboard-session.js'

const lotColumns = [
  { key: 'partId', header: 'Part' },
  {
    key: 'color',
    header: 'Color',
    accessor: (lot) => colorNameForId(lot.colorId),
  },
  {
    key: 'condition',
    header: 'Condition',
    accessor: (lot) => formatLotCondition(lot.condition),
  },
  { key: 'qty', header: 'Qty' },
]

const organizerColumns = [
  { key: 'partId', header: 'Part' },
  {
    key: 'name',
    header: 'Name',
    accessor: (line) => `${line.name} (${line.color})`,
  },
  { key: 'quantity', header: 'Qty' },
  { key: 'status', header: 'Status' },
]

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const isOrganizerMode = computed(() => route.query.mode === 'organizer')

const {
  goBack,
  backButtonLabel,
  confirmOpen,
  confirmBack,
  cancelBack,
  confirmTitle,
  confirmDescription,
  pendingTargetPhase,
} = usePhaseNavigation(sessionId)

const pageTitle = computed(() =>
  isOrganizerMode.value ? 'Organizer — pick lists' : 'List lots',
)

const pageDescription = computed(() =>
  isOrganizerMode.value
    ? 'Split pick lists and mark parts moved or needing a storage location.'
    : 'Browse lots recorded during counting.',
)

function declareReadyToImport() {
  setPhase(sessionId.value, 'updating_inventory')
  router.push(landingRouteLocation(sessionId.value, 'updating_inventory'))
}

function compareWithPartOut() {
  setPhase(sessionId.value, 'reconciling')
  router.push(landingRouteLocation(sessionId.value, 'reconciling'))
}
</script>

<template>
  <SessionViewFrame v-if="session">
    <ViewHeader :title="pageTitle" :description="pageDescription">
      <template v-if="isOrganizerMode" #badge>
        <Badge variant="outline">Organizer</Badge>
      </template>
      <template v-else #badge>
        <Badge variant="outline">{{ session.lots.length }} lots</Badge>
      </template>
    </ViewHeader>

    <template v-if="isOrganizerMode">
      <section
        v-for="list in session.organizerLists"
        :key="list.id"
        class="space-y-2"
      >
        <h2 class="text-sm font-semibold">{{ list.title }}</h2>
        <ResponsiveDataTable :items="list.lines" :columns="organizerColumns">
          <template #cell-status="{ item: line }">
            <div class="flex flex-wrap gap-2">
              <Button
                size="sm"
                :variant="line.moved ? 'default' : 'outline'"
                @click="toggleOrganizerLineFlag(sessionId, list.id, line.id, 'moved')"
              >
                Moved
              </Button>
              <Button
                size="sm"
                :variant="line.needsLocation ? 'secondary' : 'outline'"
                @click="
                  toggleOrganizerLineFlag(sessionId, list.id, line.id, 'needsLocation')
                "
              >
                Needs location
              </Button>
            </div>
          </template>
          <template #mobile="{ item: line }">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-medium leading-snug">{{ line.partId }}</p>
                <p class="mt-1 text-muted-foreground">{{ line.name }} ({{ line.color }})</p>
              </div>
              <span class="shrink-0 font-medium tabular-nums">×{{ line.quantity }}</span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                class="min-h-11"
                :variant="line.moved ? 'default' : 'outline'"
                @click="toggleOrganizerLineFlag(sessionId, list.id, line.id, 'moved')"
              >
                Moved
              </Button>
              <Button
                size="sm"
                class="min-h-11"
                :variant="line.needsLocation ? 'secondary' : 'outline'"
                @click="
                  toggleOrganizerLineFlag(sessionId, list.id, line.id, 'needsLocation')
                "
              >
                Needs location
              </Button>
            </div>
          </template>
        </ResponsiveDataTable>
      </section>

      <ViewActions>
        <Button @click="declareReadyToImport">Declare ready to import</Button>
        <Button variant="outline" data-testid="back-to-reconciling" @click="goBack('reconciling')">
          Return to reconciling
        </Button>
        <Button variant="outline" data-testid="back-to-counting" @click="goBack('counting')">
          {{ backButtonLabel('counting') }}
        </Button>
      </ViewActions>

      <ConfirmDialog
        v-model:open="confirmOpen"
        :title="confirmTitle"
        :description="pendingTargetPhase ? confirmDescription(pendingTargetPhase) : ''"
        confirm-label="Go back"
        @confirm="confirmBack"
        @cancel="cancelBack"
      />
    </template>

    <template v-else>
      <ResponsiveDataTable :items="session.lots" :columns="lotColumns">
        <template #mobile="{ item: lot }">
          <div class="flex items-start justify-between gap-3">
            <p class="font-medium leading-snug">{{ lot.partId }}</p>
            <span class="shrink-0 font-medium tabular-nums">×{{ lot.qty }}</span>
          </div>
          <p class="mt-1 text-muted-foreground">
            <span>{{ colorNameForId(lot.colorId) }}</span>
            <span aria-hidden="true"> · </span>
            <span>{{ formatLotCondition(lot.condition) }}</span>
          </p>
        </template>
      </ResponsiveDataTable>

      <ViewActions v-if="session.phase === 'counting'">
        <Button class="min-h-11" data-testid="compare-with-part-out" @click="compareWithPartOut">
          Compare with Part-Out List
        </Button>
      </ViewActions>
    </template>
  </SessionViewFrame>
</template>
