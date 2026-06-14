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
