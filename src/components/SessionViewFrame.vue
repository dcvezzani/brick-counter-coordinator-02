<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'coordinator',
    validator: (value) => ['coordinator', 'worker'].includes(value),
  },
})

const outerClasses = computed(() =>
  cn('mx-auto w-full max-w-4xl', props.variant === 'worker' ? 'space-y-2' : 'space-y-4'),
)

const frameClasses = computed(() =>
  cn(
    'rounded-xl border border-border bg-card ring-1 ring-foreground/10',
    props.variant === 'worker' ? 'p-2 md:p-3' : 'p-3 md:p-4',
  ),
)
</script>

<template>
  <div :class="outerClasses">
    <header v-if="$slots.header" class="space-y-2">
      <slot name="header" />
    </header>
    <div :class="frameClasses">
      <slot />
    </div>
  </div>
</template>
