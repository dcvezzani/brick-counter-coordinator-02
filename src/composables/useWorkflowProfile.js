import { computed } from 'vue'
import { useMediaQuery, useStorage } from '@vueuse/core'

const MD_QUERY = '(min-width: 768px)'
const STORAGE_KEY = 'bcc.workflowProfile'

export function useWorkflowProfile() {
  const isMdUp = useMediaQuery(MD_QUERY)
  const storedProfile = useStorage(STORAGE_KEY, 'coordinator')

  const effectiveProfile = computed(() => {
    if (!isMdUp.value) {
      return 'worker'
    }
    return storedProfile.value
  })

  const isWorkerProfile = computed(() => effectiveProfile.value === 'worker')
  const isCoordinatorProfile = computed(() => effectiveProfile.value === 'coordinator')

  function setStoredProfile(value) {
    if (isMdUp.value) {
      storedProfile.value = value
    }
  }

  return {
    storedProfile,
    isMdUp,
    effectiveProfile,
    isWorkerProfile,
    isCoordinatorProfile,
    setStoredProfile,
  }
}
