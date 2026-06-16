import { toast } from 'vue-sonner'

export const DEFAULT_TOAST_DURATION_MS = 6000

export const EXPORT_STUB_TOAST_MESSAGE =
  'Storyboard: XML export stub — no file generated.'

function toastOptions(options) {
  return {
    duration: options?.duration ?? DEFAULT_TOAST_DURATION_MS,
  }
}

export function showInfoToast(message, options) {
  toast.info(message, toastOptions(options))
}

export function showSuccessToast(message, options) {
  toast.success(message, toastOptions(options))
}

export function showErrorToast(message, options) {
  toast.error(message, toastOptions(options))
}

/**
 * Info toast with a single action button (vue-sonner action API).
 * @param {string} message
 * @param {{ actionLabel?: string, onAction?: () => void, duration?: number }} [options]
 */
export function showActionToast(message, { actionLabel, onAction, ...options } = {}) {
  const base = toastOptions(options)
  if (!actionLabel) {
    toast.info(message, base)
    return
  }

  toast.info(message, {
    ...base,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  })
}
