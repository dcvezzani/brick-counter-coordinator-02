<script setup>
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  rows: { type: Number, default: 4 },
})
</script>

<template>
  <div class="space-y-3" data-testid="table-loading-skeleton">
    <Skeleton v-for="row in rows" :key="row" class="h-12 w-full" />
  </div>
</template>
