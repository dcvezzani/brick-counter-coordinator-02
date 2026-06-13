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
      <div class="overflow-x-auto rounded-md border border-border">
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
      <Button @click="confirmImport">Confirm and begin counting</Button>
    </CardContent>
  </Card>
</template>
