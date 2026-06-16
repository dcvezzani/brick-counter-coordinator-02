<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { useWorkflowProfile } from '@/composables/useWorkflowProfile.js'

useWorkflowProfile()

const toastOffset = {
  top: 'max(1rem, env(safe-area-inset-top))',
  right: 'max(1rem, env(safe-area-inset-right))',
}
</script>

<template>
  <RouterView />
  <Toaster
    position="top-right"
    :close-button="true"
    close-button-position="top-right"
    :offset="toastOffset"
    :mobile-offset="toastOffset"
  />
</template>
