<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { sessionNavModel } from '@/lib/storyboard-session.js'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})

const nav = computed(() => sessionNavModel(props.sessionId))
</script>

<template>
  <nav
    v-if="nav.showNav"
    aria-label="Session navigation"
    class="border-b border-border bg-muted/40"
  >
    <ul class="container mx-auto flex max-w-4xl flex-wrap gap-1 px-4 py-2">
      <li v-for="item in nav.items" :key="item.key">
        <RouterLink
          :to="item.to"
          class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          active-class="bg-background text-foreground shadow-sm"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
