<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LotEntryForm from '@/components/LotEntryForm.vue'
import OrganizePromptBanner from '@/components/OrganizePromptBanner.vue'
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewActions from '@/components/ViewActions.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Button } from '@/components/ui/button'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'
import { showActionToast } from '@/lib/feedback.js'
import {
  acknowledgeOrganizePrompt,
  getSession,
  landingRouteLocation,
  setPhase,
  shouldShowOrganizePrompt,
} from '@/lib/storyboard-session.js'

const route = useRoute()
const router = useRouter()
const { effectiveProfile } = useWorkflowProfile()
const sessionId = computed(() => route.params.sessionId)
const session = computed(() => getSession(sessionId.value))
const frameVariant = computed(() =>
  effectiveProfile.value === 'worker' ? 'worker' : 'coordinator',
)

function compareWithPartOut() {
  setPhase(sessionId.value, 'reconciling')
  router.push(landingRouteLocation(sessionId.value, 'reconciling'))
}

const organizeToastShown = ref(false)

function goToMyPutAwayList() {
  acknowledgeOrganizePrompt(sessionId.value)
  router.push(
    landingRouteLocation(sessionId.value, 'organizing', {
      effectiveProfile: effectiveProfile.value,
    }),
  )
}

function maybeShowOrganizeToast() {
  if (effectiveProfile.value !== 'worker') {
    return
  }
  if (!shouldShowOrganizePrompt(sessionId.value, effectiveProfile.value)) {
    return
  }
  if (organizeToastShown.value) {
    return
  }
  organizeToastShown.value = true
  showActionToast('Time to put parts away.', {
    actionLabel: 'Go to my put-away list',
    onAction: goToMyPutAwayList,
  })
}

watch(
  () => [sessionId.value, session.value?.phase, effectiveProfile.value],
  () => {
    if (session.value?.phase !== 'organizing' || effectiveProfile.value !== 'worker') {
      organizeToastShown.value = false
      return
    }
    maybeShowOrganizeToast()
  },
  { flush: 'post', immediate: true },
)
</script>

<template>
  <SessionViewFrame v-if="session" :variant="frameVariant">
    <ViewHeader title="Lot entry" />

    <OrganizePromptBanner />

    <LotEntryForm
      v-if="session.phase === 'counting'"
      :session-id="sessionId"
      :session="session"
      data-testid="lot-entry-form-mount"
    />

    <p
      v-else
      class="text-sm text-muted-foreground"
    >
      Counting is available during the Count phase.
    </p>

    <ViewActions v-if="session.phase === 'counting'" separated>
      <Button class="w-full" @click="compareWithPartOut">
        Compare with Part-Out List
      </Button>
    </ViewActions>
  </SessionViewFrame>
</template>
