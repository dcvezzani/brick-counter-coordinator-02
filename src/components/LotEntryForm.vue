<script setup>
defineProps({
  sessionId: {
    type: String,
    required: true,
  },
  session: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div data-testid="lot-entry-form" />
</template>
