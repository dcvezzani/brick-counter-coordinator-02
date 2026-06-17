<script setup>
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import ViewFrame from '@/components/ViewFrame.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useDisplayName } from '@/composables/useDisplayName.js'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import {
  createDemoSession,
  DEMO_SESSION_ID,
  getSession,
  hasActiveDemoSession,
  landingRouteLocation,
  listStoryboardSessions,
  registerJoinedWorker,
  setPhase,
} from '@/lib/storyboard-session.js'

const router = useRouter()
const jumpPhase = ref('importing')
const joinError = ref('')

const { displayName, hasDisplayName, saveDisplayName } = useDisplayName()
const {
  storedProfile,
  isMdUp,
  isCoordinatorProfile,
  isWorkerProfile,
  effectiveProfile,
  setStoredProfile,
} = useWorkflowProfile()

const WORKER_WAIT_PHASES = new Set(['importing', 'reconciling'])

const sessions = computed(() => {
  const all = listStoryboardSessions()
  if (!isWorkerProfile.value) {
    return all
  }
  return all.filter((session) => !WORKER_WAIT_PHASES.has(session.phase))
})
const canResume = computed(() => hasActiveDemoSession())
const demoSession = computed(() => getSession(DEMO_SESSION_ID))

const siteTitle = computed(() =>
  isWorkerProfile.value ? 'Brick Counter' : 'Brick Counter Coordinator',
)
const siteDescription = computed(() =>
  isWorkerProfile.value
    ? 'Join LEGO part-out counting sessions.'
    : 'Coordinate LEGO part-out counting sessions — storyboard demo with sample data.',
)

const phaseOptions = [
  { value: 'importing', label: 'Importing' },
  { value: 'counting', label: 'Counting' },
  { value: 'reconciling', label: 'Reconciling' },
  { value: 'organizing', label: 'Organizing' },
  { value: 'updating_inventory', label: 'Updating inventory' },
]

const phaseBadgeLabels = {
  importing: 'Importing',
  counting: 'Counting',
  reconciling: 'Reconciling',
  organizing: 'Organizing',
  updating_inventory: 'Updating inventory',
  closed: 'Closed',
}

onBeforeRouteLeave(() => {
  saveDisplayName()
})

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

function phaseBadgeLabel(phase) {
  return phaseBadgeLabels[phase] ?? phase
}

function joinSession(session) {
  joinError.value = ''

  if (!hasDisplayName.value) {
    joinError.value = 'Enter your display name before joining a session.'
    return
  }

  saveDisplayName()
  registerJoinedWorker(session.id, displayName.value)

  if (WORKER_WAIT_PHASES.has(session.phase)) {
    router.push({
      name: 'session-wait',
      params: { sessionId: session.id },
      query: { reason: session.phase },
    })
    return
  }

  router.push(
    landingRouteLocation(session.id, session.phase, { effectiveProfile: 'worker' }),
  )
}

function openStoryboardSession(session) {
  router.push(
    landingRouteLocation(session.id, session.phase, {
      effectiveProfile: effectiveProfile.value,
    }),
  )
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
        :title="siteTitle"
        :description="siteDescription"
      />
    </template>

    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your display name</CardTitle>
          <CardDescription>
            Used on organizer lists and worker assignments. Saved when you leave Home.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField label="Display name" required>
            <template #default="{ fieldId, ariaDescribedBy, ariaInvalid }">
              <Input
                :id="fieldId"
                v-model="displayName"
                :aria-describedby="ariaDescribedBy"
                :aria-invalid="ariaInvalid"
                autocomplete="nickname"
                placeholder="e.g. Alex"
              />
            </template>
          </FormField>
        </CardContent>
      </Card>

      <Card v-if="isMdUp">
        <CardHeader>
          <CardTitle>Workflow profile</CardTitle>
          <CardDescription>
            Coordinator runs the full session lifecycle. Worker joins existing sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField label="Profile">
            <div class="flex flex-wrap gap-4" role="radiogroup" aria-label="Workflow profile">
              <div class="flex items-center gap-2">
                <input
                  id="profile-coordinator"
                  type="radio"
                  name="workflow-profile"
                  value="coordinator"
                  :checked="storedProfile === 'coordinator'"
                  class="size-4 border-input text-primary"
                  @change="setStoredProfile('coordinator')"
                />
                <Label for="profile-coordinator">Coordinator</Label>
              </div>
              <div class="flex items-center gap-2">
                <input
                  id="profile-worker"
                  type="radio"
                  name="workflow-profile"
                  value="worker"
                  :checked="storedProfile === 'worker'"
                  class="size-4 border-input text-primary"
                  @change="setStoredProfile('worker')"
                />
                <Label for="profile-worker">Worker</Label>
              </div>
            </div>
          </FormField>
        </CardContent>
      </Card>

      <template v-if="isCoordinatorProfile">
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

        <Card>
          <CardHeader>
            <CardTitle>Active storyboard sessions</CardTitle>
            <CardDescription>
              Open any fixture session at its current phase.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <button
              v-for="session in sessions"
              :key="session.id"
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50"
              @click="openStoryboardSession(session)"
            >
              <div class="space-y-1">
                <p class="font-medium">{{ session.label }}</p>
                <p class="text-sm text-muted-foreground">Set {{ session.setNumber }}</p>
              </div>
              <Badge variant="secondary">{{ phaseBadgeLabel(session.phase) }}</Badge>
            </button>
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
      </template>

      <template v-else-if="isWorkerProfile">
        <Card>
          <CardHeader>
            <CardTitle>Join a session</CardTitle>
            <CardDescription>
              Pick an active storyboard session to join as {{ displayName.trim() || 'a worker' }}.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <p v-if="joinError" class="text-sm text-destructive" role="alert">
              {{ joinError }}
            </p>

            <button
              v-for="session in sessions"
              :key="session.id"
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-muted/50"
              @click="joinSession(session)"
            >
              <div class="space-y-1">
                <p class="font-medium">{{ session.label }}</p>
                <p class="text-sm text-muted-foreground">Set {{ session.setNumber }}</p>
              </div>
              <Badge variant="secondary">{{ phaseBadgeLabel(session.phase) }}</Badge>
            </button>
          </CardContent>
        </Card>
      </template>
    </div>
  </ViewFrame>
</template>
