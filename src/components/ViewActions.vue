<script setup>
import { computed, useSlots } from 'vue'

const slots = useSlots()

const containerClass = computed(() => (slots.hint ? 'space-y-2' : undefined))
</script>

<template>
  <div
    data-testid="view-actions"
    class="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
  >
    <div :class="containerClass">
      <div v-if="$slots.hint">
        <slot name="hint" />
      </div>
      <div class="flex flex-wrap gap-2">
        <slot />
      </div>
    </div>
  </div>
</template>
