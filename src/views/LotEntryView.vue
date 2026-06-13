<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getSession, landingRouteLocation, setPhase } from '@/lib/storyboard-session.js'

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
  <Card v-if="session">
    <CardHeader>
      <CardTitle>Lot entry</CardTitle>
      <CardDescription>Record counted parts into lots during the counting phase.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
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
      <p class="text-sm text-muted-foreground">
        Storyboard: sample lots shown. Production will add lot entry forms here.
      </p>
      <div
        v-if="session.phase === 'counting'"
        class="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
      >
        <Button @click="compareWithPartOut">Compare with Part-Out List</Button>
      </div>
    </CardContent>
  </Card>
</template>
