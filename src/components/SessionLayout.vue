<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SessionNav from '@/components/SessionNav.vue'
import StoryboardPhaseControls from '@/components/StoryboardPhaseControls.vue'

const route = useRoute()
const sessionId = computed(() => route.params.sessionId)
const hideSessionNav = computed(() => route.meta.hideSessionNav === true)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <SessionNav v-if="!hideSessionNav && sessionId" :session-id="sessionId" />
    <main class="container mx-auto max-w-4xl space-y-4 p-4">
      <StoryboardPhaseControls v-if="sessionId" :session-id="sessionId" />
      <RouterView />
    </main>
  </div>
</template>
