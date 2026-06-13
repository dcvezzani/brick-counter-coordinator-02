<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CupSoda, Home, List, Package, Scale } from '@lucide/vue'
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

const navIcons = {
  home: Home,
  lot: Package,
  lots: List,
  reconcile: Scale,
  cups: CupSoda,
}
</script>

<template>
  <nav
    v-if="nav.showNav"
    aria-label="Session navigation"
    class="hidden border-b border-border bg-muted/40 md:block"
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

  <nav
    v-if="nav.showNav"
    aria-label="Session navigation"
    class="fixed bottom-0 inset-x-0 z-20 border-t bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden"
  >
    <ul class="flex">
      <li v-for="item in nav.items" :key="item.key" class="min-w-0 flex-1">
        <RouterLink
          :to="item.to"
          class="relative flex min-h-11 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[10px] font-medium leading-none text-muted-foreground transition-colors hover:text-foreground"
          active-class="text-foreground"
        >
          <component :is="navIcons[item.key]" class="size-5 shrink-0" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
          <Badge
            v-if="item.key === 'lots' && isOrganizerLotsRoute"
            variant="secondary"
            class="max-w-full truncate px-1 py-0 text-[8px] font-normal leading-tight"
          >
            Organizer
          </Badge>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
