<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: undefined,
  },
  size: {
    type: String,
    default: 'page',
    validator: (value) => ['page', 'site'].includes(value),
  },
})

const titleClasses = computed(() =>
  props.size === 'site'
    ? 'text-3xl font-semibold tracking-tight'
    : 'text-base leading-snug font-medium cn-font-heading',
)

const descriptionClasses = computed(() =>
  cn('text-muted-foreground', props.size === 'page' && 'text-sm'),
)
</script>

<template>
  <div class="space-y-2">
    <div v-if="$slots.leading">
      <slot name="leading" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <h1 :class="titleClasses">{{ title }}</h1>
      <slot v-if="$slots.badge" name="badge" />
    </div>
    <p v-if="description" :class="descriptionClasses">{{ description }}</p>
  </div>
</template>
