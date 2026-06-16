<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SetSearchCombobox from '@/components/SetSearchCombobox.vue'
import ViewFrame from '@/components/ViewFrame.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { normalizeSetNumber } from '@/lib/set-catalog'
import { createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'

const router = useRouter()
const setNumber = ref('10281-1')

function submit() {
  createDemoSession({ setNumber: normalizeSetNumber(setNumber.value) })
  router.push({ name: 'session-import', params: { sessionId: DEMO_SESSION_ID } })
}
</script>

<template>
  <ViewFrame>
    <template #header>
      <h1 class="text-3xl font-semibold tracking-tight">New session</h1>
      <p class="text-muted-foreground">
        Create a storyboard counting session for a LEGO set part-out.
      </p>
    </template>

    <Card>
      <CardContent class="space-y-4 pt-6">
        <SetSearchCombobox v-model="setNumber" />
        <Button @click="submit">Create session</Button>
      </CardContent>
    </Card>
  </ViewFrame>
</template>
