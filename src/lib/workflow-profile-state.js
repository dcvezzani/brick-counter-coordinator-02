import { ref } from 'vue'

function readMdUp() {
  if (typeof window === 'undefined') {
    return true
  }
  return window.matchMedia('(min-width: 768px)').matches
}

function readStoredProfile() {
  if (typeof window === 'undefined') {
    return 'coordinator'
  }

  try {
    const raw = localStorage.getItem('bcc.workflowProfile')
    if (raw == null) {
      return 'coordinator'
    }
    return JSON.parse(raw)
  } catch {
    return 'coordinator'
  }
}

const isMdUp = ref(readMdUp())
const storedProfile = ref(readStoredProfile())

export function setWorkflowProfileSnapshot({ isMdUp: md, storedProfile: stored }) {
  isMdUp.value = md
  storedProfile.value = stored
}

export function getEffectiveProfile() {
  if (!isMdUp.value) {
    return 'worker'
  }
  return storedProfile.value
}
