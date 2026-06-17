<script setup>
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  separated: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const containerClass = computed(() => (slots.hint ? 'space-y-2' : undefined))

const rootClasses = computed(() =>
  cn(
    'z-10 mt-4 border-t border-border px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]',
    'sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static',
    props.separated
      ? 'md:px-0 md:pb-0 md:bg-transparent md:backdrop-blur-none'
      : 'md:mt-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none',
  ),
)
</script>

<template>
  <div data-testid="view-actions" :class="rootClasses">
    <div :class="containerClass">
      <div v-if="$slots.hint">
        <slot name="hint" />
      </div>
      <div
        class="flex flex-wrap gap-2 [&_[data-slot=button]]:min-h-11 [&_[data-slot=button]]:md:min-h-9"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
