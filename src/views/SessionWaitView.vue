<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ViewFrame from '@/components/ViewFrame.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { PRIMARY_ACTION_BUTTON_CLASS } from '@/lib/primary-action-button-ui.js'

const route = useRoute()
const router = useRouter()

const reason = computed(() => route.query.reason ?? 'importing')

const copy = computed(() => {
  if (reason.value === 'reconciling') {
    return {
      title: 'Coordinator is reconciling',
      description:
        'This session is in reconciliation. You can return to the session list and join again when counting resumes.',
    }
  }

  return {
    title: 'Session not ready yet',
    description:
      'The coordinator is still setting up this session. Return to the session list and try again later.',
  }
})

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <ViewFrame>
    <template #header>
      <h1 class="text-3xl font-semibold tracking-tight">Please wait</h1>
      <p class="text-muted-foreground">This session is not available for workers yet.</p>
    </template>

    <div class="space-y-4">
      <Alert>
        <AlertTitle>{{ copy.title }}</AlertTitle>
        <AlertDescription>{{ copy.description }}</AlertDescription>
      </Alert>

      <Button :class="PRIMARY_ACTION_BUTTON_CLASS" @click="goHome">
        Back to session list
      </Button>
    </div>
  </ViewFrame>
</template>
