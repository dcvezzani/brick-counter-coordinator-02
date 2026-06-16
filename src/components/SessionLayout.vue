<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SessionNav from '@/components/SessionNav.vue'
import SessionProgress from '@/components/SessionProgress.vue'
import StoryboardPhaseControls from '@/components/StoryboardPhaseControls.vue'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import { isWorkerShell, resolveSessionShell } from '@/lib/session-shell.js'

const route = useRoute()
const { effectiveProfile } = useWorkflowProfile()
const sessionId = computed(() => route.params.sessionId)
const hideSessionNav = computed(() => route.meta.hideSessionNav === true)
const sessionShell = computed(() =>
  resolveSessionShell(route.meta, { effectiveProfile: effectiveProfile.value }),
)
const workerShell = computed(() => isWorkerShell(sessionShell.value))

const mainClasses = computed(() =>
  workerShell.value
    ? 'container mx-auto max-w-4xl space-y-2 px-4 pt-2 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4'
    : 'container mx-auto max-w-4xl space-y-4 px-4 pt-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4',
)
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))]"
  >
    <SessionNav
      v-if="!hideSessionNav && sessionId"
      :session-id="sessionId"
      :effective-profile="effectiveProfile"
    />
    <SessionProgress
      v-if="sessionId"
      :session-id="sessionId"
      :effective-profile="effectiveProfile"
      :compact="workerShell"
    />
    <main :class="mainClasses">
      <StoryboardPhaseControls
        v-if="sessionId"
        :class="workerShell ? 'hidden md:block' : undefined"
        :session-id="sessionId"
      />
      <RouterView />
    </main>
  </div>
</template>
