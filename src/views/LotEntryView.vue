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
      <p class="text-sm text-muted-foreground">
        Storyboard: sample lots shown. Production will add lot entry forms here.
      </p>
      <Button v-if="session.phase === 'counting'" @click="compareWithPartOut">
        Compare with Part-Out List
      </Button>
    </CardContent>
  </Card>
</template>
