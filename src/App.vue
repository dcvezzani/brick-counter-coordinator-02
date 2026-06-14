<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster position="bottom-right" :offset="{ bottom: '1rem' }" />
</template>
