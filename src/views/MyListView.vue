<script setup>
import SessionViewFrame from '@/components/SessionViewFrame.vue'
import ViewHeader from '@/components/ViewHeader.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
</script>

<template>
  <SessionViewFrame variant="worker">
    <ViewHeader title="My list" description="Assigned put-away list for this session." />

    <Alert>
      <AlertTitle>Coming in a later build unit</AlertTitle>
      <AlertDescription>
        My list with virtual scrolling and line actions ships in U4. Route registration is wired for
        workflow guards and navigation.
      </AlertDescription>
    </Alert>
  </SessionViewFrame>
</template>
