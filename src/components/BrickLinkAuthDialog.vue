<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps({
  open: { type: Boolean, required: true },
  required: { type: Boolean, default: false },
  showBackToHome: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'save'])

const router = useRouter()
const cookieText = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      cookieText.value = ''
    }
  },
)

function onOpenChange(value) {
  emit('update:open', value)
}

function onSave() {
  const trimmed = cookieText.value.trim()
  if (!trimmed) {
    return
  }
  emit('save', trimmed)
}

function onBackToHome() {
  emit('update:open', false)
  router.push({ name: 'home' })
}
</script>

<template>
  <AlertDialog :open="open" @update:open="onOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Connect BrickLink</AlertDialogTitle>
        <AlertDialogDescription>
          Paste your BrickLink session cookie string. Sign in at bricklink.com in another tab,
          copy the Cookie header from a request to invSetEdit.asp, and paste it here.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <textarea
        v-model="cookieText"
        rows="6"
        :class="
          cn(
            'border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 font-mono text-xs outline-none focus-visible:ring-3',
          )
        "
        placeholder="Paste Cookie header value…"
        aria-label="BrickLink session cookie"
      />

      <AlertDialogFooter class="flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          v-if="showBackToHome"
          type="button"
          variant="ghost"
          class="w-full sm:w-auto"
          @click="onBackToHome"
        >
          Back to Home
        </Button>
        <AlertDialogCancel v-if="!required" class="w-full sm:w-auto">Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="w-full sm:w-auto"
          :disabled="!cookieText.trim()"
          @click="onSave"
        >
          Save authentication
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
