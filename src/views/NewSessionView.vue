<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'

const router = useRouter()
const setNumber = ref('10281')

function submit() {
  createDemoSession({ setNumber: setNumber.value })
  router.push({ name: 'session-import', params: { sessionId: DEMO_SESSION_ID } })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>New session</CardTitle>
      <CardDescription>Create a storyboard counting session for a LEGO set part-out.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium">Set number</span>
        <input
          v-model="setNumber"
          type="text"
          class="max-w-xs rounded-md border border-input bg-background px-3 py-2"
          placeholder="e.g. 10281"
        />
      </label>
      <Button @click="submit">Create session</Button>
    </CardContent>
  </Card>
</template>
