<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SetSearchCombobox from '@/components/SetSearchCombobox.vue'
import ViewFrame from '@/components/ViewFrame.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useBrickLinkAuth } from '@/composables/useBrickLinkAuth.js'
import { hasBrickLinkCookie } from '@/lib/bricklink-auth.js'
import { normalizeSetNumber } from '@/lib/set-catalog'
import { createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'
import { PRIMARY_ACTION_BUTTON_CLASS } from '@/lib/primary-action-button-ui.js'

const router = useRouter()
const { openAuth } = useBrickLinkAuth()
const setNumber = ref('10281-1')

const showConnectBanner = computed(() => !hasBrickLinkCookie())

function connectBrickLink() {
  openAuth({ required: false })
}

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
      <Alert v-if="showConnectBanner">
        <AlertDescription class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Connect BrickLink to load a real part-out list.</span>
          <Button type="button" variant="outline" class="shrink-0" @click="connectBrickLink">
            Connect BrickLink
          </Button>
        </AlertDescription>
      </Alert>

      <SetSearchCombobox v-model="setNumber" />
      <Button :class="PRIMARY_ACTION_BUTTON_CLASS" @click="submit">Create session</Button>
    </div>
  </ViewFrame>
</template>
