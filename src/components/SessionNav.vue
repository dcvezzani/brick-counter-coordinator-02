<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { sessionNavModel } from '@/lib/storyboard-session.js'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const nav = computed(() => sessionNavModel(props.sessionId))
const isOrganizerLotsRoute = computed(
  () => route.name === 'session-lots' && route.query.mode === 'organizer',
)
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
          class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          active-class="bg-background text-foreground shadow-sm"
        >
          {{ item.label }}
          <Badge
            v-if="item.key === 'lots' && isOrganizerLotsRoute"
            variant="secondary"
            class="ml-1.5 text-[10px] font-normal"
          >
            Organizer
          </Badge>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
