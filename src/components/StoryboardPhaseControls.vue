<script setup>
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { getSession } from '@/lib/storyboard-session.js'

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
})

const session = computed(() => getSession(props.sessionId))
const phaseLabel = computed(() => session.value?.phase?.replace(/_/g, ' ') ?? 'unknown')
</script>

<template>
  <div
    v-if="session"
    class="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-sm"
  >
    <span class="font-medium text-muted-foreground">Storyboard</span>
    <Badge variant="secondary">{{ phaseLabel }}</Badge>
    <span v-if="session.setNumber" class="text-muted-foreground">Set {{ session.setNumber }}</span>
  </div>
</template>
