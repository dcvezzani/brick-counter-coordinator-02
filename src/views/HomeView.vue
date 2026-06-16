<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import ViewFrame from '@/components/ViewFrame.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import {
  COMPLETION_TOAST_DURATION_MS,
  consumeCompletionCelebration,
  formatCelebrationMessage,
} from '@/lib/completion-celebration.js'
import { showSuccessToast } from '@/lib/feedback.js'
import { PRIMARY_ACTION_BUTTON_CLASS } from '@/lib/primary-action-button-ui.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  hasActiveDemoSession,
  landingRouteLocation,
  setPhase,
} from '@/lib/storyboard-session.js'

const router = useRouter()
const jumpPhase = ref('importing')

const canResume = computed(() => hasActiveDemoSession())
const demoSession = computed(() => getSession(DEMO_SESSION_ID))

const phaseOptions = [
  { value: 'importing', label: 'Importing' },
  { value: 'counting', label: 'Counting' },
  { value: 'reconciling', label: 'Reconciling' },
  { value: 'organizing', label: 'Organizing' },
  { value: 'updating_inventory', label: 'Updating inventory' },
]

function startDemo() {
  router.push({ name: 'session-new' })
}

function resumeDemo() {
  if (!demoSession.value) return
  router.push(landingRouteLocation(DEMO_SESSION_ID, demoSession.value.phase))
}

function jumpToPhase() {
  if (!demoSession.value) {
    createDemoSession()
  }
  setPhase(DEMO_SESSION_ID, jumpPhase.value)
  router.push(landingRouteLocation(DEMO_SESSION_ID, jumpPhase.value))
}

onMounted(() => {
  const summary = consumeCompletionCelebration()
  if (summary) {
    showSuccessToast(formatCelebrationMessage(summary), {
      duration: COMPLETION_TOAST_DURATION_MS,
    })
  }
})
</script>

<template>
  <ViewFrame>
    <template #header>
      <ViewHeader
        size="site"
        title="Brick Counter Coordinator"
        description="Coordinate LEGO part-out counting sessions — storyboard demo with sample data."
      />
    </template>

    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session hub</CardTitle>
          <CardDescription>
            Walk through the full workflow: import → count → reconcile → organize → update inventory.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-wrap gap-3">
          <Button :class="PRIMARY_ACTION_BUTTON_CLASS" @click="startDemo">Start demo session</Button>
          <Button
            v-if="canResume"
            variant="outline"
            :class="PRIMARY_ACTION_BUTTON_CLASS"
            @click="resumeDemo"
          >
            Resume demo
          </Button>
        </CardContent>
      </Card>

      <Card v-if="canResume">
        <CardHeader>
          <CardTitle>Jump to phase</CardTitle>
          <CardDescription>For stakeholder prep — lands on the default screen for that phase.</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-wrap items-end gap-3">
          <FormField label="Phase">
            <template #default="{ fieldId, ariaDescribedBy, ariaInvalid }">
              <Select v-model="jumpPhase">
                <SelectTrigger
                  :id="fieldId"
                  :aria-describedby="ariaDescribedBy"
                  :aria-invalid="ariaInvalid"
                  class="w-[220px]"
                >
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in phaseOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </template>
          </FormField>
          <Button variant="secondary" :class="PRIMARY_ACTION_BUTTON_CLASS" @click="jumpToPhase">
            Go
          </Button>
        </CardContent>
      </Card>
    </div>
  </ViewFrame>
</template>
