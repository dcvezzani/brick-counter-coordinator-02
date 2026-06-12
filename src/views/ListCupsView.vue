<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getSession } from '@/lib/storyboard-session.js'

const route = useRoute()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
</script>

<template>
  <Card v-if="session">
    <CardHeader>
      <CardTitle>List cups</CardTitle>
      <CardDescription>Physical sort containers used while counting and organizing.</CardDescription>
    </CardHeader>
    <CardContent>
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
    </CardContent>
  </Card>
</template>
