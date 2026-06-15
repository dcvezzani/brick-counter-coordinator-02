<script setup>
import { nextTick, ref } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  cancelLabel: { type: String, default: 'Cancel' },
  confirmLabel: { type: String, default: 'Confirm' },
  confirmVariant: { type: String, default: 'default' },
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

const confirming = ref(false)
const cancelClicked = ref(false)

function onOpenChange(value) {
  emit('update:open', value)

  if (!value) {
    nextTick(() => {
      if (!confirming.value && !cancelClicked.value) {
        emit('cancel')
      }
      confirming.value = false
      cancelClicked.value = false
    })
    return
  }

  confirming.value = false
  cancelClicked.value = false
}

function onConfirmPointerDown() {
  confirming.value = true
}

function onConfirm() {
  confirming.value = true
  emit('confirm')
}

function onCancel() {
  cancelClicked.value = true
  emit('cancel')
}
</script>

<template>
  <AlertDialog :open="open" @update:open="onOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="description">
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">{{ cancelLabel }}</AlertDialogCancel>
        <AlertDialogAction
          :variant="confirmVariant"
          @pointerdown="onConfirmPointerDown"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
