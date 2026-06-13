<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SessionNav from '@/components/SessionNav.vue'
import SessionProgress from '@/components/SessionProgress.vue'
import StoryboardPhaseControls from '@/components/StoryboardPhaseControls.vue'

const route = useRoute()
const sessionId = computed(() => route.params.sessionId)
const hideSessionNav = computed(() => route.meta.hideSessionNav === true)
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0px,env(safe-area-inset-top))]"
  >
    <SessionNav v-if="!hideSessionNav && sessionId" :session-id="sessionId" />
    <SessionProgress v-if="sessionId" :session-id="sessionId" />
    <main
      class="container mx-auto max-w-4xl space-y-4 px-4 pt-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-4"
    >
      <StoryboardPhaseControls v-if="sessionId" :session-id="sessionId" />
      <RouterView />
    </main>
  </div>
</template>
