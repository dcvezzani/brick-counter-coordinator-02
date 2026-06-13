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
import { getSession, landingRouteLocation } from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))

const stickyActionsClass =
  'sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none'

function returnToLotEntry() {
  router.push(landingRouteLocation(sessionId.value, 'counting'))
}
</script>

<template>
  <Card v-if="session">
    <CardHeader>
      <CardTitle>List cups</CardTitle>
      <CardDescription>Physical sort containers used while counting and organizing.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <ul class="space-y-3">
        <li
          v-for="cup in session.cups"
          :key="cup.id"
          class="flex items-center justify-between rounded-md border border-border px-3 py-2"
        >
          <span>{{ cup.label }}</span>
          <Badge variant="secondary">{{ cup.partCount }} parts</Badge>
        </li>
      </ul>
      <div :class="stickyActionsClass">
        <Button @click="returnToLotEntry">Return to lot entry</Button>
      </div>
    </CardContent>
  </Card>
</template>
