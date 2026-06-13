<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
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

function goBack() {
  router.push({ name: 'home' })
}

function confirmImport() {
  setPhase(sessionId.value, 'counting')
  router.push(landingRouteLocation(sessionId.value, 'counting'))
}
</script>

<template>
  <Card v-if="session">
    <CardHeader>
      <Button variant="ghost" size="sm" class="-ml-2 mb-1 w-fit" @click="goBack">
        <ArrowLeft data-icon="inline-start" />
        Back
      </Button>
      <CardTitle>Part-out import</CardTitle>
      <CardDescription>
        Confirm the part-out list for set {{ session.setNumber }} before counting begins.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="hidden overflow-x-auto rounded-md border border-border md:block">
        <table class="w-full text-sm">
          <thead class="border-b border-border bg-muted/50 text-left">
            <tr>
              <th class="px-3 py-2 font-medium">Part</th>
              <th class="px-3 py-2 font-medium">Name</th>
              <th class="px-3 py-2 font-medium">Color</th>
              <th class="px-3 py-2 font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="line in session.partOutLines"
              :key="line.id"
              class="border-b border-border last:border-0"
            >
              <td class="px-3 py-2">{{ line.partId }}</td>
              <td class="px-3 py-2">{{ line.name }}</td>
              <td class="px-3 py-2">{{ line.color }}</td>
              <td class="px-3 py-2">{{ line.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="space-y-2 md:hidden" role="list">
        <li
          v-for="line in session.partOutLines"
          :key="line.id"
          class="rounded-md border border-border p-3 text-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <p class="font-medium leading-snug">{{ line.name }}</p>
            <span class="shrink-0 font-medium tabular-nums">×{{ line.quantity }}</span>
          </div>
          <p class="mt-1 text-muted-foreground">
            <span>{{ line.partId }}</span>
            <span aria-hidden="true"> · </span>
            <span>{{ line.color }}</span>
          </p>
        </li>
      </ul>
      <div
        class="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
      >
        <Button @click="confirmImport">Confirm and begin counting</Button>
      </div>
    </CardContent>
  </Card>
</template>
