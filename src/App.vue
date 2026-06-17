<script setup>
import { RouterView } from 'vue-router'
import BrickLinkAuthDialog from '@/components/BrickLinkAuthDialog.vue'
import { Toaster } from '@/components/ui/sonner'
import { useBrickLinkAuth } from '@/composables/useBrickLinkAuth.js'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'

useWorkflowProfile()

const { open, required, showBackToHome, closeAuth, handleSave } = useBrickLinkAuth()

const toastOffset = {
  top: 'max(1rem, env(safe-area-inset-top))',
  right: 'max(1rem, env(safe-area-inset-right))',
}
</script>

<template>
  <RouterView />
  <BrickLinkAuthDialog
    :open="open"
    :required="required"
    :show-back-to-home="showBackToHome"
    @update:open="(value) => !value && closeAuth()"
    @save="handleSave"
  />
  <Toaster
    position="top-right"
    :close-button="true"
    close-button-position="top-right"
    :offset="toastOffset"
    :mobile-offset="toastOffset"
  />
</template>
