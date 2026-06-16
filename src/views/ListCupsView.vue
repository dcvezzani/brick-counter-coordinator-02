<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import { getSession } from '@/lib/storyboard-session.js'

const route = useRoute()
const { effectiveProfile } = useWorkflowProfile()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const frameVariant = computed(() =>
  effectiveProfile.value === 'worker' ? 'worker' : 'coordinator',
)
</script>

<template>
  <SessionViewFrame v-if="session" :variant="frameVariant">
    <ViewHeader
      title="List cups"
      description="Physical sort containers used while counting and organizing."
    />

    <ul class="space-y-3">
      <li
        v-for="cup in session.cups"
        :key="cup.id"
        class="flex items-center justify-between rounded-md border border-border px-3 py-2"
      >
        <span>{{ cup.label }}</span>
        <Badge variant="secondary">{{ cup.partCount }} parts</Badge>
      </li>
    </ul>
  </SessionViewFrame>
</template>
