<script setup>
import { computed } from 'vue'
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
  getSession,
  landingRouteLocation,
  returnToReconciling,
  setPhase,
  toggleOrganizerLineFlag,
} from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const isOrganizerMode = computed(() => route.query.mode === 'organizer')

const stickyActionsClass =
  'sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none'

function declareReadyToImport() {
  setPhase(sessionId.value, 'updating_inventory')
  router.push(landingRouteLocation(sessionId.value, 'updating_inventory'))
}

function goBackToReconciling() {
  returnToReconciling(sessionId.value)
  router.push(landingRouteLocation(sessionId.value, 'reconciling'))
}
</script>

<template>
  <Card v-if="session">
    <CardHeader>
      <CardTitle>{{ isOrganizerMode ? 'Organizer — pick lists' : 'List lots' }}</CardTitle>
      <CardDescription>
        {{
          isOrganizerMode
            ? 'Split pick lists and mark parts moved or needing a storage location.'
            : 'Browse lots recorded during counting.'
        }}
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <template v-if="isOrganizerMode">
        <section v-for="list in session.organizerLists" :key="list.id" class="space-y-2">
          <h2 class="text-sm font-semibold">{{ list.title }}</h2>
          <div class="hidden overflow-x-auto rounded-md border border-border md:block">
            <table class="w-full text-sm">
              <thead class="border-b border-border bg-muted/50 text-left">
                <tr>
                  <th class="px-3 py-2 font-medium">Part</th>
                  <th class="px-3 py-2 font-medium">Name</th>
                  <th class="px-3 py-2 font-medium">Qty</th>
                  <th class="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="line in list.lines"
                  :key="line.id"
                  class="border-b border-border last:border-0"
                >
                  <td class="px-3 py-2">{{ line.partId }}</td>
                  <td class="px-3 py-2">{{ line.name }} ({{ line.color }})</td>
                  <td class="px-3 py-2">{{ line.quantity }}</td>
                  <td class="px-3 py-2">
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul class="space-y-2 md:hidden" role="list">
            <li
              v-for="line in list.lines"
              :key="line.id"
              class="rounded-md border border-border p-3 text-sm"
            >
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
                  @click="toggleOrganizerLineFlag(sessionId, list.id, line.id, 'needsLocation')"
                >
                  Needs location
                </Button>
              </div>
            </li>
          </ul>
        </section>
        <div :class="stickyActionsClass" class="flex flex-wrap gap-2">
          <Button @click="declareReadyToImport">Declare ready to import</Button>
          <Button variant="outline" @click="goBackToReconciling">Return to reconciling</Button>
        </div>
      </template>

      <template v-else>
        <div class="hidden overflow-x-auto rounded-md border border-border md:block">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/50 text-left">
              <tr>
                <th class="px-3 py-2 font-medium">Lot</th>
                <th class="px-3 py-2 font-medium">Part</th>
                <th class="px-3 py-2 font-medium">Color</th>
                <th class="px-3 py-2 font-medium">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lot in session.lots" :key="lot.id" class="border-b border-border last:border-0">
                <td class="px-3 py-2">{{ lot.label }}</td>
                <td class="px-3 py-2">{{ lot.partId }}</td>
                <td class="px-3 py-2">{{ lot.color }}</td>
                <td class="px-3 py-2">{{ lot.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="space-y-2 md:hidden" role="list">
          <li
            v-for="lot in session.lots"
            :key="lot.id"
            class="rounded-md border border-border p-3 text-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <p class="font-medium leading-snug">{{ lot.label }}</p>
              <span class="shrink-0 font-medium tabular-nums">×{{ lot.quantity }}</span>
            </div>
            <p class="mt-1 text-muted-foreground">
              <span>{{ lot.partId }}</span>
              <span aria-hidden="true"> · </span>
              <span>{{ lot.color }}</span>
            </p>
          </li>
        </ul>
        <Badge variant="outline">{{ session.lots.length }} lots</Badge>
      </template>
    </CardContent>
  </Card>
</template>
