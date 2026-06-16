<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import {
  acknowledgeOrganizePrompt,
  landingRouteLocation,
  shouldShowOrganizePrompt,
} from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const { effectiveProfile } = useWorkflowProfile()
const sessionId = computed(() => route.params.sessionId)

const visible = computed(() =>
  shouldShowOrganizePrompt(sessionId.value, effectiveProfile.value),
)

function goToMyList() {
  acknowledgeOrganizePrompt(sessionId.value)
  router.push(
    landingRouteLocation(sessionId.value, 'organizing', {
      effectiveProfile: effectiveProfile.value,
    }),
  )
}
</script>

<template>
  <div
    v-if="visible"
    class="sticky top-0 z-10 -mx-1 mb-4 border-b border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    data-testid="organize-prompt-banner"
  >
    <Alert>
      <AlertTitle>Organize phase started</AlertTitle>
      <AlertDescription class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Put away your assigned parts before returning to lot entry.</span>
        <Button size="sm" class="min-h-11 shrink-0" @click="goToMyList">
          Go to my put-away list
        </Button>
      </AlertDescription>
    </Alert>
  </div>
</template>
