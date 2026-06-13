<script setup>
import { ref } from 'vue'
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
import { Input } from '@/components/ui/input'
import { createDemoSession, DEMO_SESSION_ID } from '@/lib/storyboard-session.js'

const router = useRouter()
const setNumber = ref('10281')

function submit() {
  createDemoSession({ setNumber: setNumber.value })
  router.push({ name: 'session-import', params: { sessionId: DEMO_SESSION_ID } })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>New session</CardTitle>
      <CardDescription>Create a storyboard counting session for a LEGO set part-out.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <FormField label="Set number">
        <template #default="{ fieldId, ariaDescribedBy, ariaInvalid }">
          <Input
            :id="fieldId"
            :aria-describedby="ariaDescribedBy"
            :aria-invalid="ariaInvalid"
            v-model="setNumber"
            class="max-w-xs"
            placeholder="e.g. 10281"
          />
        </template>
      </FormField>
      <Button @click="submit">Create session</Button>
    </CardContent>
  </Card>
</template>
