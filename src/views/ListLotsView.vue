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
      <CardTitle>{{ isOrganizerMode ? 'Organizer pick lists' : 'List lots' }}</CardTitle>
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
          <div class="overflow-x-auto rounded-md border border-border">
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
                        size="xs"
                        :variant="line.moved ? 'default' : 'outline'"
                        @click="toggleOrganizerLineFlag(sessionId, list.id, line.id, 'moved')"
                      >
                        Moved
                      </Button>
                      <Button
                        size="xs"
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
        </section>
        <div class="flex flex-wrap gap-2">
          <Button @click="declareReadyToImport">Declare ready to import</Button>
          <Button variant="outline" @click="goBackToReconciling">Return to reconciling</Button>
        </div>
      </template>

      <template v-else>
        <div class="overflow-x-auto rounded-md border border-border">
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
        <Badge variant="outline">{{ session.lots.length }} lots</Badge>
      </template>
    </CardContent>
  </Card>
</template>
