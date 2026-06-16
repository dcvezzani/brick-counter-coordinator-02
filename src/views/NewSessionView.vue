<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SetSearchCombobox from '@/components/SetSearchCombobox.vue'
import ViewFrame from '@/components/ViewFrame.vue'
import { Button } from '@/components/ui/button'
import { normalizeSetNumber } from '@/lib/set-catalog'
import { createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'
import { PRIMARY_ACTION_BUTTON_CLASS } from '@/lib/primary-action-button-ui.js'

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

    <div class="space-y-4">
      <SetSearchCombobox v-model="setNumber" />
      <Button :class="PRIMARY_ACTION_BUTTON_CLASS" @click="submit">Create session</Button>
    </div>
  </ViewFrame>
</template>
