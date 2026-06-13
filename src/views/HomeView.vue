<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { Button } from '@/components/ui/button'
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
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-6 py-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">Brick Counter Coordinator</h1>
      <p class="text-muted-foreground">
        Coordinate LEGO part-out counting sessions — storyboard demo with sample data.
      </p>
    </header>

    <Card>
      <CardHeader>
        <CardTitle>Session hub</CardTitle>
        <CardDescription>
          Walk through the full workflow: import → count → reconcile → organize → update inventory.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <Button @click="startDemo">Start demo session</Button>
        <Button v-if="canResume" variant="outline" @click="resumeDemo">Resume demo</Button>
      </CardContent>
    </Card>

    <Card v-if="canResume">
      <CardHeader>
        <CardTitle>Jump to phase</CardTitle>
        <CardDescription>For stakeholder prep — lands on the default screen for that phase.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-end gap-3">
        <FormField label="Phase">
          <Select v-model="jumpPhase">
            <SelectTrigger class="w-[220px]">
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
        </FormField>
        <Button variant="secondary" @click="jumpToPhase">Go</Button>
      </CardContent>
    </Card>
  </main>
</template>
