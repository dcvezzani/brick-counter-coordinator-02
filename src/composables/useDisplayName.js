import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'bcc.displayName'

export function useDisplayName() {
  const displayName = useStorage(STORAGE_KEY, '')

  const hasDisplayName = computed(() => displayName.value.trim().length > 0)

  function saveDisplayName() {
    displayName.value = displayName.value.trim()
  }

  return {
    displayName,
    hasDisplayName,
    saveDisplayName,
  }
}
