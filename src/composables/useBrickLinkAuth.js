import { ref } from 'vue'
import { saveBrickLinkCookie } from '@/lib/bricklink-auth.js'
import { showSuccessToast } from '@/lib/feedback.js'

const open = ref(false)
const required = ref(false)
const showBackToHome = ref(false)
/** @type {import('vue').Ref<(() => void) | null>} */
const onSavedCallback = ref(null)

export function useBrickLinkAuth() {
  function openAuth(options = {}) {
    required.value = Boolean(options.required)
    showBackToHome.value = Boolean(options.showBackToHome ?? options.required)
    onSavedCallback.value = typeof options.onSaved === 'function' ? options.onSaved : null
    open.value = true
  }

  function closeAuth() {
    open.value = false
    required.value = false
    showBackToHome.value = false
    onSavedCallback.value = null
  }

  /**
   * @param {string} cookie
   */
  function handleSave(cookie) {
    saveBrickLinkCookie(cookie)
    showSuccessToast('BrickLink authentication saved.')
    const callback = onSavedCallback.value
    closeAuth()
    callback?.()
  }

  return {
    open,
    required,
    showBackToHome,
    openAuth,
    closeAuth,
    handleSave,
  }
}
